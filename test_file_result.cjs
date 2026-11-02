const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {File} = require('node:buffer');
const source = fs.readFileSync('static/js/file-result.js', 'utf8');

function fixture({ios = true, shareable = true, fail = null} = {}) {
  const elements = {};
  for (const key of ['name', 'hint', 'status', 'share', 'download', 'open']) {
    elements[key] = {hidden:false, disabled:false, textContent:'', clicks:0,
      addEventListener(type, fn) {this.handler = fn;},
      click() {this.clicks++; return this.handler?.();},
      removeAttribute(key) {delete this[key];}};
  }
  const root = {hidden:true, querySelector(selector) {return elements[selector.match(/data-result-(\w+)/)[1]];}};
  const observed = {shares:[], revoked:[]};
  let count = 0;
  const context = {window:{}, File, Blob,
    navigator:{userAgent:ios?'iPhone':'Desktop', platform:ios?'iPhone':'Win32', maxTouchPoints:0,
      canShare:() => shareable,
      share(data) {observed.shares.push(data); return fail ? Promise.reject({name:fail}) : Promise.resolve();}},
    URL:{createObjectURL:() => `blob:output-${++count}`, revokeObjectURL:url => observed.revoked.push(url)}};
  vm.runInNewContext(source, context);
  return {result:context.window.createFileResult(root), elements, root, observed};
}

(async () => {
  const ios = fixture();
  ios.result.show(new Blob(['pdf'], {type:'application/pdf'}), 'merged.pdf');
  assert.equal(ios.elements.download.clicks, 0, 'iPhone must wait for a real tap');
  assert.equal(ios.observed.shares.length, 0, 'do not automatically open sharing');
  assert.equal(ios.root.hidden, false);
  assert.equal(ios.elements.share.hidden, false);
  const action = ios.elements.share.click();
  assert.equal(ios.observed.shares.length, 1, 'share starts synchronously in the click handler');
  await action;
  assert.equal(ios.observed.shares[0].files[0].name, 'merged.pdf');
  assert.equal(ios.observed.shares[0].files[0].type, 'application/pdf');
  assert.match(ios.elements.status.textContent, /If you selected Save to Files/);
  ios.elements.download.click(); ios.elements.download.click();
  assert.equal(ios.elements.download.href, 'blob:output-1');
  assert.equal(ios.observed.revoked.length, 0, 'output remains available for retries');
  ios.result.show(new Blob(['zip'], {type:'application/zip'}), 'sample-split.zip');
  assert.deepEqual(ios.observed.revoked, ['blob:output-1']);
  assert.equal(ios.elements.open.hidden, true);
  await ios.elements.share.click();
  assert.equal(ios.observed.shares[1].files[0].type, 'application/zip');

  const canceled = fixture({fail:'AbortError'});
  canceled.result.show(new Blob(['pdf'], {type:'application/pdf'}), 'cancel.pdf');
  await canceled.elements.share.click();
  assert.match(canceled.elements.status.textContent, /canceled/);
  assert.equal(canceled.elements.download.clicks, 0, 'cancel must not force a download');
  assert.equal(canceled.elements.share.disabled, false);

  const unsupported = fixture({shareable:false});
  unsupported.result.show(new Blob(['pdf'], {type:'application/pdf'}), 'fallback.pdf');
  assert.equal(unsupported.elements.share.hidden, true);
  assert.equal(unsupported.elements.open.hidden, false);
  assert.equal(unsupported.elements.open.href, unsupported.elements.download.href);
  const desktop = fixture({ios:false});
  desktop.result.show(new Blob(['pdf'], {type:'application/pdf'}), 'desktop.pdf');
  assert.equal(desktop.elements.download.clicks, 1);
  desktop.result.clear();
  assert.equal(desktop.root.hidden, true);
  assert.equal(desktop.elements.download.href, undefined);
  console.log('PASS: iPhone explicit save, PDF/ZIP sharing, cancellation, fallback, retry lifetime and desktop download');
})();
