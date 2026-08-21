const app = document.querySelector("#splitApp");
const popupPdfjsLib = window.pdfjsLib;
const pdfjsLib = popupPdfjsLib;
if (!pdfjsLib) throw new Error("PDF renderer is unavailable.");
pdfjsLib.GlobalWorkerOptions.workerSrc = app.dataset.popupWorkerUrl;

const filePicker = document.querySelector("#splitFilePicker");
const dropZone = document.querySelector("#splitDropZone");
const options = document.querySelector("#splitOptions");
const fileName = document.querySelector("#selectedFileName");
const fileSize = document.querySelector("#selectedFileSize");
const pageCount = document.querySelector("#selectedPageCount");
const removeButton = document.querySelector("#removeSplitFile");
const pagePreview = document.querySelector("#pagePreview");
const selectedCuts = document.querySelector("#selectedCuts");
const selectAllButton = document.querySelector("#selectAllCuts");
const clearCutsButton = document.querySelector("#clearCuts");
const status = document.querySelector("#splitStatus");
const splitButton = document.querySelector("#splitButton");
const previewModal = document.querySelector("#pdfPreviewModal");
const previewClose = document.querySelector("#pdfPreviewClose");
const previewStage = document.querySelector("#pdfPreviewStage");
const previewCanvas = document.querySelector("#pdfPreviewCanvas");
const previewLoading = document.querySelector("#pdfPreviewLoading");
const previewTitle = document.querySelector("#pdfPreviewTitle");
const previewPrevious = document.querySelector("#pdfPreviewPrevious");
const previewNext = document.querySelector("#pdfPreviewNext");
const previewZoomOut = document.querySelector("#pdfPreviewZoomOut");
const previewZoomIn = document.querySelector("#pdfPreviewZoomIn");
const previewZoomValue = document.querySelector("#pdfPreviewZoomValue");
const splitWorkerUrl = app.dataset.workerUrl;
const CMAP_URL = "/static/vendor/cmaps/";
const STANDARD_FONT_DATA_URL = "/static/vendor/standard_fonts/";

let selectedFile = null;
let pdfDocument = null;
let pdfLoadingTask = null;
let totalPages = 0;
let cuts = new Set();
let processing = false;
let splitWorker = null;
let previewObserver = null;
let loadToken = 0;
let popupPdfDocument = null;
let popupLoadingTask = null;
let popupLoadPromise = null;
let popupRenderTask = null;
let popupPageNumber = 1;
let popupZoom = 1;
let popupRequestToken = 0;
let previewReturnTarget = null;

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function updateCutUi() {
  const count = cuts.size;
  selectedCuts.textContent = `${count} CUT${count === 1 ? "" : "S"}`;
  splitButton.disabled = processing || !selectedFile || count === 0;
  pagePreview.querySelectorAll(".cut-control").forEach((button) => {
    const active = cuts.has(Number(button.dataset.after));
    const afterPage = Number(button.dataset.after);
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.querySelector("span").textContent = button.classList.contains("vertical")
      ? (active ? "SET" : "CUT")
      : (active ? `CUT SET · ${afterPage}/${afterPage + 1}` : `CUT BETWEEN ${afterPage}/${afterPage + 1}`);
  });
  if (!processing && selectedFile) {
    setStatus(count ? `${count + 1} output PDFs will be created.` : "Select at least one split point between pages.");
  }
}

function resetFile() {
  loadToken += 1;
  closeZoomPreview();
  if (splitWorker) splitWorker.terminate();
  splitWorker = null;
  if (previewObserver) previewObserver.disconnect();
  previewObserver = null;
  const loadingTaskToDestroy = pdfLoadingTask;
  const popupTaskToDestroy = popupLoadingTask;
  pdfLoadingTask = null;
  popupLoadingTask = null;
  pdfDocument = null;
  popupPdfDocument = null;
  popupLoadPromise = null;
  selectedFile = null;
  totalPages = 0;
  cuts = new Set();
  processing = false;
  options.hidden = true;
  dropZone.hidden = false;
  pagePreview.replaceChildren();
  splitButton.disabled = true;
  splitButton.classList.remove("processing");
  splitButton.textContent = "SPLIT & DOWNLOAD ZIP";
  filePicker.value = "";
  setStatus("Add one PDF file to begin.");
  // PDF.js may still be finishing a thumbnail render. The loading task owns
  // destroy(); update the UI first and let that cleanup finish in the background.
  if (typeof loadingTaskToDestroy?.destroy === "function") {
    Promise.resolve(loadingTaskToDestroy.destroy()).catch(() => {});
  }
  if (typeof popupTaskToDestroy?.destroy === "function") {
    Promise.resolve(popupTaskToDestroy.destroy()).catch(() => {});
  }
}

