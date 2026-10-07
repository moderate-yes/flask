// Set SPREADSHEET_ID and USAGE_SECRET in Project Settings > Script properties.
// Deploy as a web app, executing as the owner. Requests require a signed payload.
const TOOLS = ['pdf-merge','pdf-split','pdf-organizer','pdf-annotations','pdf-to-images','images-to-pdf','image-toolkit','image-transform','file-hash','qr-generator'];

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() { return json_({ok:false}); }
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    if (!e.postData || e.postData.contents.length > 4096) return json_({ok:false});
    const input=JSON.parse(e.postData.contents);
    const props=PropertiesService.getScriptProperties();
    const secret=props.getProperty('USAGE_SECRET');
    if (!secret || secret.length<32 || typeof input.payload!=='string') return json_({ok:false});
    const expected=Utilities.computeHmacSha256Signature(input.payload,secret,Utilities.Charset.UTF_8)
      .map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');
    if (typeof input.signature!=='string' || input.signature.length!==expected.length) return json_({ok:false});
    let mismatch=0; for(let i=0;i<expected.length;i++) mismatch|=expected.charCodeAt(i)^input.signature.charCodeAt(i);
    if (mismatch) return json_({ok:false});
    const data=JSON.parse(input.payload);
    if (!Number.isInteger(data.timestamp) || Math.abs(Date.now()/1000-data.timestamp)>300) return json_({ok:false});
    if (!['snapshot','event'].includes(data.action)) return json_({ok:false});
    if (data.action==='event' && (!/^[0-9a-f-]{36}$/.test(data.event_id) || !['visit','job'].includes(data.kind)
        || (data.kind==='job' && !TOOLS.includes(data.tool)))) return json_({ok:false});
    lock.waitLock(10000);
    const book=SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'));
    const summary=book.getSheetByName('Summary'), daily=book.getSheetByName('Daily'), receipts=book.getSheetByName('Receipts');
    if (!summary || !daily || !receipts) throw new Error('Missing statistics sheets');
    const startValue=summary.getRange('B4').getValue();
    let started=startValue instanceof Date ? Utilities.formatDate(startValue,'Asia/Seoul','yyyy-MM-dd') : String(startValue);
    if (!started) {
      started=Utilities.formatDate(new Date(),'Asia/Seoul','yyyy-MM-dd');
      book.setSpreadsheetTimeZone('Asia/Seoul');
      summary.getRange('B4').setNumberFormat('@');
      summary.getRange('B4:B6').setValues([[started],['Active'],['Asia/Seoul']]);
      receipts.getRange('A1:F1').setValues([['Event ID','Received at','Kind','Tool','Visit sessions','Completed jobs']]);
    }
    let last=receipts.getLastRow();
    let counts=last>1 ? receipts.getRange(last,5,1,2).getValues()[0] : [0,0];
    if (data.action==='event') {
      const existing=last>1 ? receipts.getRange(2,1,last-1,1).createTextFinder(data.event_id).matchEntireCell(true).findNext() : null;
      if (!existing) {
        counts=[Number(counts[0])+(data.kind==='visit'?1:0), Number(counts[1])+(data.kind==='job'?1:0)];
        // This single ledger row is authoritative. Derived views can be rebuilt.
        receipts.appendRow([data.event_id,new Date().toISOString(),data.kind,data.tool||'',counts[0],counts[1]]);
        SpreadsheetApp.flush();
        last++;
      }
    }
    summary.getRange('B2:B3').setValues([[counts[0]],[counts[1]]]);
    // Rebuild the daily view from the authoritative ledger after any event retry.
    if (data.action==='event' && last>1) {
      const groups={};
      receipts.getRange(2,1,last-1,4).getValues().forEach(row=>{
        const day=Utilities.formatDate(new Date(row[1]),'Asia/Seoul','yyyy-MM-dd');
        const tool=String(row[3]||'site'), key=day+'|'+tool;
        if(!groups[key]) groups[key]=[day,tool,0,0];
        groups[key][row[2]==='visit'?2:3]++;
      });
      const rows=Object.keys(groups).sort().map(key=>groups[key]);
      daily.getRange(2,1,rows.length,4).setValues(rows);
    }
    return json_({ok:true,visits:Number(counts[0]),jobs:Number(counts[1]),started});
  } catch(error) {
    // Do not log request bodies or authentication material.
    return json_({ok:false});
  } finally { if(lock.hasLock()) lock.releaseLock(); }
}
