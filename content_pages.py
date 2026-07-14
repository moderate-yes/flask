PAGES = {
    "about": {
        "title": "About Local Tools",
        "description": "Learn why Local Tools builds practical, browser-first utilities with privacy in mind.",
        "eyebrow": "ABOUT / LOCAL TOOLS",
        "heading": "SMALL TOOLS.\nCLEAR PURPOSE.",
        "intro": "Local Tools is a growing collection of focused browser utilities designed to solve everyday tasks without unnecessary accounts, dashboards, or uploads.",
        "sections": [
            {
                "title": "WHY THIS SITE EXISTS",
                "text": "Many simple tasks are routed through services that ask users to upload documents, create accounts, or hand over more information than the task requires. Local Tools takes a smaller approach: open a tool, complete the task, and leave."
            },
            {
                "title": "BROWSER-FIRST BY DESIGN",
                "text": "PDF merging, PDF splitting, path editing, image-layer work, number conversion, and everyday calculations are performed in the browser. The focus timer also runs locally and remembers its state on the same device."
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
                "text": "The collection currently includes a focus timer, private PDF merge and split tools, a desktop path editor, a US–Korean large-number converter, and a multi calculator for arithmetic, percentages, discounts, tax, tips, and split bills."
            }
        ]
    },
    "guides": {
        "title": "How to Use Local Tools",
        "description": "Step-by-step instructions for the focus timer, PDF tools, Path Studio, number converter, and multi calculator.",
        "eyebrow": "GUIDES / START HERE",
        "heading": "USE EVERY TOOL.\nWITHOUT GUESSING.",
        "intro": "Each tool is independent. Choose the task you need, follow the short workflow below, and keep your work on your device whenever local processing is available.",
        "sections": [
            {
                "title": "FOCUS TIMER",
                "text": "Choose a preset or enter a custom duration, select START FOCUS, and keep the tab open while you work.",
                "items": ["Space starts or pauses the timer.", "R resets the current session.", "The selected timer state is stored in this browser so a refresh does not immediately erase it."],
                "endpoint": "index",
                "link_label": "OPEN FOCUS TIMER"
            },
            {
                "title": "PDF MERGE",
                "text": "Add two or more PDF files, arrange them in the required order, remove anything you do not need, and select the merge action.",
                "items": ["Files are read in browser memory.", "The merged result is downloaded to your device.", "Closing the page clears the working file list."],
                "endpoint": "pdf_merge",
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
                "title": "PATH STUDIO",
                "text": "Use PEN to place anchors, hold Alt while dragging to create curves, and use SELECT to move anchors, handles, images, or complete paths.",
                "items": ["Drag two open endpoints together to join paths.", "Add image layers and adjust their opacity in Properties.", "SAVE PROJECT creates a local .pathwork file that can be reopened later.", "EXPORT PNG creates a flattened image of the canvas."],
                "endpoint": "path_studio",
                "link_label": "OPEN PATH STUDIO"
            },
            {
                "title": "NUMBER CONVERTER",
                "text": "Choose a conversion direction and type a value. A valid expression converts automatically after a short pause.",
                "items": ["US units include thousand, million, billion, trillion, K, M, B, and T.", "Korean inputs include 만, 억, 조, 경 and spellings such as 밀리언 or 빌리언.", "Use COPY to place the formatted result on the clipboard."],
                "endpoint": "number_converter",
                "link_label": "OPEN NUMBER CONVERTER"
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
        "description": "Answers about privacy, browser processing, saved projects, supported files, and Local Tools.",
        "eyebrow": "FAQ / COMMON QUESTIONS",
        "heading": "CLEAR ANSWERS.\nBEFORE YOU START.",
        "intro": "These answers describe how the current version of Local Tools behaves. Review the Privacy Policy for the complete data-handling explanation.",
        "sections": [
            {"title": "ARE MY PDF FILES UPLOADED?", "text": "No. The PDF merge and split tools process selected files in your browser. The Flask server delivers the page files but does not provide an upload endpoint for these tools."},
            {"title": "DO YOU STORE MY PATH STUDIO IMAGES?", "text": "No. Added images stay in browser memory while the editor is open. When you save a .pathwork project, the project and embedded image data are downloaded directly to your device."},
            {"title": "CAN I CONTINUE A PATH PROJECT LATER?", "text": "Yes. Select SAVE PROJECT, keep the downloaded .pathwork file, and use OPEN PROJECT when you return."},
            {"title": "WHAT HAPPENS WHEN I CLOSE A TOOL?", "text": "Temporary PDF and Path Studio working data is cleared with the page. Download anything you want to keep before closing. The focus timer may retain its state locally in the browser."},
            {"title": "WHICH BROWSERS ARE SUPPORTED?", "text": "A current version of Chrome, Edge, Firefox, or Safari is recommended. Large PDF files may require more memory, especially on mobile devices."},
            {"title": "WHY DOES A LARGE FILE FEEL SLOW?", "text": "Local processing uses your device's memory and processor. Large documents, high-resolution images, or many PDF pages can take longer without indicating that the files were uploaded."},
            {"title": "IS THE NUMBER CONVERTER A FINANCIAL CALCULATOR?", "text": "No. It converts large-number notation and unit expressions. Always verify values independently before using them in contracts, accounting, investments, or other high-stakes decisions."},
            {"title": "HOW DOES THE MULTI CALCULATOR HANDLE TAX AND TIPS?", "text": "The discount calculator applies the discount first and then calculates tax on the discounted subtotal. The tip calculator applies the entered tip rate to the bill and divides the total by the selected number of people. Local rules and venue practices can differ, so verify important totals."},
            {"title": "ARE CALCULATOR INPUTS SENT TO THE SERVER?", "text": "No. Multi Calculator and Number Converter inputs are processed by JavaScript in your browser and are not submitted to a calculation endpoint."},
            {"title": "ARE THE TOOLS GUARANTEED TO BE ERROR-FREE?", "text": "No software can be guaranteed error-free. Review downloaded documents and exported work before deleting original files or relying on the result."}
        ]
    },
    "privacy": {
        "title": "Privacy Policy",
        "description": "How Local Tools handles browser data, local files, technical logs, external resources, and future advertising.",
        "eyebrow": "POLICY / PRIVACY",
        "heading": "YOUR FILES STAY\nCLOSE TO YOU.",
        "intro": "This policy explains what the current Local Tools website processes, what may be stored on your device, and what may change if analytics or advertising is introduced.",
        "updated": "Last updated: July 14, 2026",
        "sections": [
            {"title": "FILES AND TOOL INPUTS", "text": "PDF documents, Path Studio project files, and images selected in supported tools are processed in the browser. These tools do not send those files to the application server. Temporary working data is normally cleared when the page closes."},
            {"title": "LOCAL BROWSER STORAGE", "text": "The focus timer may use local browser storage to preserve timer state on the same device. You can remove this information by clearing site data in your browser."},
            {"title": "CALCULATIONS AND NUMBER CONVERSION", "text": "Values entered in the multi calculator and number converter are calculated in the browser and are not submitted to an application endpoint."},
            {"title": "HOSTING AND TECHNICAL LOGS", "text": "When the site is publicly hosted, the hosting provider may process standard request information such as IP address, browser type, requested URL, timestamps, and security logs. This information may be required to deliver, protect, and diagnose the website."},
            {"title": "EXTERNAL RESOURCES", "text": "The current interface loads font resources from Google Fonts. Requests for these resources may disclose standard connection information, including an IP address, to the resource provider."},
            {"title": "ADVERTISING AND COOKIES", "text": "The current local development version does not include advertising code. If advertising or analytics is enabled, this policy will be updated before launch to describe providers, cookies, identifiers, consent choices, and opt-out methods. Where required, an appropriate consent message will be shown before relevant storage or personalized advertising is used."},
            {"title": "DATA SALES AND USER ACCOUNTS", "text": "Local Tools does not currently provide user accounts and does not sell the PDF, image, project, timer, calculation, or number-conversion contents users process in the tools."},
            {"title": "CHILDREN", "text": "The service is a general-purpose utility site and is not designed to collect personal information from children."},
            {"title": "POLICY CHANGES", "text": "This policy may be revised when hosting, analytics, advertising, contact methods, or tool behavior changes. The updated date will be changed when material revisions are published."},
            {"title": "CONTACT", "text": "Privacy questions can be sent through the contact method published on the Contact page."}
        ]
    },
    "terms": {
        "title": "Terms of Use",
        "description": "Terms governing use of Local Tools, local file processing, acceptable use, and service availability.",
        "eyebrow": "POLICY / TERMS",
        "heading": "USE THE TOOLS.\nKEEP CONTROL.",
        "intro": "By using Local Tools, you agree to use the service lawfully and to review important outputs before relying on them.",
        "updated": "Last updated: July 14, 2026",
        "sections": [
            {"title": "SERVICE PROVIDED AS IS", "text": "The tools are provided on an as-is and as-available basis. Features may contain errors, change, pause, or be removed. Continuous availability and compatibility with every file or browser are not guaranteed."},
            {"title": "YOUR RESPONSIBILITY", "text": "You are responsible for confirming that you have permission to process selected files, reviewing generated documents and exports, and keeping backups of original material."},
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
        "title": "Contact Local Tools",
        "description": "Contact Local Tools about support, privacy, policy questions, or feedback.",
        "eyebrow": "CONTACT / SUPPORT",
        "heading": "QUESTIONS.\nFEEDBACK. ISSUES.",
        "intro": "Use the contact channel below for tool feedback, accessibility issues, privacy questions, or reports of unexpected behavior.",
        "contact_page": True,
        "sections": [
            {"title": "BEFORE REPORTING A TOOL ISSUE", "text": "Include the tool name, browser and device, what you expected, and what happened. Do not attach private PDFs, Path Studio project files, confidential screenshots, passwords, or payment information."},
            {"title": "RESPONSE EXPECTATIONS", "text": "Messages may be reviewed for product support and policy questions. A response time is not guaranteed, and urgent or emergency requests cannot be handled through this website."},
            {"title": "PRIVACY REQUESTS", "text": "Use the subject line PRIVACY REQUEST and describe the request without including unnecessary personal or confidential information."}
        ]
    }
}
