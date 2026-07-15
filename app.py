import os

from flask import Flask, Response, abort, redirect, render_template, request, send_from_directory, url_for
from werkzeug.middleware.proxy_fix import ProxyFix

from content_pages import PAGES
from locale_pages import LOCALES, TOOLS


app = Flask(__name__)

if os.getenv("TRUST_PROXY_HEADERS") == "1":
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)


def public_url(endpoint, **values):
    site_url = os.getenv("SITE_URL", "").strip().rstrip("/")
    path = url_for(endpoint, **values)
    return f"{site_url}{path}" if site_url else url_for(endpoint, _external=True, **values)


@app.context_processor
def inject_public_metadata():
    site_url = os.getenv("SITE_URL", "").strip().rstrip("/")
    canonical_url = f"{site_url}{request.path}" if site_url else request.base_url
    return {"canonical_url": canonical_url}


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


@app.get("/focus-timer")
def focus_timer():
    return render_template("index.html")


@app.get("/path-studio")
def path_studio():
    return render_template("path_studio.html")


@app.get("/calculator")
def calculator():
    return render_template("calculator.html")


def discover_path(language):
    return url_for("discover_default") if language == "en" else url_for("discover_localized", language=language)


def render_discover(language):
    locale = LOCALES[language]
    alternates = [
        {
            "code": code,
            "hreflang": item["hreflang"],
            "html_lang": item["html_lang"],
            "dir": item["dir"],
            "name": item["name"],
            "url": public_url("discover_default") if code == "en" else public_url("discover_localized", language=code),
        }
        for code, item in LOCALES.items()
    ]
    tools = [
        {"title": locale["tools"][key][0], "description": locale["tools"][key][1], "url": url_for(endpoint)}
        for endpoint, key in TOOLS
    ]
    structured_data = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": locale["title"],
        "description": locale["description"],
        "url": public_url("discover_default") if language == "en" else public_url("discover_localized", language=language),
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
    )


@app.get("/discover")
def discover_default():
    return render_discover("en")


@app.get("/<language>/discover")
def discover_localized(language):
    if language == "en" or language not in LOCALES:
        abort(404)
    return render_discover(language)


@app.get("/<any(about,guides,faq,privacy,terms,contact):slug>")
def content_page(slug):
    page = PAGES.get(slug)
    if page is None:
        abort(404)
    return render_template(
        "content_page.html",
        page=page,
        slug=slug,
        contact_email=os.getenv("CONTACT_EMAIL", "").strip(),
    )


@app.get("/healthz")
def health_check():
    return {"status": "ok"}


@app.get("/googlebb29d5b1978e0f82.html")
def google_site_verification():
    return send_from_directory(app.root_path, "googlebb29d5b1978e0f82.html", mimetype="text/html")


@app.get("/ads.txt")
def ads_txt():
    return send_from_directory(app.root_path, "ads.txt", mimetype="text/plain")


@app.get("/robots.txt")
def robots_txt():
    body = f"User-agent: *\nAllow: /\nSitemap: {public_url('sitemap_xml')}\n"
    return Response(body, mimetype="text/plain")


@app.get("/sitemap.xml")
def sitemap_xml():
    pages = [
        public_url("index"),
        public_url("pdf_split"),
        public_url("focus_timer"),
        public_url("path_studio"),
        public_url("calculator"),
        *[public_url("content_page", slug=slug) for slug in PAGES],
    ]
    locale_pages = [
        {
            "loc": public_url("discover_default") if code == "en" else public_url("discover_localized", language=code),
            "alternates": [
                {
                    "hreflang": item["hreflang"],
                    "url": public_url("discover_default") if alternate == "en" else public_url("discover_localized", language=alternate),
                }
                for alternate, item in LOCALES.items()
            ],
        }
        for code in LOCALES
    ]
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
