PAGES = {
    "about": {
        "title": "About Browser Tools",
        "description": "Learn why Browser Tools builds practical, browser-first utilities with privacy in mind.",
        "eyebrow": "ABOUT / BROWSER TOOLS",
        "heading": "SMALL TOOLS.\nCLEAR PURPOSE.",
        "intro": "Browser Tools is a growing collection of focused browser utilities designed to solve everyday tasks without unnecessary accounts, dashboards, or uploads.",
        "sections": [
            {
                "title": "WHY THIS SITE EXISTS",
                "text": "Many simple tasks are routed through services that ask users to upload documents, create accounts, or hand over more information than the task requires. Browser Tools takes a smaller approach: open a tool, complete the task, and leave."
            },
            {
                "title": "BROWSER-FIRST BY DESIGN",
                "text": "PDF and image processing, file hashing, QR generation, path editing, and everyday calculations are performed in the browser. The focus timer also runs locally and remembers its state on the same device."
            },
            {
                "title": "WHAT WE VALUE",
                "text": "The project is guided by three ideas:",
                "items": [
                    "Useful tools should be understandable at a glance.",
                    "Private files should stay on the user's device whenever the task allows it.",
                    "A tool should remain usable before visual decoration or advertising is considered."
                ]
            },
            {
                "title": "CURRENT TOOLKIT",
                "text": "The collection includes PDF merge, split, page organization, PDF-image conversion, an image toolkit, file hashing, QR generation, a focus timer, a multi calculator, and a desktop path editor."
            }
        ]
    },
    "guides": {
        "title": "How to Use Browser Tools",
        "description": "Step-by-step instructions for Browser Tools PDF, image, checksum, QR, focus, calculation, and path utilities.",
        "eyebrow": "GUIDES / START HERE",
        "heading": "USE EVERY TOOL.\nWITHOUT GUESSING.",
        "intro": "Each tool is independent. Choose the task you need, follow the short workflow below, and keep your work on your device whenever local processing is available.",
        "sections": [
            {
                "title": "PDF MERGE",
                "text": "Add two or more PDF files, arrange them in the required order, remove anything you do not need, and select the merge action.",
                "items": ["Files are read in browser memory.", "The merged result is downloaded to your device.", "Closing the page clears the working file list."],
                "endpoint": "index",
                "link_label": "OPEN PDF MERGE"
            },
            {
                "title": "PDF SPLIT",
                "text": "Add one PDF, review the three-column page preview, and select the cut markers between pages. Confirm the split to download the resulting documents.",
                "items": ["Cut markers appear before, between, and after pages.", "Page previews help confirm the correct boundaries.", "Multiple outputs are packaged for convenient download."],
                "endpoint": "pdf_split",
                "link_label": "OPEN PDF SPLIT"
            },
            {
                "title": "PDF PAGE ORGANIZER",
                "text": "Add one PDF, drag page cards into a new order, rotate or remove pages, and select any pages you want to extract.",
                "items": ["SAVE PDF keeps every visible page in its displayed order.", "EXTRACT SELECTED creates a PDF containing only selected pages.", "Keep the original document until you have checked the new file."],
                "endpoint": "pdf_organizer",
                "link_label": "OPEN PDF ORGANIZER"
            },
            {
                "title": "PDF TO IMAGES",
                "text": "Add one PDF, optionally enter a page range such as 1-3, 5, and choose PNG or JPEG plus a rendering scale.",
                "items": ["Selected pages are packaged in a ZIP file.", "A higher scale produces larger, sharper images and uses more memory.", "Encrypted or damaged PDFs may not open."],
                "endpoint": "pdf_to_images",
                "link_label": "OPEN PDF TO IMAGES"
            },
            {
                "title": "IMAGES TO PDF",
                "text": "Add JPG, PNG, or WebP images, put them in order, choose a page size and margin, and create one PDF.",
                "items": ["Match each image preserves its natural page proportions.", "A4 and US Letter fit each image inside a standard portrait page.", "Very large images may use substantial browser memory."],
                "endpoint": "images_to_pdf",
                "link_label": "OPEN IMAGES TO PDF"
            },
            {
                "title": "IMAGE TOOLKIT",
                "text": "Add one JPG, PNG, or WebP image, enter output dimensions, choose a format and quality, and download the result.",
                "items": ["Keep aspect ratio prevents accidental stretching.", "Quality affects JPEG and WebP output; PNG is lossless.", "JPEG output replaces transparent areas with white."],
                "endpoint": "image_toolkit",
                "link_label": "OPEN IMAGE TOOLKIT"
            },
            {
                "title": "FILE HASH CHECKER",
                "text": "Choose a file and an algorithm. Compare the calculated hexadecimal value with a checksum supplied by the file publisher.",
                "items": ["SHA-256 is the usual default for modern checksum verification.", "A matching hash supports file-integrity checking but does not by itself prove a file is safe.", "Changing even one byte produces a different hash."],
                "endpoint": "file_hash",
                "link_label": "OPEN FILE HASH"
            },
            {
                "title": "QR CODE GENERATOR",
                "text": "Enter text or a URL, choose an error-correction level and image size, then download the PNG.",
                "items": ["Higher error correction can improve resilience but makes the code denser.", "Test the QR code with more than one device before printing or publishing it.", "Do not encode secrets in a QR code intended for public display."],
                "endpoint": "qr_generator",
                "link_label": "OPEN QR GENERATOR"
            },
            {
                "title": "FOCUS TIMER",
                "text": "Choose a preset or enter a custom duration, select START FOCUS, and keep the tab open while you work.",
                "items": ["Space starts or pauses the timer.", "R resets the current session.", "The selected timer state is stored in this browser so a refresh does not immediately erase it."],
                "endpoint": "focus_timer",
                "link_label": "OPEN FOCUS TIMER"
            },
            {
                "title": "PATH STUDIO",
                "text": "Open Path Studio on a desktop or laptop with a screen at least 1080 pixels wide. Use PEN to place anchors, hold Alt while dragging to create curves, and use SELECT to move anchors, handles, images, or complete paths.",
                "items": ["Drag two open endpoints together to join paths.", "Add image layers and adjust their opacity in Properties.", "SAVE PROJECT creates a local .pathwork file that can be reopened later.", "EXPORT PNG creates a flattened image of the canvas."],
                "endpoint": "path_studio",
                "link_label": "OPEN PATH STUDIO"
            },
            {
                "title": "MULTI CALCULATOR",
                "text": "Choose arithmetic, PERCENT, DISCOUNT, or TIP / SPLIT. Enter the requested values and the result updates immediately with a short calculation summary.",
                "items": ["Arithmetic mode adds, subtracts, multiplies, or divides two values.", "PERCENT calculates a percent of a number or the percentage change between two values.", "DISCOUNT removes the entered discount before applying sales tax.", "TIP / SPLIT adds a tip and divides the total among a whole number of people.", "Review local tax, service-charge, and rounding rules before relying on a result."],
                "endpoint": "calculator",
                "link_label": "OPEN MULTI CALCULATOR"
            }
        ]
    },
    "faq": {
        "title": "Frequently Asked Questions",
        "description": "Answers about privacy, browser processing, saved projects, supported files, and Browser Tools.",
        "eyebrow": "FAQ / COMMON QUESTIONS",
        "heading": "CLEAR ANSWERS.\nBEFORE YOU START.",
        "intro": "These answers describe how the current version of Browser Tools behaves. Review the Privacy Policy for the complete data-handling explanation.",
        "sections": [
            {"title": "ARE MY PDF OR IMAGE FILES UPLOADED?", "text": "No. The PDF and image tools process selected files in your browser. The Flask server delivers the page files but does not provide an upload endpoint for these tools."},
            {"title": "IS A MATCHING FILE HASH PROOF THAT A FILE IS SAFE?", "text": "No. A matching hash shows that your copy matches the reference checksum. It does not scan for malware or prove that the source itself is trustworthy."},
            {"title": "IS QR CODE CONTENT SENT TO THE SERVER?", "text": "No. The QR code is encoded by JavaScript in your browser. Test downloaded codes before relying on them, especially when they contain a URL."},
            {"title": "DO YOU STORE MY PATH STUDIO IMAGES?", "text": "No. Added images stay in browser memory while the editor is open. When you save a .pathwork project, the project and embedded image data are downloaded directly to your device."},
            {"title": "CAN I CONTINUE A PATH PROJECT LATER?", "text": "Yes. Select SAVE PROJECT, keep the downloaded .pathwork file, and use OPEN PROJECT when you return."},
            {"title": "WHAT HAPPENS WHEN I CLOSE A TOOL?", "text": "Temporary PDF, image, hash, QR, and Path Studio working data is cleared with the page. Download anything you want to keep before closing. The focus timer may retain its state locally in the browser."},
            {"title": "WHICH BROWSERS ARE SUPPORTED?", "text": "A current version of Chrome, Edge, Firefox, or Safari is recommended. Path Studio is disabled below 1080 pixels and requires a desktop or laptop screen. Large PDF files may require more memory, especially on mobile devices."},
            {"title": "WHY DOES A LARGE FILE FEEL SLOW?", "text": "Local processing uses your device's memory and processor. Large documents, high-resolution images, or many PDF pages can take longer without indicating that the files were uploaded."},
            {"title": "HOW DOES THE MULTI CALCULATOR HANDLE TAX AND TIPS?", "text": "The discount calculator applies the discount first and then calculates tax on the discounted subtotal. The tip calculator applies the entered tip rate to the bill and divides the total by the selected number of people. Local rules and venue practices can differ, so verify important totals."},
            {"title": "ARE CALCULATOR INPUTS SENT TO THE SERVER?", "text": "No. Multi Calculator inputs are processed by JavaScript in your browser and are not submitted to a calculation endpoint."},
            {"title": "ARE THE TOOLS GUARANTEED TO BE ERROR-FREE?", "text": "No software can be guaranteed error-free. Review downloaded documents and exported work before deleting original files or relying on the result."}
        ]
    },
    "privacy": {
        "title": "Privacy Policy",
        "description": "How Browser Tools handles browser data, local files, technical logs, external resources, and advertising.",
        "eyebrow": "POLICY / PRIVACY",
        "heading": "YOUR FILES STAY\nCLOSE TO YOU.",
        "intro": "This policy explains what the current Browser Tools website processes, what may be stored on your device, and how third-party resources and advertising may process technical information.",
        "updated": "Last updated: July 15, 2026",
        "sections": [
            {"title": "FILES AND TOOL INPUTS", "text": "PDF documents, images, Path Studio projects, files selected for hashing, and text entered for QR generation are processed in the browser. These tools do not send that working content to the application server. Temporary working data is normally cleared when the page closes."},
            {"title": "LOCAL BROWSER STORAGE", "text": "The focus timer may use local browser storage to preserve timer state on the same device. You can remove this information by clearing site data in your browser."},
            {"title": "CALCULATIONS", "text": "Values entered in the multi calculator are calculated in the browser and are not submitted to an application endpoint."},
            {"title": "HOSTING AND TECHNICAL LOGS", "text": "When the site is publicly hosted, the hosting provider may process standard request information such as IP address, browser type, requested URL, timestamps, and security logs. This information may be required to deliver, protect, and diagnose the website."},
            {"title": "EXTERNAL RESOURCES", "text": "The current interface loads font resources from Google Fonts. Requests for these resources may disclose standard connection information, including an IP address, to the resource provider."},
            {"title": "ADVERTISING AND COOKIES", "text": "Browser Tools uses Google AdSense advertising code. Google and its partners may use cookies, device identifiers, IP addresses, and related technical information to deliver, measure, limit, and personalize advertising where permitted. Consent choices are presented where required, and users can review Google's advertising and privacy controls for additional options."},
            {"title": "DATA SALES AND USER ACCOUNTS", "text": "Browser Tools does not currently provide user accounts and does not sell the PDF, image, project, checksum, QR, timer, or calculation contents users process in the tools."},
            {"title": "CHILDREN", "text": "The service is a general-purpose utility site and is not designed to collect personal information from children."},
            {"title": "POLICY CHANGES", "text": "This policy may be revised when hosting, analytics, advertising, contact methods, or tool behavior changes. The updated date will be changed when material revisions are published."},
            {"title": "CONTACT", "text": "Privacy questions can be sent through the contact method published on the Contact page."}
        ]
    },
    "terms": {
        "title": "Terms of Use",
        "description": "Terms governing use of Browser Tools, local file processing, acceptable use, and service availability.",
        "eyebrow": "POLICY / TERMS",
        "heading": "USE THE TOOLS.\nKEEP CONTROL.",
        "intro": "By using Browser Tools, you agree to use the service lawfully and to review important outputs before relying on them.",
        "updated": "Last updated: July 15, 2026",
        "sections": [
            {"title": "SERVICE PROVIDED AS IS", "text": "The tools are provided on an as-is and as-available basis. Features may contain errors, change, pause, or be removed. Continuous availability and compatibility with every file or browser are not guaranteed."},
            {"title": "YOUR RESPONSIBILITY", "text": "You are responsible for confirming that you have permission to process selected files, reviewing generated documents, images, QR codes, and exports, and keeping backups of original material."},
            {"title": "CHECKSUMS AND QR CODES", "text": "File hashes are integrity-comparison values, not malware scans or guarantees of safety. QR codes can conceal destinations from casual view; verify their content and test generated codes before sharing, printing, or relying on them."},
            {"title": "ACCEPTABLE USE", "text": "You may not use the service to violate laws, infringe intellectual property or privacy rights, attack the website, bypass security controls, distribute malware, or interfere with other users."},
            {"title": "NO PROFESSIONAL ADVICE", "text": "Outputs and information provided by the tools are not legal, financial, medical, accounting, or other professional advice."},
            {"title": "LOCAL PROCESSING LIMITS", "text": "Browser-based processing depends on your device, browser, available memory, and file complexity. Closing or refreshing a page may remove unsaved working data."},
            {"title": "INTELLECTUAL PROPERTY", "text": "The website interface, original copy, and original code are protected by applicable intellectual property laws. Rights in user-selected files remain with their respective owners."},
            {"title": "LIMITATION OF LIABILITY", "text": "To the extent permitted by law, the service operator is not liable for lost files, lost work, inaccurate conversion, corrupted output, interruption, or indirect damages arising from use of the tools."},
            {"title": "CHANGES TO THESE TERMS", "text": "These terms may be updated as the service changes. Continued use after an update constitutes acceptance of the revised terms where permitted by law."},
            {"title": "CONTACT", "text": "Questions about these terms can be sent through the contact method published on the Contact page."}
        ]
    },
    "contact": {
        "title": "Contact Browser Tools",
        "description": "Contact Browser Tools about support, privacy, policy questions, or feedback.",
        "eyebrow": "CONTACT / SUPPORT",
        "heading": "QUESTIONS.\nFEEDBACK. ISSUES.",
        "intro": "Use the contact channel below for tool feedback, accessibility issues, privacy questions, or reports of unexpected behavior.",
        "contact_page": True,
        "sections": [
            {"title": "BEFORE REPORTING A TOOL ISSUE", "text": "Include the tool name, browser and device, what you expected, and what happened. Do not attach private PDFs or images, Path Studio project files, confidential screenshots, passwords, QR contents, or payment information."},
            {"title": "RESPONSE EXPECTATIONS", "text": "Messages may be reviewed for product support and policy questions. A response time is not guaranteed, and urgent or emergency requests cannot be handled through this website."},
            {"title": "PRIVACY REQUESTS", "text": "Use the subject line PRIVACY REQUEST and describe the request without including unnecessary personal or confidential information."}
        ]
    }
}
