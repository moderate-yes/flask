(() => {
  const app = document.querySelector("#pdfApp");
  const filePicker = document.querySelector("#filePicker");
  const dropZone = document.querySelector("#dropZone");
  const fileQueue = document.querySelector("#fileQueue");
  const fileList = document.querySelector("#fileList");
  const fileCount = document.querySelector("#fileCount");
  const clearButton = document.querySelector("#clearButton");
  const mergeButton = document.querySelector("#mergeButton");
  const mergeStatus = document.querySelector("#mergeStatus");
  const workerUrl = app.dataset.workerUrl;

  let files = [];
  let processing = false;
  let worker = null;

  function formatBytes(bytes) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function setStatus(message, isError = false) {
    mergeStatus.textContent = message;
    mergeStatus.classList.toggle("error", isError);
  }

  function fileKey(file) {
    return `${file.name}:${file.size}:${file.lastModified}`;
  }

  function addFiles(newFiles) {
    if (processing) return;
    const existing = new Set(files.map((item) => fileKey(item.file)));
    let rejected = 0;

    [...newFiles].forEach((file) => {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const key = fileKey(file);
      if (!isPdf) rejected += 1;
      else if (!existing.has(key)) {
        files.push({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, file });
        existing.add(key);
      }
    });

    renderFiles();
    if (rejected) setStatus(`${rejected} non-PDF file${rejected > 1 ? "s were" : " was"} skipped.`, true);
  }

  function renderFiles() {
    fileList.replaceChildren();
    fileCount.textContent = String(files.length).padStart(2, "0");
    fileQueue.hidden = files.length === 0;
    mergeButton.disabled = files.length < 2 || processing;

    files.forEach((item, index) => {
      const row = document.createElement("li");
      row.className = "file-item";
      row.dataset.id = item.id;

      const number = document.createElement("span");
      number.className = "file-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const details = document.createElement("div");
      details.className = "file-details";
      const name = document.createElement("span");
      name.className = "file-name";
      name.textContent = item.file.name;
      name.title = item.file.name;
      const size = document.createElement("span");
      size.className = "file-size";
      size.textContent = formatBytes(item.file.size);
      details.append(name, size);

      const actions = document.createElement("div");
      actions.className = "file-actions";
      const labels = [
        ["up", "↑", "Move up", index === 0],
        ["down", "↓", "Move down", index === files.length - 1],
        ["remove", "×", "Remove", false]
      ];
      labels.forEach(([action, text, label, disabled]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.action = action;
        button.textContent = text;
        button.setAttribute("aria-label", `${label} ${item.file.name}`);
        button.disabled = disabled || processing;
        actions.append(button);
      });

      row.append(number, details, actions);
      fileList.append(row);
    });

    if (!processing) {
      setStatus(files.length < 2 ? "Add at least two PDF files to begin." : `${files.length} files ready to merge.`);
    }
  }

  function moveFile(id, direction) {
    const index = files.findIndex((item) => item.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= files.length) return;
    [files[index], files[nextIndex]] = [files[nextIndex], files[index]];
    renderFiles();
  }

  async function mergeFiles() {
    if (processing || files.length < 2) return;
    processing = true;
    mergeButton.classList.add("processing");
    mergeButton.textContent = "PREPARING FILES";
    renderFiles();

    try {
      const buffers = [];
      for (let index = 0; index < files.length; index += 1) {
        setStatus(`Reading file ${index + 1} of ${files.length}...`);
        buffers.push(await files[index].file.arrayBuffer());
      }

      worker = new Worker(workerUrl);
      worker.onmessage = (event) => {
        const message = event.data;
        if (message.type === "progress") {
          setStatus(`Merging file ${message.current} of ${message.total}...`);
          mergeButton.textContent = `MERGING ${message.current} / ${message.total}`;
        }
        if (message.type === "done") {
          const blob = new Blob([message.bytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          const stamp = new Date().toISOString().slice(0, 10);
          link.href = url;
          link.download = `merged-${stamp}.pdf`;
          document.body.append(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          finishProcessing("Your merged PDF is ready. No files were uploaded.");
        }
        if (message.type === "error") finishProcessing(message.message, true);
      };
      worker.onerror = () => finishProcessing("The browser could not process these files. Try smaller or unencrypted PDFs.", true);
      worker.postMessage({ type: "merge", buffers }, buffers);
    } catch (_) {
      finishProcessing("The files could not be read. Please try again.", true);
    }
  }

  function finishProcessing(message, isError = false) {
    processing = false;
    mergeButton.classList.remove("processing");
    mergeButton.textContent = "MERGE";
    if (worker) worker.terminate();
    worker = null;
    renderFiles();
    setStatus(message, isError);
  }

  dropZone.addEventListener("click", () => filePicker.click());
  filePicker.addEventListener("change", () => {
    addFiles(filePicker.files);
    filePicker.value = "";
  });

  ["dragenter", "dragover"].forEach((type) => dropZone.addEventListener(type, (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  }));
  ["dragleave", "drop"].forEach((type) => dropZone.addEventListener(type, (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  }));
  dropZone.addEventListener("drop", (event) => addFiles(event.dataTransfer.files));

  fileList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button || processing) return;
    const id = button.closest(".file-item").dataset.id;
    if (button.dataset.action === "up") moveFile(id, -1);
    if (button.dataset.action === "down") moveFile(id, 1);
    if (button.dataset.action === "remove") {
      files = files.filter((item) => item.id !== id);
      renderFiles();
    }
  });

  clearButton.addEventListener("click", () => {
    if (processing) return;
    files = [];
    renderFiles();
  });
  mergeButton.addEventListener("click", mergeFiles);
})();
