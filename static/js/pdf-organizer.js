const app = document.querySelector('#organizerApp');
const picker = document.querySelector('#filePicker');
const drop = document.querySelector('#dropZone');
const workspace = document.querySelector('#workspace');
const grid = document.querySelector('#pageGrid');
const status = document.querySelector('#status');
let sourceBytes = null;
let sourceName = 'organized.pdf';
let pdf = null;
let pages = [];

const pdfjs = await import(app.dataset.pdfjs);
pdfjs.GlobalWorkerOptions.workerSrc = app.dataset.worker;
const setStatus = (message, error = false) => { status.textContent = message; status.classList.toggle('error', error); };
const downloadBytes = (bytes, name) => { const url = URL.createObjectURL(new Blob([bytes], {type:'application/pdf'})); const a = document.createElement('a'); a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url), 1000); };

async function loadFile(file) {
  if (!file || (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf')) return setStatus('Choose a valid PDF file.', true);
  try {
    sourceBytes = await file.arrayBuffer(); sourceName = file.name.replace(/\.pdf$/i,'');
    pdf = await pdfjs.getDocument({data: sourceBytes.slice(0)}).promise;
    pages = Array.from({length: pdf.numPages}, (_, index) => ({source:index, rotation:0, selected:false}));
    workspace.hidden = false; drop.querySelector('strong').textContent = file.name; await render();
  } catch (error) { console.error(error); setStatus('This PDF could not be opened. It may be encrypted or damaged.', true); }
}

async function render() {
  grid.replaceChildren(); setStatus(`${pages.length} page${pages.length===1?'':'s'} ready. Drag cards to reorder.`);
  for (let index=0; index<pages.length; index += 1) {
    const item = pages[index]; const li = document.createElement('li'); li.className=`asset-card${item.selected?' selected':''}`; li.draggable=true; li.dataset.index=index;
    const canvas=document.createElement('canvas'); const sourcePage=await pdf.getPage(item.source+1); const viewport=sourcePage.getViewport({scale:.42, rotation:(sourcePage.rotate+item.rotation)%360}); canvas.width=viewport.width; canvas.height=viewport.height; await sourcePage.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
    const meta=document.createElement('p'); meta.className='asset-name'; meta.textContent=`Page ${item.source+1}`;
    const detail=document.createElement('p'); detail.className='asset-meta'; detail.textContent=`POSITION ${index+1} · ROTATE ${item.rotation}°`;
    const actions=document.createElement('div'); actions.className='asset-actions';
    [['←','left'],['↻','rotate'],['×','remove']].forEach(([label,action])=>{const b=document.createElement('button'); b.type='button'; b.textContent=label; b.dataset.action=action; b.disabled=action==='left'&&index===0; actions.append(b);});
    li.append(canvas,meta,detail,actions); li.addEventListener('click', e=>{if(e.target.closest('button')) return; item.selected=!item.selected; render();}); grid.append(li);
  }
}

grid.addEventListener('click', e=>{const b=e.target.closest('button'); if(!b)return; const i=Number(b.closest('li').dataset.index); if(b.dataset.action==='left'&&i){[pages[i-1],pages[i]]=[pages[i],pages[i-1]];} if(b.dataset.action==='rotate')pages[i].rotation=(pages[i].rotation+90)%360; if(b.dataset.action==='remove')pages.splice(i,1); render();});
let dragIndex=null; grid.addEventListener('dragstart',e=>{const li=e.target.closest('li'); if(li)dragIndex=Number(li.dataset.index);}); grid.addEventListener('dragover',e=>e.preventDefault()); grid.addEventListener('drop',e=>{e.preventDefault(); const li=e.target.closest('li'); if(!li||dragIndex===null)return; const target=Number(li.dataset.index); const [moved]=pages.splice(dragIndex,1); pages.splice(target,0,moved); dragIndex=null; render();});
document.querySelector('#selectAll').addEventListener('click',()=>{pages.forEach(p=>p.selected=true);render();});
document.querySelector('#clearAll').addEventListener('click',()=>{pages.forEach(p=>p.selected=false);render();});
async function exportPages(selectedOnly) { const list=selectedOnly?pages.filter(p=>p.selected):pages; if(!list.length)return setStatus('Select at least one page.',true); try { setStatus('Building your PDF…'); const source=await PDFLib.PDFDocument.load(sourceBytes); const out=await PDFLib.PDFDocument.create(); for(const item of list){const [copy]=await out.copyPages(source,[item.source]); const current=copy.getRotation().angle||0; copy.setRotation(PDFLib.degrees((current+item.rotation)%360)); out.addPage(copy);} downloadBytes(await out.save(),`${sourceName}-${selectedOnly?'extracted':'organized'}.pdf`); setStatus('Your PDF has been downloaded.'); } catch(error){console.error(error);setStatus('The PDF could not be created.',true);} }
document.querySelector('#saveAll').addEventListener('click',()=>exportPages(false)); document.querySelector('#extract').addEventListener('click',()=>exportPages(true));
drop.addEventListener('click',()=>picker.click()); picker.addEventListener('change',()=>loadFile(picker.files[0])); ['dragenter','dragover'].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();drop.classList.add('dragging');})); ['dragleave','drop'].forEach(type=>drop.addEventListener(type,e=>{e.preventDefault();drop.classList.remove('dragging');})); drop.addEventListener('drop',e=>loadFile(e.dataTransfer.files[0]));
