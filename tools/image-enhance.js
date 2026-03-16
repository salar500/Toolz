export function renderImageEnhance(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="enhance_file"
        type="file"
        accept="image/*"
      />
    </div>

    <div class="form-row">
      <label>Brightness</label>
      <input
        id="enhance_brightness"
        type="range"
        min="50"
        max="150"
        value="100"
      />
    </div>

    <div class="form-row">
      <label>Contrast</label>
      <input
        id="enhance_contrast"
        type="range"
        min="50"
        max="150"
        value="100"
      />
    </div>

    <div class="form-row">
      <label>Sharpness</label>
      <input
        id="enhance_sharpness"
        type="range"
        min="0"
        max="10"
        value="0"
      />
    </div>

    <button id="enhance_apply" class="btn" style="margin-top:6px">
      Enhance Image
    </button>

    <p class="small muted" style="margin-top:8px">
      Improve brightness, contrast, and clarity of your image.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="enhance_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <div id="enhance_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#enhance_file');
  const brightnessEl = document.querySelector('#enhance_brightness');
  const contrastEl = document.querySelector('#enhance_contrast');
  const sharpnessEl = document.querySelector('#enhance_sharpness');
  const resultEl = document.querySelector('#enhance_result');
  const previewEl = document.querySelector('#enhance_preview');

  let originalImg = null;

  /* ---------------- UTILS ---------------- */
  function applySharpen(ctx, width, height, amount) {
    if (amount === 0) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);

    const kernel = [
      0, -1, 0,
      -1, 5 + amount, -1,
      0, -1, 0
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;

        for (let c = 0; c < 3; c++) {
          let val = 0;
          let k = 0;

          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const ii = ((y + ky) * width + (x + kx)) * 4 + c;
              val += copy[ii] * kernel[k++];
            }
          }

          data[i + c] = Math.max(0, Math.min(255, val));
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /* ---------------- LOGIC ---------------- */
  function enhanceImage() {
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

    const brightness = brightnessEl.value;
    const contrast = contrastEl.value;
    const sharpness = Number(sharpnessEl.value);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => (img.src = e.target.result);

    img.onload = () => {
      originalImg = img;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
      `;

      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';

      applySharpen(ctx, canvas.width, canvas.height, sharpness);

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);

        previewEl.innerHTML = `
          <img src="${url}" style="max-width:100%;border-radius:6px" />
          <div style="margin-top:6px">
            <a href="${url}" download="enhanced-image.png">
              Download Image
            </a>
          </div>
        `;

        resultEl.innerText = 'Image enhanced';
        resultEl.style.opacity = 1;
      });
    };

    resultEl.innerText = 'Processing...';
    resultEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#enhance_apply')
    .addEventListener('click', enhanceImage);
}
