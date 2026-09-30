/* Feed synthetic samples through each tool's existing file-selection handler. */
(() => {
  const script = document.querySelector('script[data-sample-tool]');
  if (!script) return;
  const tool = script.dataset.sampleTool;
  const picker = document.querySelector(tool === 'pdf_split' ? '#splitFilePicker' : '#filePicker');
  const drop = document.querySelector(tool === 'pdf_split' ? '#splitDropZone' : '#dropZone');
  if (!picker || !drop || typeof DataTransfer === 'undefined') return;
  const merge = tool === 'index', images = tool === 'images_to_pdf';
  const group = document.createElement('div'); group.className = 'sample-controls';
  const button = document.createElement('button'); button.type = 'button'; button.textContent = 'TRY A SAMPLE';
  const hint = document.createElement('p');
  hint.textContent = merge ? 'Adds two copies of a four-page sample. Merge only these to get eight pages.' : images ? 'Adds a synthetic 1600 × 1000 PNG. No personal file needed.' : 'Loads a four-page practice PDF. This replaces the current document and unsaved edits.';
  const message = document.createElement('p'); message.setAttribute('role', 'status'); message.setAttribute('aria-live', 'polite');
  group.append(button, hint, message); drop.insertAdjacentElement('afterend', group);
  let used = false, userSelected = false, revision = 0;
  picker.addEventListener('change', () => { userSelected = true; revision += 1; });
  drop.addEventListener('drop', () => { userSelected = true; revision += 1; });
  button.addEventListener('click', async () => {
    if (button.disabled || drop.disabled) return;
    if ((userSelected || used) && !window.confirm(merge || images ? 'Add sample files to the current list?' : 'Replace the current document? Unsaved changes will be lost.')) return;
    const currentRevision = revision;
    button.disabled = true; message.textContent = 'Fetching sample…';
    try {
      const response = await fetch(images ? script.dataset.imageSample : script.dataset.pdfSample);
      if (!response.ok) throw new Error('Sample unavailable');
      const blob = await response.blob();
      if (revision !== currentRevision || drop.disabled || document.querySelector('#mergeButton.processing')) {
        message.textContent = 'Sample cancelled because the current task changed. Try again when ready.'; return;
      }
      const files = new DataTransfer();
      const names = merge ? ['sample-first.pdf', 'sample-second.pdf'] : [images ? 'resize-practice.png' : 'practice-packet.pdf'];
      for (const name of names) files.items.add(new File([blob], name, {type: images ? 'image/png' : 'application/pdf', lastModified: 0}));
      picker.files = files.files;
      picker.dispatchEvent(new Event('change', {bubbles: true}));
      used = true; message.textContent = 'Sample passed to the tool. Check the tool status before continuing.';
    } catch (error) {
      message.textContent = 'Could not load the sample. Check your connection and try again, or choose your own file.';
    } finally { button.disabled = false; }
  });
})();
