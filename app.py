import os
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path

from flask import Flask, Response, abort, jsonify, redirect, render_template, request, send_from_directory, url_for
from werkzeug.middleware.proxy_fix import ProxyFix

from content_pages import PAGES
from locale_pages import LOCALES, TOOLS
from seo_pages import TOOL_SEO


app = Flask(__name__)
KOREA_TIME = timezone(timedelta(hours=9))

if os.getenv("TRUST_PROXY_HEADERS") == "1":
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)


def configured_site_url():
    return (
        os.getenv("SITE_URL", "").strip().rstrip("/")
        or os.getenv("RENDER_EXTERNAL_URL", "").strip().rstrip("/")
    )


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


def initial_total_visits():
    try:
        return max(0, int(os.getenv("INITIAL_TOTAL_VISITS", "1")))
    except ValueError:
        return 1


def initial_today_visits():
    try:
        return max(0, int(os.getenv("INITIAL_TODAY_VISITS", "1")))
    except ValueError:
        return 1


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
        "INSERT OR IGNORE INTO visit_totals (id, visits) VALUES (1, ?)",
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
        "adsense_enabled": request.endpoint in TOOL_SEO,
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


def render_discover():
    language = "en"
    locale = LOCALES[language]
    alternates = [
        {
            "code": code,
            "hreflang": item["hreflang"],
            "html_lang": item["html_lang"],
            "dir": item["dir"],
            "name": item["name"],
            "url": public_url("discover_default"),
        }
        for code, item in LOCALES.items()
    ]
    tools = []
    for endpoint, key in TOOLS:
        title, description = locale["tools"].get(key, LOCALES["en"]["tools"][key])
        tools.append({"title": title, "description": description, "url": url_for(endpoint)})
    structured_data = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": locale["title"],
        "description": locale["description"],
        "url": public_url("discover_default"),
        "inLanguage": locale["html_lang"],
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                {"@type": "ListItem", "position": index, "name": tool["title"], "url": public_url(endpoint)}
                for index, ((endpoint, _key), tool) in enumerate(zip(TOOLS, tools), start=1)
            ],
        },
    }
    return render_template(
        "discover.html",
        locale=locale,
        language=language,
        tools=tools,
        alternates=alternates,
        default_url=public_url("discover_default"),
        structured_data=structured_data,
        localized_page=False,
    )


@app.get("/discover")
def discover_default():
    return render_discover()


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
            if count_total:
                connection.execute("UPDATE visit_totals SET visits = visits + 1 WHERE id = 1")
            if count_today:
                connection.execute(
                    "INSERT INTO daily_visits (visit_date, visits) VALUES (?, ?) "
                    "ON CONFLICT(visit_date) DO UPDATE SET visits = visits + 1",
                    (visit_date, init_today),
                )
            total = connection.execute("SELECT visits FROM visit_totals WHERE id = 1").fetchone()[0]
            today_row = connection.execute(
                "SELECT visits FROM daily_visits WHERE visit_date = ?",
                (visit_date,),
            ).fetchone()
            if today_row is None:
                connection.execute(
                    "INSERT OR IGNORE INTO daily_visits (visit_date, visits) VALUES (?, ?)",
                    (visit_date, init_today),
                )
                today_row = (init_today,)
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
        *[public_url("content_page", slug=slug) for slug in PAGES],
    ]
    pages = [{"loc": page, "lastmod": "2026-07-26"} for page in page_urls]
    # Localized discovery pages currently lead to English-only tools. Keep them
    # available to visitors, but exclude them from the index until the complete
    # tool experience is localized.
    locale_pages = [{
        "loc": public_url("discover_default"),
        "lastmod": "2026-07-26",
        "alternates": [],
    }]
    return Response(render_template("sitemap.xml", pages=pages, locale_pages=locale_pages, default_url=public_url("discover_default")), mimetype="application/xml")


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