async function loadPopupDocument() {
  if (popupPdfDocument) return popupPdfDocument;
  if (popupLoadPromise) return popupLoadPromise;
  if (!popupPdfjsLib || !selectedFile) throw new Error("Popup PDF renderer is unavailable.");
  popupLoadPromise = (async () => {
    const bytes = new Uint8Array(await selectedFile.arrayBuffer());
    popupLoadingTask = popupPdfjsLib.getDocument({ data: bytes, isEvalSupported: false });
    popupPdfDocument = await popupLoadingTask.promise;
    return popupPdfDocument;
  })();
  try {
    return await popupLoadPromise;
  } catch (error) {
    popupLoadPromise = null;
    throw error;
  }
}

function closeZoomPreview() {
  popupRequestToken += 1;
  if (popupRenderTask) popupRenderTask.cancel();
  popupRenderTask = null;
  previewModal.hidden = true;
  document.body.classList.remove("preview-open");
  const context = previewCanvas.getContext("2d");
  context.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  previewCanvas.width = 0;
  previewCanvas.height = 0;
  if (previewReturnTarget?.isConnected) previewReturnTarget.focus();
  previewReturnTarget = null;
}

function updatePopupControls() {
  previewTitle.textContent = `PAGE ${popupPageNumber} / ${totalPages}`;
  previewPrevious.disabled = popupPageNumber <= 1;
  previewNext.disabled = popupPageNumber >= totalPages;
  previewZoomOut.disabled = popupZoom <= 0.6;
  previewZoomIn.disabled = popupZoom >= 2.2;
  previewZoomValue.textContent = `${Math.round(popupZoom * 100)}%`;
}

async function renderZoomPreview() {
  const requestToken = ++popupRequestToken;
  previewLoading.hidden = false;
  previewLoading.textContent = "LOADING PAGE...";
  updatePopupControls();
  try {
    const popupDocument = await loadPopupDocument();
    const page = await popupDocument.getPage(popupPageNumber);
    if (requestToken !== popupRequestToken) return;
    if (popupRenderTask) popupRenderTask.cancel();
    const baseViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.max(260, previewStage.clientWidth - 44);
    const cssScale = (Math.min(1040, availableWidth) / baseViewport.width) * popupZoom;
    const outputScale = Math.min(window.devicePixelRatio || 1, 2);
    const viewport = page.getViewport({ scale: cssScale * outputScale });
    const context = previewCanvas.getContext("2d", { alpha: false });
    previewCanvas.width = Math.floor(viewport.width);
    previewCanvas.height = Math.floor(viewport.height);
    previewCanvas.style.width = `${Math.floor(viewport.width / outputScale)}px`;
    previewCanvas.style.height = `${Math.floor(viewport.height / outputScale)}px`;
    popupRenderTask = page.render({ canvasContext: context, viewport });
    await popupRenderTask.promise;
    if (requestToken !== popupRequestToken) return;
    previewLoading.hidden = true;
    previewStage.scrollTo({ top: 0, left: 0 });
  } catch (error) {
    if (error?.name === "RenderingCancelledException") return;
    console.error("Enlarged PDF preview error:", error);
    previewLoading.hidden = false;
    previewLoading.textContent = "THIS PAGE COULD NOT BE PREVIEWED";
  } finally {
    popupRenderTask = null;
  }
}

function openZoomPreview(pageNumber) {
  if (!pdfDocument || processing || !selectedFile) return;
  previewReturnTarget = document.activeElement;
  popupPageNumber = Math.min(totalPages, Math.max(1, pageNumber));
  popupZoom = 1;
  previewModal.hidden = false;
  document.body.classList.add("preview-open");
  previewClose.focus();
  renderZoomPreview();
  setStatus(`Showing page ${popupPageNumber} in the enlarged preview.`);
}

function changePopupPage(offset) {
  const nextPage = Math.min(totalPages, Math.max(1, popupPageNumber + offset));
  if (nextPage === popupPageNumber) return;
  popupPageNumber = nextPage;
  renderZoomPreview();
}

function changePopupZoom(amount) {
  const nextZoom = Math.min(2.2, Math.max(0.6, Number((popupZoom + amount).toFixed(1))));
  if (nextZoom === popupZoom) return;
  popupZoom = nextZoom;
  renderZoomPreview();
}

