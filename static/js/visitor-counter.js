(() => {
  const totalElement = document.querySelector("[data-visit-total]");
  const todayElement = document.querySelector("[data-visit-today]");
  if (!totalElement || !todayElement) return;

  const totalKey = "browser-tools-counted-total";
  const dayKey = "browser-tools-counted-day";

  function readStorage(key) {
    try {
      return { available: true, value: window.localStorage.getItem(key) };
    } catch (_error) {
      return { available: false, value: null };
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_error) {
      // The counter still displays when browser storage is unavailable.
    }
  }

  function display(counts) {
    totalElement.textContent = Number(counts.total).toLocaleString();
    todayElement.textContent = Number(counts.today).toLocaleString();
  }

  async function requestCounts() {
    const currentResponse = await fetch("/api/visits", { cache: "no-store" });
    if (!currentResponse.ok) throw new Error("Visitor counter is unavailable.");
    const current = await currentResponse.json();

    const totalState = readStorage(totalKey);
    const dayState = readStorage(dayKey);
    const canMarkVisit = totalState.available && dayState.available;
    const countTotal = canMarkVisit && totalState.value !== "1";
    const countToday = canMarkVisit && dayState.value !== current.date;

    if (!countTotal && !countToday) return current;

    const updateResponse = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countTotal, countToday })
    });
    if (!updateResponse.ok) throw new Error("Visitor counter could not be updated.");
    const updated = await updateResponse.json();
    if (countTotal) writeStorage(totalKey, "1");
    if (countToday) writeStorage(dayKey, updated.date);
    return updated;
  }

  requestCounts().then(display).catch(() => {
    totalElement.textContent = "—";
    todayElement.textContent = "—";
  });
})();
