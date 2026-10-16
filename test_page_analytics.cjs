const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const sent = [];
const storage = new Map();
let uuid = 0;
const context = {
  Blob,
  URL,
  Intl,
  crypto: { randomUUID: () => `00000000-0000-4000-8000-${String(++uuid).padStart(12, "0")}` },
  document: {
    referrer: "https://www.google.com/search?q=pdf",
    documentElement: { lang: "ko" },
  },
  navigator: {
    language: "ko-KR",
    userAgent: "Mozilla/5.0 (Linux; Android 14; Mobile)",
    userAgentData: { mobile: true },
    sendBeacon(endpoint, body) { sent.push({ endpoint, body }); return true; },
  },
  sessionStorage: {
    getItem(key) { return storage.get(key) || null; },
    setItem(key, value) { storage.set(key, value); },
  },
  window: {
    BROWSER_ANALYTICS_RELAY: {
      endpoint: "https://script.google.com/macros/s/example/exec",
      site: "browserfiletools.net",
    },
    location: { pathname: "/ko/pdf-split", hostname: "browserfiletools.net" },
  },
};

vm.runInNewContext(fs.readFileSync("static/js/page-analytics.js", "utf8"), context);

(async () => {
  assert.equal(sent.length, 1);
  const payload = JSON.parse(await sent[0].body.text());
  assert.equal(payload.path, "/ko/pdf-split");
  assert.equal(payload.source, "google");
  assert.equal(payload.device, "mobile");
  assert.equal(payload.locale, "ko");
  assert.equal(payload.country, "EST-KR");
  assert.equal(payload.landing, true);
  assert.match(payload.session_id, /^[0-9a-f-]{36}$/);
  console.log("page analytics tests passed");
})().catch(error => { console.error(error); process.exitCode = 1; });
