const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('static/js/advertising-choice.js', 'utf8');
for (const required of [true, false]) {
  test(`consent prompt: required=${required}`, () => {
    const handlers = {};
    let click;
    const dialog = {
      dataset: {required: String(required)}, open: required, modal: false,
      close() { this.open = false; },
      showModal() { this.open = true; this.modal = true; },
      addEventListener(name, callback) { handlers[name] = callback; },
    };
    vm.runInNewContext(source, {document: {
      getElementById: () => dialog,
      querySelectorAll: () => [{addEventListener(name, callback) { click = callback; }}],
    }});
    assert.equal(dialog.modal, required);
    let prevented = false;
    handlers.cancel({preventDefault() { prevented = true; }});
    assert.equal(prevented, required);
    click();
    assert.equal(dialog.modal, true);
  });
}
