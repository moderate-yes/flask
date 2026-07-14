(() => {
  const input = document.querySelector("#numberInput");
  const inputLabel = document.querySelector("#inputLabel");
  const resultLabel = document.querySelector("#resultLabel");
  const result = document.querySelector("#numberResult");
  const primary = document.querySelector("#resultPrimary");
  const exact = document.querySelector("#resultExact");
  const copy = document.querySelector("#copyResult");
  const examples = document.querySelector("#exampleRow");
  let direction = "us-to-kr";
  let lastOutput = "";
  let conversionTimer = null;

  const usUnits = {
    thousand: 1e3, k: 1e3, "사우전드": 1e3,
    million: 1e6, m: 1e6, "밀리언": 1e6, "밀리온": 1e6,
    billion: 1e9, b: 1e9, "빌리언": 1e9, "빌리온": 1e9,
    trillion: 1e12, t: 1e12, "트릴리언": 1e12, "트릴리온": 1e12,
    quadrillion: 1e15, q: 1e15, "쿼드릴리언": 1e15, "콰드릴리언": 1e15
  };

  function cleanNumber(value) {
    return value.replace(/[,$₩￦]/g, "").trim();
  }

  function parseUs(value) {
    const source = cleanNumber(value).toLowerCase();
    if (/^[+-]?\d+(?:\.\d+)?$/.test(source)) return Number(source);
    const pattern = /([+-]?\d+(?:\.\d+)?)\s*(quadrillion|trillion|billion|million|thousand|쿼드릴리언|콰드릴리언|트릴리언|트릴리온|빌리언|빌리온|밀리언|밀리온|사우전드|q|t|b|m|k)(?![a-z가-힣])/gi;
    let total = 0;
    let matches = 0;
    for (const match of source.matchAll(pattern)) {
      total += Number(match[1]) * usUnits[match[2].toLowerCase()];
      matches += 1;
    }
    const leftover = source.replace(pattern, "").replace(/[+\s]/g, "");
    if (!matches || leftover) throw new Error("Use units such as billion, B, or 빌리언.");
    return total;
  }

  function parseKoreanSection(value) {
    let source = value.trim().replace(/[영공]/g, "0").replace(/일/g, "1").replace(/이/g, "2").replace(/삼/g, "3").replace(/사/g, "4").replace(/오/g, "5").replace(/육/g, "6").replace(/칠/g, "7").replace(/팔/g, "8").replace(/구/g, "9");
    if (!source) return 1;
    if (/^\d+(?:\.\d+)?$/.test(source)) return Number(source);
    let total = 0;
    for (const [unit, multiplier] of [["천", 1000], ["백", 100], ["십", 10]]) {
      const index = source.indexOf(unit);
      if (index < 0) continue;
      const coefficient = source.slice(0, index);
      if (coefficient && !/^\d+(?:\.\d+)?$/.test(coefficient)) throw new Error("Invalid Korean number section.");
      total += (coefficient ? Number(coefficient) : 1) * multiplier;
      source = source.slice(index + 1);
    }
    if (source) {
      if (!/^\d+(?:\.\d+)?$/.test(source)) throw new Error("Invalid Korean number section.");
      total += Number(source);
    }
    return total;
  }

  function parseKorean(value) {
    let source = cleanNumber(value).replace(/원/g, "").replace(/\s/g, "");
    if (/^[+-]?\d+(?:\.\d+)?$/.test(source)) return Number(source);
    const negative = source.startsWith("-");
    if (negative) source = source.slice(1);
    let total = 0;
    let found = false;
    for (const [unit, multiplier] of [["경", 1e16], ["조", 1e12], ["억", 1e8], ["만", 1e4]]) {
      const index = source.indexOf(unit);
      if (index < 0) continue;
      total += parseKoreanSection(source.slice(0, index)) * multiplier;
      source = source.slice(index + 1);
      found = true;
    }
    if (source) total += parseKoreanSection(source);
    if (!found && !total) throw new Error("Use Korean units such as 만, 억, 조, or 경.");
    return negative ? -total : total;
  }

  function tidy(value, digits = 6) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);
  }

  function formatKorean(value) {
    if (!Number.isFinite(value)) throw new Error("The number is too large.");
    const sign = value < 0 ? "-" : "";
    const absolute = Math.abs(value);
    if (absolute < 10000 || !Number.isInteger(absolute)) return `${sign}${tidy(absolute)}`;
    const units = ["", "만", "억", "조", "경"];
    const parts = [];
    for (let index = units.length - 1; index >= 0; index -= 1) {
      const divisor = 10 ** (index * 4);
      const group = Math.floor(absolute / divisor) % 10000;
      if (group) parts.push(`${tidy(group, 0)}${units[index]}`);
    }
    return `${sign}${parts.join(" ") || "0"}`;
  }

  function formatUs(value) {
    if (!Number.isFinite(value)) throw new Error("The number is too large.");
    const absolute = Math.abs(value);
    const units = [[1e15, "quadrillion"], [1e12, "trillion"], [1e9, "billion"], [1e6, "million"], [1e3, "thousand"]];
    const selected = units.find(([multiplier]) => absolute >= multiplier);
    if (!selected) return tidy(value);
    return `${tidy(value / selected[0])} ${selected[1]}`;
  }

  function showError(message) {
    result.classList.add("error");
    primary.value = "CHECK INPUT";
    primary.textContent = "CHECK INPUT";
    exact.textContent = message;
    lastOutput = "";
    copy.disabled = true;
  }

  function showWaiting() {
    result.classList.remove("error");
    primary.value = "—";
    primary.textContent = "—";
    exact.textContent = input.value.trim() ? "Waiting for a complete number expression…" : "Enter a number. The result updates automatically.";
    lastOutput = "";
    copy.disabled = true;
  }

  function convert({ silent = false } = {}) {
    if (!input.value.trim()) { showWaiting(); return false; }
    try {
      const value = direction === "us-to-kr" ? parseUs(input.value) : parseKorean(input.value);
      const formatted = direction === "us-to-kr" ? formatKorean(value) : formatUs(value);
      result.classList.remove("error");
      primary.value = formatted;
      primary.textContent = formatted;
      exact.textContent = `EXACT VALUE / ${tidy(value)}`;
      lastOutput = formatted;
      copy.disabled = false;
      return true;
    } catch (error) {
      if (silent) showWaiting();
      else showError(error.message);
      return false;
    }
  }

  function setDirection(next) {
    if (next === direction) return;
    const previousOutput = lastOutput;
    direction = next;
    document.querySelectorAll("[data-direction]").forEach((button) => {
      const active = button.dataset.direction === direction;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const koreanInput = direction === "kr-to-us";
    inputLabel.textContent = koreanInput ? "KOREAN NUMBER" : "AMERICAN NUMBER";
    resultLabel.textContent = koreanInput ? "AMERICAN NUMBER" : "KOREAN NUMBER";
    input.placeholder = koreanInput ? "12억 5,000만" : "1.25 billion";
    examples.innerHTML = koreanInput
      ? '<span>TRY</span><button type="button" data-example="240만">240만</button><button type="button" data-example="12억 5,000만">12억 5,000만</button><button type="button" data-example="45억 6천만">45억 6천만</button><button type="button" data-example="1조 2,300억">1조 2,300억</button>'
      : '<span>TRY</span><button type="button" data-example="1.1빌리언">1.1빌리언</button><button type="button" data-example="850K">850K</button><button type="button" data-example="6.2밀리언">6.2밀리언</button><button type="button" data-example="3.75 trillion">3.75 TRILLION</button>';
    input.value = previousOutput;
    lastOutput = "";
    copy.disabled = true;
    if (input.value) convert();
    else showWaiting();
  }

  document.querySelectorAll("[data-direction]").forEach((button) => button.addEventListener("click", () => setDirection(button.dataset.direction)));
  examples.addEventListener("click", (event) => {
    const button = event.target.closest("[data-example]");
    if (!button) return;
    input.value = button.dataset.example;
    convert();
  });
  document.querySelector("#convertButton").addEventListener("click", () => convert());
  input.addEventListener("input", () => {
    clearTimeout(conversionTimer);
    showWaiting();
    if (!input.value.trim()) return;
    conversionTimer = setTimeout(() => convert({ silent: true }), 280);
  });
  input.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      clearTimeout(conversionTimer);
      convert();
    }
  });
  copy.addEventListener("click", async () => {
    if (!lastOutput) return;
    await navigator.clipboard.writeText(lastOutput);
    copy.textContent = "COPIED";
    setTimeout(() => { copy.textContent = "COPY"; }, 1200);
  });
})();
