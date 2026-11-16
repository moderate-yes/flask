const app = document.querySelector('#compressApp');
const korean = document.documentElement.lang === 'ko';
const drop = document.querySelector('#compressDrop');
const picker = document.querySelector('#compressFile');
const level = document.querySelector('#compressLevel');
const button = document.querySelector('#compressButton');
const status = document.querySelector('#compressStatus');
const result = document.querySelector('#compressResult');
const sizes = document.querySelector('#compressSizes');
const download = document.querySelector('#compressDownload');

const presets = {
  light: {dpi: 150, quality: 0.85},
  balanced: {dpi: 110, quality: 0.72},
  strong: {dpi: 80, quality: 0.52},
};
let file;
let busy = false;
let outputUrl;
const formatSize = bytes => bytes >= 1048576
  ? `${(bytes / 1048576).toFixed(2)} MB`
  : `${(bytes / 1024).toFixed(1)} KB`;

function clearResult() {
  if (outputUrl) URL.revokeObjectURL(outputUrl);
  outputUrl = null;
  download.removeAttribute('href');
  result.hidden = true;
}

function selectFile(candidate) {
  if (!candidate || busy) return;
  clearResult();
  file = /\.pdf$/i.test(candidate.name) || candidate.type === 'application/pdf' ? candidate : null;
  button.disabled = !file;
  status.textContent = file
    ? `${file.name} · ${formatSize(file.size)}`
    : korean ? 'PDF 파일을 선택해 주세요.' : 'Choose a PDF file.';
}

function encodeJpeg(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('JPEG encoding failed'));
    }, 'image/jpeg', quality);
  });
}

async function compress() {
  if (!file || busy) return;
  busy = true;
  button.disabled = drop.disabled = level.disabled = true;
  clearResult();
  status.textContent = korean ? 'PDF를 여는 중…' : 'Opening PDF…';
  const {dpi, quality} = presets[level.value];
  const canvas = document.createElement('canvas');
  let loadingTask;
  try {
    const pdfjs = await import(app.dataset.pdfjs);
    pdfjs.GlobalWorkerOptions.workerSrc = app.dataset.worker;
    loadingTask = pdfjs.getDocument({
      data: await file.arrayBuffer(),
      cMapUrl: '/static/vendor/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '/static/vendor/standard_fonts/',
    });
    const source = await loadingTask.promise;
    const output = await PDFLib.PDFDocument.create();
    for (let number = 1; number <= source.numPages; number++) {
      status.textContent = korean ? `압축 중 · ${number} / ${source.numPages}페이지` : `Compressing page ${number} of ${source.numPages}…`;
      const page = await source.getPage(number);
      const original = page.getViewport({scale: 1});
      const scale = Math.min(dpi / 72, 4096 / Math.max(original.width, original.height));
      const viewport = page.getViewport({scale});
      canvas.width = Math.max(1, Math.ceil(viewport.width));
      canvas.height = Math.max(1, Math.ceil(viewport.height));
      await page.render({canvasContext: canvas.getContext('2d', {alpha: false}), viewport, background: '#fff'}).promise;
      const jpeg = await encodeJpeg(canvas, quality);
      const image = await output.embedJpg(await jpeg.arrayBuffer());
      const outputPage = output.addPage([original.width, original.height]);
      outputPage.drawImage(image, {x: 0, y: 0, width: original.width, height: original.height});
      page.cleanup();
    }
    const bytes = await output.save();
    if (bytes.length >= file.size) {
      status.textContent = korean
        ? `용량이 줄지 않았습니다. 원본 ${formatSize(file.size)} · 압축 시도 ${formatSize(bytes.length)}`
        : `This setting did not reduce file size. Original ${formatSize(file.size)} · Attempt ${formatSize(bytes.length)}`;
      return;
    }
    outputUrl = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
    download.href = outputUrl;
    download.download = `${file.name.replace(/\.pdf$/i, '')}-compressed.pdf`;
    const percent = new Intl.NumberFormat(korean ? 'ko' : 'en', {style: 'percent', maximumFractionDigits: 2}).format(1 - bytes.length / file.size);
    sizes.textContent = korean
      ? `원본 ${formatSize(file.size)} → 압축 ${formatSize(bytes.length)} · ${percent} 감소`
      : `Original ${formatSize(file.size)} → Compressed ${formatSize(bytes.length)} · ${percent} smaller`;
    result.hidden = false;
    status.textContent = korean ? '압축 PDF를 다운로드할 수 있습니다.' : 'Your compressed PDF is ready to download.';
  } catch (error) {
    console.error(error);
    status.textContent = korean
      ? 'PDF를 압축할 수 없습니다. 암호가 걸려 있거나 파일이 손상되었을 수 있습니다.'
      : 'Could not compress this PDF. It may be password-protected or damaged.';
  } finally {
    canvas.width = canvas.height = 0;
    busy = false;
    button.disabled = drop.disabled = level.disabled = false;
    loadingTask?.destroy().catch(console.error);
  }
}

drop.addEventListener('click', () => picker.click());
picker.addEventListener('change', () => {
  selectFile(picker.files[0]);
  picker.value = '';
});
drop.addEventListener('dragover', event => event.preventDefault());
drop.addEventListener('drop', event => {
  event.preventDefault();
  selectFile(event.dataTransfer.files[0]);
});
button.addEventListener('click', compress);
