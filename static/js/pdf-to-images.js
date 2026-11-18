const app=document.querySelector('#pdfImageApp'),picker=document.querySelector('#filePicker'),drop=document.querySelector('#dropZone'),workspace=document.querySelector('#workspace'),grid=document.querySelector('#pageGrid'),status=document.querySelector('#status');
const pdfjsReady=import(app.dataset.pdfjs).then(pdfjs=>{pdfjs.GlobalWorkerOptions.workerSrc=app.dataset.worker;return pdfjs;});
const CMAP_URL='/static/vendor/cmaps/';
const STANDARD_FONT_DATA_URL='/static/vendor/standard_fonts/';
let pdf=null,fileBase='pdf';
const setStatus=(m,e=false)=>{status.textContent=m;status.classList.toggle('error',e);};
async function load(file){if(!file)return;const label=drop.querySelector('strong');drop.disabled=true;drop.setAttribute('aria-busy','true');label.textContent='OPENING PDF...';setStatus(`Opening ${file.name} locally…`);try{const [bytes,pdfjs]=await Promise.all([file.arrayBuffer(),pdfjsReady]);pdf=await pdfjs.getDocument({data:bytes,cMapUrl:CMAP_URL,cMapPacked:true,standardFontDataUrl:STANDARD_FONT_DATA_URL}).promise;fileBase=file.name.replace(/\.pdf$/i,'');workspace.hidden=false;grid.replaceChildren();label.textContent=file.name;document.querySelector('#pageRange').placeholder=`All pages (1-${pdf.numPages})`;setStatus(`Creating previews… 0 / ${pdf.numPages}`);for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i),vp=page.getViewport({scale:.25}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;const ctx=c.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,c.width,c.height);await page.render({canvasContext:ctx,viewport:vp}).promise;const li=document.createElement('li');li.className='asset-card';const p=document.createElement('p');p.className='asset-name';p.textContent=`Page ${i}`;li.append(c,p);grid.append(li);setStatus(`Creating previews… ${i} / ${pdf.numPages}`);}setStatus(`${pdf.numPages} page${pdf.numPages===1?'':'s'} ready.`);}catch(e){console.error(e);label.textContent='ADD ONE PDF';setStatus('This PDF could not be opened.',true);}finally{drop.disabled=false;drop.removeAttribute('aria-busy');}}
function pageNumbers(){const raw=document.querySelector('#pageRange').value.trim();if(!raw)return Array.from({length:pdf.numPages},(_,i)=>i+1);const values=new Set();for(const token of raw.split(',')){const part=token.trim();if(/^\d+$/.test(part))values.add(Number(part));else{const m=part.match(/^(\d+)\s*-\s*(\d+)$/);if(!m)throw new Error('Use page numbers like 1-3, 5.');let a=Number(m[1]),b=Number(m[2]);if(a>b)[a,b]=[b,a];for(let i=a;i<=b;i++)values.add(i);}}const nums=[...values].filter(n=>n>=1&&n<=pdf.numPages).sort((a,b)=>a-b);if(!nums.length)throw new Error('No valid pages were selected.');return nums;}
const blobFromCanvas=(c,type,q)=>new Promise(resolve=>c.toBlob(resolve,type,q));
const download = document.querySelector('#download');
const ko = document.documentElement.lang === 'ko';

download.addEventListener('click', async () => {
  if (!pdf || download.disabled) return;
  download.disabled = true;
  const source = pdf;
  const name = fileBase;
  try {
    const pages = pageNumbers();
    const type = document.querySelector('#format').value;
    const scale = Number(document.querySelector('#scale').value);
    const quality = Number(document.querySelector('#quality').value);
    const extension = type === 'image/png' ? 'png' : 'jpg';
    const zip = pages.length > 1 ? new JSZip() : null;
    let output;
    let filename;
    window.reportGoogleAdsConversion?.();
    for (const number of pages) {
      setStatus(ko ? `${number}페이지 변환 중…` : `Rendering page ${number}…`);
      const page = await source.getPage(number);
      const viewport = page.getViewport({scale});
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
      output = await blobFromCanvas(canvas, type, quality);
      canvas.width = canvas.height = 0;
      if (!output || output.type !== type) {
        throw new Error(ko ? '이미지를 만들 수 없습니다.' : 'Could not create the image.');
      }
      const pageName = `page-${String(number).padStart(3, '0')}.${extension}`;
      if (zip) zip.file(pageName, await output.arrayBuffer());
      else filename = `${name}-${pageName}`;
    }
    if (zip) {
      output = await zip.generateAsync({type:'blob'});
      filename = `${name}-images.zip`;
    }
    const url = URL.createObjectURL(output);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    setStatus(ko ? '다운로드를 시작했습니다.' : 'Download requested.');
    window.reportToolCompletion?.('pdf-to-images');
  } catch (error) {
    setStatus(error.message || (ko ? '이미지를 만들 수 없습니다.' : 'Could not create the images.'), true);
  } finally {
    download.disabled = false;
  }
});

document.querySelector('#format').addEventListener('change',e=>document.querySelector('#qualityWrap').hidden=e.target.value!=='image/jpeg');drop.addEventListener('click',()=>picker.click());picker.addEventListener('change',()=>{const file=picker.files[0];picker.value='';load(file);});['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('dragging');}));['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('dragging');}));drop.addEventListener('drop',e=>load(e.dataTransfer.files[0]));
