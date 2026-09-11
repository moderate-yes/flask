import json
import os
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlsplit

from flask import Flask, Response, abort, jsonify, redirect, render_template, request, send_from_directory, url_for
from werkzeug.middleware.proxy_fix import ProxyFix

from content_pages import PAGES
from learn_pages import LEARN_PAGES
from seo_pages import TOOL_SEO
from site_metadata import SITEMAP_LASTMOD


app = Flask(__name__)
KOREA_TIME = timezone(timedelta(hours=9))
PRIMARY_SITE_URL = "https://browserfiletools.net"
DEFAULT_LEGACY_HOSTS = {
    "flask-v57n.onrender.com",
    "www.browserfiletools.net",
}

if os.getenv("TRUST_PROXY_HEADERS") == "1":
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)


def configured_site_url():
    return (
        os.getenv("SITE_URL", "").strip().rstrip("/")
        or PRIMARY_SITE_URL
    )


def legacy_hosts():
    configured_hosts = os.getenv("LEGACY_HOSTS", "").strip()
    if not configured_hosts:
        return DEFAULT_LEGACY_HOSTS
    return {
        host.strip().lower().split(":", 1)[0]
        for host in configured_hosts.split(",")
        if host.strip()
    }


@app.before_request
def redirect_legacy_domains():
    """Keep every public legacy hostname on one permanent canonical origin."""
    if request.endpoint == "health_check":
        return None

    request_host = request.host.lower().split(":", 1)[0]
    canonical_host = urlsplit(configured_site_url()).hostname
    if request_host not in legacy_hosts() or request_host == canonical_host:
        return None

    path_and_query = request.full_path if request.query_string else request.path
    return redirect(f"{configured_site_url()}{path_and_query}", code=301)


def public_url(endpoint, **values):
    site_url = configured_site_url()
    path = url_for(endpoint, **values)
    return f"{site_url}{path}" if site_url else url_for(endpoint, _external=True, **values)


def visitor_database_path():
    configured_path = os.getenv("VISITOR_DB_PATH", "").strip()
    if configured_path:
        path = Path(configured_path)
        return path if path.is_absolute() else Path(app.root_path) / path
    return Path(app.instance_path) / "visits.db"


def deploy_visit_seed():
    try:
        value = json.loads((Path(app.root_path) / "deploy_visit_seed.json").read_text(encoding="utf-8"))
        return value if isinstance(value, dict) else {}
    except (OSError, json.JSONDecodeError):
        return {}


def initial_total_visits():
    try:
        configured = max(0, int(os.getenv("INITIAL_TOTAL_VISITS", "1")))
    except ValueError:
        configured = 1
    try:
        captured = max(0, int(deploy_visit_seed().get("total", 1)))
    except (TypeError, ValueError):
        captured = 1
    return max(configured, captured)


def initial_today_visits():
    try:
        configured = max(0, int(os.getenv("INITIAL_TODAY_VISITS", "1")))
    except ValueError:
        configured = 1
    captured_seed = deploy_visit_seed()
    if captured_seed.get("date") != datetime.now(KOREA_TIME).date().isoformat():
        return configured
    try:
        captured = max(0, int(captured_seed.get("today", 1)))
    except (TypeError, ValueError):
        captured = 1
    return max(configured, captured)


def open_visitor_database():
    path = visitor_database_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path, timeout=5)
    connection.execute("PRAGMA busy_timeout = 5000")
    connection.execute("PRAGMA journal_mode = WAL")
    connection.execute(
        "CREATE TABLE IF NOT EXISTS visit_totals ("
        "id INTEGER PRIMARY KEY CHECK (id = 1), "
        "visits INTEGER NOT NULL DEFAULT 0 CHECK (visits >= 0))"
    )
    connection.execute(
        "CREATE TABLE IF NOT EXISTS daily_visits ("
        "visit_date TEXT PRIMARY KEY, "
        "visits INTEGER NOT NULL DEFAULT 0 CHECK (visits >= 0))"
    )
    connection.execute(
        "INSERT INTO visit_totals (id, visits) VALUES (1, ?) "
        "ON CONFLICT(id) DO UPDATE SET visits = MAX(visit_totals.visits, excluded.visits)",
        (initial_total_visits(),),
    )
    connection.commit()
    return connection


