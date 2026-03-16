export function renderImageWatermark(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="wm_base_file"
        type="file"
        accept="image/*"
      />
    </div>

    <div class="form-row">
      <label>Watermark Type</label>
      <select id="wm_type">
        <option value="text">Text</option>
        <option value="image">Image</option>
      </select>
    </div>

    <div id="wm_text_controls">
      <div class="form-row">
        <label>Watermark Text</label>
        <input
          id="wm_text"
          type="text"
          placeholder="© Your Brand"
        />
      </div>

      <div class="form-row">
        <label>Font Size (px)</label>
        <input
          id="wm_font_size"
          type="number"
          min="8"
          value="32"
        />
      </div>
    </div>

    <div id="wm_image_controls" style="display:none">
      <div class="form-row">
        <label>Select Watermark Image</label>
        <input
          id="wm_image_file"
          type="file"
          accept="image/*"
        />
      </div>
    </div>

    <div class="form-row">
      <label>Position</label>
      <select id="wm_position">
        <option value="bottom-right">Bottom Right</option>
        <option value="bottom-left">Bottom Left</option>
        <option value="top-right">Top Right</option>
        <option value="top-left">Top Left</option>
        <option value="center">Center</option>
      </select>
    </div>

    <div class="form-row">
      <label>Opacity</label>
      <input
        id="wm_opacity"
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        value="0.4"
      />
    </div>

    <button id="wm_apply" class="btn" style="margin-top:6px">
      Apply Watermark
    </button>

    <p class="small muted" style="margin-top:8px">
      Add text or image watermark to your photos.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="wm_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <div id="wm_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const baseFileEl = document.querySelector('#wm_base_file');
  const typeEl = document.querySelector('#wm_type');
  const textControls = document.querySelector('#wm_text_controls');
  const imageControls = document.querySelector('#wm_image_controls');
  const textEl = document.querySelector('#wm_text');
  const fontSizeEl = document.querySelector('#wm_font_size');
  const wmImageEl = document.querySelector('#wm_image_file');
  const positionEl = document.querySelector('#wm_position');
  const opacityEl = document.querySelector('#wm_opacity');
  const resultEl = document.querySelector('#wm_result');
  const previewEl = document.querySelector('#wm_preview');

  /* ---------------- UI TOGGLE ---------------- */
  typeEl.addEventListener('change', () => {
    const isText = typeEl.value === 'text';
    textControls.style.display = isText ? 'block' : 'none';
    imageControls.style.display = isText ? 'none' : 'block';
  });

  /* ---------------- LOGIC ---------------- */
  function applyWatermark() {
    const baseFile = baseFileEl.files[0];

    if (!baseFile) {
      resultEl.innerText = 'Please select a base image';
      resultEl.style.opacity = 1;
      return;
    }

    if (!baseFile.type.startsWith('image/')) {
      resultEl.innerText = 'Invalid image file';
      return;
    }

    const opacity = Number(opacityEl.value);
    const position = positionEl.value;
    const type = typeEl.value;

    const baseImg = new Image();
    const reader = new FileReader();

    reader.onload = e => (baseImg.src = e.target.result);

    baseImg.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = baseImg.width;
      canvas.height = baseImg.height;

      ctx.drawImage(baseImg, 0, 0);
      ctx.globalAlpha = opacity;

      if (type === 'text') {
        const text = textEl.value || '© Watermark';
        const fontSize = Number(fontSizeEl.value);

        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'bottom';

        const metrics = ctx.measureText(text);
        const padding = 12;

        let x, y;

        switch (position) {
          case 'top-left':
            x = padding;
            y = fontSize + padding;
            break;
          case 'top-right':
            x = canvas.width - metrics.width - padding;
            y = fontSize + padding;
            break;
          case 'bottom-left':
            x = padding;
            y = canvas.height - padding;
            break;
          case 'center':
            x = (canvas.width - metrics.width) / 2;
            y = canvas.height / 2;
            break;
          default: // bottom-right
            x = canvas.width - metrics.width - padding;
            y = canvas.height - padding;
        }

        ctx.fillText(text, x, y);
      } else {
        const wmFile = wmImageEl.files[0];
        if (!wmFile) {
          resultEl.innerText = 'Please select a watermark image';
          ctx.globalAlpha = 1;
          return;
        }

        const wmImg = new Image();
        const wmReader = new FileReader();

        wmReader.onload = e => (wmImg.src = e.target.result);

        wmImg.onload = () => {
          const scale = 0.25;
          const w = wmImg.width * scale;
          const h = wmImg.height * scale;
          const padding = 12;

          let x, y;

          switch (position) {
            case 'top-left':
              x = padding;
              y = padding;
              break;
            case 'top-right':
              x = canvas.width - w - padding;
              y = padding;
              break;
            case 'bottom-left':
              x = padding;
              y = canvas.height - h - padding;
              break;
            case 'center':
              x = (canvas.width - w) / 2;
              y = (canvas.height - h) / 2;
              break;
            default:
              x = canvas.width - w - padding;
              y = canvas.height - h - padding;
          }

          ctx.drawImage(wmImg, x, y, w, h);
          finish();
        };

        wmReader.readAsDataURL(wmFile);
        return;
      }

      finish();
    };

    function finish() {
      ctx.globalAlpha = 1;

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);

        previewEl.innerHTML = `
          <img src="${url}" style="max-width:100%;border-radius:6px" />
          <div style="margin-top:6px">
            <a href="${url}" download="watermarked-image.png">
              Download Image
            </a>
          </div>
        `;

        resultEl.innerText = 'Watermark applied';
        resultEl.style.opacity = 1;
      });
    }

    resultEl.innerText = 'Processing...';
    resultEl.style.opacity = .4;

    reader.readAsDataURL(baseFile);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#wm_apply')
    .addEventListener('click', applyWatermark);
}