async function renderPage(pageNumber, paper, token) {
  if (!pdfDocument || token !== loadToken || paper.dataset.rendered === "true") return;
  paper.dataset.rendered = "true";
  try {
    const page = await pdfDocument.getPage(pageNumber);
    if (token !== loadToken) return;
    const baseViewport = page.getViewport({ scale: 1 });
    const targetWidth = Math.max(80, Math.min(160, paper.clientWidth || 110));
    const outputScale = Math.min(window.devicePixelRatio || 1, 2);
    const scale = (targetWidth / baseViewport.width) * outputScale;
    const viewport = page.getViewport({ scale, rotation: page.rotate || 0 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = `${Math.floor(viewport.width / outputScale)}px`;
    canvas.style.height = `${Math.floor(viewport.height / outputScale)}px`;
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    if (token !== loadToken) return;
    paper.replaceChildren(canvas);
  } catch (error) {
    console.error("PDF page render error:", error);
    paper.dataset.rendered = "false";
    paper.querySelector(".page-loading").textContent = "PREVIEW UNAVAILABLE";
  }
}

function buildPageList(token) {
  pagePreview.replaceChildren();
  cuts = new Set();

  previewObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const paper = entry.target;
      renderPage(Number(paper.dataset.page), paper, token);
      previewObserver.unobserve(paper);
    });
  }, { rootMargin: "500px 0px" });

  const createBoundary = (position) => {
    const boundary = document.createElement("div");
    boundary.className = `edge-boundary ${position}`;
    const label = document.createElement("span");
    label.textContent = position === "start" ? "DOCUMENT START" : "DOCUMENT END";
    boundary.append(label);
    return boundary;
  };

  const createCutButton = (afterPage, className) => {
    const button = document.createElement("button");
    button.className = `cut-control ${className}`;
    button.type = "button";
    button.dataset.after = String(afterPage);
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `Split between page ${afterPage} and page ${afterPage + 1}`);
    const label = document.createElement("span");
    label.textContent = className.includes("vertical") ? "CUT" : `CUT BETWEEN ${afterPage}/${afterPage + 1}`;
    button.append(label);
    return button;
  };

  pagePreview.append(createBoundary("start"));

  for (let rowStart = 1; rowStart <= totalPages; rowStart += 3) {
    const rowEnd = Math.min(rowStart + 2, totalPages);
    const row = document.createElement("div");
    row.className = "page-row";

    for (let pageNumber = rowStart; pageNumber <= rowEnd; pageNumber += 1) {
      const figure = document.createElement("figure");
      figure.className = "page-tile";
      const paper = document.createElement("div");
      paper.className = "page-paper";
      paper.dataset.page = String(pageNumber);
      paper.dataset.rendered = "false";
      paper.tabIndex = 0;
      paper.setAttribute("role", "button");
      paper.setAttribute("aria-label", `Enlarge preview of page ${pageNumber}`);
      const loading = document.createElement("span");
      loading.className = "page-loading";
      loading.textContent = "LOADING PREVIEW";
      paper.append(loading);
      const label = document.createElement("figcaption");
      label.className = "page-label";
      label.textContent = `PAGE ${String(pageNumber).padStart(2, "0")}`;
      figure.append(paper, label);
      row.append(figure);
      previewObserver.observe(paper);

      if (pageNumber < rowEnd) {
        const slot = pageNumber - rowStart + 1;
        row.append(createCutButton(pageNumber, `vertical slot-${slot}`));
      }
    }

    pagePreview.append(row);
    if (rowEnd < totalPages) pagePreview.append(createCutButton(rowEnd, "between-rows"));
  }

  pagePreview.append(createBoundary("end"));
  updateCutUi();
}

async function inspectFile(file) {
  const isPdf = file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
  if (!isPdf) {
    setStatus("Choose a valid PDF file.", true);
    return;
  }

  resetFile();
  const token = loadToken;
  selectedFile = file;
  processing = true;
  dropZone.hidden = true;
  options.hidden = false;
  fileName.textContent = file.name;
  fileName.title = file.name;
  fileSize.textContent = formatBytes(file.size);
  pageCount.textContent = "READING PAGES";
  setStatus("Creating private page previews in your browser...");

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    pdfLoadingTask = pdfjsLib.getDocument({
      data: bytes,
      cMapUrl: CMAP_URL,
      cMapPacked: true,
      standardFontDataUrl: STANDARD_FONT_DATA_URL,
      isEvalSupported: false,
    });
    pdfDocument = await pdfLoadingTask.promise;
    if (token !== loadToken) return;
    popupPdfDocument = pdfDocument;
    totalPages = pdfDocument.numPages;
    pageCount.textContent = `${totalPages} PAGE${totalPages === 1 ? "" : "S"}`;
    processing = false;
    if (totalPages < 2) {
      setStatus("This PDF has only one page and cannot be split.", true);
      return;
    }
    buildPageList(token);
  } catch (error) {
    console.error("PDF inspection error:", error);
    if (token !== loadToken) return;
    processing = false;
    pageCount.textContent = "UNREADABLE";
    setStatus("This PDF could not be previewed. It may be encrypted or damaged.", true);
  }
}

