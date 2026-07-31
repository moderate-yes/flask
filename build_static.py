"""Build the Flask site as static files suitable for Amazon S3.

The Flask app is used only at build time. Every published tool continues to
run locally in the visitor's browser using the JavaScript files under static/.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent

ROUTES = {
    "/": "index.html",
    "/pdf-split": "pdf-split/index.html",
    "/pdf-organizer": "pdf-organizer/index.html",
    "/pdf-to-images": "pdf-to-images/index.html",
    "/images-to-pdf": "images-to-pdf/index.html",
    "/image-toolkit": "image-toolkit/index.html",
    "/image-transform": "image-transform/index.html",
    "/file-hash": "file-hash/index.html",
    "/qr-generator": "qr-generator/index.html",
    "/focus-timer": "focus-timer/index.html",
    "/path-studio": "path-studio/index.html",
    "/calculator": "calculator/index.html",
    "/discover": "discover/index.html",
    "/ko/discover": "ko/discover/index.html",
    "/ja/discover": "ja/discover/index.html",
    "/es/discover": "es/discover/index.html",
    "/fr/discover": "fr/discover/index.html",
    "/de/discover": "de/discover/index.html",
    "/pt/discover": "pt/discover/index.html",
    "/zh-cn/discover": "zh-cn/discover/index.html",
    "/hi/discover": "hi/discover/index.html",
    "/ar/discover": "ar/discover/index.html",
    "/about": "about/index.html",
    "/guides": "guides/index.html",
    "/faq": "faq/index.html",
    "/privacy": "privacy/index.html",
    "/terms": "terms/index.html",
    "/contact": "contact/index.html",
}

INDEXED_ROUTES = (
    "/",
    "/pdf-split",
    "/pdf-organizer",
    "/pdf-to-images",
    "/images-to-pdf",
    "/image-toolkit",
    "/image-transform",
    "/file-hash",
    "/qr-generator",
    "/focus-timer",
    "/path-studio",
    "/calculator",
    "/discover",
    "/about",
    "/guides",
    "/faq",
    "/privacy",
    "/terms",
    "/contact",
)

URL_ATTRIBUTE = re.compile(
    r'(?P<name>href|src|data-[a-z0-9-]+)=(?P<quote>["\'])(?P<url>/[^"\']*)(?P=quote)',
    re.IGNORECASE,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build the S3 static website.")
    parser.add_argument(
        "--site-url",
        default=os.getenv("SITE_URL", "http://localhost:8000"),
        help="Public origin used for canonical URLs and sitemap.xml.",
    )
    parser.add_argument(
        "--output",
        default=str(ROOT / "s3-site"),
        help="Output directory. Existing generated contents are replaced.",
    )
    return parser.parse_args()


def validate_site_url(value: str) -> str:
    value = value.strip().rstrip("/")
    parsed = urlsplit(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc or parsed.path:
        raise ValueError("--site-url must be an origin such as https://tools.example.com")
    return value


def static_path(path: str) -> str:
    base, separator, suffix = path.partition("?")
    fragment = ""
    if "#" in (suffix if separator else base):
        if separator:
            suffix, _, fragment = suffix.partition("#")
        else:
            base, _, fragment = base.partition("#")

    if base in ROUTES and base != "/":
        base = f"{base}/"

    result = base
    if separator:
        result += f"?{suffix}"
    if fragment:
        result += f"#{fragment}"
    return result


def rewrite_html(html: str, site_url: str) -> str:
    def replace_attribute(match: re.Match[str]) -> str:
        url = static_path(match.group("url"))
        return f'{match.group("name")}={match.group("quote")}{url}{match.group("quote")}'

    html = URL_ATTRIBUTE.sub(replace_attribute, html)

    # Canonical, Open Graph, and JSON-LD URLs are absolute. Match the longest
    # routes first so the root URL does not consume every internal URL.
    for route in sorted(ROUTES, key=len, reverse=True):
        if route == "/":
            continue
        html = html.replace(f"{site_url}{route}", f"{site_url}{route}/")
    return html


def write_text(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding="utf-8", newline="\n")


def redirect_page(site_url: str) -> str:
    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0; url=/">
    <link rel="canonical" href="{site_url}/">
    <title>PDF Merge — Browser Tools</title>
    <script>window.location.replace("/");</script>
  </head>
  <body>
    <p><a href="/">Continue to PDF Merge</a></p>
  </body>
</html>
"""


def sitemap(site_url: str) -> str:
    entries = []
    for route in INDEXED_ROUTES:
        public_path = "/" if route == "/" else f"{route}/"
        entries.append(
            "  <url>\n"
            f"    <loc>{site_url}{public_path}</loc>\n"
            "    <lastmod>2026-07-26</lastmod>\n"
            "  </url>"
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )


