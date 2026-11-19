"""Shared metadata for search-engine discovery files."""


# Update this only when indexed site content changes. Keeping one value shared
# by Flask and the static exporter prevents their sitemap dates from drifting.
SITEMAP_LASTMOD = "2026-10-17"


# Dates reflect content and navigation changes, rather than the build time.
PAGE_LASTMOD = {
    "/": "2026-11-20",
    "/pdf-split": "2026-11-20",
    "/pdf-organizer": "2026-11-20",
    "/pdf-compress": "2026-11-20",
    "/pdf-annotations": "2026-11-20",
    "/pdf-to-images": "2026-11-20",
    "/images-to-pdf": "2026-11-20",
    "/image-toolkit": "2026-11-20",
    "/image-transform": "2026-11-20",
}


def sitemap_lastmod(path):
    normalized = path.rstrip("/") or "/"
    if normalized == "/ko":
        normalized = "/"
    elif normalized.startswith("/ko/"):
        normalized = normalized[3:]
    return PAGE_LASTMOD.get(normalized, SITEMAP_LASTMOD)
