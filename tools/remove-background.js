export function renderRemoveBackground(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="bg_file"
        type="file"
        accept="image/*"
      />
    </div>

    <div class="form-row">
      <label>Background Sensitivity</label>
      <input
        id="bg_threshold"
        type="range"
        min="10"
        max="100"
        value="40"
      />
      <div class="small muted">
        Higher removes more background
      </div>
    </div>

    <button id="bg_remove" class="btn" style="margin-top:6px">
      Remove Background
    </button>

    <p class="small muted" style="margin-top:8px">
      Best for images with plain or light backgrounds.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="bg_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <div id="bg_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#bg_file');
  const thresholdEl = document.querySelector('#bg_threshold');
  const resultEl = document.querySelector('#bg_result');
  const previewEl = document.querySelector('#bg_preview');

  /* ---------------- LOGIC ---------------- */
  function removeBackground() {
    const file = fileEl.files[0];

    if (!file) {
      resultEl.innerText = 'Please select an image file';
      resultEl.style.opacity = 1;
      return;
    }

    if (!file.type.startsWith('image/')) {
      resultEl.innerText = 'Invalid image file';
      return;
    }

    const threshold = Number(thresholdEl.value);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => (img.src = e.target.result);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample top-left pixel as background color
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const diff =
          Math.abs(r - bgR) +
          Math.abs(g - bgG) +
          Math.abs(b - bgB);

        if (diff < threshold * 3) {
          data[i + 3] = 0; // transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);

        previewEl.innerHTML = `
          <div style="
            background: repeating-conic-gradient(#eee 0% 25%, #ddd 0% 50%) 50% / 20px 20px;
            padding:10px;
            border-radius:6px">
            <img src="${url}" style="max-width:100%" />
          </div>

          <div style="margin-top:6px">
            <a href="${url}" download="background-removed.png">
              Download PNG
            </a>
          </div>
        `;

        resultEl.innerText = 'Background removed';
        resultEl.style.opacity = 1;
      });
    };

    resultEl.innerText = 'Processing...';
    resultEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#bg_remove')
    .addEventListener('click', removeBackground);
}
