(() => {
  const picker = document.querySelector("#filePicker");
  const drop = document.querySelector("#dropZone");
  const workspace = document.querySelector("#workspace");
  const canvas = document.querySelector("#preview");
  const angleInput = document.querySelector("#angle");
  const angleOutput = document.querySelector("#angleOutput");
  const format = document.querySelector("#format");
  const status = document.querySelector("#status");
  const previewPanel = document.querySelector("#previewPanel");
  const ctx = canvas.getContext("2d");

  let image = null;
  let objectUrl = null;
  let fileBase = "image";
  let rotation = 0;
  let mirrorX = 1;
  let mirrorY = 1;

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle("error", isError);
  };

  const normalizedAngle = () => {
    const value = (rotation + Number(angleInput.value)) % 360;
    return value < 0 ? value + 360 : value;
  };

  function outputSize(width, height, degrees) {
    const radians = degrees * Math.PI / 180;
    return {
      width: Math.max(1, Math.ceil(Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians)))),
      height: Math.max(1, Math.ceil(Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians))))
    };
  }

  function draw(target, targetContext, fullSize = false) {
    if (!image) return;
    const degrees = normalizedAngle();
    const size = outputSize(image.naturalWidth, image.naturalHeight, degrees);
    const limit = fullSize ? Infinity : Math.max(280, Math.min(760, previewPanel.clientWidth * 2));
    const scale = Math.min(1, limit / Math.max(size.width, size.height));
    target.width = Math.round(size.width * scale);
    target.height = Math.round(size.height * scale);
    targetContext.clearRect(0, 0, target.width, target.height);
    targetContext.save();
    targetContext.translate(target.width / 2, target.height / 2);
    targetContext.scale(mirrorX * scale, mirrorY * scale);
    targetContext.rotate(degrees * Math.PI / 180);
    targetContext.imageSmoothingEnabled = true;
    targetContext.imageSmoothingQuality = "high";
    targetContext.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
    targetContext.restore();
    return size;
  }

  function render() {
    draw(canvas, ctx);
    const degrees = normalizedAngle();
    const signed = degrees > 180 ? degrees - 360 : degrees;
    angleOutput.value = `${signed}°`;
  }

  function reset() {
    rotation = 0;
    mirrorX = 1;
    mirrorY = 1;
    angleInput.value = "0";
    render();
    setStatus("Transform controls reset.");
  }

  function load(file) {
    if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setStatus("Choose a JPG, PNG, or WebP image.", true);
      return;
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    const nextImage = new Image();
    nextImage.onload = () => {
      image = nextImage;
      fileBase = file.name.replace(/\.[^.]+$/, "") || "image";
      reset();
      workspace.hidden = false;
      drop.hidden = true;
      setStatus(`${image.naturalWidth} × ${image.naturalHeight} pixels. Ready to transform.`);
    };
    nextImage.onerror = () => setStatus("This image could not be opened.", true);
    nextImage.src = objectUrl;
  }

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "mirror") mirrorX *= -1;
      if (action === "flip") mirrorY *= -1;
      if (action === "rotate-left") rotation -= 90;
      if (action === "rotate-right") rotation += 90;
      render();
      setStatus(`${button.textContent.trim()} applied.`);
    });
  });

  angleInput.addEventListener("input", () => {
    render();
    setStatus(`Rotation set to ${angleOutput.value}.`);
  });
  document.querySelector("#reset").addEventListener("click", reset);
  document.querySelector("#replaceImage").addEventListener("click", () => picker.click());

  document.querySelector("#download").addEventListener("click", () => {
    if (!image) return;
    const output = document.createElement("canvas");
    const outputContext = output.getContext("2d");
    const size = outputSize(image.naturalWidth, image.naturalHeight, normalizedAngle());
    output.width = size.width;
    output.height = size.height;
    if (format.value === "image/jpeg") {
      outputContext.fillStyle = "#ffffff";
      outputContext.fillRect(0, 0, output.width, output.height);
    }
    outputContext.save();
    outputContext.translate(output.width / 2, output.height / 2);
    outputContext.scale(mirrorX, mirrorY);
    outputContext.rotate(normalizedAngle() * Math.PI / 180);
    outputContext.imageSmoothingEnabled = true;
    outputContext.imageSmoothingQuality = "high";
    outputContext.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
    outputContext.restore();
    output.toBlob((blob) => {
      if (!blob) {
        setStatus("This browser could not create the selected format.", true);
        return;
      }
      window.reportGoogleAdsConversion?.();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[format.value];
      link.href = url;
      link.download = `${fileBase}-transformed.${extension}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(`${size.width} × ${size.height} ${extension.toUpperCase()} downloaded.`);
    }, format.value, 0.92);
  });

  drop.addEventListener("click", () => picker.click());
  picker.addEventListener("change", () => load(picker.files[0]));
  ["dragenter", "dragover"].forEach((type) => drop.addEventListener(type, (event) => {
    event.preventDefault();
    drop.classList.add("dragging");
  }));
  ["dragleave", "drop"].forEach((type) => drop.addEventListener(type, (event) => {
    event.preventDefault();
    drop.classList.remove("dragging");
  }));
  drop.addEventListener("drop", (event) => load(event.dataTransfer.files[0]));
  window.addEventListener("resize", render);
})();
