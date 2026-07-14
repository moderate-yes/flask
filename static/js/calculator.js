(() => {
  const app = document.querySelector("#calculatorApp");
  if (!app) return;

  const resultBox = app.querySelector(".calculator-result");
  const resultLabel = app.querySelector("#resultLabel");
  const resultOutput = app.querySelector("#calculationResult");
  const details = app.querySelector("#calculationDetails");
  const copyButton = app.querySelector("#copyCalculation");
  let mode = "basic";
  let percentMode = "of";
  let copyValue = "";

  const defaults = {
    basic: { basicA: "1250", basicOperator: "add", basicB: "250" },
    percent: { percentRate: "15", percentValue: "240", percentFrom: "80", percentTo: "100" },
    discount: { originalPrice: "120", discountRate: "20", taxRate: "8" },
    tip: { billAmount: "86.50", tipRate: "18", peopleCount: "2" },
  };

  const value = (id) => Number(app.querySelector(`#${id}`).value);
  const finiteInputs = (...ids) => ids.every((id) => Number.isFinite(value(id)));
  const format = (number, digits = 6) => new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(number);
  const money = (number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(number);

  function show(label, primary, explanation) {
    resultBox.classList.remove("error");
    resultLabel.textContent = label;
    resultOutput.textContent = primary;
    resultOutput.value = primary;
    details.textContent = explanation;
    copyValue = `${label}: ${primary}\n${explanation}`;
    copyButton.disabled = false;
  }

  function error(message) {
    resultBox.classList.add("error");
    resultLabel.textContent = "CHECK INPUT";
    resultOutput.textContent = "—";
    resultOutput.value = "—";
    details.textContent = message;
    copyValue = "";
    copyButton.disabled = true;
  }

  function calculateBasic() {
    if (!finiteInputs("basicA", "basicB")) return error("Enter two valid numbers.");
    const a = value("basicA");
    const b = value("basicB");
    const operator = app.querySelector("#basicOperator").value;
    const symbols = { add: "+", subtract: "−", multiply: "×", divide: "÷" };
    if (operator === "divide" && b === 0) return error("A number cannot be divided by zero.");
    const operations = { add: a + b, subtract: a - b, multiply: a * b, divide: a / b };
    const answer = operations[operator];
    show("RESULT", format(answer), `${format(a)} ${symbols[operator]} ${format(b)} = ${format(answer)}`);
  }

  function calculatePercent() {
    if (percentMode === "of") {
      if (!finiteInputs("percentRate", "percentValue")) return error("Enter a valid percentage and number.");
      const rate = value("percentRate");
      const base = value("percentValue");
      const answer = rate / 100 * base;
      show("PERCENTAGE RESULT", format(answer), `${format(rate)}% of ${format(base)} = ${format(answer)}`);
      return;
    }
    if (!finiteInputs("percentFrom", "percentTo")) return error("Enter a valid starting and new value.");
    const from = value("percentFrom");
    const to = value("percentTo");
    if (from === 0) return error("Percentage change needs a non-zero starting value.");
    const answer = (to - from) / Math.abs(from) * 100;
    const direction = answer > 0 ? "increase" : answer < 0 ? "decrease" : "no change";
    show("PERCENTAGE CHANGE", `${format(Math.abs(answer))}%`, `${format(from)} → ${format(to)} · ${direction}`);
  }

  function calculateDiscount() {
    if (!finiteInputs("originalPrice", "discountRate", "taxRate")) return error("Enter valid price, discount, and tax values.");
    const original = value("originalPrice");
    const discount = value("discountRate");
    const tax = value("taxRate");
    if (original < 0 || discount < 0 || tax < 0) return error("Price, discount, and tax cannot be negative.");
    if (discount > 100) return error("Discount must be between 0% and 100%.");
    const savings = original * discount / 100;
    const subtotal = original - savings;
    const taxAmount = subtotal * tax / 100;
    const total = subtotal + taxAmount;
    show("FINAL PRICE", money(total), `SAVE ${money(savings)} · TAX ${money(taxAmount)} · SUBTOTAL ${money(subtotal)}`);
  }

  function calculateTip() {
    if (!finiteInputs("billAmount", "tipRate", "peopleCount")) return error("Enter valid bill, tip, and people values.");
    const bill = value("billAmount");
    const rate = value("tipRate");
    const people = value("peopleCount");
    if (bill < 0 || rate < 0 || people < 1 || !Number.isInteger(people)) return error("Use non-negative amounts and a whole number of at least one person.");
    const tip = bill * rate / 100;
    const total = bill + tip;
    const each = total / people;
    show("PER PERSON", money(each), `TIP ${money(tip)} · TOTAL ${money(total)} · ${people} ${people === 1 ? "PERSON" : "PEOPLE"}`);
  }

  function calculate() {
    ({ basic: calculateBasic, percent: calculatePercent, discount: calculateDiscount, tip: calculateTip })[mode]();
  }

  app.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => {
    mode = button.dataset.mode;
    app.querySelectorAll("[data-mode]").forEach((tab) => {
      const active = tab === button;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    app.querySelectorAll("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== mode; });
    calculate();
  }));

  app.querySelectorAll("[data-percent-mode]").forEach((button) => button.addEventListener("click", () => {
    percentMode = button.dataset.percentMode;
    app.querySelectorAll("[data-percent-mode]").forEach((item) => item.classList.toggle("active", item === button));
    app.querySelector("#percentOfFields").hidden = percentMode !== "of";
    app.querySelector("#percentChangeFields").hidden = percentMode !== "change";
    app.querySelector("#percentFormula").textContent = percentMode === "of" ? "FORMULA / PERCENT ÷ 100 × NUMBER" : "FORMULA / (NEW − START) ÷ |START| × 100";
    calculate();
  }));

  app.querySelector(".calculator-panels").addEventListener("input", calculate);
  app.querySelector(".calculator-panels").addEventListener("change", calculate);
  app.querySelector("#resetCalculator").addEventListener("click", () => {
    Object.entries(defaults[mode]).forEach(([id, setting]) => { app.querySelector(`#${id}`).value = setting; });
    calculate();
  });
  copyButton.addEventListener("click", async () => {
    if (!copyValue) return;
    await navigator.clipboard.writeText(copyValue);
    copyButton.textContent = "COPIED";
    setTimeout(() => { copyButton.textContent = "COPY"; }, 1200);
  });

  calculate();
})();
