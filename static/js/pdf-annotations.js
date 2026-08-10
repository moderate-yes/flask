const app = document.querySelector("#annotationApp");
const picker = document.querySelector("#filePicker");
const drop = document.querySelector("#dropZone");
const workspace = document.querySelector("#workspace");
const viewer = document.querySelector("#viewer");
const stage = document.querySelector("#pageStage");
const canvas = document.querySelector("#pdfCanvas");
const overlay = document.querySelector("#annotationOverlay");
const status = document.querySelector("#status");
const pageNumber = document.querySelector("#pageNumber");
const pageCount = document.querySelector("#pageCount");
const previousPage = document.querySelector("#previousPage");
const nextPage = document.querySelector("#nextPage");
const inspectorEmpty = document.querySelector("#inspectorEmpty");
const inspectorFields = document.querySelector("#inspectorFields");
const annotationKind = document.querySelector("#annotationKind");
const annotationAuthor = document.querySelector("#annotationAuthor");
const annotationComment = document.querySelector("#annotationComment");
const annotationColor = document.querySelector("#annotationColor");
const pageAnnotationCount = document.querySelector("#pageAnnotationCount");
const documentCommentCount = document.querySelector("#documentCommentCount");
const documentComments = document.querySelector("#documentComments");
const modeHint = document.querySelector("#modeHint");

const pdfjs = await import(app.dataset.pdfjs);
pdfjs.GlobalWorkerOptions.workerSrc = app.dataset.worker;

let sourceBytes = null;
let sourceName = "annotated";
let pdfDocument = null;
let currentPage = 1;
let currentViewport = null;
let currentMode = "select";
let selectedId = null;
let annotationSequence = 0;
let renderSequence = 0;
let dragStart = null;
let draft = null;
let suppressNextOverlayClick = false;
const annotationsByPage = new Map();
const loadedPages = new Set();
const existingSourcesByPage = new Map();

const setStatus = (message, error = false) => {
  status.textContent = message;
  status.classList.toggle("error", error);
};

function annotationId() {
  annotationSequence += 1;
  return `annotation-${Date.now()}-${annotationSequence}`;
}

function normalizeRect(rect) {
  return [
    Math.min(Number(rect[0]), Number(rect[2])),
    Math.min(Number(rect[1]), Number(rect[3])),
    Math.max(Number(rect[0]), Number(rect[2])),
    Math.max(Number(rect[1]), Number(rect[3]))
  ];
}

function componentHex(value) {
  const normalized = value <= 1 ? value * 255 : value;
  return Math.max(0, Math.min(255, Math.round(normalized))).toString(16).padStart(2, "0");
}

function colorToHex(color, fallback) {
  if (!color || color.length < 3) return fallback;
  return `#${componentHex(color[0])}${componentHex(color[1])}${componentHex(color[2])}`;
}

function annotationText(value) {
  if (typeof value === "string") return value;
  if (value && typeof value.str === "string") return value.str;
  return "";
}

function sourceKey(value) {
  const match = String(value || "").match(/(\d+)\s*(?:0\s*)?R/i);
  return match ? `${match[1]}R` : String(value || "");
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255);
}

function pageAnnotations(page = currentPage) {
  if (!annotationsByPage.has(page)) annotationsByPage.set(page, []);
  return annotationsByPage.get(page);
}

function selectedAnnotation() {
  return pageAnnotations().find((item) => item.id === selectedId) || null;
}

function allComments() {
  return [...annotationsByPage.entries()]
    .flatMap(([page, items]) => items
      .filter((item) => item.comment.trim())
      .map((item) => ({ page, item })))
    .sort((left, right) => left.page - right.page);
}

function renderDocumentComments() {
  const comments = allComments();
  documentCommentCount.textContent = String(comments.length);
  documentComments.replaceChildren();
  if (!comments.length) {
    const empty = document.createElement("p");
    empty.textContent = "No comments found.";
    documentComments.append(empty);
    return;
  }
  for (const { page, item } of comments) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `document-comment${page === currentPage && item.id === selectedId ? " active" : ""}`;
    const pageLabel = document.createElement("span");
    pageLabel.textContent = `P.${page}`;
    const excerpt = document.createElement("strong");
    excerpt.textContent = item.comment;
    button.append(pageLabel, excerpt);
    button.addEventListener("click", async () => {
      currentPage = page;
      await renderPage();
      selectedId = item.id;
      setMode("select");
      renderOverlay();
      renderInspector();
      renderDocumentComments();
      overlay.querySelector(`[data-annotation-id="${item.id}"]`)?.focus();
    });
    documentComments.append(button);
  }
}

