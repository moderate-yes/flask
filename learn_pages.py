"""Original problem-solving guides based on Browser Tools workflows."""

LEARN_PAGES = {
    "scanned-pdf-preview-problems": {
        "category": "PDF DIAGNOSTICS",
        "title": "Why a Scanned PDF Preview Looks Blank, Dark, or Blurry",
        "description": "A practical diagnostic guide to PDF previews that load without readable content, fail before loading, or become blurry on mobile devices.",
        "heading": "WHEN A PDF PREVIEW FAILS.",
        "intro": "Two files with the same .pdf extension can be built very differently. This guide separates upload failures from rendering failures and shows what to check before changing or sharing the original document.",
        "published": "2026-09-03",
        "updated": "2026-09-03",
        "reading_time": "8 MIN READ",
        "tool_endpoint": "pdf_split",
        "tool_label": "OPEN PDF SPLIT",
        "sections": [
            {
                "title": "FIRST IDENTIFY THE FAILURE STAGE",
                "paragraphs": [
                    "A preview problem begins in one of three places. The browser may reject the file before reading it, the PDF parser may fail to interpret the document structure, or the page may render successfully at a scale that makes its contents difficult to read. These cases can look similar, but they require different responses.",
                    "Check whether the filename, size, and page count appear. If none appear, the file-selection stage probably failed. If they appear but no page cards are created, parsing or encryption is the likely issue. If page cards appear with faint or unreadable content, rendering scale, scan contrast, or unusually large page dimensions are more likely than an upload problem. Browser Tools processes the selected PDF in browser memory; seeing a local filename does not mean it was sent to the server."
                ],
                "checklist": [
                    "No filename or size: choose the file again and confirm that it has a .pdf extension.",
                    "Filename appears but page count does not: test whether the PDF opens in a dedicated reader and whether it requests a password.",
                    "Thumbnails appear but text is unreadable: open the enlarged preview before assuming the document is empty.",
                    "Only one particular file fails: preserve that file as evidence and test a copy rather than overwriting the source."
                ]
            },
            {
                "title": "WHY SCANNED PAGES NEED MORE PIXELS",
                "paragraphs": [
                    "A text PDF can describe letters and lines as scalable drawing instructions. A scanned PDF often contains one large photograph for each page. When that photograph is reduced to a small thumbnail, thin strokes and low-contrast gray text are averaged into fewer pixels. The page has rendered, but the thumbnail no longer contains enough pixels to communicate the scan clearly.",
                    "Page dimensions matter too. A scan saved as a poster-sized page can be scaled down much more aggressively than an A4 page, even when both images have similar pixel counts. Use the enlarged preview to judge actual content, and treat the thumbnail as a navigation aid rather than a quality test. Increasing zoom cannot recreate detail that was absent from the scan, but it can reveal detail that was hidden by thumbnail reduction."
                ],
                "table": {
                    "headers": ["WHAT YOU SEE", "LIKELY CAUSE", "USEFUL NEXT CHECK"],
                    "rows": [
                        ["Blank white page", "Very faint scan or unsupported paint operation", "Open the file in two PDF readers and compare"],
                        ["Dark rectangle", "Scan background or transparency interaction", "Export one page as PNG and inspect the pixels"],
                        ["Readable only when enlarged", "Thumbnail downscaling", "Use the enlarged preview; do not resave yet"],
                        ["Error before page count", "Password, damage, or unsupported structure", "Try an authorized unlocked copy"]
                    ]
                }
            },
            {
                "title": "PASSWORDS, DAMAGE, AND UNUSUAL PDF STRUCTURES",
                "paragraphs": [
                    "A PDF may be encrypted even when its icon and filename look ordinary. Some readers remember a password or use operating-system credentials, which can make the same file appear unlocked elsewhere. A browser tool cannot safely guess or remove that protection. Obtain an unlocked copy only when you have permission to do so.",
                    "Interrupted downloads, broken cross-reference tables, incremental saves, and scanner-specific encodings can also stop a browser parser. Opening and saving a permitted copy in a trusted desktop PDF application may rebuild the internal structure. Always save to a new filename and compare page count, orientation, comments, forms, and signatures. Re-saving may discard interactive features or invalidate digital signatures."
                ],
                "callout": "Do not use a repair workflow on the only copy of an important document. Duplicate it first, and keep the original unchanged."
            },
            {
                "title": "A SAFE DIAGNOSTIC SEQUENCE",
                "paragraphs": [
                    "Start with observations that do not modify the file. Confirm its size, open it in a dedicated reader, check the page count, and look for a password prompt or signature warning. Next, try the enlarged browser preview. If the page is visible there, the issue is thumbnail readability rather than missing content.",
                    "If the PDF works in one reader but not another, document the reader names and the failing page. That comparison is more useful than repeatedly uploading the file. If every reader fails, obtain a new copy from the source. If only one very large scan is affected, work on a duplicate and consider reducing scan dimensions with a trusted application before returning to the browser tool."
                ],
                "checklist": [
                    "Keep the original file.",
                    "Record whether filename, file size, and page count are shown.",
                    "Compare thumbnail and enlarged preview.",
                    "Test the same page in another reader.",
                    "Only then create a repaired or optimized copy."
                ]
            },
            {
                "title": "WHAT THE BROWSER TOOLS PREVIEW CAN AND CANNOT PROVE",
                "paragraphs": [
                    "A successful preview confirms that the browser could parse and paint a page. It does not prove that every annotation, form control, embedded file, color profile, layer, or digital signature will survive a later transformation. A preview is also not an authenticity check.",
                    "After splitting, organizing, or converting a PDF, reopen the downloaded result and compare critical pages with the source. Check small text, page order, rotation, links, forms, comments, and signatures. For archival, legal, medical, or financial records, retain the source and use an approved document workflow rather than relying on a browser preview alone."
                ]
            }
        ]
    },
    "pdf-comments-compatibility": {
        "category": "PDF ANNOTATIONS",
        "title": "Why PDF Comments Appear in One Reader but Not Another",
        "description": "Understand PDF annotation types, popup relationships, appearance streams, and safe checks when comments seem to disappear between readers.",
        "heading": "THE COMMENT MAY STILL BE THERE.",
        "intro": "A PDF comment is not always a visible speech bubble. It may be attached to a highlight, stored as a text, or drawn through a separate appearance definition. Reader differences explain many apparently missing comments.",
        "published": "2026-09-03",
        "updated": "2026-09-03",
        "reading_time": "9 MIN READ",
        "tool_endpoint": "pdf_annotations",
        "tool_label": "OPEN PDF ANNOTATIONS",
        "sections": [
            {
                "title": "ANNOTATION DATA AND VISIBLE APPEARANCE ARE SEPARATE",
                "paragraphs": [
                    "PDF annotations are page objects with a subtype, position, and optional properties such as contents, author, color, and modification date. A highlight can contain comment text without displaying a separate note icon. A sticky note can have text but no open popup. A shape or ink mark can also carry a comment. Looking only for yellow bubbles misses much of the annotation model.",
                    "Readers may generate the visible appearance themselves or rely on an appearance stream embedded in the PDF. When that stream is absent or unusual, one reader may draw the annotation while another shows only its entry in a comments panel. This is why the safest review combines the page view with an annotation list."
                ],
                "table": {
                    "headers": ["ANNOTATION", "PAGE APPEARANCE", "WHERE TEXT MAY LIVE"],
                    "rows": [
                        ["Text note", "Small icon", "Note contents or popup"],
                        ["Highlight", "Colored text area", "Highlight contents or linked popup"],
                        ["Shape / ink", "Line, box, or drawing", "Annotation contents"],
                        ["Popup", "Open or hidden panel", "Parent annotation relationship"]
                    ]
                }
            },
            {
                "title": "THE POPUP AND PARENT RELATIONSHIP",
                "paragraphs": [
                    "A popup can be a separate annotation linked to a parent highlight or note. Some producers store the meaningful text on the parent; others emphasize the popup relationship. If software reads only visible popup objects, it may miss text attached to highlights. If it reads only parent objects, it may duplicate or mislabel popup entries.",
                    "A robust viewer groups related objects and displays their page number, subtype, text, and position. Browser Tools lists common annotations by page and lets a user select visible marks or comment pins. It is still possible to encounter proprietary annotation types or damaged relationships that need the originating desktop application."
                ],
                "callout": "A missing icon does not prove that the comment text was deleted. Check the comments list before editing or resaving the PDF."
            },
            {
                "title": "WHY PRINTING OR FLATTENING CHANGES COMMENTS",
                "paragraphs": [
                    "Printing a PDF to a new PDF usually preserves what was painted on the page, not the complete interactive annotation structure. A visible highlight may become ordinary page graphics, while its author, timestamp, reply thread, status, and hidden text disappear. Flattening intentionally makes annotations part of the page and produces a similar tradeoff.",
                    "Use flattening only when the goal is a fixed visual record and the loss of editable metadata is acceptable. For collaboration, keep an unflattened master. For sharing, consider producing both an editable review copy and a flattened reference copy, with filenames that make the difference obvious."
                ],
                "checklist": [
                    "Keep the unedited source.",
                    "Check both page marks and the comments list.",
                    "Preserve author and reply information when it matters.",
                    "Open the saved result in a second reader.",
                    "Do not assume Print to PDF is an annotation-preserving export."
                ]
            },
            {
                "title": "A PRACTICAL COMPATIBILITY TEST",
                "paragraphs": [
                    "Choose one non-confidential test page and add a highlight plus a short comment. Save a new copy, close the editor, reopen the download, and confirm that the mark and text remain connected. Then open the same copy in the reader used by the recipient. This tests the actual handoff path rather than relying on a feature checklist.",
                    "If the result differs, record the annotation type and whether the text is missing, the mark is missing, or only the icon differs. Those are separate compatibility failures. Avoid sending confidential samples to support; a blank test document that reproduces the behavior is safer and often easier to diagnose."
                ]
            },
            {
                "title": "SIGNATURES AND REVIEW RECORDS NEED EXTRA CARE",
                "paragraphs": [
                    "Adding, removing, or changing annotations modifies a PDF. That change can invalidate a digital signature or alter a review record even when the page looks the same. A browser annotation editor is useful for ordinary review copies, but it should not replace an organization's controlled signature, records, or legal-review process.",
                    "Before editing a signed or regulated document, determine whether annotations are permitted and keep the original. Downloaded output should be treated as a new derivative file. Browser Tools does not certify signatures, verify identity, or guarantee that every proprietary comment feature is retained."
                ]
            }
        ]
    },
    "resize-image-for-online-forms": {
        "category": "IMAGE WORKFLOW",
        "title": "How to Resize an Image for an Online Form Without Guessing",
        "description": "A decision guide for pixel dimensions, file-size limits, aspect ratio, format, transparency, and readable document photos.",
        "heading": "PIXELS AND KILOBYTES ARE DIFFERENT.",
        "intro": "Online forms often combine a dimension rule with a file-size rule. Meeting one does not guarantee the other. This workflow explains the controls in the order that prevents unnecessary quality loss.",
        "published": "2026-09-03",
        "updated": "2026-09-03",
        "reading_time": "8 MIN READ",
        "tool_endpoint": "image_toolkit",
        "tool_label": "OPEN IMAGE TOOLKIT",
        "sections": [
            {
                "title": "TRANSLATE THE FORM REQUIREMENTS FIRST",
                "paragraphs": [
                    "Write down the accepted format, maximum file size, required width and height, and whether the image must have a particular aspect ratio. A rule such as 600 × 600 pixels describes geometry. A rule such as under 200 KB describes encoded storage. DPI is usually not the deciding factor for a browser upload unless the form explicitly says otherwise.",
                    "When a form gives only maximum dimensions, preserve the aspect ratio and reduce the longer edge. When it demands exact dimensions, cropping is usually preferable to stretching. Browser Tools' resize control preserves aspect ratio when the lock is enabled; disabling it can distort faces, signatures, logos, and document text."
                ],
                "table": {
                    "headers": ["REQUIREMENT", "CONTROL", "COMMON MISTAKE"],
                    "rows": [
                        ["Exact pixels", "Width and height", "Changing quality only"],
                        ["Maximum KB/MB", "Format, dimensions, quality", "Changing dimensions once and stopping"],
                        ["Square portrait", "Crop before resize", "Stretching a rectangular photo"],
                        ["Transparent logo", "PNG or WebP", "Saving as JPEG and getting a white background"]
                    ]
                }
            },
            {
                "title": "CHOOSE FORMAT BASED ON THE IMAGE",
                "paragraphs": [
                    "JPEG is normally efficient for photographs and scanned color documents. PNG is better for flat graphics, screenshots, signatures, and transparency, but photographic PNG files can be large. WebP can reduce size while retaining good visual quality, although some older government, education, or recruitment portals accept only JPEG or PNG.",
                    "Do not rename an extension to imitate another format. A file called photo.jpg can still contain PNG data, and strict portals inspect the real format. Convert the image and then confirm the downloaded extension. If the portal names a format, follow that requirement even when another format produces a smaller result."
                ]
            },
            {
                "title": "REDUCE SIZE IN A CONTROLLED ORDER",
                "paragraphs": [
                    "Start by setting the required pixel dimensions. Export once at a moderate-to-high quality and inspect the resulting file size. If the file is still too large, lower JPEG or WebP quality in small steps. Reducing dimensions again should be a later choice because it removes readable detail everywhere in the image.",
                    "PNG quality sliders do not behave like JPEG compression because PNG is lossless. If a photograph saved as PNG is far above the limit and transparency is not required, JPEG is often the practical option. Always inspect small text, facial features, signature strokes, and document numbers at 100 percent after compression."
                ],
                "checklist": [
                    "Work from the highest-quality authorized original.",
                    "Set pixel dimensions before tuning compression.",
                    "Keep aspect ratio unless exact cropping has already been done.",
                    "Download and check the actual file size.",
                    "Open the result and inspect important details before upload."
                ]
            },
            {
                "title": "ORIENTATION AND METADATA CAN SURPRISE YOU",
                "paragraphs": [
                    "Phone photos may store camera orientation as metadata rather than permanently rotating the pixels. Browsers usually display that orientation correctly, but different upload systems can interpret it differently. If a portal shows the image sideways, create a visibly rotated copy and verify that copy before submission.",
                    "Image conversion may remove metadata such as camera model, capture time, location, or color profile. Removing metadata can be beneficial for privacy, but it may also matter in a formal evidence workflow. Browser Tools is intended for ordinary form preparation, not forensic preservation. Keep the source file when provenance matters."
                ]
            },
            {
                "title": "VERIFY THE FINAL FILE, NOT JUST THE PREVIEW",
                "paragraphs": [
                    "The browser preview shows how the image looks inside the current page. The receiving portal may create another thumbnail, crop the image, or reject it based on dimensions, format, filename, or byte size. Read the portal's validation message carefully and change only the requirement that failed.",
                    "Before submitting, confirm extension, dimensions, file size, orientation, and readability. Use a simple filename made from letters, numbers, hyphens, or underscores if the portal has older upload software. Keep both the original and the accepted derivative until the application process is complete."
                ]
            }
        ]
    },
    "verify-sha256-checksum": {
        "category": "FILE INTEGRITY",
        "title": "How to Verify a SHA-256 Checksum—and What a Match Does Not Prove",
        "description": "A careful workflow for comparing file hashes, diagnosing mismatches, and separating integrity checks from malware or publisher verification.",
        "heading": "A MATCH CHECKS BYTES, NOT TRUST.",
        "intro": "SHA-256 turns a file into a fixed-length fingerprint. It is excellent for detecting a different byte sequence, but the conclusion is only as trustworthy as the reference checksum and download source.",
        "published": "2026-09-03",
        "updated": "2026-09-03",
        "reading_time": "7 MIN READ",
        "tool_endpoint": "file_hash",
        "tool_label": "OPEN FILE HASH",
        "sections": [
            {
                "title": "WHAT THE COMPARISON ACTUALLY ESTABLISHES",
                "paragraphs": [
                    "When two SHA-256 values match, the practical conclusion is that the checked file has the same bytes as the file represented by the reference value. A one-byte modification normally produces a completely different result. This is useful for detecting incomplete downloads, accidental changes, and confusion between release versions.",
                    "A match does not inspect program behavior, detect malware, prove who published the file, or show that the publisher's system was secure. If an attacker can replace both a download and the checksum shown beside it, the values can still match. Obtain reference hashes from an authenticated official source, ideally through a different trusted channel when the risk is high."
                ],
                "table": {
                    "headers": ["RESULT", "SUPPORTED CONCLUSION", "NOT PROVEN"],
                    "rows": [
                        ["Exact match", "Bytes match the reference", "File is safe or legitimate"],
                        ["Mismatch", "Bytes or algorithm differ", "File is definitely malicious"],
                        ["No reference", "A fingerprint was calculated", "Integrity against an expected release"]
                    ]
                }
            },
            {
                "title": "USE THE SAME ALGORITHM",
                "paragraphs": [
                    "SHA-256, SHA-384, and SHA-512 produce different lengths and different values for the same file. Select the algorithm named by the publisher. A SHA-256 value contains 64 hexadecimal characters; copying only part of it removes the protection of an exact comparison.",
                    "Uppercase and lowercase hexadecimal letters represent the same value, but spaces, line breaks, labels, and filenames are not part of the hash. Compare the complete hexadecimal sequence after removing only presentation formatting. Do not convert the file or open and resave it before hashing, because that changes its bytes."
                ]
            },
            {
                "title": "A REPEATABLE VERIFICATION WORKFLOW",
                "paragraphs": [
                    "Download the file from the expected source and locate the checksum published for that exact version, operating system, architecture, and filename. Calculate the file hash locally. Copy the calculated result and compare all characters with the reference. If possible, use a comparison tool rather than visual scanning.",
                    "Browser Tools uses the browser's cryptographic interface to read the selected file locally. The resulting hash appears in the page and can be copied. The site does not need the contents of the file to perform this calculation on the server. Very large files can still take time because the browser must read every byte."
                ],
                "checklist": [
                    "Match version, platform, architecture, and filename.",
                    "Select the publisher's stated algorithm.",
                    "Compare the complete value.",
                    "Investigate any mismatch instead of trying to make it match.",
                    "Keep the reference source URL with important verification records."
                ]
            },
            {
                "title": "COMMON REASONS FOR A MISMATCH",
                "paragraphs": [
                    "The most common causes are a different release, a partial download, a browser or mirror that supplied a different package, and selection of the wrong algorithm. Files that look identical can also differ because of metadata, archive timestamps, line endings, or re-compression.",
                    "Delete and download again only after confirming that you no longer need the mismatching copy for investigation. If repeated downloads from the same official source produce the same unexpected hash, pause installation and check the publisher's release notes or support channel. Do not disable security warnings merely because the filename looks correct."
                ]
            },
            {
                "title": "WHEN A DIGITAL SIGNATURE IS MORE APPROPRIATE",
                "paragraphs": [
                    "A checksum answers whether bytes match a reference. A properly verified digital signature can additionally connect the file to a signing identity and detect modification after signing. Software distributors may provide both because they answer related but different questions.",
                    "For routine integrity checks, a checksum from an official HTTPS page is often useful. For operating-system images, security tools, firmware, or high-risk software, follow the publisher's signature-verification instructions as well. Browser Tools calculates hashes; it does not validate code-signing certificates or package signatures."
                ]
            }
        ]
    },
    "local-browser-file-processing": {
        "category": "PRIVACY EXPLAINED",
        "title": "What ‘Processed in Your Browser’ Means for Private Files",
        "description": "A precise explanation of local browser processing, network requests, memory, downloads, third-party resources, and how users can verify the difference.",
        "heading": "LOCAL PROCESSING IS NOT THE SAME AS OFFLINE.",
        "intro": "A web page can download application code and then process a selected file entirely on the device. That protects the file from an upload workflow, but it does not mean the browser makes no network requests at all.",
        "published": "2026-09-03",
        "updated": "2026-09-03",
        "reading_time": "9 MIN READ",
        "tool_endpoint": "index",
        "tool_label": "OPEN PDF MERGE",
        "sections": [
            {
                "title": "THE PAGE AND THE FILE FOLLOW DIFFERENT PATHS",
                "paragraphs": [
                    "Opening Browser Tools requests HTML, CSS, JavaScript, fonts, and related assets from web servers. Selecting a PDF or image gives the page permission to read that file through the browser's file interface. The tool code can then parse, transform, and package the data in memory without posting the selected bytes to an application upload endpoint.",
                    "The finished PDF, image, or ZIP is created as browser data and offered as a download. This is different from a conventional converter that sends the source file to a remote server, waits for processing, and returns a result. It also has a tradeoff: processing speed and maximum practical file size depend on the device's memory and processor."
                ],
                "table": {
                    "headers": ["ACTIVITY", "WHERE IT HAPPENS", "NETWORK NEEDED"],
                    "rows": [
                        ["Load the web app", "Server and browser", "Yes, unless already cached"],
                        ["Read a selected file", "Browser memory", "No upload required"],
                        ["Transform or hash", "Device processor", "No upload required"],
                        ["Save result", "Browser download", "No upload required"]
                    ]
                }
            },
            {
                "title": "LOCAL DOES NOT MEAN ZERO NETWORK REQUESTS",
                "paragraphs": [
                    "A locally processing tool may still request fonts, analytics, advertising, security resources, or updated application files. Those requests can expose ordinary connection data such as an IP address, browser information, requested page, and time. The important claim is narrower: the contents of the selected working file are not sent through a converter upload endpoint.",
                    "Privacy statements should distinguish these facts rather than saying the entire website is offline or anonymous. Browser Tools documents third-party resources and hosting logs in its Privacy Policy. Users handling highly sensitive records should follow organizational policy and may prefer a vetted offline desktop workflow even when a browser tool does not upload files."
                ],
                "callout": "A no-upload workflow reduces one important exposure path. It does not remove browser, device, extension, network, or operating-system risk."
            },
            {
                "title": "HOW TO VERIFY THE CLAIM IN YOUR BROWSER",
                "paragraphs": [
                    "Modern browsers include developer tools with a Network panel. Open the panel before selecting a non-confidential test file, clear the existing request list, and perform the operation. Look for POST, PUT, or other requests whose payload size changes with the file. Also inspect the destination domains rather than assuming every request belongs to the application.",
                    "This is a technical check, not a permanent guarantee. Code can change, browser extensions can observe pages, and service workers can affect requests. Repeat the check after major updates if the processing model matters to you. Avoid using a confidential file merely to test privacy; a generated sample is sufficient."
                ],
                "checklist": [
                    "Use a disposable test file.",
                    "Open the Network panel before file selection.",
                    "Clear earlier requests.",
                    "Run the complete operation.",
                    "Inspect destinations, methods, and transferred sizes."
                ]
            },
            {
                "title": "MEMORY, CRASHES, AND TEMPORARY DATA",
                "paragraphs": [
                    "Local processing often holds the source and result in memory at the same time. PDF previews may also allocate rendered page images. A large document can therefore consume much more memory than its compressed file size suggests. Mobile browsers may close the tab when memory is scarce without providing a detailed error.",
                    "Process smaller batches, close unrelated tabs, and keep originals before attempting large work. Closing or refreshing the page normally clears in-memory work, while downloaded files remain on the device. A focus timer or other preference may use local browser storage, which is different from uploading document contents."
                ]
            },
            {
                "title": "USE THE RIGHT TOOL FOR THE RISK",
                "paragraphs": [
                    "Local browser processing is useful for ordinary personal documents because it avoids an application-server upload and makes the workflow easy to inspect. It is not automatically suitable for classified, regulated, signed, evidentiary, or employer-controlled material. Rules about permitted software and devices still apply.",
                    "For important outputs, reopen the download and compare it with the source. Transformations can change forms, links, comments, metadata, layers, color, or signatures even when no upload occurs. Privacy and output fidelity are separate questions, and both deserve verification."
                ]
            }
        ]
    }
}
