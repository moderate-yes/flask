(() => {
  const STORAGE_KEY = "browsertools-language";
  const translations = new Map(Object.entries({
    "MENU": "메뉴",
    "SELECT A TOOL": "도구 선택",
    "Close tools": "도구 메뉴 닫기",
    "PDF MERGE": "PDF 합치기",
    "Combine files locally.": "기기에서 파일을 합칩니다.",
    "PDF SPLIT": "PDF 분할",
    "Cut pages privately.": "안전하게 페이지를 나눕니다.",
    "PDF ORGANIZER": "PDF 페이지 정리",
    "Reorder, rotate, extract.": "순서 변경, 회전, 추출.",
    "PDF ANNOTATIONS": "PDF 주석",
    "Highlight, comment, review.": "하이라이트와 댓글을 확인합니다.",
    "PDF TO IMAGES": "PDF를 이미지로",
    "Export pages as pictures.": "페이지를 이미지로 저장합니다.",
    "IMAGES TO PDF": "이미지를 PDF로",
    "Build one PDF from images.": "이미지를 하나의 PDF로 만듭니다.",
    "IMAGE TOOLKIT": "이미지 도구",
    "Resize, compress, convert.": "크기, 용량, 형식을 변경합니다.",
    "IMAGE TRANSFORM": "이미지 변형",
    "Mirror, flip, and rotate.": "좌우·상하 반전 및 회전.",
    "FILE HASH": "파일 해시",
    "Check a file fingerprint.": "파일 지문을 확인합니다.",
    "QR GENERATOR": "QR 코드 생성",
    "Turn text into a QR code.": "텍스트를 QR 코드로 만듭니다.",
    "FOCUS TIMER": "집중 타이머",
    "Stay on one task.": "한 가지 일에 집중합니다.",
    "CALCULATOR": "계산기",
    "Percent, discount, tax, tip.": "퍼센트, 할인, 세금, 팁 계산.",
    "PATH STUDIO": "패스 스튜디오",
    "Desktop path and layer editor.": "데스크톱용 패스·레이어 편집기.",
    "DISCOVER": "둘러보기",
    "ABOUT": "소개",
    "GUIDES": "사용 안내",
    "HOW TO USE": "사용 방법",
    "FAQ": "자주 묻는 질문",
    "PRIVACY": "개인정보 처리방침",
    "TERMS": "이용약관",
    "CONTACT": "문의",
    "INDEPENDENT TOOLS · ONE TAP AWAY": "독립적인 도구 · 한 번의 클릭으로 실행",
    "VISITOR COUNTER": "방문자 수",
    "APPROX.": "대략",
    "TOTAL VISITS": "전체 방문",
    "TODAY": "오늘",
    "BROWSER TOOLS · BROWSER-FIRST UTILITIES": "브라우저 도구 · 브라우저에서 바로 사용하는 기능",

    "MERGE": "합치기",
    "SPLIT": "분할",
    "KEEP YOUR DATA PRIVATE.": "내 파일을 안전하게.",
    "ADD PDF FILES": "PDF 파일 추가",
    "ADD ONE PDF": "PDF 한 개 추가",
    "Choose files or drop them here": "파일을 선택하거나 여기에 놓으세요",
    "Choose a file or drop it here": "파일을 선택하거나 여기에 놓으세요",
    "FILES": "파일",
    "CLEAR": "전체 삭제",
    "Add at least two PDF files to begin.": "시작하려면 PDF 파일을 두 개 이상 추가하세요.",
    "This site performs PDF processing using your local computer's resources; no data is stored, ensuring there is no risk of data leakage.": "PDF 작업은 사용자의 기기에서 처리되며 파일은 서버에 저장되지 않습니다.",
    "SELECT SPLIT POINTS": "분할 지점 선택",
    "Tap a page to enlarge it. Tap the line between pages to create a cut.": "페이지를 누르면 확대됩니다. 페이지 사이의 선을 누르면 분할 지점이 설정됩니다.",
    "SELECT ALL": "전체 선택",
    "CLEAR CUTS": "분할 지점 지우기",
    "CLEAR SELECTION": "선택 해제",
    "Add one PDF file to begin.": "시작하려면 PDF 파일 한 개를 추가하세요.",
    "SPLIT & DOWNLOAD ZIP": "분할 후 ZIP 다운로드",
    "ENLARGED PREVIEW": "확대 미리보기",
    "CLOSE ×": "닫기 ×",
    "LOADING PAGE...": "페이지 불러오는 중...",
    "← PREVIOUS": "← 이전",
    "NEXT →": "다음 →",
    "Close enlarged preview": "확대 미리보기 닫기",
    "Preview zoom controls": "미리보기 확대·축소",
    "Zoom out": "축소",
    "Zoom in": "확대",
    "PDF page previews": "PDF 페이지 미리보기",
    "Split settings": "PDF 분할 설정",
    "Remove selected PDF": "선택한 PDF 제거",
    "Choose a PDF action": "PDF 작업 선택",

    "ORGANIZE PDF PAGES.": "PDF 페이지 정리.",
    "Reorder, rotate, remove, or select pages to extract into a new file.": "페이지 순서를 바꾸고 회전·삭제하거나 선택한 페이지만 새 파일로 추출하세요.",
    "SAVE PDF": "PDF 저장",
    "EXTRACT SELECTED": "선택 페이지 추출",
    "PDF pages are processed in this browser. The selected file is not sent to our server.": "PDF 페이지는 이 브라우저에서 처리되며 서버로 전송되지 않습니다.",

    "PDF TO IMAGE": "PDF → 이미지",
    "IMAGE TO PDF": "이미지 → PDF",
    "PDF TO IMAGES.": "PDF를 이미지로.",
    "Render every page, or a page range, as PNG or JPEG files.": "전체 페이지 또는 원하는 범위를 PNG나 JPEG로 변환하세요.",
    "PAGES (EXAMPLE: 1-3, 5)": "페이지 (예: 1-3, 5)",
    "All pages": "전체 페이지",
    "FORMAT": "형식",
    "SCALE": "배율",
    "JPEG QUALITY": "JPEG 품질",
    "DOWNLOAD ZIP": "ZIP 다운로드",
    "Conversion runs locally in this browser. The PDF is not uploaded to our server.": "변환은 브라우저에서 처리되며 PDF는 서버로 업로드되지 않습니다.",
    "Choose an image and PDF conversion": "PDF와 이미지 변환 선택",
    "IMAGES TO PDF.": "이미지를 PDF로.",
    "Arrange JPG, PNG, or WebP images and download them as one PDF.": "JPG, PNG, WebP 이미지의 순서를 정해 하나의 PDF로 저장하세요.",
    "ADD IMAGES": "이미지 추가",
    "PAGE SIZE": "페이지 크기",
    "Match each image": "각 이미지 크기에 맞춤",
    "A4 portrait": "A4 세로",
    "US Letter portrait": "US Letter 세로",
    "MARGIN": "여백",
    "None": "없음",
    "Small": "작게",
    "Large": "크게",
    "CREATE PDF": "PDF 만들기",
    "Images are processed in browser memory and are not sent to our server.": "이미지는 브라우저 메모리에서 처리되며 서버로 전송되지 않습니다.",

    "IMAGE TOOLKIT.": "이미지 도구.",
    "Resize, compress, and convert one image without uploading it.": "이미지를 업로드하지 않고 크기·용량·형식을 변경하세요.",
    "ADD AN IMAGE": "이미지 추가",
    "WIDTH": "너비",
    "HEIGHT": "높이",
    "KEEP ASPECT RATIO": "가로세로 비율 유지",
    "QUALITY": "품질",
    "PROCESS & DOWNLOAD": "변환 후 다운로드",
    "The selected image stays in this browser and is not uploaded to our server.": "선택한 이미지는 브라우저에서만 처리되며 서버에 업로드되지 않습니다.",
    "IMAGE\nTRANSFORM.": "이미지\n변형.",
    "Mirror, flip, and rotate one image without uploading it.": "이미지를 업로드하지 않고 좌우·상하 반전하고 회전하세요.",
    "MIRROR": "좌우 반전",
    "UPSIDE DOWN": "상하 반전",
    "LEFT 90°": "왼쪽 90°",
    "RIGHT 90°": "오른쪽 90°",
    "FINE ROTATION": "미세 회전",
    "RESET": "초기화",
    "DOWNLOAD TRANSFORMED IMAGE": "변형된 이미지 다운로드",
    "CHOOSE ANOTHER IMAGE": "다른 이미지 선택",
    "Your image stays on this device. Processing happens entirely in the browser.": "이미지는 이 기기에 머물며 모든 작업은 브라우저에서 처리됩니다.",

    "CHECK A FILE HASH.": "파일 해시 확인.",
    "Create a cryptographic fingerprint to compare a file with a checksum published by its source.": "파일의 암호화 지문을 만들어 제공처가 공개한 체크섬과 비교하세요.",
    "CHOOSE ANY FILE": "파일 선택",
    "The file remains on this device": "파일은 이 기기에만 유지됩니다",
    "ALGORITHM": "알고리즘",
    "COPY HASH": "해시 복사",
    "Calculated file hash": "계산된 파일 해시",
    "Hashing uses your browser's cryptographic API. The file is never submitted to our server.": "해시는 브라우저에서 계산되며 파일은 서버로 전송되지 않습니다.",

    "MAKE A QR CODE.": "QR 코드 만들기.",
    "Turn text or a URL into a downloadable code. Always test the result before publishing it.": "텍스트나 URL을 QR 코드로 만들 수 있습니다. 사용 전 결과를 확인하세요.",
    "TEXT OR URL": "텍스트 또는 URL",
    "ERROR CORRECTION": "오류 복원 수준",
    "IMAGE SIZE": "이미지 크기",
    "Low": "낮음",
    "Medium": "보통",
    "Quartile": "높음",
    "High": "최고",
    "QR code preview": "QR 코드 미리보기",
    "Enter text or a URL to begin.": "시작하려면 텍스트 또는 URL을 입력하세요.",
    "DOWNLOAD PNG": "PNG 다운로드",
    "QR content is encoded locally in this browser and is not sent to our server.": "QR 내용은 브라우저에서 인코딩되며 서버로 전송되지 않습니다.",

    "PDF\nANNOTATIONS.": "PDF\n주석.",
    "Click, edit, and add highlights or comments without uploading your PDF.": "PDF를 업로드하지 않고 하이라이트와 댓글을 확인·수정·추가하세요.",
    "SELECT": "선택",
    "HIGHLIGHT": "하이라이트",
    "COMMENT": "댓글",
    "PAGE": "페이지",
    "Previous page": "이전 페이지",
    "Next page": "다음 페이지",
    "Click an annotation to inspect it.": "확인할 주석을 클릭하세요.",
    "Drag across a line or area to create a highlight.": "선이나 영역을 끌어서 하이라이트를 만드세요.",
    "Click the page to place a new comment pin.": "페이지를 클릭해 새 댓글 핀을 놓으세요.",
    "NO SELECTION": "선택 없음",
    "Select a highlight or comment on the page to edit it.": "수정할 하이라이트나 댓글을 페이지에서 선택하세요.",
    "ANNOTATION": "주석",
    "AUTHOR": "작성자",
    "Optional": "선택 사항",
    "Write a comment…": "댓글을 입력하세요…",
    "COLOR": "색상",
    "DELETE ANNOTATION": "주석 삭제",
    "PAGE ANNOTATIONS": "현재 페이지 주석",
    "COMMENTS IN FILE": "파일의 댓글",
    "No comments found.": "댓글이 없습니다.",
    "CHOOSE ANOTHER PDF": "다른 PDF 선택",
    "DOWNLOAD ANNOTATED PDF": "주석이 포함된 PDF 다운로드",
    "The PDF stays in this browser. Comments attached to highlights, text notes, shapes, stamps, ink, and other common annotations are editable.": "PDF는 브라우저에만 유지됩니다. 하이라이트, 메모, 도형, 스탬프 등 일반적인 주석의 댓글을 수정할 수 있습니다.",

    "PERCENT": "퍼센트",
    "DISCOUNT": "할인",
    "TIP / SPLIT": "팁 / 나누기",
    "FIRST NUMBER": "첫 번째 숫자",
    "OPERATION": "연산",
    "SECOND NUMBER": "두 번째 숫자",
    "PERCENT OF": "값의 퍼센트",
    "% CHANGE": "% 변화율",
    "OF NUMBER": "기준 숫자",
    "STARTING VALUE": "시작 값",
    "NEW VALUE": "새 값",
    "ORIGINAL PRICE": "원래 가격",
    "SALES TAX AFTER DISCOUNT": "할인 후 세금",
    "BILL AMOUNT": "청구 금액",
    "TIP": "팁",
    "NUMBER OF PEOPLE": "인원수",
    "RESULT": "결과",
    "COPY": "복사",
    "COPIED": "복사됨",
    "RESET CURRENT CALCULATOR": "현재 계산기 초기화",
    "CALCULATIONS RUN IN YOUR BROWSER · INPUTS ARE NOT SUBMITTED · FREE TO USE": "계산은 브라우저에서 실행 · 입력값은 전송되지 않음 · 무료 사용",
    "CHECK INPUT": "입력값 확인",
    "PERCENTAGE RESULT": "퍼센트 결과",
    "PERCENTAGE CHANGE": "퍼센트 변화",
    "FINAL PRICE": "최종 가격",
    "PER PERSON": "1인당 금액",
    "Enter two valid numbers.": "올바른 숫자 두 개를 입력하세요.",
    "A number cannot be divided by zero.": "0으로 나눌 수 없습니다.",
    "Enter a valid percentage and number.": "올바른 퍼센트와 숫자를 입력하세요.",
    "Enter a valid starting and new value.": "올바른 시작 값과 새 값을 입력하세요.",
    "Percentage change needs a non-zero starting value.": "퍼센트 변화를 계산하려면 시작 값이 0이 아니어야 합니다.",
    "Enter valid price, discount, and tax values.": "올바른 가격, 할인율, 세율을 입력하세요.",
    "Price, discount, and tax cannot be negative.": "가격, 할인율, 세율은 음수일 수 없습니다.",
    "Discount must be between 0% and 100%.": "할인율은 0%에서 100% 사이여야 합니다.",
    "Enter valid bill, tip, and people values.": "올바른 금액, 팁, 인원수를 입력하세요.",
    "Use non-negative amounts and a whole number of at least one person.": "금액은 0 이상, 인원수는 1명 이상의 정수로 입력하세요.",
    "FORMULA / PERCENT ÷ 100 × NUMBER": "공식 / 퍼센트 ÷ 100 × 숫자",
    "FORMULA / (NEW − START) ÷ |START| × 100": "공식 / (새 값 − 시작 값) ÷ |시작 값| × 100",

    "Sound on": "소리 켜짐",
    "Sound off": "소리 꺼짐",
    "CUSTOM TIME": "시간 설정",
    "Focus duration": "집중 시간",
    "MIN": "분",
    "APPLY": "적용",
    "START FOCUS": "집중 시작",
    "START AGAIN": "다시 시작",
    "PAUSE": "일시정지",
    "Space": "스페이스",
    "Start / Pause": "시작 / 일시정지",
    "Reset": "초기화",
    "Session complete. Take a moment to reset.": "집중 시간이 끝났습니다. 잠시 쉬어가세요.",

    "DESKTOP REQUIRED": "데스크톱 필요",
    "SWITCH TO A PC.": "PC에서 열어주세요.",
    "Path Studio is disabled on screens narrower than 1080 pixels. Open this page on a desktop or laptop to use the canvas, paths, images, and layers.": "패스 스튜디오는 1080px보다 좁은 화면에서 사용할 수 없습니다. 데스크톱이나 노트북에서 열어주세요.",
    "BACK TO PDF MERGE": "PDF 합치기로 돌아가기",
    "LOCAL VECTOR WORKSPACE": "로컬 벡터 작업 공간",
    "NEW": "새로 만들기",
    "OPEN PROJECT": "프로젝트 열기",
    "SAVE PROJECT": "프로젝트 저장",
    "EXPORT PNG": "PNG 내보내기",
    "PEN": "펜",
    "FINISH": "완료",
    "IMAGE": "이미지",
    "TRANSFORM.": "변형.",
    "ANNOTATIONS.": "주석.",
    "CANVAS": "캔버스",
    "Select a tool to begin.": "시작할 도구를 선택하세요.",
    "PROPERTIES": "속성",
    "ENABLE FILL": "채우기 사용",
    "LAYERS": "레이어",
    "＋ PATH": "＋ 패스",
    "＋ IMAGE": "＋ 이미지",

    "HOW TO USE IT": "사용 방법",
    "FREQUENTLY ASKED QUESTIONS": "자주 묻는 질문",
    "RELATED TOOLS": "관련 도구",
    "HOW IT WORKS": "작동 방식",
    "Useful information": "유용한 정보",
    "Related browser tools": "관련 브라우저 도구",
    "Site information": "사이트 정보",
    "Approximate visitor counter": "대략적인 방문자 수",
    "Focus timer": "집중 타이머",
    "Completion sound on": "완료 알림음 켜짐",
    "Completion sound off": "완료 알림음 꺼짐",
    "Quick timer presets": "빠른 타이머 설정",
    "Multi calculator": "다기능 계산기",
    "Project actions": "프로젝트 작업",
    "Canvas workspace": "캔버스 작업 공간"
  }));

  Object.entries({
    "MERGE PDF": "PDF 합치기",
    "SPLIT PDF": "PDF 분할",
    "ORGANIZE PAGES": "페이지 정리",
    "FULL GUIDE": "전체 안내",
    "GUIDE / PRIVATE PDF MERGER": "안내 / 개인정보 보호 PDF 합치기",
    "HOW TO MERGE PDF FILES": "PDF 파일 합치는 방법",
    "Combine two or more PDF documents in the order you choose. Processing happens in browser memory, so the source files are not uploaded to an application server.": "두 개 이상의 PDF를 원하는 순서로 합치세요. 브라우저 메모리에서 처리되므로 원본 파일은 서버에 업로드되지 않습니다.",
    "Add at least two PDF files.": "PDF 파일을 두 개 이상 추가하세요.",
    "Use the arrow controls to arrange the documents.": "화살표 버튼으로 문서 순서를 정하세요.",
    "Remove any file you do not want in the result.": "결과에 포함하지 않을 파일을 제거하세요.",
    "Select MERGE and save the downloaded PDF.": "합치기를 누르고 완성된 PDF를 저장하세요.",
    "LOCAL PDF PROCESSING": "기기에서 PDF 처리",
    "The browser reads the selected documents and builds the new PDF on your device. Available memory, document size, and page count can affect processing time.": "브라우저가 선택한 문서를 읽어 기기에서 새 PDF를 만듭니다. 사용 가능한 메모리, 문서 크기, 페이지 수에 따라 처리 시간이 달라질 수 있습니다.",
    "BEFORE YOU DELETE ORIGINALS": "원본을 삭제하기 전에",
    "Open the downloaded file and confirm its page order, orientation, links, forms, and visual quality. Keep backup copies of important source documents.": "다운로드한 파일을 열어 페이지 순서, 방향, 링크, 양식과 화질을 확인하세요. 중요한 원본 문서는 백업해 두세요.",
    "Are my PDF files uploaded?": "PDF 파일이 업로드되나요?",
    "No. This tool does not submit selected PDFs to an application upload endpoint.": "아니요. 선택한 PDF는 서버의 업로드 경로로 전송되지 않습니다.",
    "Can I change the file order?": "파일 순서를 바꿀 수 있나요?",
    "Yes. Arrange the files in the queue before selecting MERGE.": "네. 합치기를 누르기 전에 목록에서 파일 순서를 정하세요.",
    "Why can a large merge take longer?": "큰 PDF를 합칠 때 왜 오래 걸리나요?",
    "The work uses your device's processor and memory. Large or complex PDFs require more local resources.": "기기의 프로세서와 메모리를 사용하기 때문입니다. 크거나 복잡한 PDF일수록 더 많은 자원이 필요합니다.",

    "GUIDE / PRIVATE PDF SPLITTER": "안내 / 개인정보 보호 PDF 분할",
    "HOW TO SPLIT A PDF": "PDF 분할 방법",
    "See each page before choosing boundaries. A cut marker separates the pages on its left and right into different output documents.": "각 페이지를 확인한 뒤 분할 지점을 선택하세요. 분할 표시의 앞뒤 페이지가 서로 다른 PDF로 저장됩니다.",
    "Add one PDF file.": "PDF 파일 한 개를 추가하세요.",
    "Review the page thumbnails in reading order.": "페이지 미리보기를 순서대로 확인하세요.",
    "Select the cut lines where a new document should begin.": "새 문서가 시작될 위치의 분할선을 선택하세요.",
    "Choose SPLIT & DOWNLOAD ZIP and inspect the results.": "분할 후 ZIP 다운로드를 누르고 결과를 확인하세요.",
    "CHOOSE CUT POINTS CAREFULLY": "분할 지점을 신중하게 선택",
    "Cut controls appear at document boundaries and between pages. Clear or select all cuts when you need to reset the layout quickly.": "분할 버튼은 페이지 사이에 표시됩니다. 전체 선택이나 분할 지점 지우기로 빠르게 다시 설정할 수 있습니다.",
    "PRIVATE BY DESIGN": "개인정보 보호 중심 설계",
    "Previewing, splitting, and packaging happen locally. The source document is not stored by this site.": "미리보기, 분할, ZIP 생성은 기기에서 처리되며 원본 문서는 사이트에 저장되지 않습니다.",
    "Can I split a PDF into every page?": "PDF를 한 페이지씩 모두 나눌 수 있나요?",
    "Yes. Use SELECT ALL to place a cut between every page.": "네. 전체 선택을 누르면 모든 페이지 사이에 분할 지점이 설정됩니다.",
    "What does the ZIP contain?": "ZIP 파일에는 무엇이 들어 있나요?",
    "It contains the PDF sections created by your selected cut points.": "선택한 분할 지점에 따라 생성된 여러 PDF가 들어 있습니다.",
    "Can encrypted PDFs be split?": "암호화된 PDF도 분할할 수 있나요?",
    "Password-protected or restricted documents may not open. Use a permitted, unlocked copy.": "암호로 보호되거나 제한된 문서는 열리지 않을 수 있습니다. 권한이 있고 잠금이 해제된 파일을 사용하세요.",

    "GUIDE / PDF PAGE ORGANIZER": "안내 / PDF 페이지 정리",
    "ORGANIZE PDF PAGES": "PDF 페이지 정리",
    "Edit the page sequence of one PDF before creating a new document. Page cards can be dragged, rotated, removed, or selected for extraction.": "새 PDF를 만들기 전에 페이지 순서를 편집하세요. 페이지 카드를 끌어 이동하고 회전·삭제하거나 추출할 페이지를 선택할 수 있습니다.",
    "Add one PDF and wait for the thumbnails.": "PDF 한 개를 추가하고 미리보기가 나타날 때까지 기다리세요.",
    "Drag page cards into the required order.": "페이지 카드를 원하는 순서로 끌어 놓으세요.",
    "Rotate or remove pages as needed.": "필요한 페이지를 회전하거나 삭제하세요.",
    "Save all visible pages, or select pages and use EXTRACT SELECTED.": "표시된 모든 페이지를 저장하거나 원하는 페이지를 선택해 선택 페이지 추출을 누르세요.",
    "SAVE OR EXTRACT": "저장 또는 추출",
    "SAVE PDF keeps every visible page in the displayed order. EXTRACT SELECTED creates a separate PDF containing only the pages you selected.": "PDF 저장은 표시된 모든 페이지를 현재 순서로 저장합니다. 선택 페이지 추출은 선택한 페이지만 별도 PDF로 만듭니다.",
    "NON-DESTRUCTIVE WORKFLOW": "원본을 바꾸지 않는 작업",
    "The original file is not overwritten. The organizer creates a new download so you can compare it with the source.": "원본 파일은 덮어쓰지 않습니다. 새 파일이 다운로드되므로 원본과 비교할 수 있습니다.",
    "Can I undo a removed page?": "삭제한 페이지를 되돌릴 수 있나요?",
    "There is no full undo history. Reload the source PDF if you remove a page by mistake.": "전체 실행 취소 기록은 없습니다. 실수로 삭제했다면 원본 PDF를 다시 불러오세요.",
    "Does rotation change the original?": "회전하면 원본도 바뀌나요?",
    "No. Rotation is applied only to the new downloaded PDF.": "아니요. 회전은 새로 다운로드되는 PDF에만 적용됩니다.",
    "Can I combine several PDFs here?": "여기서 여러 PDF를 합칠 수 있나요?",
    "Use PDF Merge for multiple documents; this organizer works with one PDF at a time.": "여러 문서는 PDF 합치기를 사용하세요. 페이지 정리는 한 번에 PDF 한 개만 처리합니다.",

    "GUIDE / PRIVATE PDF ANNOTATION EDITOR": "안내 / 개인정보 보호 PDF 주석 편집기",
    "EDIT PDF HIGHLIGHTS AND COMMENTS": "PDF 하이라이트와 댓글 편집",
    "Review existing highlight and note annotations in one place. Add rectangular highlights or comment pins, edit their text and color, and save a new annotated PDF in your browser.": "기존 하이라이트와 메모를 한곳에서 확인하세요. 하이라이트나 댓글 핀을 추가하고 내용과 색상을 수정한 뒤 새 PDF로 저장할 수 있습니다.",
    "Click an existing highlight or comment to inspect and edit it.": "기존 하이라이트나 댓글을 눌러 확인하고 수정하세요.",
    "Choose HIGHLIGHT and drag, or choose COMMENT and click the page.": "하이라이트를 선택해 영역을 끌거나 댓글을 선택해 페이지를 클릭하세요.",
    "Download a new PDF containing the updated annotations.": "수정된 주석이 포함된 새 PDF를 다운로드하세요.",
    "CLICKABLE PDF ANNOTATIONS": "클릭할 수 있는 PDF 주석",
    "Highlights and comment pins are saved as standard PDF annotations so compatible PDF readers can display and open them.": "하이라이트와 댓글 핀은 표준 PDF 주석으로 저장되어 호환 PDF 뷰어에서 표시하고 열 수 있습니다.",
    "LOCAL AND NON-DESTRUCTIVE": "기기 처리 및 원본 보존",
    "The source PDF remains on your device and is not overwritten. The editor creates a separate downloadable copy.": "원본 PDF는 기기에 머물고 덮어쓰지 않습니다. 편집기는 별도의 다운로드 파일을 만듭니다.",
    "Are existing comments supported?": "기존 댓글도 지원하나요?",
    "Yes. The editor finds comments attached to highlights, text notes, shapes, stamps, ink, and other common PDF annotations, then lists them by page for quick review.": "네. 하이라이트, 텍스트 메모, 도형, 스탬프, 잉크 등 일반적인 PDF 주석의 댓글을 찾아 페이지별로 보여줍니다.",
    "Can I highlight exact text?": "정확한 텍스트만 하이라이트할 수 있나요?",
    "Drag a rectangle across the line or area you want to mark. The first version creates rectangular highlights rather than selecting individual text glyphs.": "표시하려는 줄이나 영역을 사각형으로 끌어 선택하세요. 현재 버전은 글자 단위 선택 대신 사각형 하이라이트를 만듭니다.",
    "Is the PDF uploaded?": "PDF가 업로드되나요?",
    "No. Reading, editing, and saving happen locally in your browser.": "아니요. 읽기, 편집, 저장은 브라우저에서 처리됩니다."
  }).forEach(([english, korean]) => translations.set(english, korean));

  Object.entries({
    "GUIDE / PDF TO IMAGE CONVERTER": "안내 / PDF 이미지 변환",
    "CONVERT PDF TO IMAGES": "PDF를 이미지로 변환",
    "Render an entire PDF or selected pages as PNG or JPEG files. Page-range controls help avoid processing pages you do not need.": "PDF 전체 또는 선택한 페이지를 PNG나 JPEG로 변환하세요. 페이지 범위를 지정하면 필요 없는 페이지 처리를 줄일 수 있습니다.",
    "Add one PDF.": "PDF 한 개를 추가하세요.",
    "Enter a range such as 1-3, 5 or leave it blank for all pages.": "1-3, 5와 같이 범위를 입력하거나 전체 페이지라면 비워 두세요.",
    "Choose PNG or JPEG and a rendering scale.": "PNG 또는 JPEG 형식과 변환 배율을 선택하세요.",
    "Download the generated images as a ZIP.": "생성된 이미지를 ZIP으로 다운로드하세요.",
    "PNG OR JPEG": "PNG 또는 JPEG",
    "PNG is useful for text, diagrams, and crisp edges. JPEG can produce smaller photographic files and offers an adjustable quality setting.": "PNG는 텍스트, 도표, 선명한 가장자리에 적합합니다. JPEG는 사진 파일을 더 작게 만들 수 있고 품질을 조절할 수 있습니다.",
    "SCALE AND MEMORY": "배율과 메모리",
    "A larger rendering scale creates more pixels and can improve detail, but it also increases file size, memory use, and processing time.": "배율을 높이면 세부 표현이 좋아지지만 파일 크기, 메모리 사용량, 처리 시간도 늘어납니다.",
    "Can I convert only one page?": "한 페이지만 변환할 수 있나요?",
    "Yes. Enter that page number in the page-range field.": "네. 페이지 범위 칸에 원하는 페이지 번호를 입력하세요.",
    "Why are the results in a ZIP?": "결과가 왜 ZIP으로 저장되나요?",
    "A ZIP keeps multiple page images together in one download.": "여러 페이지 이미지를 한 번에 다운로드할 수 있도록 ZIP으로 묶습니다.",
    "Does this extract original embedded images?": "PDF에 삽입된 원본 이미지를 추출하나요?",
    "No. It renders each complete PDF page as an image.": "아니요. 각 PDF 페이지 전체를 이미지로 변환합니다.",

    "GUIDE / IMAGES TO PDF CONVERTER": "안내 / 이미지를 PDF로 변환",
    "CONVERT IMAGES TO PDF": "이미지를 PDF로 변환",
    "Turn a sequence of JPG, PNG, or WebP images into one downloadable PDF. Reorder the images and select how each image fits on its page.": "JPG, PNG, WebP 이미지를 순서대로 하나의 PDF로 만드세요. 이미지 순서와 페이지 맞춤 방식을 선택할 수 있습니다.",
    "Add one or more supported images.": "지원되는 이미지를 한 개 이상 추가하세요.",
    "Arrange or remove image cards.": "이미지 카드의 순서를 바꾸거나 제거하세요.",
    "Choose matched image pages, A4, or US Letter and set a margin.": "이미지 맞춤, A4 또는 US Letter를 선택하고 여백을 설정하세요.",
    "Select CREATE PDF and review the download.": "PDF 만들기를 누르고 다운로드 결과를 확인하세요.",
    "PAGE SIZE OPTIONS": "페이지 크기 옵션",
    "Match each image preserves its natural proportions. A4 and US Letter place images inside a consistent portrait page.": "각 이미지 크기에 맞춤은 원래 비율을 유지합니다. A4와 US Letter는 일정한 세로 페이지 안에 이미지를 배치합니다.",
    "IMAGE QUALITY": "이미지 품질",
    "The tool places the selected image data into the new document. Very large images can create a large PDF and require more browser memory.": "선택한 이미지 데이터가 새 문서에 들어갑니다. 매우 큰 이미지는 PDF 용량과 브라우저 메모리 사용량을 늘릴 수 있습니다.",
    "Which image formats are supported?": "어떤 이미지 형식을 지원하나요?",
    "The file picker accepts JPEG, PNG, and WebP images.": "JPEG, PNG, WebP 이미지를 선택할 수 있습니다.",
    "Can every page use the image's own size?": "각 페이지를 이미지 원래 크기로 만들 수 있나요?",
    "Yes. Choose Match each image.": "네. 각 이미지 크기에 맞춤을 선택하세요.",
    "Are my images uploaded?": "이미지가 업로드되나요?",
    "No. They are read and converted in your browser.": "아니요. 브라우저에서 읽고 변환합니다.",

    "GUIDE / IMAGE RESIZER AND CONVERTER": "안내 / 이미지 크기·형식 변환",
    "RESIZE AND CONVERT IMAGES": "이미지 크기와 형식 변환",
    "Prepare one image for sharing, websites, documents, or storage. Set exact pixel dimensions and download it as JPEG, PNG, or WebP.": "공유, 웹사이트, 문서 또는 보관에 맞게 이미지를 준비하세요. 정확한 픽셀 크기를 지정하고 JPEG, PNG, WebP로 다운로드할 수 있습니다.",
    "Add a JPG, PNG, or WebP image.": "JPG, PNG 또는 WebP 이미지를 추가하세요.",
    "Enter the required width or height.": "원하는 너비 또는 높이를 입력하세요.",
    "Keep the aspect ratio on unless you intentionally want stretching.": "의도적으로 늘리지 않는다면 가로세로 비율 유지를 켜 두세요.",
    "Choose a format and quality, then process the download.": "형식과 품질을 선택한 뒤 변환하여 다운로드하세요.",
    "FORMAT DIFFERENCES": "형식별 차이",
    "JPEG is widely compatible and efficient for photos. PNG preserves transparency and sharp graphics. WebP often balances quality and smaller file size in modern browsers.": "JPEG는 호환성이 높고 사진에 효율적입니다. PNG는 투명도와 선명한 그래픽을 유지합니다. WebP는 최신 브라우저에서 품질과 작은 용량의 균형이 좋습니다.",
    "TRANSPARENCY": "투명 영역",
    "PNG and WebP can preserve transparent areas. JPEG has no alpha channel, so transparent pixels are placed on white.": "PNG와 WebP는 투명 영역을 유지할 수 있습니다. JPEG에는 알파 채널이 없어 투명한 픽셀이 흰색으로 바뀝니다.",
    "Does quality affect PNG?": "품질 설정이 PNG에도 적용되나요?",
    "No. The quality slider applies to lossy formats such as JPEG and WebP; PNG output is lossless.": "아니요. 품질 슬라이더는 JPEG와 WebP 같은 손실 형식에 적용되며 PNG는 무손실로 출력됩니다.",
    "What does aspect ratio mean?": "가로세로 비율은 무엇인가요?",
    "It is the relationship between width and height. Locking it prevents accidental distortion.": "너비와 높이의 비율입니다. 비율을 잠그면 이미지가 의도치 않게 찌그러지는 것을 막습니다.",
    "Can I enlarge a small image?": "작은 이미지를 확대할 수 있나요?",
    "Yes, but enlargement cannot recreate detail that was not present in the source.": "네. 다만 원본에 없는 세부 정보까지 복원되지는 않습니다.",

    "GUIDE / IMAGE MIRROR, FLIP AND ROTATE TOOL": "안내 / 이미지 반전·회전 도구",
    "MIRROR, FLIP AND ROTATE IMAGES": "이미지 반전과 회전",
    "Correct image orientation or create a mirrored copy without uploading the original. Use quick 90-degree controls or fine-tune the angle before downloading.": "원본을 업로드하지 않고 이미지 방향을 바로잡거나 반전된 사본을 만드세요. 90도 회전 또는 미세 각도 조절 후 다운로드할 수 있습니다.",
    "Mirror it horizontally, flip it vertically, or rotate it.": "좌우 반전, 상하 반전 또는 회전을 적용하세요.",
    "Use the angle slider for precise adjustments.": "각도 슬라이더로 세밀하게 조절하세요.",
    "Choose an output format and download the transformed image.": "출력 형식을 선택하고 변형된 이미지를 다운로드하세요.",
    "NON-DESTRUCTIVE EDITING": "원본을 바꾸지 않는 편집",
    "The original file is never overwritten. Reset returns the preview to its starting orientation, and download creates a new file.": "원본 파일은 덮어쓰지 않습니다. 초기화하면 미리보기가 처음 방향으로 돌아가고 다운로드 시 새 파일이 생성됩니다.",
    "ROTATED IMAGE SIZE": "회전된 이미지 크기",
    "Rotating at an angle other than 90 degrees expands the output canvas so the image is not cropped. Transparent corners are preserved in PNG and WebP.": "90도 단위가 아닌 각도로 회전하면 이미지가 잘리지 않도록 캔버스가 확장됩니다. PNG와 WebP는 모서리의 투명 영역을 유지합니다.",
    "What is the difference between mirror and flip?": "좌우 반전과 상하 반전의 차이는 무엇인가요?",
    "Mirror reverses the image from left to right. Flip turns it upside down from top to bottom.": "좌우 반전은 이미지를 왼쪽과 오른쪽으로 뒤집고, 상하 반전은 위아래로 뒤집습니다.",
    "No. Loading, transforming, and exporting happen in your browser.": "아니요. 불러오기, 변형, 내보내기는 브라우저에서 처리됩니다.",
    "Which output format should I use?": "어떤 출력 형식을 사용해야 하나요?",
    "PNG preserves transparent corners. JPEG fills transparent areas with white. WebP can preserve transparency with a smaller file size.": "PNG는 투명한 모서리를 유지합니다. JPEG는 투명 영역을 흰색으로 채웁니다. WebP는 더 작은 용량으로 투명도를 유지할 수 있습니다.",

    "GUIDE / FILE HASH CHECKER": "안내 / 파일 해시 확인",
    "CHECK A FILE CHECKSUM": "파일 체크섬 확인",
    "Calculate a repeatable cryptographic fingerprint for any local file. Compare the result with a checksum published by a trusted source.": "기기에 있는 파일의 암호화 지문을 계산하고 신뢰할 수 있는 제공처가 공개한 체크섬과 비교하세요.",
    "Choose the file you want to verify.": "확인할 파일을 선택하세요.",
    "Select SHA-256, SHA-384, or SHA-512.": "SHA-256, SHA-384 또는 SHA-512를 선택하세요.",
    "Wait for the hexadecimal hash to appear.": "16진수 해시가 나타날 때까지 기다리세요.",
    "Copy it and compare every character with the trusted reference.": "해시를 복사해 신뢰할 수 있는 기준값과 모든 문자를 비교하세요.",
    "WHAT A MATCH MEANS": "해시가 일치한다는 의미",
    "A matching checksum supports the conclusion that your copy has the same bytes as the reference file. Even a one-byte change produces a different result.": "체크섬이 일치하면 파일이 기준 파일과 같은 바이트로 구성되었음을 확인하는 데 도움이 됩니다. 한 바이트만 바뀌어도 결과가 달라집니다.",
    "NOT A MALWARE SCAN": "악성코드 검사는 아님",
    "A hash does not inspect a file for malicious behavior and cannot prove that the publisher is trustworthy. Obtain reference hashes from an authoritative source.": "해시는 악성 동작을 검사하지 않으며 제공처의 신뢰성을 보장하지도 않습니다. 기준 해시는 공식 출처에서 받으세요.",
    "Which algorithm should I choose?": "어떤 알고리즘을 선택해야 하나요?",
    "Use the algorithm named by the file publisher. SHA-256 is a common modern default when a choice is available.": "파일 제공처가 지정한 알고리즘을 사용하세요. 선택할 수 있다면 SHA-256이 일반적인 최신 기본값입니다.",
    "Is the selected file uploaded?": "선택한 파일이 업로드되나요?",
    "No. The browser's cryptographic API reads it locally.": "아니요. 브라우저의 암호화 기능이 기기에서 파일을 읽습니다.",
    "Why does my hash not match?": "해시가 일치하지 않는 이유는 무엇인가요?",
    "The file may be incomplete, modified, a different version, or compared with the wrong algorithm.": "파일이 불완전하거나 수정되었거나 다른 버전이거나 잘못된 알고리즘으로 비교했을 수 있습니다.",

    "GUIDE / PRIVATE QR CODE GENERATOR": "안내 / 개인정보 보호 QR 코드 생성",
    "CREATE A QR CODE": "QR 코드 만들기",
    "Encode text or a URL into a downloadable PNG. The generator supports Unicode text, multiple image sizes, and four error-correction levels.": "텍스트나 URL을 다운로드 가능한 PNG로 만드세요. 유니코드 텍스트, 여러 이미지 크기, 네 단계 오류 복원을 지원합니다.",
    "Enter the exact text or destination URL.": "정확한 텍스트 또는 이동할 URL을 입력하세요.",
    "Choose an error-correction level.": "오류 복원 수준을 선택하세요.",
    "Select the output image size.": "출력 이미지 크기를 선택하세요.",
    "Download the PNG and test it on more than one device.": "PNG를 다운로드하고 여러 기기에서 테스트하세요.",
    "TEST BEFORE PUBLISHING": "공개하기 전에 테스트",
    "A QR code can be technically valid while containing a mistyped address. Scan the final downloaded image and confirm the destination before printing or distributing it.": "QR 코드가 정상이어도 주소에 오타가 있을 수 있습니다. 인쇄하거나 배포하기 전에 다운로드한 이미지를 스캔해 목적지를 확인하세요.",
    "ERROR CORRECTION": "오류 복원",
    "Higher correction can help a code remain readable after minor damage, but it makes the pattern denser and may increase the required QR version.": "오류 복원 수준이 높으면 일부가 손상되어도 읽힐 가능성이 커지지만 패턴이 촘촘해지고 QR 버전이 높아질 수 있습니다.",
    "Is QR content sent to the server?": "QR 내용이 서버로 전송되나요?",
    "No. Encoding happens locally in the browser.": "아니요. 인코딩은 브라우저에서 처리됩니다.",
    "Can I enter Korean or other Unicode text?": "한글이나 다른 유니코드 문자를 입력할 수 있나요?",
    "Yes. The generator supports Unicode text, including Korean characters.": "네. 한글을 포함한 유니코드 텍스트를 지원합니다.",
    "Should I put confidential data in a QR code?": "QR 코드에 기밀 정보를 넣어도 되나요?",
    "No. Anyone who can scan a displayed QR code may read its contents.": "권장하지 않습니다. 표시된 QR 코드를 스캔할 수 있는 사람은 누구나 내용을 읽을 수 있습니다."
  }).forEach(([english, korean]) => translations.set(english, korean));

  Object.entries({
    "GUIDE / FOCUS TIMER": "안내 / 집중 타이머",
    "USE THE FOCUS TIMER": "집중 타이머 사용법",
    "Run a distraction-free countdown for focused work, study, reading, or short breaks. Choose a preset or enter a custom duration up to 180 minutes.": "집중 작업, 공부, 독서 또는 짧은 휴식을 위한 방해 없는 타이머입니다. 프리셋을 선택하거나 최대 180분까지 직접 입력하세요.",
    "Choose 5, 15, 25, 45 minutes or set a custom time.": "5분, 15분, 25분, 45분을 선택하거나 시간을 직접 설정하세요.",
    "Select START FOCUS.": "집중 시작을 누르세요.",
    "Pause when needed or reset the current session.": "필요할 때 일시정지하거나 현재 세션을 초기화하세요.",
    "Keep the tab open to hear the optional completion sound.": "완료 알림음을 들으려면 탭을 열어 두세요.",
    "LOCAL TIMER STATE": "브라우저에 저장되는 타이머 상태",
    "The current timer state can be stored in this browser so an accidental refresh does not immediately erase the session.": "현재 타이머 상태는 브라우저에 저장되어 실수로 새로고침해도 세션이 바로 사라지지 않습니다.",
    "KEYBOARD CONTROLS": "키보드 조작",
    "Press Space to start or pause. Press R to reset when focus is not inside another control.": "스페이스 키로 시작하거나 일시정지하고, 다른 입력란을 선택하지 않은 상태에서 R 키로 초기화하세요.",
    "What is the 25-minute preset for?": "25분 프리셋은 어떤 용도인가요?",
    "It is a common focus interval, but you can choose any duration that fits your work.": "일반적으로 많이 사용하는 집중 간격이지만 작업에 맞는 시간을 자유롭게 선택할 수 있습니다.",
    "Does the timer require an account?": "타이머 사용에 계정이 필요한가요?",
    "No. It runs in the browser without sign-in.": "아니요. 로그인 없이 브라우저에서 실행됩니다.",
    "Will it work after I close the browser?": "브라우저를 닫아도 작동하나요?",
    "The saved state may remain, but a closed browser cannot reliably play the completion sound.": "저장된 상태는 남을 수 있지만 브라우저가 닫혀 있으면 완료 알림음은 정상적으로 재생되지 않을 수 있습니다.",
    "minutes and": "분",

    "Calculation type": "계산 유형",
    "Arithmetic": "사칙연산",
    "FORMULA / FIRST NUMBER [OPERATOR] SECOND NUMBER": "공식 / 첫 번째 숫자 [연산] 두 번째 숫자",
    "FORMULA / (PRICE − DISCOUNT) + TAX ON DISCOUNTED PRICE": "공식 / (가격 − 할인) + 할인 가격의 세금",
    "FORMULA / (BILL + TIP) ÷ PEOPLE": "공식 / (청구 금액 + 팁) ÷ 인원수",
    "CLEAR FORMULAS.": "명확한 공식.",
    "USEFUL RESULTS.": "유용한 결과.",
    "Basic arithmetic": "사칙연산",
    "Add, subtract, multiply, or divide two numbers. Example: 1,250 + 250 returns 1,500. Division by zero is shown as an error instead of an invented result.": "두 숫자를 더하고 빼고 곱하거나 나눕니다. 예를 들어 1,250 + 250의 결과는 1,500입니다. 0으로 나누면 잘못된 결과 대신 오류를 표시합니다.",
    "Percent and percentage change": "퍼센트와 변화율",
    "“15% of 240” uses 15 ÷ 100 × 240 and returns 36. Percentage change compares a new value with its starting value: (new − start) ÷ start × 100.": "‘240의 15%’는 15 ÷ 100 × 240으로 계산해 36을 구합니다. 변화율은 새 값과 시작 값을 (새 값 − 시작 값) ÷ 시작 값 × 100으로 비교합니다.",
    "Discount and sales tax": "할인과 판매세",
    "A discount is removed first. Sales tax is then applied to the discounted subtotal. Local tax rules can differ, so confirm which amount is taxable where you live.": "먼저 할인을 적용한 뒤 할인된 소계에 판매세를 계산합니다. 지역별 세금 규정이 다를 수 있으니 과세 기준을 확인하세요.",
    "Tip and split bill": "팁과 더치페이",
    "The tip is calculated from the entered bill, added to the total, and divided by the number of people. Rounding or service-charge rules may differ by venue.": "입력한 금액을 기준으로 팁을 계산해 합계에 더하고 인원수로 나눕니다. 반올림이나 서비스 요금 규정은 장소마다 다를 수 있습니다.",
    "IMPORTANT": "중요",
    "This general-purpose calculator is not financial, tax, accounting, or legal advice. Verify important figures and applicable local rules before making decisions.": "이 일반 계산기는 금융, 세무, 회계 또는 법률 자문이 아닙니다. 결정하기 전에 중요한 수치와 해당 지역 규정을 확인하세요.",
    "GUIDE / MULTI CALCULATOR": "안내 / 다기능 계산기",
    "EVERYDAY CALCULATIONS": "생활 계산",
    "Use four focused calculator modes with visible formulas. Results update in the browser and can be copied without submitting the entered values.": "공식이 표시되는 네 가지 계산 모드를 사용하세요. 입력값을 전송하지 않고 브라우저에서 결과를 계산하고 복사할 수 있습니다.",
    "Choose arithmetic, percentage, discount, or tip and split.": "사칙연산, 퍼센트, 할인 또는 팁·나누기를 선택하세요.",
    "Enter the requested values.": "필요한 값을 입력하세요.",
    "Read the result and the displayed calculation summary.": "결과와 계산 요약을 확인하세요.",
    "Copy the calculation and verify important totals against local rules.": "계산 내용을 복사하고 중요한 합계는 지역 규정에 맞는지 확인하세요.",
    "PERCENT, DISCOUNT AND TAX": "퍼센트, 할인과 세금",
    "Percentage mode calculates a percent of a value or the change between two values. Discount mode removes the discount before applying the entered sales-tax rate.": "퍼센트 모드는 값의 일정 비율 또는 두 값의 변화율을 계산합니다. 할인 모드는 할인을 먼저 적용한 뒤 입력한 판매세율을 계산합니다.",
    "GENERAL INFORMATION ONLY": "일반 정보용",
    "Taxability, service charges, tipping customs, and rounding rules vary. This calculator does not provide financial, tax, accounting, or legal advice.": "과세, 서비스 요금, 팁 관행과 반올림 규칙은 다를 수 있습니다. 이 계산기는 금융, 세무, 회계 또는 법률 자문을 제공하지 않습니다.",
    "How is percentage change calculated?": "퍼센트 변화율은 어떻게 계산하나요?",
    "The difference between new and starting values is divided by the starting value and multiplied by 100.": "새 값과 시작 값의 차이를 시작 값으로 나눈 뒤 100을 곱합니다.",
    "Is tax applied before the discount?": "세금은 할인 전에 적용되나요?",
    "No. This tool applies the discount first and tax to the discounted subtotal.": "아니요. 할인을 먼저 적용한 뒤 할인된 소계에 세금을 계산합니다.",
    "Are calculator inputs uploaded?": "계산기 입력값이 업로드되나요?",
    "No. Calculations run in JavaScript in your browser.": "아니요. 계산은 브라우저에서 실행됩니다.",

    "Drawing tools": "그리기 도구",
    "Layers and properties": "레이어와 속성",
    "ZOOM": "확대",
    "Path editing canvas": "패스 편집 캔버스",
    "PEN: JOIN ENDPOINTS · ALT + DRAG FOR CURVES · SELECT: CLICK A PATH TO MOVE IT": "펜: 끝점 연결 · ALT + 드래그로 곡선 · 선택: 패스를 클릭해 이동",
    "START / LIME · END / CORAL ON HOVER": "시작 / 라임 · 끝 / 마우스를 올리면 코랄",
    "PATH": "패스",
    "NAME": "이름",
    "OPACITY": "불투명도",
    "STROKE": "선 색상",
    "FILL": "채우기 색상",
    "Path 1": "패스 1",
    "Add path layer": "패스 레이어 추가",
    "Add image layer": "이미지 레이어 추가",
    "GUIDE / PATH STUDIO": "안내 / 패스 스튜디오",
    "DRAW EDITABLE BEZIER PATHS": "편집 가능한 베지어 패스 그리기",
    "Path Studio is a desktop-only vector workspace for drawing curves, managing paths and image layers, and saving projects locally for later editing.": "패스 스튜디오는 곡선을 그리고 패스와 이미지 레이어를 관리하며 프로젝트를 기기에 저장할 수 있는 데스크톱 전용 벡터 작업 공간입니다.",
    "Open the tool on a screen at least 1080 pixels wide.": "너비 1080픽셀 이상의 화면에서 도구를 여세요.",
    "Use PEN to place anchors and Alt-drag to create curve handles.": "펜으로 앵커를 놓고 Alt 키를 누른 채 끌어 곡선 핸들을 만드세요.",
    "Use SELECT to edit anchors, handles, images, or complete paths.": "선택 도구로 앵커, 핸들, 이미지 또는 전체 패스를 편집하세요.",
    "Save a .pathwork project or export a flattened PNG.": ".pathwork 프로젝트를 저장하거나 합쳐진 PNG로 내보내세요.",
    "PATHS AND ENDPOINTS": "패스와 끝점",
    "Open endpoints can be joined. Start and end markers change color on hover to make path closure and joining easier to identify.": "열린 끝점은 서로 연결할 수 있습니다. 시작과 끝 표시는 마우스를 올리면 색이 바뀌어 패스 닫기와 연결 위치를 쉽게 구분할 수 있습니다.",
    "LOCAL PROJECT FILES": "기기에 저장되는 프로젝트 파일",
    "SAVE PROJECT downloads a local project containing editable path and image-layer data. Keep that file if you want to continue later.": "프로젝트 저장은 편집 가능한 패스와 이미지 레이어 데이터가 포함된 파일을 다운로드합니다. 나중에 계속 작업하려면 이 파일을 보관하세요.",
    "PRACTICAL WORKFLOW": "권장 작업 방식",
    "Use separate paths for shapes you may want to move independently. Save the editable .pathwork project before exporting PNG, because the PNG is flattened and cannot restore anchors, handles, or layer settings.": "독립적으로 이동할 도형은 별도 패스로 만드세요. PNG는 하나로 합쳐져 앵커, 핸들, 레이어 설정을 복원할 수 없으므로 내보내기 전에 편집 가능한 .pathwork 프로젝트를 저장하세요.",
    "KNOWN LIMITS": "알려진 제한 사항",
    "Path Studio is designed for a desktop pointer and a wide workspace. It is not a full SVG editor, and PNG export rasterizes the canvas at the current project dimensions.": "패스 스튜디오는 데스크톱 포인터와 넓은 작업 공간에 맞춰 설계되었습니다. 완전한 SVG 편집기는 아니며 PNG 내보내기는 현재 프로젝트 크기로 캔버스를 래스터화합니다.",
    "Why is Path Studio disabled on mobile?": "모바일에서 패스 스튜디오가 비활성화되는 이유는 무엇인가요?",
    "Its canvas, layer inspector, and precision controls require a desktop-width workspace.": "캔버스, 레이어 검사기와 정밀 조작에는 데스크톱 너비의 작업 공간이 필요합니다.",
    "How do I create a curve?": "곡선은 어떻게 만드나요?",
    "With PEN active, hold Alt while dragging an anchor to create Bezier handles.": "펜이 활성화된 상태에서 Alt 키를 누른 채 앵커를 끌면 베지어 핸들이 만들어집니다.",
    "Can I change image opacity?": "이미지 불투명도를 바꿀 수 있나요?",
    "Yes. Select an image layer and adjust its opacity in Properties.": "네. 이미지 레이어를 선택하고 속성에서 불투명도를 조절하세요.",
    "Can I reopen an exported PNG for editing?": "내보낸 PNG를 다시 편집할 수 있나요?",
    "No. Exported PNG files are flattened. Save the .pathwork project if you need to continue editing paths and layers.": "아니요. 내보낸 PNG는 하나로 합쳐진 파일입니다. 패스와 레이어를 계속 편집하려면 .pathwork 프로젝트를 저장하세요.",
    "What should I keep before closing the page?": "페이지를 닫기 전에 무엇을 저장해야 하나요?",
    "Keep the latest .pathwork project and any exported PNG you need. Unsaved canvas state is not stored on the server.": "최신 .pathwork 프로젝트와 필요한 PNG를 보관하세요. 저장하지 않은 캔버스 상태는 서버에 보관되지 않습니다."
  }).forEach(([english, korean]) => translations.set(english, korean));

  const patterns = [
    [/^(\d+) MIN$/, "$1분"],
    [/^(\d+) CUTS?$/, "$1개 분할 지점"],
    [/^(\d+) PAGES?$/, "$1페이지"],
    [/^PAGE (\d+)(?: \/ (\d+))?$/, (_, page, total) => total ? `${page} / ${total} 페이지` : `${page}페이지`],
    [/^Page (\d+)$/, "$1페이지"],
    [/^CUT BETWEEN (\d+)\/(\d+)$/, "$1/$2 사이 분할"],
    [/^CUT SET · (\d+)\/(\d+)$/, "$1/$2 분할 설정됨"],
    [/^(\d+) output PDFs will be created\.$/, "$1개의 PDF가 생성됩니다."],
    [/^(\d+) files ready to merge\.$/, "$1개 파일을 합칠 준비가 되었습니다."],
    [/^(\d+) pages ready\.$/, "$1페이지 준비됨."],
    [/^(\d+) pages? ready\. Drag cards to reorder\.$/, "$1페이지 준비됨. 카드를 끌어 순서를 바꾸세요."],
    [/^(\d+) images? ready\.$/, "$1개 이미지 준비됨."],
    [/^(\d+) characters · (\d+) × (\d+) modules\.$/, "$1자 · $2 × $3 모듈"],
    [/^(\d+) × (\d+) pixels\.$/, "$1 × $2 픽셀."],
    [/^(\d+) × (\d+) pixels\. Ready to transform\.$/, "$1 × $2 픽셀. 변형 준비 완료."],
    [/^Showing page (\d+) in the enlarged preview\.$/, "$1페이지를 확대해서 보는 중입니다."],
    [/^Reading file (\d+) of (\d+)\.\.\.$/, "$2개 중 $1번째 파일 읽는 중..."],
    [/^Merging file (\d+) of (\d+)\.\.\.$/, "$2개 중 $1번째 파일 합치는 중..."],
    [/^Creating PDF (\d+) of (\d+)\.\.\.$/, "$2개 중 $1번째 PDF 만드는 중..."],
    [/^Packing files into ZIP\.\.\. (\d+)%$/, "ZIP으로 묶는 중... $1%"],
    [/^Rendering (\d+) pages?…$/, "$1페이지 변환 중…"],
    [/^Rendering page (\d+)…$/, "$1페이지 표시 중…"],
    [/^(\d+) editable annotations? on page (\d+)\.$/, "$2페이지에 수정 가능한 주석 $1개."],
    [/^Finding comments (\d+) \/ (\d+).*$/, "$2페이지 중 $1페이지의 댓글 찾는 중…"],
    [/^Zoom set to (\d+)%\.$/, "확대 비율 $1%로 설정됨."],
    [/^Rotation set to (.+)\.$/, "회전 각도 $1로 설정됨."],
    [/^(.+) applied\.$/, "$1 적용됨."],
    [/^POSITION (\d+) · ROTATE (.+)$/, "위치 $1 · 회전 $2"],
    [/^All pages \((\d+)-(\d+)\)$/, "전체 페이지 ($1-$2)"],
    [/^(.+)% of (.+) = (.+)$/, "$2의 $1% = $3"],
    [/^(.+) → (.+) · increase$/, "$1 → $2 · 증가"],
    [/^(.+) → (.+) · decrease$/, "$1 → $2 · 감소"],
    [/^(.+) → (.+) · no change$/, "$1 → $2 · 변화 없음"],
    [/^SAVE (.+) · TAX (.+) · SUBTOTAL (.+)$/, "절약 $1 · 세금 $2 · 소계 $3"],
    [/^TIP (.+) · TOTAL (.+) · (\d+) (?:PERSON|PEOPLE)$/, "팁 $1 · 합계 $2 · $3명"],
    [/^(\d+) minutes? and (\d+) seconds? remaining$/, "$1분 $2초 남음"],
    [/^Move layer up: (.+)$/, "$1 레이어 위로 이동"],
    [/^Move layer down: (.+)$/, "$1 레이어 아래로 이동"],
    [/^Delete layer: (.+)$/, "$1 레이어 삭제"]
  ];

  const exactStatus = new Map(Object.entries({
    "Select at least one split point between pages.": "페이지 사이에서 분할 지점을 하나 이상 선택하세요.",
    "Choose a valid PDF file.": "올바른 PDF 파일을 선택하세요.",
    "Creating private page previews in your browser...": "브라우저에서 안전하게 페이지 미리보기를 만드는 중...",
    "This PDF has only one page and cannot be split.": "이 PDF는 한 페이지뿐이라 분할할 수 없습니다.",
    "This PDF could not be previewed. It may be encrypted or damaged.": "PDF를 미리 볼 수 없습니다. 암호화되었거나 손상되었을 수 있습니다.",
    "Reading the PDF locally...": "기기에서 PDF를 읽는 중...",
    "PREPARING PDF": "PDF 준비 중",
    "CREATING ZIP": "ZIP 만드는 중",
    "PREVIEW UNAVAILABLE": "미리보기 불가",
    "DOCUMENT START": "문서 시작",
    "DOCUMENT END": "문서 끝",
    "LOADING PREVIEW": "미리보기 불러오는 중",
    "THIS PAGE COULD NOT BE PREVIEWED": "이 페이지를 미리 볼 수 없습니다",
    "Choose a JPG, PNG, or WebP image.": "JPG, PNG 또는 WebP 이미지를 선택하세요.",
    "This image could not be opened.": "이미지를 열 수 없습니다.",
    "Enter dimensions from 1 to 12,000 pixels.": "1~12,000픽셀 사이의 크기를 입력하세요.",
    "This browser could not create the selected format.": "이 브라우저에서 선택한 형식을 만들 수 없습니다.",
    "Transform controls reset.": "변형 설정을 초기화했습니다.",
    "The hash could not be calculated in this browser.": "이 브라우저에서 해시를 계산할 수 없습니다.",
    "Hash copied to the clipboard.": "해시를 클립보드에 복사했습니다.",
    "Hash selected. Use your browser copy command.": "해시가 선택되었습니다. 브라우저의 복사 기능을 사용하세요.",
    "One or more images could not be opened.": "일부 이미지를 열 수 없습니다.",
    "Building your PDF…": "PDF 만드는 중…",
    "Your PDF has been downloaded.": "PDF 다운로드가 완료되었습니다.",
    "The PDF could not be created. Try smaller images.": "PDF를 만들 수 없습니다. 더 작은 이미지를 사용해 보세요.",
    "This PDF could not be opened.": "PDF를 열 수 없습니다.",
    "This PDF could not be opened. It may be encrypted or damaged.": "PDF를 열 수 없습니다. 암호화되었거나 손상되었을 수 있습니다.",
    "Select at least one page.": "페이지를 하나 이상 선택하세요.",
    "The PDF could not be created.": "PDF를 만들 수 없습니다.",
    "Your ZIP has been downloaded.": "ZIP 다운로드가 완료되었습니다.",
    "Images could not be created.": "이미지를 만들 수 없습니다.",
    "This content is too long for the selected error-correction level.": "선택한 오류 복원 수준에 비해 내용이 너무 깁니다.",
    "Opening PDF…": "PDF 여는 중…",
    "Highlight added. Add an optional comment in the editor.": "하이라이트를 추가했습니다. 편집기에서 댓글을 입력할 수 있습니다.",
    "Comment pin added. Write the note in the editor.": "댓글 핀을 추가했습니다. 편집기에서 내용을 입력하세요.",
    "Annotation deleted from the edited copy.": "편집본에서 주석을 삭제했습니다.",
    "Building annotated PDF…": "주석 PDF 만드는 중…",
    "Annotated PDF downloaded. Keep the original file as a backup.": "주석 PDF를 다운로드했습니다. 원본 파일도 보관하세요.",
    "The annotated PDF could not be created.": "주석 PDF를 만들 수 없습니다.",
    "Pen active. Click for corners or Alt + drag for curves.": "펜 활성화. 클릭하면 모서리, Alt 키를 누른 채 끌면 곡선이 됩니다.",
    "Select active. Drag anchors or Bezier handles.": "선택 활성화. 앵커나 베지어 핸들을 끌어 이동하세요.",
    "Path selected. Drag to move the complete path.": "패스가 선택되었습니다. 끌어서 전체 패스를 이동하세요.",
    "Position updated.": "위치를 변경했습니다.",
    "Project saved locally. Open this file later to continue.": "프로젝트를 기기에 저장했습니다. 나중에 파일을 열어 계속할 수 있습니다.",
    "Project restored. Continue editing where you left off.": "프로젝트를 불러왔습니다. 이전 작업부터 계속하세요.",
    "This project file could not be opened.": "프로젝트 파일을 열 수 없습니다.",
    "New project ready.": "새 프로젝트가 준비되었습니다.",
    "PNG exported locally.": "PNG를 기기에 저장했습니다."
  }));

  exactStatus.forEach((value, key) => translations.set(key, value));

  const textOriginal = new WeakMap();
  const textApplied = new WeakMap();
  const attributeOriginal = new WeakMap();
  const attributeApplied = new WeakMap();
  let language = readLanguage();

  function readLanguage() {
    try { return localStorage.getItem(STORAGE_KEY) === "ko" ? "ko" : "en"; }
    catch (_) { return "en"; }
  }

  function translateText(value) {
    if (translations.has(value)) return translations.get(value);
    for (const [pattern, replacement] of patterns) {
      if (pattern.test(value)) return value.replace(pattern, replacement);
    }
    return value;
  }

  function applyText(node) {
    const current = node.nodeValue;
    if (!current || !current.trim()) return;
    if (language === "ko") {
      if (textApplied.get(node) === current) return;
      const leading = current.match(/^\s*/)[0];
      const trailing = current.match(/\s*$/)[0];
      const core = current.trim();
      const translated = translateText(core);
      textOriginal.set(node, current);
      if (translated !== core) {
        const next = `${leading}${translated}${trailing}`;
        textApplied.set(node, next);
        node.nodeValue = next;
      }
      return;
    }
    if (textApplied.get(node) === current && textOriginal.has(node)) {
      const original = textOriginal.get(node);
      textApplied.delete(node);
      if (current !== original) node.nodeValue = original;
    }
  }

  function applyAttributes(element) {
    if (!(element instanceof Element)) return;
    const names = ["aria-label", "placeholder", "title"];
    let originals = attributeOriginal.get(element);
    let applied = attributeApplied.get(element);
    if (!originals) { originals = new Map(); attributeOriginal.set(element, originals); }
    if (!applied) { applied = new Map(); attributeApplied.set(element, applied); }
    names.forEach((name) => {
      const current = element.getAttribute(name);
      if (!current) return;
      if (language === "ko") {
        if (applied.get(name) === current) return;
        originals.set(name, current);
        const translated = translateText(current);
        if (translated !== current) {
          applied.set(name, translated);
          element.setAttribute(name, translated);
        }
      } else if (applied.get(name) === current && originals.has(name)) {
        const original = originals.get(name);
        applied.delete(name);
        if (current !== original) element.setAttribute(name, original);
      }
    });
  }

  function applyTree(root = document.body) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) applyText(root);
    if (root.nodeType === Node.ELEMENT_NODE) applyAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) applyText(node);
      else applyAttributes(node);
    }
  }

  function updateSwitches() {
    document.querySelectorAll("[data-language-switch]").forEach((button) => {
      const text = language === "ko" ? "EN" : "KR";
      const label = language === "ko" ? "영어로 전환" : "한국어로 전환";
      const pressed = String(language === "ko");
      if (button.textContent !== text) button.textContent = text;
      if (button.getAttribute("aria-label") !== label) button.setAttribute("aria-label", label);
      if (button.getAttribute("aria-pressed") !== pressed) button.setAttribute("aria-pressed", pressed);
    });
  }

  function setLanguage(next) {
    language = next === "ko" ? "ko" : "en";
    try { localStorage.setItem(STORAGE_KEY, language); } catch (_) {}
    document.documentElement.lang = language;
    applyTree();
    updateSwitches();
    window.dispatchEvent(new CustomEvent("site-language-changed", { detail: { language } }));
  }

  window.browserToolsLanguage = {
    get current() { return language; },
    translate: translateText,
    set: setLanguage
  };

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-language-switch]")) return;
    setLanguage(language === "ko" ? "en" : "ko");
  });

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "characterData") applyText(record.target);
      if (record.type === "attributes") applyAttributes(record.target);
      record.addedNodes.forEach((node) => applyTree(node));
    });
    updateSwitches();
  });

  function start() {
    setLanguage(language);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "placeholder", "title"]
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
