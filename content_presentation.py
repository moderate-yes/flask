"""Keep shared information in one public home without deleting legacy source copy."""
from copy import deepcopy

CONTENT_REDIRECTS = {"/about": "/contact", "/guides": "/learn"}


def streamlined_content(slug, page):
    if slug != "faq" or page is None:
        return page
    result = deepcopy(page)
    result["description"] = "Sitewide help with browser compatibility, local work, large files, and checking results."
    result["intro"] = "For task-specific instructions, open the relevant tool. These answers cover questions shared across the site."
    shared_questions = {
        "WHAT HAPPENS WHEN I CLOSE A TOOL?",
        "WHICH BROWSERS ARE SUPPORTED?",
        "WHY DOES A LARGE FILE FEEL SLOW?",
        "ARE THE TOOLS GUARANTEED TO BE ERROR-FREE?",
    }
    result["sections"] = [section for section in result["sections"] if section["title"] in shared_questions]
    return result
