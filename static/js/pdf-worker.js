importScripts("/static/vendor/pdf-lib.min.js");

self.onmessage = async (event) => {
  if (event.data.type !== "merge") return;

  try {
    const { PDFDocument } = self.PDFLib;
    const buffers = event.data.buffers;
    const mergedDocument = await PDFDocument.create();

    for (let index = 0; index < buffers.length; index += 1) {
      const sourceDocument = await PDFDocument.load(buffers[index]);
      const copiedPages = await mergedDocument.copyPages(sourceDocument, sourceDocument.getPageIndices());
      copiedPages.forEach((page) => mergedDocument.addPage(page));
      self.postMessage({ type: "progress", current: index + 1, total: buffers.length });
    }

    mergedDocument.setTitle("Merged PDF");
    mergedDocument.setCreator("Private PDF Merge");
    mergedDocument.setProducer("pdf-lib");
    const bytes = await mergedDocument.save({ useObjectStreams: true });
    self.postMessage({ type: "done", bytes: bytes.buffer }, [bytes.buffer]);
  } catch (error) {
    const encrypted = /encrypt/i.test(String(error && error.message));
    self.postMessage({
      type: "error",
      message: encrypted
        ? "Password-protected PDFs cannot be merged. Remove the password and try again."
        : "One or more PDFs could not be processed. The file may be damaged or unsupported."
    });
  }
};
