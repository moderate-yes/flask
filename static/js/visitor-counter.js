(() => {
  const totalElement = document.querySelector("[data-visit-total]");
  const todayElement = document.querySelector("[data-visit-today]");
  if (!totalElement || !todayElement) return;

  function display(counts) {
    totalElement.textContent = Number(counts.total).toLocaleString();
    todayElement.textContent = Number(counts.today).toLocaleString();
  }

  async function requestCounts() {
    // The server decides whether this visit counts (via its own cookie), so
    // the browser does not need to track or claim anything itself.
    const response = await fetch("/api/visits", { method: "POST", cache: "no-store" });
    if (!response.ok) throw new Error("Visitor counter is unavailable.");
    return response.json();
  }

  requestCounts().then(display).catch(() => {
    totalElement.textContent = "—";
    todayElement.textContent = "—";
  });
})();
