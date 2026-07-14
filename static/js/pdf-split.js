const app = document.querySelector("#splitApp");
const pdfjsLib = await import(app.dataset.pdfjsUrl);
pdfjsLib.GlobalWorkerOptions.workerSrc = app.dataset.pdfjsWorkerUrl;

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
const splitWorkerUrl = app.dataset.workerUrl;

let selectedFile = null;
let pdfDocument = null;
let totalPages = 0;
let cuts = new Set();
let processing = false;
let splitWorker = null;
let previewObserver = null;
let loadToken = 0;

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

async function resetFile() {
  loadToken += 1;
  if (splitWorker) splitWorker.terminate();
  splitWorker = null;
  if (previewObserver) previewObserver.disconnect();
  previewObserver = null;
  if (pdfDocument) await pdfDocument.destroy().catch(() => {});
  pdfDocument = null;
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
}

async function renderPage(pageNumber, paper, token) {
  if (!pdfDocument || token !== loadToken || paper.dataset.rendered === "true") return;
  paper.dataset.rendered = "true";
  try {
    const page = await pdfDocument.getPage(pageNumber);
    if (token !== loadToken) return;
    const baseViewport = page.getViewport({ scale: 1 });
    const targetWidth = Math.max(72, Math.min(150, paper.clientWidth || 110));
    const outputScale = Math.min(window.devicePixelRatio || 1, 1.5);
    const viewport = page.getViewport({ scale: targetWidth / baseViewport.width });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;
    await page.render({
      canvasContext: context,
      viewport,
      transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0]
    }).promise;
    if (token !== loadToken) return;
    paper.replaceChildren(canvas);
  } catch (_) {
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

  await resetFile();
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
    pdfDocument = await pdfjsLib.getDocument({ data: bytes }).promise;
    if (token !== loadToken) return;
    totalPages = pdfDocument.numPages;
    pageCount.textContent = `${totalPages} PAGE${totalPages === 1 ? "" : "S"}`;
    processing = false;
    if (totalPages < 2) {
      setStatus("This PDF has only one page and cannot be split.", true);
      return;
    }
    buildPageList(token);
  } catch (_) {
    processing = false;
    pageCount.textContent = "UNREADABLE";
    setStatus("This PDF could not be previewed. It may be encrypted or damaged.", true);
  }
}

async function splitPdf() {
  if (!selectedFile || processing || !totalPages || cuts.size === 0) return;
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
  if (!button || processing) return;
  const afterPage = Number(button.dataset.after);
  if (cuts.has(afterPage)) cuts.delete(afterPage);
  else cuts.add(afterPage);
  updateCutUi();
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

splitButton.addEventListener("click", splitPdf);
