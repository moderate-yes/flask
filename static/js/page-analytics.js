(() => {
  "use strict";
  if (["localhost", "127.0.0.1", "::1", "[::1]"].includes(window.location.hostname)) return;
  const config = window.BROWSER_ANALYTICS_RELAY || {};
  if (typeof navigator.sendBeacon !== "function" || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(config.endpoint || "")) return;
  const path = window.location.pathname.slice(0, 300);
  const newId = () => typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const reportedCountry = document.querySelector('meta[name="visitor-country"]')?.content || "";
  const country = /^[A-Z]{2}$/.test(reportedCountry) && reportedCountry !== "XX" ? reportedCountry : "UNKNOWN";
  let referrer = "";
  try { referrer = document.referrer ? new URL(document.referrer).hostname : ""; } catch (error) { referrer = ""; }
  if (["localhost", "127.0.0.1", "::1", "[::1]"].includes(referrer)) return;
  const host = window.location.hostname.replace(/^www\./, "");
  const normalizedReferrer = referrer.replace(/^www\./, "");
  const source = !normalizedReferrer ? "direct" : normalizedReferrer === host ? "internal" : /(^|\.)google\./.test(normalizedReferrer) ? "google" : /(^|\.)naver\.com$/.test(normalizedReferrer) ? "naver" : /(^|\.)bing\.com$/.test(normalizedReferrer) ? "bing" : "referral";
  const userAgent = navigator.userAgent || "";
  const device = /iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent) ? "tablet" : navigator.userAgentData?.mobile || /Mobile|iPhone|iPod/i.test(userAgent) ? "mobile" : "desktop";
  let sessionId = "";
  let landing = true;
  try {
    sessionId = sessionStorage.getItem("bt_analytics_session") || newId();
    landing = !sessionStorage.getItem("bt_analytics_seen");
    sessionStorage.setItem("bt_analytics_session", sessionId);
    sessionStorage.setItem("bt_analytics_seen", "1");
  } catch (error) { sessionId = newId(); }
  const body = JSON.stringify({
    action: "pageview",
    event_id: newId(),
    site: config.site || window.location.hostname,
    country,
    path,
    referrer,
    source,
    device,
    locale: (document.documentElement.lang || navigator.language || "").slice(0, 20),
    session_id: sessionId,
    landing,
  });
  navigator.sendBeacon(config.endpoint, new Blob([body], {type:"text/plain;charset=UTF-8"}));
})();
