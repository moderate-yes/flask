(() => {
  "use strict";

  const text = new Map(Object.entries({
    "INSTALL APP": "앱 설치", "MENU": "메뉴", "ADD TO HOME SCREEN": "홈 화면에 추가",
    "INSTALL BROWSER TOOLS.": "BROWSER TOOLS 설치", "GOT IT ×": "확인 ×", "SELECT A TOOL": "도구 선택",
    "INDEPENDENT TOOLS · ONE TAP AWAY": "독립형 도구 · 한 번에 실행",
    "PDF MERGE": "PDF 합치기", "PDF SPLIT": "PDF 나누기", "PDF ORGANIZER": "PDF 정리",
    "PDF ANNOTATIONS": "PDF 주석", "PDF TO IMAGES": "PDF를 이미지로", "IMAGES TO PDF": "이미지를 PDF로",
    "IMAGE TOOLKIT": "이미지 도구", "IMAGE TRANSFORM": "이미지 변환", "FILE HASH": "파일 해시",
    "QR GENERATOR": "QR 코드 생성", "FOCUS TIMER": "집중 타이머", "CALCULATOR": "계산기",
    "Combine files locally.": "기기에서 파일을 합칩니다.", "Cut pages privately.": "안전하게 페이지를 나눕니다.",
    "Reorder, rotate, extract.": "순서 변경, 회전, 추출.", "Highlight, comment, review.": "강조, 메모, 검토.",
    "Export pages as pictures.": "페이지를 이미지로 저장.", "Build one PDF from images.": "이미지를 하나의 PDF로.",
    "Resize, compress, convert.": "크기 조절, 압축, 변환.", "Mirror, flip, and rotate.": "대칭, 뒤집기, 회전.",
    "Check a file fingerprint.": "파일 지문을 확인합니다.", "Turn text into a QR code.": "텍스트를 QR 코드로.",
    "Stay on one task.": "한 가지 일에 집중합니다.", "Percent, discount, tax, tip.": "퍼센트, 할인, 세금, 팁.",
    "MERGE": "합치기", "SPLIT": "나누기", "ADD PDF FILES": "PDF 파일 추가", "ADD ONE PDF": "PDF 하나 추가",
    "ADD IMAGES": "이미지 추가", "ADD AN IMAGE": "이미지 추가", "CHOOSE ANOTHER PDF": "다른 PDF 선택",
    "CHOOSE ANOTHER IMAGE": "다른 이미지 선택", "CHOOSE ANY FILE": "파일 선택", "FILES": "파일",
    "CLEAR": "지우기", "RESET": "초기화", "SELECT": "선택", "SELECT ALL": "모두 선택",
    "CLEAR CUTS": "분할점 지우기", "CLEAR SELECTION": "선택 해제", "SELECT SPLIT POINTS": "분할점 선택",
    "SPLIT & DOWNLOAD ZIP": "나누고 ZIP 다운로드", "PROCESS & DOWNLOAD": "처리 후 다운로드",
    "DOWNLOAD ZIP": "ZIP 다운로드", "DOWNLOAD PNG": "PNG 다운로드", "DOWNLOAD ANNOTATED PDF": "주석 PDF 다운로드",
    "DOWNLOAD TRANSFORMED IMAGE": "변환 이미지 다운로드", "CREATE PDF": "PDF 만들기", "SAVE PDF": "PDF 저장",
    "EXTRACT SELECTED": "선택 항목 추출", "PDF processing runs in your browser.": "PDF 처리는 브라우저 안에서 진행됩니다.",
    "Add at least two PDF files to begin.": "시작하려면 PDF 파일을 두 개 이상 추가하세요.",
    "Add one PDF file to begin.": "시작하려면 PDF 파일 하나를 추가하세요.",
    "Choose files or drop them here": "파일을 선택하거나 여기에 놓으세요", "Choose a file or drop it here": "파일을 선택하거나 여기에 놓으세요",
    "Tap a page to enlarge it. Tap the line between pages to create a cut.": "페이지를 누르면 크게 볼 수 있습니다. 페이지 사이 선을 누르면 분할점이 생깁니다.",
    "This PDF has only one page and cannot be split.": "한 페이지짜리 PDF는 나눌 수 없습니다.",
    "ENLARGED PREVIEW": "확대 미리보기", "LOADING PAGE...": "페이지 불러오는 중...", "PAGE ANNOTATIONS": "페이지 주석",
    "COMMENTS IN FILE": "파일 내 메모", "No comments found.": "메모가 없습니다.",
    "Click an annotation to inspect it.": "주석을 눌러 내용을 확인하세요.",
    "Select a highlight or comment on the page to edit it.": "페이지에서 강조 또는 메모를 선택해 수정하세요.",
    "HIGHLIGHT": "강조", "COMMENT": "메모", "ANNOTATION": "주석", "DELETE ANNOTATION": "주석 삭제",
    "AUTHOR": "작성자", "COLOR": "색상", "FORMAT": "형식", "QUALITY": "품질", "JPEG QUALITY": "JPEG 품질",
    "IMAGE SIZE": "이미지 크기", "WIDTH": "너비", "HEIGHT": "높이", "KEEP ASPECT RATIO": "가로세로 비율 유지",
    "MARGIN": "여백", "PAGE SIZE": "페이지 크기", "Match each image": "이미지 크기에 맞춤",
    "MIRROR": "좌우 대칭", "UPSIDE DOWN": "상하 뒤집기", "LEFT 90°": "왼쪽 90°", "RIGHT 90°": "오른쪽 90°",
    "FINE ROTATION": "세밀한 회전", "SCALE": "배율", "APPLY": "적용",
    "ALGORITHM": "알고리즘", "COPY HASH": "해시 복사", "COPY": "복사", "The file remains on this device": "파일은 이 기기에만 남습니다",
    "TEXT OR URL": "텍스트 또는 URL", "Enter text or a URL to begin.": "텍스트 또는 URL을 입력하세요.",
    "ERROR CORRECTION": "오류 복원 수준", "FOCUS / LOCAL TIMER": "집중 / 로컬 타이머", "Focus duration": "집중 시간",
    "CUSTOM TIME": "직접 설정", "START FOCUS": "집중 시작", "Start / Pause": "시작 / 일시정지", "Sound on": "소리 켜짐",
    "Session complete. Take a moment to reset.": "집중 시간이 끝났습니다. 잠시 쉬어가세요.",
    "CALCULATE / LOCAL UTILITY": "계산 / 로컬 도구", "USEFUL RESULTS.": "유용한 계산 결과.",
    "Basic arithmetic": "기본 계산", "Percent and percentage change": "퍼센트와 증감률", "Discount and sales tax": "할인과 판매세",
    "Tip and split bill": "팁과 더치페이", "FIRST NUMBER": "첫 번째 숫자", "SECOND NUMBER": "두 번째 숫자",
    "OPERATION": "연산", "PERCENT OF": "퍼센트 계산", "OF NUMBER": "기준 숫자", "% CHANGE": "% 증감률",
    "STARTING VALUE": "시작값", "NEW VALUE": "새 값", "ORIGINAL PRICE": "원래 가격", "DISCOUNT": "할인",
    "SALES TAX AFTER DISCOUNT": "할인 후 판매세", "BILL AMOUNT": "결제 금액", "TIP": "팁", "NUMBER OF PEOPLE": "인원수",
    "RESULT": "결과", "RESET CURRENT CALCULATOR": "현재 계산기 초기화", "CLEAR FORMULAS.": "계산식 지우기.",
    "PREVIOUS": "이전", "NEXT": "다음", "CLOSE ×": "닫기 ×", "NO SELECTION": "선택 없음",
    "None": "없음", "Low": "낮음", "Medium": "보통", "Quartile": "높음", "High": "매우 높음",
    "Small": "작게", "Large": "크게", "IMPORTANT": "중요"
  }));

  const patterns = [
    [/^(\d+) files ready to merge\.?$/i, "$1개 파일을 합칠 준비가 되었습니다."],
    [/^Reading file (\d+) of (\d+)/i, "$2개 중 $1번째 파일을 읽는 중"],
    [/^Merging file (\d+) of (\d+)/i, "$2개 중 $1번째 파일을 합치는 중"],
    [/^(\d+) CUTS?$/i, "분할점 $1개"], [/^PAGE (\d+)$/i, "$1페이지"],
    [/^(\d+) characters/i, "$1자"], [/^(\d+) pages?$/i, "$1페이지"],
    [/^Sound off$/i, "소리 꺼짐"], [/^Pause$/i, "일시정지"], [/^Start again$/i, "다시 시작"],
    [/^COPIED!?$/i, "복사됨"], [/^CHECK INPUT$/i, "입력값 확인"]
  ];

  function translated(value) {
    const trimmed = value.trim();
    if (!trimmed) return value;
    let result = text.get(trimmed);
    if (!result) {
      for (const [pattern, replacement] of patterns) {
        if (pattern.test(trimmed)) { result = trimmed.replace(pattern, replacement); break; }
      }
    }
    if (!result || result === trimmed) return value;
    return value.replace(trimmed, result);
  }

  function translateNode(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      if (!root.parentElement?.closest("script, style, code")) {
        const value = translated(root.nodeValue);
        if (value !== root.nodeValue) root.nodeValue = value;
      }
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll("*")] : [...root.querySelectorAll("*")];
    for (const element of elements) {
      for (const attribute of ["placeholder", "aria-label", "title"]) {
        if (element.hasAttribute?.(attribute)) {
          const current = element.getAttribute(attribute);
          const value = translated(current);
          if (value !== current) element.setAttribute(attribute, value);
        }
      }
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement?.closest("script, style, code")) {
        const value = translated(node.nodeValue);
        if (value !== node.nodeValue) node.nodeValue = value;
      }
    }
  }

  translateNode(document);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") translateNode(mutation.target);
      for (const node of mutation.addedNodes) translateNode(node);
    }
  }).observe(document.documentElement, {childList: true, characterData: true, subtree: true});
})();
