const app = document.querySelector('#organizerApp');
const ko = document.documentElement.lang === 'ko';
const picker = document.querySelector('#filePicker');
const drop = document.querySelector('#dropZone');
const workspace = document.querySelector('#workspace');
const grid = document.querySelector('#pageGrid');
const status = document.querySelector('#status');
let sourceBytes = null;
let sourceName = 'organized.pdf';
let pdf = null;
let pages = [];

const pdfjsReady = import(app.dataset.pdfjs).then((pdfjs) => {
  pdfjs.GlobalWorkerOptions.workerSrc = app.dataset.worker;
  return pdfjs;
});
const CMAP_URL = '/static/vendor/cmaps/';
const STANDARD_FONT_DATA_URL = '/static/vendor/standard_fonts/';
const setStatus = (message, error = false) => { status.textContent = message; status.classList.toggle('error', error); };
const result = window.createFileResult(document.querySelector('#downloadResult'));
const downloadBytes = (bytes, name) => result.show(new Blob([bytes], {type:'application/pdf'}), name);

async function loadFile(file) {
  if (!file || (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf')) return setStatus('Choose a valid PDF file.', true);
  const dropLabel = drop.querySelector('strong');
  drop.disabled = true;
  drop.setAttribute('aria-busy', 'true');
  dropLabel.textContent = 'OPENING PDF...';
  setStatus(`Opening ${file.name} locally…`);
  // Do not export stale page selections if the next file fails to load.
  result.clear();
  document.querySelector('#extract').disabled = true;
  sourceBytes = null;
  pages = [];
  workspace.hidden = true;
  grid.replaceChildren();
  try {
    const [bytes, pdfjs] = await Promise.all([file.arrayBuffer(), pdfjsReady]);
    sourceBytes = bytes; sourceName = file.name.replace(/\.pdf$/i,'');
    pdf = await pdfjs.getDocument({
      data: sourceBytes.slice(0),
      cMapUrl: CMAP_URL,
      cMapPacked: true,
      standardFontDataUrl: STANDARD_FONT_DATA_URL
    }).promise;
    pages = Array.from({length: pdf.numPages}, (_, index) => ({source:index, rotation:0, selected:false}));
    workspace.hidden = false; dropLabel.textContent = file.name; await render();
  } catch (error) {
    console.error(error);
    dropLabel.textContent = 'ADD ONE PDF';
    setStatus('This PDF could not be opened. It may be encrypted or damaged.', true);
  } finally {
    drop.disabled = false;
    drop.removeAttribute('aria-busy');
  }
}

function updateSelection() { const count=pages.filter(p=>p.selected).length; document.querySelector('#extract').disabled=count===0; setStatus(ko ? `전체 ${pages.length}페이지 중 ${count}페이지 선택됨. 선택한 페이지만 저장됩니다.` : `${count} of ${pages.length} pages selected. Only selected pages will be saved.`); }

const previewModal = document.querySelector('#pdfPreviewModal');
const previewCanvas = document.querySelector('#pdfPreviewCanvas');
const previewStage = document.querySelector('#pdfPreviewStage');
const previewLoading = document.querySelector('#pdfPreviewLoading');
let previewIndex = 0, previewZoom = 1, previewVersion = 0, previewReturnTarget = null;
function closePreview() {
  previewVersion += 1;
  previewModal.hidden = true;
  document.body.classList.remove('preview-open');
  previewReturnTarget?.focus();
}
async function renderPreview() {
  const version = ++previewVersion;
  const item = pages[previewIndex];
  document.querySelector('#pdfPreviewTitle').textContent = `PAGE ${item.source+1} / ${pdf.numPages}`;
  document.querySelector('#pdfPreviewPrevious').disabled = previewIndex === 0;
  document.querySelector('#pdfPreviewNext').disabled = previewIndex === pages.length-1;
  document.querySelector('#pdfPreviewZoomValue').textContent = `${Math.round(previewZoom*100)}%`;
  document.querySelector('#pdfPreviewZoomOut').disabled = previewZoom <= .6;
  document.querySelector('#pdfPreviewZoomIn').disabled = previewZoom >= 2.2;
  previewLoading.hidden = false;
  try {
    const page = await pdf.getPage(item.source+1);
    const rotation = (page.rotate+item.rotation)%360;
    const base = page.getViewport({scale:1, rotation});
    const outputScale = Math.min(window.devicePixelRatio || 1, 2);
    const cssScale = Math.min(1040, Math.max(260,previewStage.clientWidth-44))/base.width*previewZoom;
    const viewport = page.getViewport({scale:cssScale*outputScale, rotation});
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width); canvas.height = Math.floor(viewport.height);
    await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
    if(version !== previewVersion || previewModal.hidden) return;
    previewCanvas.width=canvas.width; previewCanvas.height=canvas.height;
    previewCanvas.style.width=`${Math.floor(viewport.width/outputScale)}px`;
    previewCanvas.style.height=`${Math.floor(viewport.height/outputScale)}px`;
    previewCanvas.getContext('2d').drawImage(canvas,0,0);
    previewLoading.hidden=true; previewStage.scrollTo({top:0,left:0});
  } catch(error) { if(version===previewVersion) previewLoading.textContent=ko ? '\ubbf8\ub9ac\ubcf4\uae30\ub97c \ubd88\ub7ec\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.' : 'Could not load preview.'; }
}
function previewPage(item) {
  previewIndex=pages.indexOf(item); previewZoom=1; previewReturnTarget=document.activeElement;
  previewModal.hidden=false; document.body.classList.add('preview-open');
  document.querySelector('#pdfPreviewClose').focus(); renderPreview();
}
function changePreviewPage(offset) { previewIndex=Math.max(0,Math.min(pages.length-1,previewIndex+offset)); renderPreview(); }
function changePreviewZoom(offset) { previewZoom=Math.max(.6,Math.min(2.2,Math.round((previewZoom+offset)*10)/10)); renderPreview(); }
document.querySelector('#pdfPreviewClose').addEventListener('click',closePreview);
previewModal.addEventListener('click',e=>{if(e.target.closest('[data-preview-close]'))closePreview();});
document.querySelector('#pdfPreviewPrevious').addEventListener('click',()=>changePreviewPage(-1));
document.querySelector('#pdfPreviewNext').addEventListener('click',()=>changePreviewPage(1));
document.querySelector('#pdfPreviewZoomOut').addEventListener('click',()=>changePreviewZoom(-.2));
document.querySelector('#pdfPreviewZoomIn').addEventListener('click',()=>changePreviewZoom(.2));
document.addEventListener('keydown',e=>{if(previewModal.hidden)return; if(e.key==='Escape')closePreview(); if(e.key==='ArrowLeft')changePreviewPage(-1); if(e.key==='ArrowRight')changePreviewPage(1); if(e.key==='+'||e.key==='=')changePreviewZoom(.2); if(e.key==='-')changePreviewZoom(-.2);});

async function render() {
  grid.replaceChildren(); setStatus(`Creating previews… 0 / ${pages.length}`);
  for (let index=0; index<pages.length; index += 1) {
    const item = pages[index]; const li = document.createElement('li'); li.className=`asset-card${item.selected?' selected':''}`; li.draggable=true; li.dataset.index=index;
    const canvas=document.createElement('canvas'); const sourcePage=await pdf.getPage(item.source+1); const viewport=sourcePage.getViewport({scale:.42, rotation:(sourcePage.rotate+item.rotation)%360}); canvas.width=viewport.width; canvas.height=viewport.height; const ctx=canvas.getContext('2d'); ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height); await sourcePage.render({canvasContext:ctx,viewport}).promise;
    const checkbox=document.createElement('input'); checkbox.type='checkbox'; checkbox.checked=item.selected; checkbox.setAttribute('aria-label', ko ? `${item.source+1}페이지 선택` : `Select page ${item.source+1}`); checkbox.addEventListener('click',e=>e.stopPropagation()); checkbox.addEventListener('change',()=>{item.selected=checkbox.checked; li.classList.toggle('selected',item.selected); updateSelection();});
    const meta=document.createElement('p'); meta.className='asset-name'; meta.textContent=`Page ${item.source+1}`;
    const detail=document.createElement('p'); detail.className='asset-meta'; detail.textContent=`POSITION ${index+1} · ROTATE ${item.rotation}°`;
    const actions=document.createElement('div'); actions.className='asset-actions';
    [['←','left'],['↻','rotate'],['×','remove']].forEach(([label,action])=>{const b=document.createElement('button'); b.type='button'; b.textContent=label; b.dataset.action=action; b.disabled=action==='left'&&index===0; actions.append(b);});
    const imageWrap=document.createElement('div'); imageWrap.className='page-thumbnail';
    const zoom=document.createElement('button'); zoom.type='button'; zoom.className='page-preview-trigger'; zoom.setAttribute('aria-label',ko ? `${item.source+1}\ud398\uc774\uc9c0 \ubbf8\ub9ac\ubcf4\uae30` : `Preview page ${item.source+1}`); zoom.title=zoom.getAttribute('aria-label');
    zoom.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5M7.5 10.5h6m-3-3v6"/></svg>';
    imageWrap.tabIndex=0; imageWrap.setAttribute('role','button'); imageWrap.setAttribute('aria-label',zoom.getAttribute('aria-label'));
    imageWrap.addEventListener('click',e=>{e.stopPropagation();previewPage(item);});
    imageWrap.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();previewPage(item);}});
    imageWrap.append(canvas,zoom);
    li.append(checkbox,imageWrap,meta,detail,actions); grid.append(li); setStatus(`Creating previews… ${index + 1} / ${pages.length}`);
  }
  updateSelection();
}

