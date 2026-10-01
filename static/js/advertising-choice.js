(() => {
  const dialog = document.getElementById('advertisingChoice');
  if (!dialog) return;
  const required = dialog.dataset.required === 'true';
  function show() {
    if (dialog.open) dialog.close();
    dialog.showModal();
  }
  dialog.addEventListener('cancel', event => {
    if (required) event.preventDefault();
  });
  document.querySelectorAll('[data-ad-preferences]').forEach(button => {
    button.addEventListener('click', show);
  });
  if (required) show();
})();
