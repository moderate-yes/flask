(() => {
  if (window.matchMedia("(max-width: 1079px)").matches) return;

  const canvas = document.querySelector("#workCanvas");
  const ctx = canvas.getContext("2d");
  const status = document.querySelector("#editorStatus");
  const layerList = document.querySelector("#layerList");
  const layerName = document.querySelector("#layerName");
  const layerType = document.querySelector("#layerType");
  const layerOpacity = document.querySelector("#layerOpacity");
  const opacityValue = document.querySelector("#opacityValue");
  const pathProperties = document.querySelector("#pathProperties");
  const strokeColor = document.querySelector("#strokeColor");
  const strokeWidth = document.querySelector("#strokeWidth");
  const strokeWidthValue = document.querySelector("#strokeWidthValue");
  const fillEnabled = document.querySelector("#fillEnabled");
  const fillColor = document.querySelector("#fillColor");
  const fillColorRow = document.querySelector("#fillColorRow");
  const imageFile = document.querySelector("#imageFile");
  const projectFile = document.querySelector("#projectFile");
  const zoomSelect = document.querySelector("#zoomSelect");

  const imageCache = new Map();
  let project = createProject();
  let activeTool = "select";
  let selectedPoint = null;
  let hoveredEndpoint = null;
  let dragging = null;
  let dirty = false;

  function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function newPath(name = `Path ${project.layers.filter((layer) => layer.type === "path").length + 1}`) {
    return {
      id: uid(), name, type: "path", visible: true, opacity: 1,
      path: { points: [], closed: false, stroke: "#111210", strokeWidth: 4, fillEnabled: false, fill: "#777873" }
    };
  }

  function createProject() {
    const path = {
      id: uid(), name: "Path 1", type: "path", visible: true, opacity: 1,
      path: { points: [], closed: false, stroke: "#111210", strokeWidth: 4, fillEnabled: false, fill: "#777873" }
    };
    return { version: 1, canvas: { width: 1600, height: 900, background: "#ffffff" }, layers: [path], activeLayerId: path.id };
  }

  function getActiveLayer() {
    return project.layers.find((layer) => layer.id === project.activeLayerId) || null;
  }

  function setStatus(message) { status.textContent = message; }
  function markDirty(message) { dirty = true; if (message) setStatus(message); }

  function loadImageLayer(layer) {
    if (imageCache.has(layer.id)) return imageCache.get(layer.id);
    const image = new Image();
    image.onload = () => renderCanvas();
    image.src = layer.image.dataUrl;
    imageCache.set(layer.id, image);
    return image;
  }

  function drawPath(layer, showSelection) {
    const points = layer.path.points;
    if (!points.length) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length; index += 1) drawSegment(points[index - 1], points[index]);
    if (layer.path.closed) {
      drawSegment(points.at(-1), points[0]);
      ctx.closePath();
    }
    if (layer.path.closed && layer.path.fillEnabled) {
      ctx.fillStyle = layer.path.fill;
      ctx.fill();
    }
    if (points.length > 1) {
      ctx.strokeStyle = layer.path.stroke;
      ctx.lineWidth = layer.path.strokeWidth;
      ctx.lineJoin = "round";
      ctx.stroke();
    }

    if (showSelection) {
      if (layer.id === project.activeLayerId) points.forEach((point, index) => drawAnchorMarker(layer, point, index));
      else if (hoveredEndpoint?.layerId === layer.id) drawAnchorMarker(layer, points[hoveredEndpoint.index], hoveredEndpoint.index);
      if (selectedPoint && selectedPoint.layerId === layer.id) {
        const point = points[selectedPoint.index];
        if (point) drawBezierHandles(point);
      }
    }
  }

  function drawAnchorMarker(layer, point, index) {
    if (!point) return;
    const isStart = index === 0;
    const isEnd = !layer.path.closed && layer.path.points.length > 1 && index === layer.path.points.length - 1;
    const isHovered = hoveredEndpoint?.layerId === layer.id && hoveredEndpoint.index === index;
    const isSelected = selectedPoint?.layerId === layer.id && selectedPoint.index === index;
    const radius = isStart ? 9 : isEnd ? 8 : isSelected ? 8 : 6;

    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = isHovered && isStart ? "#c8ff3d" : isHovered && isEnd ? "#ff765e" : isStart ? "#ffffff" : "#111210";
    ctx.fill();
    ctx.lineWidth = isStart || isEnd ? 3 : 2;
    ctx.strokeStyle = "#111210";
    ctx.stroke();

    if (isStart) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#111210";
      ctx.fill();
    }
  }

  function hasHandle(point, side) {
    return Number.isFinite(point[`${side}X`]) && Number.isFinite(point[`${side}Y`]);
  }

  function drawSegment(from, to) {
    if (hasHandle(from, "out") || hasHandle(to, "in")) {
      ctx.bezierCurveTo(
        hasHandle(from, "out") ? from.outX : from.x,
        hasHandle(from, "out") ? from.outY : from.y,
        hasHandle(to, "in") ? to.inX : to.x,
        hasHandle(to, "in") ? to.inY : to.y,
        to.x,
        to.y
      );
    } else {
      ctx.lineTo(to.x, to.y);
    }
  }

  function makePathShape(layer) {
    const points = layer.path.points;
    const shape = new Path2D();
    if (!points.length) return shape;
    shape.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length; index += 1) {
      const from = points[index - 1];
      const to = points[index];
      if (hasHandle(from, "out") || hasHandle(to, "in")) {
        shape.bezierCurveTo(
          hasHandle(from, "out") ? from.outX : from.x,
          hasHandle(from, "out") ? from.outY : from.y,
          hasHandle(to, "in") ? to.inX : to.x,
          hasHandle(to, "in") ? to.inY : to.y,
          to.x,
          to.y
        );
      } else shape.lineTo(to.x, to.y);
    }
    if (layer.path.closed) {
      const from = points.at(-1);
      const to = points[0];
      if (hasHandle(from, "out") || hasHandle(to, "in")) {
        shape.bezierCurveTo(
          hasHandle(from, "out") ? from.outX : from.x,
          hasHandle(from, "out") ? from.outY : from.y,
          hasHandle(to, "in") ? to.inX : to.x,
          hasHandle(to, "in") ? to.inY : to.y,
          to.x,
          to.y
        );
      }
      shape.closePath();
    }
    return shape;
  }

  function drawBezierHandles(point) {
    ["in", "out"].forEach((side) => {
      if (!hasHandle(point, side)) return;
      const x = point[`${side}X`];
      const y = point[`${side}Y`];
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#4f514c";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.rect(x - 6, y - 6, 12, 12);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#111210";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  function renderCanvas(showSelection = true) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = project.canvas.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    project.layers.forEach((layer) => {
      if (!layer.visible) return;
      ctx.save();
      ctx.globalAlpha = layer.opacity;
      if (layer.type === "image") {
        const image = loadImageLayer(layer);
        if (image.complete && image.naturalWidth) ctx.drawImage(image, layer.image.x, layer.image.y, layer.image.width, layer.image.height);
        if (showSelection && layer.id === project.activeLayerId) {
          ctx.globalAlpha = 1;
          ctx.setLineDash([10, 8]);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#111210";
          ctx.strokeRect(layer.image.x, layer.image.y, layer.image.width, layer.image.height);
        }
      } else drawPath(layer, showSelection);
      ctx.restore();
    });
    ctx.restore();
  }

  function setActiveLayer(id) {
    project.activeLayerId = id;
    selectedPoint = null;
    renderLayers();
    renderProperties();
    renderCanvas();
  }

  function renderLayers() {
    layerList.replaceChildren();
    [...project.layers].reverse().forEach((layer) => {
      const item = document.createElement("li");
      item.className = `layer-item${layer.id === project.activeLayerId ? " active" : ""}`;
      item.dataset.id = layer.id;

      const visible = document.createElement("button");
      visible.className = "layer-visible";
      visible.type = "button";
      visible.dataset.action = "visible";
      visible.textContent = layer.visible ? "ON" : "OFF";
      visible.setAttribute("aria-label", `${layer.visible ? "Hide" : "Show"} ${layer.name}`);

      const select = document.createElement("button");
      select.className = "layer-select";
      select.type = "button";
      select.dataset.action = "select";
      const name = document.createElement("strong");
      name.textContent = layer.name;
      const type = document.createElement("small");
      type.textContent = layer.type.toUpperCase();
      select.append(name, type);

      const controls = document.createElement("div");
      controls.className = "layer-controls";
      [["up", "↑", "Move layer up"], ["down", "↓", "Move layer down"], ["delete", "×", "Delete layer"]].forEach(([action, text, label]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.action = action;
        button.textContent = text;
        button.setAttribute("aria-label", `${label}: ${layer.name}`);
        controls.append(button);
      });

      item.append(visible, select, controls);
      layerList.append(item);
    });
  }

  function renderProperties() {
    const layer = getActiveLayer();
    const disabled = !layer;
    layerName.disabled = disabled;
    layerOpacity.disabled = disabled;
    if (!layer) return;
    layerName.value = layer.name;
    layerType.textContent = layer.type.toUpperCase();
    layerOpacity.value = Math.round(layer.opacity * 100);
    opacityValue.value = `${layerOpacity.value}%`;
    pathProperties.hidden = layer.type !== "path";
    if (layer.type === "path") {
      strokeColor.value = layer.path.stroke;
      strokeWidth.value = layer.path.strokeWidth;
      strokeWidthValue.value = layer.path.strokeWidth;
      fillEnabled.checked = layer.path.fillEnabled;
      fillColor.disabled = !layer.path.fillEnabled;
      fillColorRow.classList.toggle("disabled", !layer.path.fillEnabled);
      fillColor.value = layer.path.fill;
    }
  }

  function addPathLayer() {
    const layer = newPath();
    project.layers.push(layer);
    project.activeLayerId = layer.id;
    selectedPoint = null;
    setTool("pen");
    refresh();
    markDirty("New path layer added. Click the canvas to draw.");
  }

  function addImageFromFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min((canvas.width * .8) / image.naturalWidth, (canvas.height * .8) / image.naturalHeight, 1);
        const width = image.naturalWidth * scale;
        const height = image.naturalHeight * scale;
        const layer = {
          id: uid(), name: file.name.replace(/\.[^.]+$/, ""), type: "image", visible: true, opacity: 1,
          image: { dataUrl: reader.result, x: (canvas.width - width) / 2, y: (canvas.height - height) / 2, width, height }
        };
        project.layers.push(layer);
        project.activeLayerId = layer.id;
        imageCache.set(layer.id, image);
        setTool("select");
        refresh();
        markDirty("Image added. Adjust opacity in Properties or draw a path above it.");
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function refresh() {
    renderLayers();
    renderProperties();
    renderCanvas();
  }

  function setTool(tool) {
    activeTool = tool;
    document.querySelectorAll("[data-tool]").forEach((button) => {
      const active = button.dataset.tool === tool;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    canvas.style.cursor = tool === "pen" ? "crosshair" : "default";
    setStatus(tool === "pen" ? "Pen active. Click for corners or Alt + drag for curves." : "Select active. Drag anchors or Bezier handles.");
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  }

  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  function reversedPathPoints(points) {
    return [...points].reverse().map((point) => ({
      ...point,
      inX: point.outX,
      inY: point.outY,
      outX: point.inX,
      outY: point.inY
    }));
  }

  function findOpenEndpoint(point, excludedLayerId) {
    const scale = canvas.width / canvas.getBoundingClientRect().width;
    const radius = 18 * scale;
    for (let layerIndex = project.layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
      const layer = project.layers[layerIndex];
      if (layer.id === excludedLayerId || layer.type !== "path" || layer.path.closed || !layer.path.points.length || !layer.visible) continue;
      const lastIndex = layer.path.points.length - 1;
      if (distance(point, layer.path.points[0]) <= radius) return { layer, index: 0 };
      if (distance(point, layer.path.points[lastIndex]) <= radius) return { layer, index: lastIndex };
    }
    return null;
  }

  function findHoveredEndpoint(point) {
    const scale = canvas.width / canvas.getBoundingClientRect().width;
    const radius = 14 * scale;
    for (let layerIndex = project.layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
      const layer = project.layers[layerIndex];
      if (layer.type !== "path" || !layer.visible || !layer.path.points.length) continue;
      const points = layer.path.points;
      if (distance(point, points[0]) <= radius) return { layerId: layer.id, index: 0, kind: "start" };
      const lastIndex = points.length - 1;
      if (!layer.path.closed && lastIndex > 0 && distance(point, points[lastIndex]) <= radius) {
        return { layerId: layer.id, index: lastIndex, kind: "end" };
      }
    }
    return null;
  }

  function updateEndpointHover(point) {
    const next = findHoveredEndpoint(point);
    const unchanged = next?.layerId === hoveredEndpoint?.layerId && next?.index === hoveredEndpoint?.index;
    canvas.style.cursor = next ? "pointer" : activeTool === "pen" ? "crosshair" : "default";
    if (unchanged) return;
    hoveredEndpoint = next;
    renderCanvas();
  }

  function joinDraggedEndpoint(layer, pointIndex) {
    if (layer.type !== "path" || layer.path.closed || layer.path.points.length < 2) return false;
    const lastIndex = layer.path.points.length - 1;
    if (pointIndex !== 0 && pointIndex !== lastIndex) return false;

    if (pointIndex === 0) layer.path.points = reversedPathPoints(layer.path.points);
    const points = layer.path.points;
    const draggedEnd = points.at(-1);
    const scale = canvas.width / canvas.getBoundingClientRect().width;
    const radius = 18 * scale;

    if (points.length >= 3 && distance(draggedEnd, points[0]) <= radius) {
      const first = points[0];
      const deltaX = first.x - draggedEnd.x;
      const deltaY = first.y - draggedEnd.y;
      if (hasHandle(draggedEnd, "in")) {
        first.inX = draggedEnd.inX + deltaX;
        first.inY = draggedEnd.inY + deltaY;
      }
      points.pop();
      layer.path.closed = true;
      selectedPoint = { layerId: layer.id, index: 0 };
      markDirty("Endpoints joined. This is now one closed path.");
      return true;
    }

    const endpoint = findOpenEndpoint(draggedEnd, layer.id);
    if (!endpoint) return false;
    const targetPoints = endpoint.index === 0 ? endpoint.layer.path.points : reversedPathPoints(endpoint.layer.path.points);
    const targetStart = targetPoints[0];
    const deltaX = targetStart.x - draggedEnd.x;
    const deltaY = targetStart.y - draggedEnd.y;
    draggedEnd.x = targetStart.x;
    draggedEnd.y = targetStart.y;
    if (hasHandle(draggedEnd, "in")) { draggedEnd.inX += deltaX; draggedEnd.inY += deltaY; }
    draggedEnd.outX = targetStart.outX;
    draggedEnd.outY = targetStart.outY;
    points.push(...targetPoints.slice(1));
    project.layers = project.layers.filter((item) => item.id !== endpoint.layer.id);
    project.activeLayerId = layer.id;
    selectedPoint = { layerId: layer.id, index: points.indexOf(draggedEnd) };
    markDirty("Endpoints joined. Both layers are now one path.");
    return true;
  }

  function hitTest(point) {
    const scale = canvas.width / canvas.getBoundingClientRect().width;
    const radius = 12 * scale;

    if (selectedPoint) {
      const selectedLayer = project.layers.find((layer) => layer.id === selectedPoint.layerId);
      const anchor = selectedLayer?.type === "path" ? selectedLayer.path.points[selectedPoint.index] : null;
      if (anchor) {
        for (const side of ["in", "out"]) {
          if (hasHandle(anchor, side) && distance(point, { x: anchor[`${side}X`], y: anchor[`${side}Y`] }) <= radius) {
            return { type: "handle", side, layer: selectedLayer, index: selectedPoint.index };
          }
        }
      }
    }

    for (let layerIndex = project.layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
      const layer = project.layers[layerIndex];
      if (!layer.visible) continue;
      if (layer.type === "path") {
        for (let index = layer.path.points.length - 1; index >= 0; index -= 1) {
          if (distance(point, layer.path.points[index]) <= radius) return { type: "point", layer, index };
        }
        if (layer.path.points.length > 1) {
          ctx.save();
          ctx.lineWidth = Math.max(layer.path.strokeWidth + radius, radius * 1.5);
          const pathHit = ctx.isPointInStroke(makePathShape(layer), point.x, point.y);
          ctx.restore();
          if (pathHit) return { type: "path", layer };
        }
      } else if (point.x >= layer.image.x && point.x <= layer.image.x + layer.image.width && point.y >= layer.image.y && point.y <= layer.image.y + layer.image.height) {
        return { type: "image", layer };
      }
    }
    return null;
  }

  function finishCurrentPath() {
    const layer = getActiveLayer();
    if (!layer || layer.type !== "path" || layer.path.points.length < 2) return;
    selectedPoint = null;
    setTool("select");
    markDirty("Path finished. Use Select to move points.");
    renderCanvas();
  }

  canvas.addEventListener("pointerdown", (event) => {
    const point = canvasPoint(event);
    if (activeTool === "pen") {
      let layer = getActiveLayer();
      if (!layer || layer.type !== "path" || layer.path.closed) {
        addPathLayer();
        layer = getActiveLayer();
      }

      const endpoint = findOpenEndpoint(point, layer.id);
      if (!layer.path.points.length && endpoint) {
        project.layers = project.layers.filter((item) => item.id !== layer.id);
        layer = endpoint.layer;
        if (endpoint.index === 0) layer.path.points = reversedPathPoints(layer.path.points);
        project.activeLayerId = layer.id;
        selectedPoint = { layerId: layer.id, index: layer.path.points.length - 1 };
        markDirty("Endpoint attached. Continue drawing to extend this path.");
        refresh();
      } else if (layer.path.points.length && endpoint) {
        const joinAtStart = endpoint.index === 0;
        const joinedPoints = joinAtStart ? endpoint.layer.path.points : reversedPathPoints(endpoint.layer.path.points);
        const connectionIndex = layer.path.points.length;
        layer.path.points.push(...joinedPoints);
        project.layers = project.layers.filter((item) => item.id !== endpoint.layer.id);
        project.activeLayerId = layer.id;
        selectedPoint = { layerId: layer.id, index: connectionIndex };
        markDirty("Endpoints joined. Both layers are now one path.");
        refresh();
      } else if (layer.path.points.length >= 3 && distance(point, layer.path.points[0]) < 18 * canvas.width / canvas.getBoundingClientRect().width) {
        layer.path.closed = true;
        finishCurrentPath();
        markDirty("Path closed.");
      } else {
        layer.path.points.push({ ...point, inX: null, inY: null, outX: null, outY: null });
        selectedPoint = { layerId: layer.id, index: layer.path.points.length - 1 };
        if (event.altKey) {
          dragging = { type: "create-handle", layerId: layer.id, index: selectedPoint.index };
          canvas.setPointerCapture(event.pointerId);
        }
        markDirty(`${layer.path.points.length} points in current path.`);
        refresh();
      }
      return;
    }

    const hit = hitTest(point);
    if (!hit) { selectedPoint = null; renderCanvas(); return; }
    project.activeLayerId = hit.layer.id;
    if (hit.type === "handle") {
      selectedPoint = { layerId: hit.layer.id, index: hit.index };
      dragging = { type: "handle", side: hit.side, layerId: hit.layer.id, index: hit.index };
    } else if (hit.type === "point") {
      selectedPoint = { layerId: hit.layer.id, index: hit.index };
      dragging = event.altKey
        ? { type: "create-handle", layerId: hit.layer.id, index: hit.index }
        : { type: "point", layerId: hit.layer.id, index: hit.index };
    } else if (hit.type === "path") {
      selectedPoint = null;
      dragging = { type: "path", layerId: hit.layer.id, lastX: point.x, lastY: point.y };
      setStatus("Path selected. Drag to move the complete path.");
    } else {
      selectedPoint = null;
      dragging = { type: "image", layerId: hit.layer.id, offsetX: point.x - hit.layer.image.x, offsetY: point.y - hit.layer.image.y };
    }
    canvas.setPointerCapture(event.pointerId);
    refresh();
  });

  canvas.addEventListener("pointermove", (event) => {
    const point = canvasPoint(event);
    if (!dragging) { updateEndpointHover(point); return; }
    const layer = project.layers.find((item) => item.id === dragging.layerId);
    if (!layer) return;
    if (dragging.type === "point") {
      const anchor = layer.path.points[dragging.index];
      const deltaX = point.x - anchor.x;
      const deltaY = point.y - anchor.y;
      anchor.x = point.x;
      anchor.y = point.y;
      if (hasHandle(anchor, "in")) { anchor.inX += deltaX; anchor.inY += deltaY; }
      if (hasHandle(anchor, "out")) { anchor.outX += deltaX; anchor.outY += deltaY; }
    } else if (dragging.type === "create-handle") {
      const anchor = layer.path.points[dragging.index];
      anchor.outX = point.x;
      anchor.outY = point.y;
      anchor.inX = anchor.x * 2 - point.x;
      anchor.inY = anchor.y * 2 - point.y;
    } else if (dragging.type === "handle") {
      const anchor = layer.path.points[dragging.index];
      anchor[`${dragging.side}X`] = point.x;
      anchor[`${dragging.side}Y`] = point.y;
      if (!event.altKey) {
        const opposite = dragging.side === "in" ? "out" : "in";
        anchor[`${opposite}X`] = anchor.x * 2 - point.x;
        anchor[`${opposite}Y`] = anchor.y * 2 - point.y;
      }
    } else if (dragging.type === "path") {
      const deltaX = point.x - dragging.lastX;
      const deltaY = point.y - dragging.lastY;
      layer.path.points.forEach((anchor) => {
        anchor.x += deltaX;
        anchor.y += deltaY;
        if (hasHandle(anchor, "in")) { anchor.inX += deltaX; anchor.inY += deltaY; }
        if (hasHandle(anchor, "out")) { anchor.outX += deltaX; anchor.outY += deltaY; }
      });
      dragging.lastX = point.x;
      dragging.lastY = point.y;
    } else {
      layer.image.x = point.x - dragging.offsetX;
      layer.image.y = point.y - dragging.offsetY;
    }
    dirty = true;
    renderCanvas();
  });

  canvas.addEventListener("pointerup", () => {
    const draggedLayer = dragging ? project.layers.find((item) => item.id === dragging.layerId) : null;
    const joined = dragging?.type === "point" && draggedLayer ? joinDraggedEndpoint(draggedLayer, dragging.index) : false;
    if (joined) refresh();
    else if (dragging?.type === "create-handle" || dragging?.type === "handle") setStatus("Curve handles updated. Hold Alt while dragging a handle to move it independently.");
    else if (dragging) setStatus("Position updated.");
    dragging = null;
  });

  canvas.addEventListener("pointerleave", () => {
    if (dragging || !hoveredEndpoint) return;
    hoveredEndpoint = null;
    canvas.style.cursor = activeTool === "pen" ? "crosshair" : "default";
    renderCanvas();
  });

  document.querySelectorAll("[data-tool]").forEach((button) => button.addEventListener("click", () => setTool(button.dataset.tool)));
  document.querySelector("#finishPath").addEventListener("click", finishCurrentPath);
  document.querySelector("#addImage").addEventListener("click", () => imageFile.click());
  document.querySelector("#newImageLayer").addEventListener("click", () => imageFile.click());
  document.querySelector("#newPathLayer").addEventListener("click", addPathLayer);
  imageFile.addEventListener("change", () => { addImageFromFile(imageFile.files[0]); imageFile.value = ""; });

  layerList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = button.closest(".layer-item").dataset.id;
    const index = project.layers.findIndex((layer) => layer.id === id);
    if (index < 0) return;
    const layer = project.layers[index];
    if (button.dataset.action === "select") setActiveLayer(id);
    if (button.dataset.action === "visible") { layer.visible = !layer.visible; markDirty(); refresh(); }
    if (button.dataset.action === "up" && index < project.layers.length - 1) { [project.layers[index], project.layers[index + 1]] = [project.layers[index + 1], project.layers[index]]; markDirty(); refresh(); }
    if (button.dataset.action === "down" && index > 0) { [project.layers[index], project.layers[index - 1]] = [project.layers[index - 1], project.layers[index]]; markDirty(); refresh(); }
    if (button.dataset.action === "delete") {
      project.layers.splice(index, 1);
      imageCache.delete(id);
      project.activeLayerId = project.layers.at(-1)?.id || null;
      selectedPoint = null;
      markDirty("Layer deleted.");
      refresh();
    }
  });

  layerName.addEventListener("input", () => { const layer = getActiveLayer(); if (layer) { layer.name = layerName.value || "Untitled Layer"; markDirty(); renderLayers(); } });
  layerOpacity.addEventListener("input", () => { const layer = getActiveLayer(); if (layer) { layer.opacity = Number(layerOpacity.value) / 100; opacityValue.value = `${layerOpacity.value}%`; markDirty(); renderCanvas(); } });
  strokeColor.addEventListener("input", () => { const layer = getActiveLayer(); if (layer?.type === "path") { layer.path.stroke = strokeColor.value; markDirty(); renderCanvas(); } });
  strokeWidth.addEventListener("input", () => { const layer = getActiveLayer(); if (layer?.type === "path") { layer.path.strokeWidth = Number(strokeWidth.value); strokeWidthValue.value = strokeWidth.value; markDirty(); renderCanvas(); } });
  fillEnabled.addEventListener("change", () => { const layer = getActiveLayer(); if (layer?.type === "path") { layer.path.fillEnabled = fillEnabled.checked; fillColor.disabled = !fillEnabled.checked; markDirty(); renderCanvas(); } });
  fillColor.addEventListener("input", () => { const layer = getActiveLayer(); if (layer?.type === "path") { layer.path.fill = fillColor.value; markDirty(); renderCanvas(); } });

  zoomSelect.addEventListener("change", () => {
    const zoom = Number(zoomSelect.value);
    canvas.style.width = `${project.canvas.width * zoom}px`;
    canvas.style.height = `${project.canvas.height * zoom}px`;
    setStatus(`Zoom set to ${Math.round(zoom * 100)}%.`);
  });

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function saveProject() {
    const data = JSON.stringify({ ...project, savedAt: new Date().toISOString() });
    downloadBlob(new Blob([data], { type: "application/json" }), `path-studio-${new Date().toISOString().slice(0, 10)}.pathwork`);
    dirty = false;
    setStatus("Project saved locally. Open this file later to continue.");
  }

  async function openProjectFile(file) {
    try {
      const data = JSON.parse(await file.text());
      if (data.version !== 1 || !data.canvas || !Array.isArray(data.layers)) throw new Error("Invalid project");
      data.layers.forEach((layer) => {
        if (!layer.id || !["path", "image"].includes(layer.type)) throw new Error("Invalid layer");
        if (layer.type === "path") {
          layer.path.points.forEach((point) => {
            ["inX", "inY", "outX", "outY"].forEach((key) => {
              if (!Number.isFinite(point[key])) point[key] = null;
            });
          });
        }
      });
      project = data;
      project.activeLayerId = data.activeLayerId && data.layers.some((layer) => layer.id === data.activeLayerId) ? data.activeLayerId : data.layers.at(-1)?.id || null;
      imageCache.clear();
      project.layers.filter((layer) => layer.type === "image").forEach(loadImageLayer);
      selectedPoint = null;
      dirty = false;
      refresh();
      setStatus("Project restored. Continue editing where you left off.");
    } catch (_) {
      setStatus("This project file could not be opened.");
    }
  }

  document.querySelector("#saveProject").addEventListener("click", saveProject);
  document.querySelector("#openProject").addEventListener("click", () => projectFile.click());
  projectFile.addEventListener("change", () => { openProjectFile(projectFile.files[0]); projectFile.value = ""; });
  document.querySelector("#newProject").addEventListener("click", () => {
    if (dirty && !window.confirm("Start a new project? Unsaved changes will be lost.")) return;
    imageCache.clear();
    project = createProject();
    selectedPoint = null;
    dirty = false;
    setTool("select");
    refresh();
    setStatus("New project ready.");
  });
  document.querySelector("#exportPng").addEventListener("click", () => {
    renderCanvas(false);
    canvas.toBlob((blob) => { if (blob) downloadBlob(blob, "path-studio-export.png"); renderCanvas(true); setStatus("PNG exported locally."); }, "image/png");
  });

  document.addEventListener("keydown", (event) => {
    if (event.target.matches("input, select")) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); saveProject(); return; }
    if (event.key.toLowerCase() === "v") setTool("select");
    if (event.key.toLowerCase() === "p") setTool("pen");
    if (event.key === "Enter") finishCurrentPath();
    if ((event.key === "Delete" || event.key === "Backspace") && selectedPoint) {
      const layer = project.layers.find((item) => item.id === selectedPoint.layerId);
      if (layer?.type === "path") {
        layer.path.points.splice(selectedPoint.index, 1);
        if (layer.path.points.length < 3) layer.path.closed = false;
        selectedPoint = null;
        markDirty("Point deleted.");
        refresh();
      }
    }
  });

  window.addEventListener("beforeunload", (event) => {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });

  zoomSelect.dispatchEvent(new Event("change"));
  refresh();
})();
