const get = id => document.getElementById(id);
const ko = document.documentElement.lang === 'ko';
const picker = get('filePicker');
const drop = get('dropZone');
const width = get('width');
const height = get('height');
const lock = get('lockRatio');
const format = get('format');
const quality = get('quality');
const download = get('download');
const preview = get('preview');
let files = [];
let previewUrl;
let busy = false;
let ratio = 1;
let dimension = 'width';

async function openImage(file, use) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return await use(image);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function load(selection) {
  if (busy || !selection.length) return;
  busy = true;
  download.disabled = true;
  get('workspace').hidden = true;
  get('loadStatus').textContent = '';
  files = [];
  const candidates = Array.from(selection);
  try {
    if (candidates.some(file => !/^image\/(jpeg|png|webp)$/.test(file.type) &&
      !/\.(jpe?g|png|webp)$/i.test(file.name))) throw new Error('Unsupported format');
    await openImage(candidates[0], image => {
      ratio = image.naturalWidth / image.naturalHeight;
      width.value = image.naturalWidth;
      height.value = image.naturalHeight;
      dimension = 'width';
    });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(candidates[0]);
    preview.src = previewUrl;
    files = candidates;
    get('workspace').hidden = false;
    get('status').textContent = files.length > 1
      ? (ko ? `${files.length}장 선택됨. 미리보기는 첫 이미지입니다. 비율을 유지하면 마지막으로 수정한 가로 또는 세로 크기가 각 이미지에 적용됩니다.` : `${files.length} images selected. The preview shows the first image. With aspect ratio locked, the last edited dimension is applied to each image.`)
      : `${width.value} × ${height.value} px`;
    download.textContent = files.length > 1
      ? (ko ? '처리하고 ZIP 다운로드' : 'PROCESS & DOWNLOAD ZIP')
      : (ko ? '처리하고 다운로드' : 'PROCESS & DOWNLOAD');
  } catch {
    get('loadStatus').textContent = ko ? '열 수 있는 JPG, PNG 또는 WebP 이미지를 선택하세요.' : 'Choose readable JPG, PNG, or WebP images.';
  } finally {
    busy = false;
    download.disabled = files.length === 0;
  }
}

width.addEventListener('input', () => {
  dimension = 'width';
  if (lock.checked) height.value = Math.max(1, Math.round(Number(width.value) / ratio));
});
height.addEventListener('input', () => {
  dimension = 'height';
  if (lock.checked) width.value = Math.max(1, Math.round(Number(height.value) * ratio));
});
format.addEventListener('change', () => { quality.disabled = format.value === 'image/png'; });

async function encode(image, w, h, type, compression) {
  if (![w, h].every(value => Number.isInteger(value) && value >= 1 && value <= 12000)) {
    throw new RangeError('Invalid image dimensions');
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  try {
    const context = canvas.getContext('2d');
    if (type === 'image/jpeg') {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, w, h);
    }
    context.drawImage(image, 0, 0, w, h);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, type, compression));
    if (!blob || blob.type !== type) throw new Error('Unsupported output format');
    return blob;
  } finally {
    canvas.width = canvas.height = 0;
  }
}

download.addEventListener('click', async () => {
  if (busy || !files.length) return;
  busy = download.disabled = true;
  const status = get('status');
  const type = format.value;
  const compression = Number(quality.value);
  const targetWidth = Math.round(Number(width.value));
  const targetHeight = Math.round(Number(height.value));
  const keepRatio = lock.checked && files.length > 1;
  const batch = files.length > 1;
  const fixedDimension = dimension;
  const extension = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}[type];
  let output;
  let name;
  let current;
  try {
    const zip = batch ? new JSZip() : null;
    window.reportGoogleAdsConversion?.();
    for (const [index, file] of files.entries()) {
      current = file.name;
      status.textContent = ko ? `처리 중 · ${index + 1} / ${files.length}` : `Processing ${index + 1} of ${files.length}…`;
      await openImage(file, async image => {
        const aspect = image.naturalWidth / image.naturalHeight;
        const w = keepRatio && fixedDimension === 'height' ? Math.max(1, Math.round(targetHeight * aspect)) : targetWidth;
        const h = keepRatio && fixedDimension === 'width' ? Math.max(1, Math.round(targetWidth / aspect)) : targetHeight;
        const base = file.name.replace(/\.[^.]+$/, '').replace(/[\\/:]/g, '_') || 'image';
        name = `${base}-${w}x${h}.${extension}`;
        output = await encode(image, w, h, type, compression);
        if (zip) zip.file(`${index + 1}-${name}`, await output.arrayBuffer());
      });
    }
    if (zip) {
      output = await zip.generateAsync({type: 'blob'});
      name = 'processed-images.zip';
    }
    const url = URL.createObjectURL(output);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    status.textContent = ko ? '다운로드를 시작했습니다.' : 'Download requested.';
    window.reportToolCompletion?.('image-toolkit');
  } catch (error) {
    status.textContent = error instanceof RangeError
      ? (ko ? '가로와 세로는 각각 1~12,000px이어야 합니다.' : 'Dimensions must be between 1 and 12,000 pixels.')
      : (ko ? `이미지를 처리할 수 없습니다. ${current || ''}` : `Could not process the images. ${current || ''}`);
  } finally {
    busy = download.disabled = false;
  }
});

drop.addEventListener('click', () => { if (!busy) picker.click(); });
picker.addEventListener('change', () => { load(picker.files); picker.value = ''; });
drop.addEventListener('dragover', event => event.preventDefault());
drop.addEventListener('drop', event => {
  event.preventDefault();
  load(event.dataTransfer.files);
});
