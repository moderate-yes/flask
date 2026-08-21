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
    "Site information": "사이트 정보"
  }));

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
    [/^TIP (.+) · TOTAL (.+) · (\d+) (?:PERSON|PEOPLE)$/, "팁 $1 · 합계 $2 · $3명"]
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
      textApplied.set(node, original);
      node.nodeValue = original;
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
        applied.set(name, original);
        element.setAttribute(name, original);
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
      const text = language === "ko" ? "EN" : "한국어";
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