grid.addEventListener('click', e=>{const b=e.target.closest('button'); if(!b)return; const i=Number(b.closest('li').dataset.index); if(b.dataset.action==='left'&&i){[pages[i-1],pages[i]]=[pages[i],pages[i-1]];} if(b.dataset.action==='rotate')pages[i].rotation=(pages[i].rotation+90)%360; if(b.dataset.action==='remove')pages.splice(i,1); render();});
let dragIndex=null; grid.addEventListener('dragstart',e=>{const li=e.target.closest('li'); if(li)dragIndex=Number(li.dataset.index);}); grid.addEventListener('dragover',e=>e.preventDefault()); grid.addEventListener('drop',e=>{e.preventDefault(); const li=e.target.closest('li'); if(!li||dragIndex===null)return; const target=Number(li.dataset.index); const [moved]=pages.splice(dragIndex,1); pages.splice(target,0,moved); dragIndex=null; render();});
document.querySelector('#selectAll').addEventListener('click',()=>{pages.forEach(p=>p.selected=true);render();});
document.querySelector('#clearAll').addEventListener('click',()=>{pages.forEach(p=>p.selected=false);render();});
async function exportPages(selectedOnly) { const list=selectedOnly?pages.filter(p=>p.selected):pages; if(!list.length)return setStatus('Select at least one page.',true); window.reportGoogleAdsConversion?.(); try { document.querySelector('#extract').disabled=true; setStatus(ko ? '\uc120\ud0dd\ud55c \ud398\uc774\uc9c0\ub85c PDF\ub97c \ub9cc\ub4dc\ub294 \uc911…' : 'Building your selected PDF…'); const source=await PDFLib.PDFDocument.load(sourceBytes); const out=await PDFLib.PDFDocument.create(); for(const item of list){const [copy]=await out.copyPages(source,[item.source]); const current=copy.getRotation().angle||0; copy.setRotation(PDFLib.degrees((current+item.rotation)%360)); out.addPage(copy);} downloadBytes(await out.save(),`${sourceName}-${selectedOnly?'extracted':'organized'}.pdf`); setStatus(ko ? '\uc120\ud0dd\ud55c \ud398\uc774\uc9c0\uac00 PDF\ub85c \uc900\ube44\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \ub2e4\uc6b4\ub85c\ub4dc\ub97c \ud655\uc778\ud558\uc138\uc694.' : 'Your selected PDF is ready. Check your downloads.'); window.reportToolCompletion?.('pdf-organizer'); } catch(error){console.error(error);setStatus(ko ? '\u0050DF\ub97c \ub9cc\ub4e4 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.' : 'The PDF could not be created.',true);} finally { document.querySelector('#extract').disabled=!pages.some(p=>p.selected); } }
document.querySelector('#extract').addEventListener('click',()=>exportPages(true));
drop.addEventListener('click',()=>picker.click()); picker.addEventListener('change',()=>{const file=picker.files[0];picker.value='';loadFile(file);}); ['dragenter','dragover'].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();drop.classList.add('dragging');})); ['dragleave','drop'].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();drop.classList.remove('dragging');})); drop.addEventListener('drop',e=>loadFile(e.dataTransfer.files[0]));