@app.context_processor
def inject_public_metadata():
    site_url = configured_site_url()
    canonical_url = f"{site_url}{request.path}" if site_url else request.base_url
    seo_page = TOOL_SEO.get(request.endpoint)
    tool_structured_data = None
    related_tools = []
    if seo_page:
        related_tools = [
            {
                "label": item[1],
                "url": url_for(item[0], **(item[2] if len(item) > 2 else {})),
            }
            for item in seo_page["related"]
        ]
        tool_structured_data = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebApplication",
                    "name": seo_page["name"],
                    "url": canonical_url,
                    "description": seo_page["description"],
                    "applicationCategory": "UtilitiesApplication",
                    "operatingSystem": "Any",
                    "browserRequirements": "JavaScript-enabled web browser",
                    "isAccessibleForFree": True,
                    "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
                },
                {
                    "@type": "HowTo",
                    "name": seo_page["heading"].title(),
                    "description": seo_page["summary"],
                    "step": [
                        {"@type": "HowToStep", "position": position, "text": step}
                        for position, step in enumerate(seo_page["steps"], start=1)
                    ],
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": question,
                            "acceptedAnswer": {"@type": "Answer", "text": answer},
                        }
                        for question, answer in seo_page["faq"]
                    ],
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "Browser Tools", "item": public_url("index")},
                        {"@type": "ListItem", "position": 2, "name": seo_page["name"], "item": canonical_url},
                    ],
                },
            ],
        }
    return {
        "canonical_url": canonical_url,
        "seo_page": seo_page,
        "related_tools": related_tools,
        "tool_structured_data": tool_structured_data,
        "og_image_url": public_url("static", filename="og-browser-tools.jpg"),
        "site_home_url": public_url("index"),
        # Ads belong beside substantial editorial content, not inside utility,
        # navigation, policy, or error screens.
        "adsense_enabled": request.endpoint == "learn_article",
    }


@app.after_request
def add_security_headers(response):
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    return response


@app.get("/")
def index():
    return render_template("pdf_merge.html")


@app.get("/pdf-merge")
def pdf_merge():
    return redirect(url_for("index"), code=308)


@app.get("/pdf-split")
def pdf_split():
    return render_template("pdf_split.html")


@app.get("/pdf-organizer")
def pdf_organizer():
    return render_template("pdf_organizer.html")


@app.get("/pdf-annotations")
def pdf_annotations():
    return render_template("pdf_annotations.html")


@app.get("/pdf-to-images")
def pdf_to_images():
    return render_template("pdf_to_images.html")


@app.get("/images-to-pdf")
def images_to_pdf():
    return render_template("images_to_pdf.html")


@app.get("/image-toolkit")
def image_toolkit():
    return render_template("image_toolkit.html")


@app.get("/image-transform")
def image_transform():
    return render_template("image_transform.html")


@app.get("/file-hash")
def file_hash():
    return render_template("file_hash.html")


@app.get("/qr-generator")
def qr_generator():
    return render_template("qr_generator.html")


@app.get("/focus-timer")
def focus_timer():
    return render_template("index.html")


@app.get("/path-studio")
def path_studio():
    return render_template("path_studio.html")


@app.get("/calculator")
def calculator():
    return render_template("calculator.html")


@app.get("/learn")
def learn_index():
    structured_data = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Browser Tools Learning Library",
        "description": "Original field guides for diagnosing PDF, image, checksum, and browser privacy problems.",
        "url": public_url("learn_index"),
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": position,
                    "name": article["title"],
                    "url": public_url("learn_article", slug=slug),
                }
                for position, (slug, article) in enumerate(LEARN_PAGES.items(), start=1)
            ],
        },
    }
    return render_template("learn_index.html", articles=LEARN_PAGES, structured_data=structured_data)


@app.get("/discover")
def retired_discover():
    return redirect(url_for("index"), code=308)


@app.get("/learn/<slug>")
def learn_article(slug):
    article = LEARN_PAGES.get(slug)
    if article is None:
        abort(404)
    structured_data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": article["title"],
                "description": article["description"],
                "datePublished": article["published"],
                "dateModified": article["updated"],
                "author": {"@type": "Person", "name": os.getenv("SITE_OPERATOR", "khh go").strip()},
                "publisher": {"@type": "Organization", "name": "Browser Tools"},
                "mainEntityOfPage": public_url("learn_article", slug=slug),
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Browser Tools", "item": public_url("index")},
                    {"@type": "ListItem", "position": 2, "name": "Learn", "item": public_url("learn_index")},
                    {"@type": "ListItem", "position": 3, "name": article["title"], "item": public_url("learn_article", slug=slug)},
                ],
            },
        ],
    }
    return render_template(
        "learn_article.html",
        article=article,
        slug=slug,
        structured_data=structured_data,
        site_operator=os.getenv("SITE_OPERATOR", "khh go").strip(),
        related_articles=[(key, value) for key, value in LEARN_PAGES.items() if key != slug][:3],
    )


