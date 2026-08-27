(() => {
  const launcher = document.querySelector("#toolLauncher");
  const openButton = document.querySelector("[data-tools-open]");
  const closeButton = document.querySelector("[data-tools-close]");
  if (launcher && openButton && closeButton) {
    function openLauncher() {
      openButton.setAttribute("aria-expanded", "true");
      if (typeof launcher.showModal === "function") launcher.showModal();
      else launcher.setAttribute("open", "");
    }

    function closeLauncher() {
      if (typeof launcher.close === "function") launcher.close();
      else launcher.removeAttribute("open");
      openButton.setAttribute("aria-expanded", "false");
    }

    openButton.addEventListener("click", openLauncher);
    closeButton.addEventListener("click", closeLauncher);
    launcher.addEventListener("click", (event) => {
      if (event.target === launcher) closeLauncher();
    });
    launcher.addEventListener("close", () => openButton.setAttribute("aria-expanded", "false"));
  }

  const installButton = document.querySelector("[data-install-app]");
  const installGuide = document.querySelector("#installGuide");
  const guideClose = document.querySelector("[data-install-guide-close]");
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  let installPrompt = null;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {});
    });
  }

  if (!installButton || isStandalone) return;

  if (isIos) installButton.hidden = false;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    installButton.hidden = true;
  });

  installButton.addEventListener("click", async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      installButton.hidden = true;
      return;
    }
    if (installGuide) {
      if (typeof installGuide.showModal === "function") installGuide.showModal();
      else installGuide.setAttribute("open", "");
    }
  });

  if (installGuide && guideClose) {
    guideClose.addEventListener("click", () => {
      if (typeof installGuide.close === "function") installGuide.close();
      else installGuide.removeAttribute("open");
    });
    installGuide.addEventListener("click", (event) => {
      if (event.target === installGuide) guideClose.click();
    });
  }
})();
