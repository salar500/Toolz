export function renderImageColorPicker(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="color_file"
        type="file"
        accept="image/*"
      />
    </div>

    <p class="small muted" style="margin-top:8px">
      Click anywhere on the image to pick a color.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Picked Color</div>
      <div
        id="color_value"
        style="font-size:16px;font-weight:600;opacity:.6">
        No color selected
      </div>

      <div id="color_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#color_file');
  const valueEl = document.querySelector('#color_value');
  const previewEl = document.querySelector('#color_preview');

  let canvas, ctx, img;

  /* ---------------- LOGIC ---------------- */
  function loadImage(file) {
    img = new Image();
    const reader = new FileReader();

    reader.onload = e => (img.src = e.target.result);

    img.onload = () => {
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      previewEl.innerHTML = `
        <canvas
          id="color_canvas"
          style="max-width:100%;cursor:crosshair;border-radius:6px">
        </canvas>
      `;

      const displayCanvas = document.querySelector('#color_canvas');
      displayCanvas.width = canvas.width;
      displayCanvas.height = canvas.height;

      displayCanvas.getContext('2d').drawImage(canvas, 0, 0);

      displayCanvas.addEventListener('click', pickColor);
    };

    reader.readAsDataURL(file);
  }

  function pickColor(e) {
    const rect = e.target.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;

    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;

    valueEl.innerText = hex;
    valueEl.style.opacity = 1;

    previewEl.insertAdjacentHTML(
      'afterbegin',
      `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <div style="
            width:28px;
            height:28px;
            border-radius:4px;
            border:1px solid #ccc;
            background:${hex}">
          </div>
          <span class="small">${hex}</span>
        </div>
      `
    );

    navigator.clipboard?.writeText(hex);
  }

  /* ---------------- EVENTS ---------------- */
  fileEl.addEventListener('change', () => {
    const file = fileEl.files[0];
    if (!file || !file.type.startsWith('image/')) {
      valueEl.innerText = 'Invalid image file';
      valueEl.style.opacity = 1;
      return;
    }
    valueEl.innerText = 'Click on the image to pick a color';
    valueEl.style.opacity = .6;
    loadImage(file);
  });
}
