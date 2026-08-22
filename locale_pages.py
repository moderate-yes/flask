"""English discovery-page copy and tool metadata."""

TOOLS = [
    ("index", "merge"),
    ("pdf_split", "split"),
    ("pdf_organizer", "organizer"),
    ("pdf_annotations", "annotations"),
    ("pdf_to_images", "pdf_images"),
    ("images_to_pdf", "images_pdf"),
    ("image_toolkit", "image_toolkit"),
    ("image_transform", "image_transform"),
    ("file_hash", "hash"),
    ("qr_generator", "qr"),
    ("focus_timer", "timer"),
    ("calculator", "calculator"),
    ("path_studio", "path"),
]

LOCALES = {
    "en": {
        "hreflang": "en", "html_lang": "en", "dir": "ltr", "og_locale": "en_US", "name": "English",
        "title": "Private Browser Tools for PDFs, Images, QR Codes & More",
        "description": "Free private browser tools for PDF and images: merge, split, organize, convert, edit, and create QR codes for users in Vietnam, India, Indonesia, Korea, and worldwide.",
        "eyebrow": "PRIVATE BROWSER TOOLKIT", "heading": "PRACTICAL TOOLS.\nLESS DATA SHARING.",
        "intro": "A focused collection of browser-first utilities. Work with PDFs and images locally, verify files, create QR codes, calculate, focus, and sketch paths without an account.",
        "privacy_title": "Your working files stay on your device",
        "privacy_text": "Supported PDF, image, checksum, and QR operations run in your browser. The site does not send that working content to our server or store it in an account.",
        "how_title": "Simple by design", "steps": ["Choose the tool you need.", "Complete the task in your browser.", "Download or save the result locally."],
        "open": "OPEN TOOL", "note": "Tool interfaces open in English.",
        "tools": {
            "timer": ("Focus Timer", "Run a clean countdown with presets, pause, reset, sound, and locally saved state."),
            "merge": ("Merge PDFs", "Combine and reorder PDF files directly in your browser without uploading them."),
            "split": ("Split PDFs", "Preview three pages per row, choose cut points, and download separated PDF files."),
            "organizer": ("Organize PDF Pages", "Reorder, rotate, remove, and extract pages before downloading a new PDF."),
            "annotations": ("PDF Annotation Editor", "View, edit, and add PDF highlights and comments directly in the browser."),
            "pdf_images": ("PDF to Images", "Render selected PDF pages as PNG or JPEG files and download them in a ZIP."),
            "images_pdf": ("Images to PDF", "Arrange JPG, PNG, or WebP images and turn them into one downloadable PDF."),
            "image_toolkit": ("Image Toolkit", "Resize, compress, and convert an image to PNG, JPEG, or WebP."),
            "image_transform": ("Image Transform", "Mirror, flip upside down, and rotate an image without uploading it."),
            "hash": ("File Hash Checker", "Calculate a SHA-256, SHA-384, or SHA-512 fingerprint for a local file."),
            "qr": ("QR Code Generator", "Create and download a QR code for text or a URL without submitting its content."),
            "path": ("Path Studio", "Draw selectable Bezier paths, manage layers, import images, and save projects locally."),
            "calculator": ("Multi Calculator", "Calculate arithmetic, percentages, discounts, sales tax, tips, and split bills with clear formulas."),
        },
    },
}