async function splitPdf() {
  if (!selectedFile || processing || !totalPages || cuts.size === 0) return;
  window.reportGoogleAdsConversion?.();
  processing = true;
  splitButton.disabled = true;
  splitButton.classList.add("processing");
  splitButton.textContent = "PREPARING PDF";
  setStatus("Reading the PDF locally...");

  try {
    const buffer = await selectedFile.arrayBuffer();
    const baseName = selectedFile.name
      .replace(/\.pdf$/i, "")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
      .slice(0, 80) || "document";
    splitWorker = new Worker(splitWorkerUrl);
    splitWorker.onmessage = (event) => {
      const message = event.data;
      if (message.type === "progress") {
        setStatus(`Creating PDF ${message.current} of ${message.total}...`);
        splitButton.textContent = `SPLITTING ${message.current} / ${message.total}`;
      }
      if (message.type === "packing") {
        setStatus(`Packing files into ZIP... ${Math.round(message.percent)}%`);
        splitButton.textContent = "CREATING ZIP";
      }
      if (message.type === "done") downloadZip(message.bytes, baseName);
      if (message.type === "error") finish(message.message, true);
    };
    splitWorker.onerror = () => finish("The browser could not split this file. Try a smaller or unencrypted PDF.", true);
    splitWorker.postMessage({ type: "split", buffer, cuts: [...cuts].sort((a, b) => a - b), baseName }, [buffer]);
  } catch (_) {
    finish("The PDF could not be read. Please try again.", true);
  }
}

function downloadZip(bytes, baseName) {
  const blob = new Blob([bytes], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${baseName}-split.zip`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  finish("Your split PDFs are ready. No files were uploaded.");
}

function finish(message, isError = false) {
  processing = false;
  splitButton.classList.remove("processing");
  splitButton.textContent = "SPLIT & DOWNLOAD ZIP";
  if (splitWorker) splitWorker.terminate();
  splitWorker = null;
  updateCutUi();
  setStatus(message, isError);
}

dropZone.addEventListener("click", () => filePicker.click());
filePicker.addEventListener("change", () => inspectFile(filePicker.files[0]));
["dragenter", "dragover"].forEach((type) => dropZone.addEventListener(type, (event) => {
  event.preventDefault();
  dropZone.classList.add("dragging");
}));
["dragleave", "drop"].forEach((type) => dropZone.addEventListener(type, (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragging");
}));
dropZone.addEventListener("drop", (event) => inspectFile(event.dataTransfer.files[0]));
removeButton.addEventListener("click", resetFile);

pagePreview.addEventListener("click", (event) => {
  const button = event.target.closest(".cut-control");
  if (!button) {
    const paper = event.target.closest(".page-paper");
    if (paper) openZoomPreview(Number(paper.dataset.page));
    return;
  }
  if (processing) return;
  const afterPage = Number(button.dataset.after);
  if (cuts.has(afterPage)) cuts.delete(afterPage);
  else cuts.add(afterPage);
  updateCutUi();
});

pagePreview.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const paper = event.target.closest(".page-paper");
  if (!paper) return;
  event.preventDefault();
  openZoomPreview(Number(paper.dataset.page));
});

selectAllButton.addEventListener("click", () => {
  if (processing) return;
  cuts = new Set(Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => index + 1));
  updateCutUi();
});

clearCutsButton.addEventListener("click", () => {
  if (processing) return;
  cuts.clear();
  updateCutUi();
});

previewModal.addEventListener("click", (event) => {
  if (event.target.closest("[data-preview-close]")) closeZoomPreview();
});
previewClose.addEventListener("click", closeZoomPreview);
previewPrevious.addEventListener("click", () => changePopupPage(-1));
previewNext.addEventListener("click", () => changePopupPage(1));
previewZoomOut.addEventListener("click", () => changePopupZoom(-0.2));
previewZoomIn.addEventListener("click", () => changePopupZoom(0.2));
document.addEventListener("keydown", (event) => {
  if (previewModal.hidden) return;
  if (event.key === "Escape") closeZoomPreview();
  if (event.key === "ArrowLeft") changePopupPage(-1);
  if (event.key === "ArrowRight") changePopupPage(1);
  if (event.key === "+" || event.key === "=") changePopupZoom(0.2);
  if (event.key === "-") changePopupZoom(-0.2);
});

splitButton.addEventListener("click", splitPdf);
