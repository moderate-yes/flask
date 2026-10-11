(() => {
  "use strict";
  const config = window.BROWSER_ANALYTICS_RELAY || {};
  if (typeof navigator.sendBeacon !== "function" || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(config.endpoint || "")) return;
  const path = window.location.pathname.slice(0, 300);
  let region = "";
  try { region = new Intl.Locale(navigator.language || "").region || ""; } catch (error) { region = ""; }
  const country = /^[A-Z]{2}$/.test(region) ? `EST-${region}` : "UNKNOWN";
  let referrer = "";
  try { referrer = document.referrer ? new URL(document.referrer).hostname : ""; } catch (error) { referrer = ""; }
  const eventId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const body = JSON.stringify({action:"pageview",event_id:eventId,site:config.site || window.location.hostname,country,path,referrer});
  navigator.sendBeacon(config.endpoint, new Blob([body], {type:"text/plain;charset=UTF-8"}));
})();
