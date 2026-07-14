(() => {
  const launcher = document.querySelector("#toolLauncher");
  const openButton = document.querySelector("[data-tools-open]");
  const closeButton = document.querySelector("[data-tools-close]");
  if (!launcher || !openButton || !closeButton) return;

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
})();