async function readPageAnnotations(pageIndex, pdfPage) {
  if (loadedPages.has(pageIndex)) return;
  const sourceAnnotations = await pdfPage.getAnnotations({ intent: "display" });
  const highlightType = pdfjs.AnnotationType?.HIGHLIGHT ?? 9;
  const textType = pdfjs.AnnotationType?.TEXT ?? 1;
  const popupType = pdfjs.AnnotationType?.POPUP ?? 16;
  const commentTypes = new Set([
    textType,
    pdfjs.AnnotationType?.FREETEXT ?? 3,
    pdfjs.AnnotationType?.LINE ?? 4,
    pdfjs.AnnotationType?.SQUARE ?? 5,
    pdfjs.AnnotationType?.CIRCLE ?? 6,
    pdfjs.AnnotationType?.POLYGON ?? 7,
    pdfjs.AnnotationType?.POLYLINE ?? 8,
    highlightType,
    pdfjs.AnnotationType?.UNDERLINE ?? 10,
    pdfjs.AnnotationType?.SQUIGGLY ?? 11,
    pdfjs.AnnotationType?.STRIKEOUT ?? 12,
    pdfjs.AnnotationType?.STAMP ?? 13,
    pdfjs.AnnotationType?.CARET ?? 14,
    pdfjs.AnnotationType?.INK ?? 15,
    pdfjs.AnnotationType?.FILEATTACHMENT ?? 17,
    pdfjs.AnnotationType?.SOUND ?? 18
  ]);
  const nonPopup = sourceAnnotations.filter((item) => item.annotationType !== popupType);
  const byId = new Map(nonPopup.map((item) => [sourceKey(item.id), item]));

  for (const popup of sourceAnnotations.filter((item) => item.annotationType === popupType)) {
    const parent = byId.get(sourceKey(popup.parentId));
    if (!parent) continue;
    if (!annotationText(parent.contentsObj) && !annotationText(parent.contents)) {
      parent.contentsObj = popup.contentsObj || parent.contentsObj;
      parent.contents = popup.contents || parent.contents;
    }
    if (!annotationText(parent.titleObj) && !annotationText(parent.title)) {
      parent.titleObj = popup.titleObj || parent.titleObj;
      parent.title = popup.title || parent.title;
    }
  }

  const supported = nonPopup.filter((item) => commentTypes.has(item.annotationType));
  const items = supported
    .filter((item) => Array.isArray(item.rect) && item.rect.length === 4)
    .map((item) => {
      const type = item.annotationType === highlightType ? "highlight" : "comment";
      return {
        id: annotationId(),
        type,
        rect: normalizeRect(item.rect),
        color: colorToHex(item.color, type === "highlight" ? "#ffe45c" : "#ffcf4a"),
        comment: annotationText(item.contentsObj) || annotationText(item.contents) || annotationText(item.richText),
        author: annotationText(item.titleObj) || annotationText(item.title),
        existing: true,
        sourceId: sourceKey(item.id)
      };
    });
  annotationsByPage.set(pageIndex, items);
  existingSourcesByPage.set(pageIndex, new Set(items.map((item) => item.sourceId).filter(Boolean)));
  loadedPages.add(pageIndex);
}

async function readDocumentAnnotations() {
  for (let pageIndex = 1; pageIndex <= pdfDocument.numPages; pageIndex += 1) {
    setStatus(`Finding comments ${pageIndex} / ${pdfDocument.numPages}â€¦`);
    const pdfPage = await pdfDocument.getPage(pageIndex);
    await readPageAnnotations(pageIndex, pdfPage);
    pdfPage.cleanup();
  }
  renderDocumentComments();
}

function rectToViewport(rect) {
  const first = currentViewport.convertToViewportPoint(rect[0], rect[1]);
  const second = currentViewport.convertToViewportPoint(rect[2], rect[3]);
  const left = Math.min(first[0], second[0]);
  const top = Math.min(first[1], second[1]);
  return {
    left,
    top,
    width: Math.max(4, Math.abs(second[0] - first[0])),
    height: Math.max(4, Math.abs(second[1] - first[1]))
  };
}