@app.get("/<any(about,guides,faq,privacy,terms,contact):slug>")
def content_page(slug):
    page = PAGES.get(slug)
    if page is None:
        abort(404)
    return render_template(
        "content_page.html",
        page=page,
        slug=slug,
        contact_email=os.getenv("CONTACT_EMAIL", "khh901001@proton.me").strip(),
        site_operator=os.getenv("SITE_OPERATOR", "khh go").strip(),
    )


@app.get("/healthz")
def health_check():
    return {"status": "ok"}


@app.get("/manifest.webmanifest")
def web_app_manifest():
    response = send_from_directory(app.static_folder, "manifest.webmanifest", mimetype="application/manifest+json")
    response.headers["Cache-Control"] = "public, max-age=3600"
    return response


@app.get("/service-worker.js")
def service_worker():
    response = send_from_directory(app.static_folder, "service-worker.js", mimetype="application/javascript")
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Service-Worker-Allowed"] = "/"
    return response


@app.route("/api/visits", methods=["GET", "POST"])
def visitor_counts():
    visit_date = datetime.now(KOREA_TIME).date().isoformat()
    payload = request.get_json(silent=True) or {} if request.method == "POST" else {}
    count_total = payload.get("countTotal") is True
    count_today = payload.get("countToday") is True

    init_today = initial_today_visits()
    connection = open_visitor_database()
    try:
        with connection:
            connection.execute(
                "INSERT INTO daily_visits (visit_date, visits) VALUES (?, ?) "
                "ON CONFLICT(visit_date) DO UPDATE SET visits = MAX(daily_visits.visits, excluded.visits)",
                (visit_date, init_today),
            )
            if count_total:
                connection.execute("UPDATE visit_totals SET visits = visits + 1 WHERE id = 1")
            if count_today:
                connection.execute("UPDATE daily_visits SET visits = visits + 1 WHERE visit_date = ?", (visit_date,))
            total = connection.execute("SELECT visits FROM visit_totals WHERE id = 1").fetchone()[0]
            today_row = connection.execute(
                "SELECT visits FROM daily_visits WHERE visit_date = ?",
                (visit_date,),
            ).fetchone()
    finally:
        connection.close()

    response = jsonify({"total": total, "today": today_row[0] if today_row else init_today, "date": visit_date})
    response.headers["Cache-Control"] = "no-store"
    return response


@app.get("/googleab522432670c34d4.html")
def google_site_verification():
    return send_from_directory(app.root_path, "googleab522432670c34d4.html", mimetype="text/html")


@app.get("/ads.txt")
def ads_txt():
    return send_from_directory(app.root_path, "ads.txt", mimetype="text/plain")


@app.get("/robots.txt")
def robots_txt():
    body = f"User-agent: *\nAllow: /\nSitemap: {public_url('sitemap_xml')}\n"
    return Response(body, mimetype="text/plain")


@app.get("/sitemap.xml")
def sitemap_xml():
    page_urls = [
        public_url("index"),
        public_url("pdf_split"),
        public_url("pdf_organizer"),
        public_url("pdf_annotations"),
        public_url("pdf_to_images"),
        public_url("images_to_pdf"),
        public_url("image_toolkit"),
        public_url("image_transform"),
        public_url("file_hash"),
        public_url("qr_generator"),
        public_url("focus_timer"),
        public_url("path_studio"),
        public_url("calculator"),
        public_url("learn_index"),
        *[public_url("learn_article", slug=slug) for slug in LEARN_PAGES],
        *[public_url("content_page", slug=slug) for slug in PAGES],
    ]
    pages = [{"loc": page, "lastmod": SITEMAP_LASTMOD} for page in page_urls]
    return Response(render_template("sitemap.xml", pages=pages), mimetype="application/xml")


@app.errorhandler(404)
def not_found(_error):
    return render_template(
        "error_page.html",
        code="404",
        title="Page not found",
        message="The page may have moved, or the address may be incomplete.",
    ), 404


@app.errorhandler(500)
def server_error(_error):
    return render_template(
        "error_page.html",
        code="500",
        title="Something went wrong",
        message="The service could not complete this request. Try again in a moment.",
    ), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG") == "1",
    )
