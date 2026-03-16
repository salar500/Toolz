export function renderPhotoToSketch(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Photo</label>
      <input
        id="sketch_file"
        type="file"
        accept="image/*"
      />
    </div>

    <div class="form-row">
      <label>Sketch Intensity</label>
      <input
        id="sketch_intensity"
        type="range"
        min="1"
        max="20"
        step="1"
        value="10"
      />
      <div class="small muted">Higher = stronger edges</div>
    </div>

    <button id="sketch_convert" class="btn" style="margin-top:6px">
      Convert to Sketch
    </button>

    <p class="small muted" style="margin-top:8px">
      Converts a photo into a pencil sketch using edge detection.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="sketch_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <div id="sketch_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#sketch_file');
  const intensityEl = document.querySelector('#sketch_intensity');
  const resultEl = document.querySelector('#sketch_result');
  const previewEl = document.querySelector('#sketch_preview');

  /* ---------------- UTILS ---------------- */
  function clamp(v) {
    return Math.max(0, Math.min(255, v));
  }

  /* ---------------- LOGIC ---------------- */
  function convertToSketch() {
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

    const intensity = Number(intensityEl.value) || 10;

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

      // Convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const gray =
          0.299 * data[i] +
          0.587 * data[i + 1] +
          0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
      }

      // Simple edge detection (Sobel-like)
      const w = canvas.width;
      const h = canvas.height;
      const copy = new Uint8ClampedArray(data);

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = (y * w + x) * 4;

          const gx =
            -copy[((y - 1) * w + (x - 1)) * 4] +
            copy[((y - 1) * w + (x + 1)) * 4] +
            -2 * copy[(y * w + (x - 1)) * 4] +
            2 * copy[(y * w + (x + 1)) * 4] +
            -copy[((y + 1) * w + (x - 1)) * 4] +
            copy[((y + 1) * w + (x + 1)) * 4];

          const gy =
            -copy[((y - 1) * w + (x - 1)) * 4] +
            -2 * copy[((y - 1) * w + x) * 4] +
            -copy[((y - 1) * w + (x + 1)) * 4] +
            copy[((y + 1) * w + (x - 1)) * 4] +
            2 * copy[((y + 1) * w + x) * 4] +
            copy[((y + 1) * w + (x + 1)) * 4];

          const edge = clamp(
            255 - Math.sqrt(gx * gx + gy * gy) * intensity * 0.1
          );

          data[i] = data[i + 1] = data[i + 2] = edge;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);

        previewEl.innerHTML = `
          <img src="${url}" style="max-width:100%;border-radius:6px" />
          <div style="margin-top:6px">
            <a href="${url}" download="photo-sketch.png">
              Download Sketch
            </a>
          </div>
        `;

        resultEl.innerText = 'Sketch generated';
        resultEl.style.opacity = 1;
      });
    };

    resultEl.innerText = 'Processing...';
    resultEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#sketch_convert')
    .addEventListener('click', convertToSketch);
}