function renderOverlay() {
  overlay.replaceChildren();
  const items = pageAnnotations();
  pageAnnotationCount.textContent = String(items.length);
  for (const item of items) {
    const box = rectToViewport(item.rect);
    const mark = document.createElement("button");
    mark.type = "button";
    mark.className = `annotation-mark ${item.type}${item.id === selectedId ? " selected" : ""}`;
    mark.dataset.annotationId = item.id;
    mark.style.left = `${box.left}px`;
    mark.style.top = `${box.top}px`;
    mark.style.width = `${box.width}px`;
    mark.style.height = `${box.height}px`;
    mark.style.setProperty("--annotation-color", item.color);
    mark.title = item.comment || (item.type === "highlight" ? "Highlight" : "Comment");
    mark.setAttribute("aria-label", `${item.type === "highlight" ? "Highlight" : "Comment"}: ${item.comment || "No comment"}`);
    if (item.type === "comment") mark.textContent = "!";
    mark.addEventListener("click", (event) => {
      event.stopPropagation();
      selectedId = item.id;
      setMode("select");
      renderOverlay();
      renderInspector();
    });
    overlay.append(mark);
  }
}

function renderInspector() {
  const item = selectedAnnotation();
  inspectorEmpty.hidden = Boolean(item);
  inspectorFields.hidden = !item;
  if (!item) return;
  annotationKind.textContent = item.type.toUpperCase();
  annotationAuthor.value = item.author;
  annotationComment.value = item.comment;
  annotationColor.value = item.color;
}

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  overlay.className = `annotation-overlay mode-${mode}`;
  modeHint.textContent = {
    select: "Click an annotation to inspect it.",
    highlight: "Drag across a line or area to create a highlight.",
    comment: "Click the page to place a new comment pin."
  }[mode];
}

async function renderPage() {
  if (!pdfDocument) return;
  const sequence = ++renderSequence;
  setStatus(`Rendering page ${currentPage}…`);
  const pdfPage = await pdfDocument.getPage(currentPage);
  const baseViewport = pdfPage.getViewport({ scale: 1 });
  const availableWidth = Math.max(260, viewer.clientWidth - 28);
  const scale = Math.min(1.45, availableWidth / baseViewport.width);
  const viewport = pdfPage.getViewport({ scale });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(viewport.width * pixelRatio);
  canvas.height = Math.floor(viewport.height * pixelRatio);
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;
  stage.style.width = `${viewport.width}px`;
  stage.style.height = `${viewport.height}px`;
  overlay.style.width = `${viewport.width}px`;
  overlay.style.height = `${viewport.height}px`;
  await pdfPage.render({
    canvasContext: canvas.getContext("2d"),
    viewport,
    transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0]
  }).promise;
  if (sequence !== renderSequence) return;
  currentViewport = viewport;
  await readPageAnnotations(currentPage, pdfPage);
  selectedId = null;
  pageNumber.value = String(currentPage);
  previousPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === pdfDocument.numPages;
  renderOverlay();
  renderInspector();
  renderDocumentComments();
  setStatus(`${pageAnnotations().length} editable annotation${pageAnnotations().length === 1 ? "" : "s"} on page ${currentPage}.`);
}

async function loadFile(file) {
  if (!file || (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf")) {
    setStatus("Choose a valid PDF file.", true);
    return;
  }
  try {
    setStatus("Opening PDF…");
    sourceBytes = await file.arrayBuffer();
    sourceName = file.name.replace(/\.pdf$/i, "") || "annotated";
    pdfDocument = await pdfjs.getDocument({ data: sourceBytes.slice(0) }).promise;
    annotationsByPage.clear();
    loadedPages.clear();
    existingSourcesByPage.clear();
    currentPage = 1;
    selectedId = null;
    pageCount.textContent = String(pdfDocument.numPages);
    pageNumber.max = String(pdfDocument.numPages);
    drop.hidden = true;
    workspace.hidden = false;
    await readDocumentAnnotations();
    const firstComment = allComments()[0];
    if (firstComment) currentPage = firstComment.page;
    await renderPage();
  } catch (error) {
    console.error(error);
    setStatus("This PDF could not be opened. It may be encrypted or damaged.", true);
  }
}

function localPoint(event) {
  const bounds = overlay.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(bounds.width, event.clientX - bounds.left)),
    y: Math.max(0, Math.min(bounds.height, event.clientY - bounds.top))
  };
}

