(() => {
  const boxes = [...document.querySelectorAll('[data-usage-stats]')];
  if (!boxes.length) return;
  const formatter = new Intl.NumberFormat('en-US');
  const display = data => {
    if (!data.available) return;
    for (const box of boxes) {
      box.querySelector('[data-usage-visits]').textContent = formatter.format(data.visits);
      box.querySelector('[data-usage-jobs]').textContent = formatter.format(data.jobs);
      box.querySelector('[data-usage-since]').textContent = `Since ${data.started} · Visits include returning sessions.`;
    }
  };
  async function getCounts() {
    const response = await fetch('/api/usage', {cache:'no-store'});
    if (!response.ok) throw new Error('Statistics unavailable');
    const data = await response.json(); display(data); return data;
  }
  async function send(event) {
    await initialized.catch(() => getCounts());
    let response = await fetch('/api/usage', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(event), keepalive:true});
    if (response.status===409) {
      await getCounts();
      if (event.kind==='job') await send({kind:'visit'});
      response=await fetch('/api/usage', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event)});
    }
    if (!response.ok) throw new Error('Statistics unavailable');
    display(await response.json());
  }
  const initialized=getCounts();
  initialized.then(()=>send({kind:'visit'})).catch(()=>{});
  window.reportToolCompletion = tool => {
    const event={kind:'job',tool,event_id:crypto.randomUUID()};
    // Retry the same ID: the Google ledger deduplicates acknowledged writes.
    const deliver = attempt => send(event).catch(() => {
      if (attempt < 2) setTimeout(() => deliver(attempt + 1), 1500 * (attempt + 1));
    });
    deliver(0);
  };
})();
