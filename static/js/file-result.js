(() => {
  // Keep the local output alive until it is replaced, not just for one second.
  // The website cannot confirm the browser's final save location or completion.
  window.createFileResult = root => {
    const nameLabel = root.querySelector('[data-result-name]');
    const hint = root.querySelector('[data-result-hint]');
    const message = root.querySelector('[data-result-status]');
    const share = root.querySelector('[data-result-share]');
    const download = root.querySelector('[data-result-download]');
    const open = root.querySelector('[data-result-open]');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    let url = null;
    let file = null;

    function clear() {
      if (url) URL.revokeObjectURL(url);
      url = null;
      file = null;
      root.hidden = true;
      share.disabled = false;
      share.hidden = true;
      download.removeAttribute('href');
      open.removeAttribute('href');
      open.hidden = true;
      message.textContent = '';
    }

    download.addEventListener('click', () => {
      if (!url) return;
      download.textContent = 'DOWNLOAD AGAIN';
      message.textContent = 'Download requested. Check your browser downloads or the Files app; this site cannot confirm that the file was saved.';
    });
    open.addEventListener('click', () => {
      message.textContent = 'In the PDF preview, use Share → Save to Files to choose a folder.';
    });
    share.addEventListener('click', async () => {
      const selectedFile = file;
      if (!selectedFile || share.disabled) return;
      share.disabled = true;
      try {
        // Called directly from this click, before any asynchronous preparation.
        await navigator.share({files: [selectedFile]});
        if (file === selectedFile) message.textContent = 'Sharing finished. If you selected Save to Files, check the folder you chose.';
      } catch (error) {
        if (file === selectedFile) message.textContent = error.name === 'AbortError'
          ? 'Sharing canceled. Your file is still ready; you can save or download it again.'
          : 'Sharing could not open. Use DOWNLOAD FILE' + (open.hidden ? '.' : ' or OPEN PDF, then Share → Save to Files.');
      } finally {
        if (file === selectedFile) share.disabled = false;
      }
    });

    function show(blob, name) {
      clear();
      url = URL.createObjectURL(blob);
      nameLabel.textContent = name;
      download.href = url;
      download.download = name;
      download.textContent = 'DOWNLOAD FILE';
      if (typeof File === 'function') file = new File([blob], name, {type: blob.type});
      let canShare = false;
      try {
        canShare = !!file && typeof navigator.share === 'function' &&
          typeof navigator.canShare === 'function' && navigator.canShare({files: [file]});
      } catch (_) { /* Fall back to a user-clicked download or PDF preview. */ }
      share.hidden = !canShare;
      open.hidden = !isIOS || blob.type !== 'application/pdf';
      if (!open.hidden) open.href = url;
      hint.textContent = isIOS
        ? (canShare ? 'On iPhone: tap SAVE / SHARE FILE, then Save to Files and choose a folder. '
          : 'On iPhone: tap DOWNLOAD FILE' + (open.hidden ? '. ' : ' or OPEN PDF, then Share → Save to Files. ')) +
          'Safari downloads are in Files → iCloud Drive or On My iPhone → Downloads, unless you chose another folder.'
        : 'Your file is ready. Use the buttons below if the automatic download does not appear. The file stays available here until your next operation or you leave this page.';
      root.hidden = false;
      // iOS gets an explicit user gesture rather than a synthetic async download.
      if (!isIOS) download.click();
    }
    return {show, clear};
  };
})();