function updateDraft(point) {
  if (!draft || !dragStart) return;
  const left = Math.min(dragStart.x, point.x);
  const top = Math.min(dragStart.y, point.y);
  draft.style.left = `${left}px`;
  draft.style.top = `${top}px`;
  draft.style.width = `${Math.abs(point.x - dragStart.x)}px`;
  draft.style.height = `${Math.abs(point.y - dragStart.y)}px`;
}

overlay.addEventListener("pointerdown", (event) => {
  if (currentMode !== "highlight" || event.target.closest(".annotation-mark")) return;
  event.preventDefault();
  dragStart = localPoint(event);
  draft = document.createElement("div");
  draft.className = "annotation-draft";
  overlay.append(draft);
  updateDraft(dragStart);
  overlay.setPointerCapture(event.pointerId);
});

overlay.addEventListener("pointermove", (event) => {
  if (dragStart) updateDraft(localPoint(event));
});

overlay.addEventListener("pointerup", (event) => {
  if (!dragStart || currentMode !== "highlight") return;
  const end = localPoint(event);
  const start = dragStart;
  dragStart = null;
  draft?.remove();
  draft = null;
  if (Math.abs(end.x - start.x) < 8 || Math.abs(end.y - start.y) < 5) return;
  const first = currentViewport.convertToPdfPoint(start.x, start.y);
  const second = currentViewport.convertToPdfPoint(end.x, end.y);
  const item = {
    id: annotationId(), type: "highlight", rect: normalizeRect([...first, ...second]),
    color: "#ffe45c", comment: "", author: "", existing: false
  };
  pageAnnotations().push(item);
  selectedId = item.id;
  suppressNextOverlayClick = true;
  setMode("select");
  renderOverlay();
  renderInspector();
  setStatus("Highlight added. Add an optional comment in the editor.");
});

overlay.addEventListener("click", (event) => {
  if (suppressNextOverlayClick) {
    suppressNextOverlayClick = false;
    return;
  }
  if (event.target.closest(".annotation-mark")) return;
  if (currentMode === "comment") {
    const point = localPoint(event);
    const pdfPoint = currentViewport.convertToPdfPoint(point.x, point.y);
    const size = 18 / currentViewport.scale;
    const item = {
      id: annotationId(), type: "comment",
      rect: normalizeRect([pdfPoint[0], pdfPoint[1], pdfPoint[0] + size, pdfPoint[1] + size]),
      color: "#ffcf4a", comment: "", author: "", existing: false
    };
    pageAnnotations().push(item);
    selectedId = item.id;
    setMode("select");
    renderOverlay();
    renderInspector();
    annotationComment.focus();
    setStatus("Comment pin added. Write the note in the editor.");
  } else if (currentMode === "select") {
    selectedId = null;
    renderOverlay();
    renderInspector();
  }
});

annotationAuthor.addEventListener("input", () => {
  const item = selectedAnnotation();
  if (item) item.author = annotationAuthor.value;
});
annotationComment.addEventListener("input", () => {
  const item = selectedAnnotation();
  if (item) {
    item.comment = annotationComment.value;
    const mark = overlay.querySelector(`[data-annotation-id="${item.id}"]`);
    if (mark) mark.title = item.comment || item.type;
    renderDocumentComments();
  }
});
annotationColor.addEventListener("input", () => {
  const item = selectedAnnotation();
  if (item) {
    item.color = annotationColor.value;
    renderOverlay();
  }
});

document.querySelector("#deleteAnnotation").addEventListener("click", () => {
  const items = pageAnnotations();
  const index = items.findIndex((item) => item.id === selectedId);
  if (index < 0) return;
  items.splice(index, 1);
  selectedId = null;
  renderOverlay();
  renderInspector();
  renderDocumentComments();
  setStatus("Annotation deleted from the edited copy.");
});

function pdfDate() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  }).formatToParts(now).reduce((values, part) => ({ ...values, [part.type]: part.value }), {});
  return `D:${parts.year}${parts.month}${parts.day}${parts.hour}${parts.minute}${parts.second}+09'00'`;
}