def validate_output(output: Path) -> None:
    errors: list[str] = []
    html_files = list(output.rglob("*.html"))
    linked_url = re.compile(
        r'(?:href|src|data-[a-z0-9-]+)=["\']([^"\']*)["\']',
        re.IGNORECASE,
    )
    json_ld = re.compile(
        r'<script type="application/ld\+json">(.*?)</script>',
        re.DOTALL,
    )

    for html_file in html_files:
        relative = html_file.relative_to(output).as_posix()
        html = html_file.read_text(encoding="utf-8")
        if "{{" in html or "{%" in html:
            errors.append(f"Unrendered template syntax in {relative}")

        for block in json_ld.findall(html):
            try:
                json.loads(block)
            except json.JSONDecodeError as error:
                errors.append(f"Invalid JSON-LD in {relative}: {error}")

        for url in linked_url.findall(html):
            parsed = urlsplit(url)
            if parsed.scheme or url.startswith(("mailto:", "#", "data:")):
                continue
            if not parsed.path.startswith("/"):
                continue
            target = output / parsed.path.lstrip("/")
            target_exists = target.is_file() or (
                target.is_dir() and (target / "index.html").is_file()
            )
            if not target_exists:
                errors.append(f"Broken internal URL in {relative}: {url}")

    for worker_name in ("static/js/pdf-worker.js", "static/js/pdf-split-worker.js"):
        worker = output / worker_name
        for url in re.findall(
            r'importScripts\(["\']([^"\']+)',
            worker.read_text(encoding="utf-8"),
        ):
            if url.startswith("/") and not (output / url.lstrip("/")).is_file():
                errors.append(f"Broken worker import in {worker_name}: {url}")

    sitemap_text = (output / "sitemap.xml").read_text(encoding="utf-8")
    if sitemap_text.count("<url>") != len(INDEXED_ROUTES):
        errors.append("sitemap.xml does not contain every indexed route")
    if re.search(
        r"/(ko|ja|es|fr|de|pt|zh-cn|hi|ar)/discover/",
        sitemap_text,
    ):
        errors.append("A noindex localized discovery page appears in sitemap.xml")

    if errors:
        raise RuntimeError("\n".join(errors))


def build(site_url: str, output: Path) -> None:
    # Set these before importing the app so its URL helpers render the intended
    # production origin into canonical and structured-data fields.
    os.environ["SITE_URL"] = site_url
    os.environ.setdefault("CONTACT_EMAIL", "khh901001@proton.me")
    os.environ.setdefault("SITE_OPERATOR", "khh go")

    from app import app

    resolved_output = output.resolve()
    if resolved_output == ROOT or ROOT not in resolved_output.parents:
        raise ValueError("--output must be a dedicated directory inside this project")
    if resolved_output.exists():
        shutil.rmtree(resolved_output)
    resolved_output.mkdir(parents=True)
    shutil.copytree(ROOT / "static", resolved_output / "static")

    with app.test_client() as client:
        for route, destination in ROUTES.items():
            response = client.get(route)
            if response.status_code != 200:
                raise RuntimeError(f"{route} returned HTTP {response.status_code}")
            html = rewrite_html(response.get_data(as_text=True), site_url)
            write_text(resolved_output / destination, html)

        error_response = client.get("/this-page-does-not-exist")
        if error_response.status_code != 404:
            raise RuntimeError("The 404 page did not return HTTP 404 during the build")
        write_text(
            resolved_output / "404.html",
            rewrite_html(error_response.get_data(as_text=True), site_url),
        )

    write_text(resolved_output / "pdf-merge" / "index.html", redirect_page(site_url))
    write_text(
        resolved_output / "robots.txt",
        f"User-agent: *\nAllow: /\nSitemap: {site_url}/sitemap.xml\n",
    )
    write_text(resolved_output / "sitemap.xml", sitemap(site_url))
    shutil.copy2(ROOT / "ads.txt", resolved_output / "ads.txt")
    shutil.copy2(
        ROOT / "googleab522432670c34d4.html",
        resolved_output / "googleab522432670c34d4.html",
    )
    validate_output(resolved_output)

    print(f"Built {len(ROUTES)} pages in {resolved_output}")
    print(f"Validated {len(list(resolved_output.rglob('*.html')))} HTML files")
    print(f"Canonical origin: {site_url}")


if __name__ == "__main__":
    arguments = parse_args()
    build(validate_site_url(arguments.site_url), Path(arguments.output))
