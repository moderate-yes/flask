"""Temporary publication switch; retained tools can be restored without rewriting them."""
from copy import deepcopy

# Set True to restore both tools, their links, descriptions and sitemap entries.
# Rebuild/redeploy after changing this switch (also refresh the service-worker cache).
SECONDARY_TOOLS_ENABLED = False
SECONDARY_ENDPOINTS = frozenset({"focus_timer", "calculator"})
SECONDARY_PATHS = frozenset({"/focus-timer", "/calculator"})
EXTRA_TOOLS_ENABLED = False
EXTRA_ENDPOINTS = frozenset({"image_toolkit", "image_transform", "file_hash", "qr_generator"})
EXTRA_PATHS = frozenset({"/image-toolkit", "/image-transform", "/file-hash", "/qr-generator"})
PAUSED_GUIDES = frozenset({'/learn/resize-image-for-online-forms', '/learn/verify-sha256-checksum'})


def tool_is_public(endpoint):
    return (SECONDARY_TOOLS_ENABLED or endpoint not in SECONDARY_ENDPOINTS) and (EXTRA_TOOLS_ENABLED or endpoint not in EXTRA_ENDPOINTS)


def path_is_public(path):
    return (SECONDARY_TOOLS_ENABLED or path not in SECONDARY_PATHS) and (EXTRA_TOOLS_ENABLED or path not in EXTRA_PATHS | PAUSED_GUIDES)


def public_content_page(slug, original):
    """Project current public copy without deleting the retained tool documentation."""
    if SECONDARY_TOOLS_ENABLED or original is None:
        return original
    page = deepcopy(original)
    hidden_titles = {
        "FOCUS TIMER", "MULTI CALCULATOR", "CALCULATIONS",
        "HOW DOES THE MULTI CALCULATOR HANDLE TAX AND TIPS?",
        "ARE CALCULATOR INPUTS SENT TO THE SERVER?",
    }
    page["sections"] = [
        section for section in page.get("sections", [])
        if tool_is_public(section.get("endpoint")) and section["title"] not in hidden_titles
    ]
    replacements = {
        "BROWSER-FIRST BY DESIGN": "PDF and image processing, file hashing, and QR generation are performed in the browser.",
        "CURRENT TOOLKIT": "The collection includes PDF merge, split, page organization, annotations, PDF-image conversion, image resizing and transformation, file hashing, and QR generation.",
        "WHAT HAPPENS WHEN I CLOSE A TOOL?": "Temporary PDF, image, hash, and QR working data is cleared with the page. Download anything you want to keep before closing.",
        "LOCAL BROWSER STORAGE": "Previously saved preferences may remain on this device. You can remove this information by clearing site data in your browser.",
        "DATA SALES AND USER ACCOUNTS": "Browser Tools does not currently provide user accounts and does not sell the PDF, image, checksum, or QR contents users process in the tools.",
    }
    for section in page["sections"]:
        if section["title"] in replacements:
            section["text"] = replacements[section["title"]]
        if not EXTRA_TOOLS_ENABLED:
            pdf_copy = {
                'CURRENT TOOLKIT': 'The public tools cover PDF merging, splitting, page organization, annotations, PDF-to-image export and images-to-PDF conversion.',
                'BROWSER-FIRST BY DESIGN': 'PDF processing and image-to-PDF conversion take place in the browser.',
                'WHAT HAPPENS WHEN I CLOSE A TOOL?': 'Temporary document data is cleared with the page. Download anything you want to keep before closing.',
            }
            if section['title'] in pdf_copy:
                section['text'] = pdf_copy[section['title']]
    if slug == "guides":
        page["description"] = "Step-by-step instructions for Browser Tools PDF, image, checksum, and QR utilities."
    return page