function syncExistingAnnotations(pdfDoc, page, pageIndex) {
  const { PDFName, PDFArray, PDFDict, PDFHexString } = PDFLib;
  const key = PDFName.of("Annots");
  const existing = page.node.lookupMaybe(key, PDFArray);
  const preserved = [];
  const items = pageAnnotations(pageIndex);
  const sourceItems = new Map(items.filter((item) => item.existing).map((item) => [item.sourceId, item]));
  const originalSources = existingSourcesByPage.get(pageIndex) || new Set();
  const deletedSources = new Set([...originalSources].filter((source) => !sourceItems.has(source)));
  if (existing) {
    for (let index = 0; index < existing.size(); index += 1) {
      const raw = existing.get(index);
      let dictionary = null;
      try {
        dictionary = pdfDoc.context.lookup(raw, PDFDict);
      } catch (_error) {
        dictionary = null;
      }
      const rawSource = sourceKey(raw?.toString());
      const parentSource = sourceKey(dictionary?.get(PDFName.of("Parent"))?.toString());
      if (deletedSources.has(rawSource) || deletedSources.has(parentSource)) continue;
      const item = sourceItems.get(rawSource);
      if (dictionary && item) {
        dictionary.set(PDFName.of("Contents"), PDFHexString.fromText(item.comment || ""));
        dictionary.set(PDFName.of("T"), PDFHexString.fromText(item.author || ""));
        dictionary.set(PDFName.of("C"), pdfDoc.context.obj(hexToRgb(item.color)));
      }
      preserved.push(raw);
    }
  }
  const annotations = pdfDoc.context.obj(preserved);
  page.node.set(key, annotations);
  return annotations;
}

function addPdfAnnotation(pdfDoc, page, annotations, item) {
  const { PDFHexString, PDFString } = PDFLib;
  const [x1, y1, x2, y2] = normalizeRect(item.rect);
  const common = {
    Type: "Annot",
    Rect: [x1, y1, x2, y2],
    C: hexToRgb(item.color),
    Contents: PDFHexString.fromText(item.comment || ""),
    T: PDFHexString.fromText(item.author || ""),
    M: PDFString.of(pdfDate()),
    NM: PDFString.of(item.id),
    P: page.ref,
    F: 4
  };
  const dictionary = item.type === "highlight"
    ? pdfDoc.context.obj({
        ...common, Subtype: "Highlight", CA: 0.38,
        QuadPoints: [x1, y2, x2, y2, x1, y1, x2, y1]
      })
    : pdfDoc.context.obj({
        ...common, Subtype: "Text", Name: "Comment", Open: false, Border: [0, 0, 0]
      });
  annotations.push(pdfDoc.context.register(dictionary));
}

async function downloadAnnotatedPdf() {
  if (!sourceBytes) return;
  try {
    setStatus("Building annotated PDF…");
    const output = await PDFLib.PDFDocument.load(sourceBytes.slice(0));
    const pages = output.getPages();
    for (let index = 0; index < pages.length; index += 1) {
      const pageIndex = index + 1;
      if (!loadedPages.has(pageIndex)) continue;
      const annotations = syncExistingAnnotations(output, pages[index], pageIndex);
      for (const item of pageAnnotations(pageIndex).filter((annotation) => !annotation.existing)) {
        addPdfAnnotation(output, pages[index], annotations, item);
      }
    }
    output.setModificationDate(new Date());
    output.setProducer("Browser Tools PDF Annotation Editor");
    const bytes = await output.save({ useObjectStreams: false });
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sourceName}-annotated.pdf`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    window.reportGoogleAdsConversion?.();
    setStatus("Annotated PDF downloaded. Keep the original file as a backup.");
  } catch (error) {
    console.error(error);
    setStatus("The annotated PDF could not be created.", true);
  }
}

document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
previousPage.addEventListener("click", () => { if (currentPage > 1) { currentPage -= 1; renderPage(); } });
nextPage.addEventListener("click", () => { if (currentPage < pdfDocument.numPages) { currentPage += 1; renderPage(); } });
pageNumber.addEventListener("change", () => {
  const requested = Math.max(1, Math.min(pdfDocument.numPages, Math.round(Number(pageNumber.value) || 1)));
  currentPage = requested;
  renderPage();
});
document.querySelector("#downloadPdf").addEventListener("click", downloadAnnotatedPdf);
document.querySelector("#replacePdf").addEventListener("click", () => picker.click());
drop.addEventListener("click", () => picker.click());
picker.addEventListener("change", () => loadFile(picker.files[0]));
["dragenter", "dragover"].forEach((type) => drop.addEventListener(type, (event) => {
  event.preventDefault();
  drop.classList.add("dragging");
}));
["dragleave", "drop"].forEach((type) => drop.addEventListener(type, (event) => {
  event.preventDefault();
  drop.classList.remove("dragging");
}));
drop.addEventListener("drop", (event) => loadFile(event.dataTransfer.files[0]));
setMode("select");
