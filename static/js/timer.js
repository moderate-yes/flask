(() => {
  const STORAGE_KEY = "ontime-timer-v1";
  const elements = {
    minutes: document.querySelector("#minutes"),
    seconds: document.querySelector("#seconds"),
    clock: document.querySelector("#clock"),
    ring: document.querySelector("#progressRing"),
    start: document.querySelector("#startButton"),
    startLabel: document.querySelector("#startLabel"),
    playIcon: document.querySelector(".play-icon"),
    reset: document.querySelector("#resetButton"),
    presets: [...document.querySelectorAll("[data-minutes]")],
    customTrigger: document.querySelector("#customTrigger"),
    customForm: document.querySelector("#customForm"),
    customMinutes: document.querySelector("#customMinutes"),
    sound: document.querySelector("#soundToggle"),
    soundLabel: document.querySelector("#soundLabel"),
    toast: document.querySelector("#toast")
  };

  let state = {
    duration: 25 * 60,
    remaining: 25 * 60,
    running: false,
    endsAt: null,
    sound: true
  };
  let intervalId = null;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !Number.isFinite(saved.duration) || saved.duration < 60) return;
      state = { ...state, ...saved };
      if (state.running && state.endsAt) {
        state.remaining = Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));
        if (state.remaining === 0) state.running = false;
      }
    } catch (_) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function setPresetActive() {
    const minutes = state.duration / 60;
    elements.presets.forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.minutes) === minutes);
    });
  }

  function render() {
    const minutes = Math.floor(state.remaining / 60);
    const seconds = state.remaining % 60;
    elements.minutes.textContent = String(minutes).padStart(2, "0");
    elements.seconds.textContent = String(seconds).padStart(2, "0");
    elements.clock.setAttribute("aria-label", `${minutes} minutes and ${seconds} seconds remaining`);
    const elapsedRatio = state.duration ? (state.duration - state.remaining) / state.duration : 0;
    elements.ring.style.setProperty("--progress", `${Math.max(0, Math.min(1, elapsedRatio)) * 360}deg`);
    elements.startLabel.textContent = state.running ? "PAUSE" : state.remaining === 0 ? "START AGAIN" : "START FOCUS";
    elements.playIcon.textContent = state.running ? "Ⅱ" : "▶";
    document.body.classList.toggle("paused", !state.running);
    document.title = state.running ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} — Browser Tools` : "Focus Timer — Browser Tools";
    setPresetActive();
  }

  function beep() {
    if (!state.sound) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    [0, 0.2, 0.4].forEach((delay, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 520 + index * 80;
      gain.gain.setValueAtTime(0.0001, context.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + 0.14);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(context.currentTime + delay);
      oscillator.stop(context.currentTime + delay + 0.15);
    });
  }

  function finish() {
    clearInterval(intervalId);
    intervalId = null;
    state.running = false;
    state.endsAt = null;
    state.remaining = 0;
    saveState();
    render();
    beep();
    elements.toast.classList.add("show");
    setTimeout(() => elements.toast.classList.remove("show"), 4000);
  }

  function tick() {
    state.remaining = Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));
    if (state.remaining === 0) finish();
    else render();
  }

  function startInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(tick, 250);
  }

  function toggleTimer() {
    if (state.running) {
      state.remaining = Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));
      state.running = false;
      state.endsAt = null;
      clearInterval(intervalId);
      intervalId = null;
    } else {
      if (state.remaining === 0) state.remaining = state.duration;
      state.running = true;
      state.endsAt = Date.now() + state.remaining * 1000;
      startInterval();
    }
    saveState();
    render();
  }

  function setDuration(minutes) {
    clearInterval(intervalId);
    intervalId = null;
    state.duration = minutes * 60;
    state.remaining = state.duration;
    state.running = false;
    state.endsAt = null;
    saveState();
    render();
  }

  function resetTimer() {
    clearInterval(intervalId);
    intervalId = null;
    state.remaining = state.duration;
    state.running = false;
    state.endsAt = null;
    saveState();
    render();
  }

  elements.start.addEventListener("click", toggleTimer);
  elements.reset.addEventListener("click", resetTimer);
  elements.presets.forEach((button) => button.addEventListener("click", () => setDuration(Number(button.dataset.minutes))));
  elements.customTrigger.addEventListener("click", () => {
    elements.customForm.hidden = !elements.customForm.hidden;
    if (!elements.customForm.hidden) elements.customMinutes.focus();
  });
  elements.customForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const minutes = Math.min(180, Math.max(1, Number(elements.customMinutes.value) || 1));
    elements.customMinutes.value = minutes;
    elements.customForm.hidden = true;
    setDuration(minutes);
  });
  elements.sound.addEventListener("click", () => {
    state.sound = !state.sound;
    elements.sound.setAttribute("aria-pressed", String(state.sound));
    elements.sound.setAttribute("aria-label", state.sound ? "Completion sound on" : "Completion sound off");
    elements.soundLabel.textContent = state.sound ? "Sound on" : "Sound off";
    saveState();
  });
  document.addEventListener("keydown", (event) => {
    if (event.target.matches("input, button")) return;
    if (event.code === "Space") {
      event.preventDefault();
      toggleTimer();
    }
    if (event.key.toLowerCase() === "r") resetTimer();
  });

  loadState();
  elements.sound.setAttribute("aria-pressed", String(state.sound));
  elements.soundLabel.textContent = state.sound ? "Sound on" : "Sound off";
  if (state.running) startInterval();
  render();
})();
