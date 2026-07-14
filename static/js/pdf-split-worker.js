importScripts("/static/vendor/pdf-lib.min.js", "/static/vendor/jszip.min.js");

function errorMessage(error) {
  const message = String(error && error.message);
  if (/encrypt/i.test(message)) return "Password-protected PDFs cannot be split. Remove the password and try again.";
  return "This PDF could not be processed. The file may be damaged or unsupported.";
}

self.onmessage = async (event) => {
  if (event.data.type !== "split") return;
  try {
    const { PDFDocument } = self.PDFLib;
    const { buffer, cuts, baseName } = event.data;
    const source = await PDFDocument.load(buffer);
    const totalPages = source.getPageCount();
    const validCuts = [...new Set(cuts)]
      .filter((page) => Number.isInteger(page) && page > 0 && page < totalPages)
      .sort((a, b) => a - b);
    if (!validCuts.length) throw new Error("No valid split points were selected.");

    const boundaries = [0, ...validCuts, totalPages];
    const groups = [];
    for (let index = 0; index < boundaries.length - 1; index += 1) {
      const start = boundaries[index];
      const end = boundaries[index + 1];
      groups.push({
        indices: Array.from({ length: end - start }, (_, offset) => start + offset),
        label: start + 1 === end ? `${end}` : `${start + 1}-${end}`
      });
    }

    const zip = new self.JSZip();
    for (let index = 0; index < groups.length; index += 1) {
      const group = groups[index];
      const output = await PDFDocument.create();
      const pages = await output.copyPages(source, group.indices);
      pages.forEach((page) => output.addPage(page));
      output.setTitle(`${baseName} pages ${group.label}`);
      output.setCreator("Private PDF Split");
      output.setProducer("pdf-lib");
      const bytes = await output.save({ useObjectStreams: true });
      const number = String(index + 1).padStart(2, "0");
      zip.file(`${baseName}_part-${number}_pages-${group.label}.pdf`, bytes);
      self.postMessage({ type: "progress", current: index + 1, total: groups.length });
    }

    const zipBytes = await zip.generateAsync(
      { type: "uint8array", compression: "STORE" },
      (metadata) => self.postMessage({ type: "packing", percent: metadata.percent })
    );
    self.postMessage({ type: "done", bytes: zipBytes.buffer }, [zipBytes.buffer]);
  } catch (error) {
    self.postMessage({ type: "error", message: errorMessage(error) });
  }
};
