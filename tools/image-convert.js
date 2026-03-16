export function renderImageConvert(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="convert_file"
        type="file"
        accept="image/*"
      />
    </div>

    <div class="form-row">
      <label>Convert To</label>
      <select id="convert_format">
        <option value="image/jpeg">JPEG</option>
        <option value="image/png">PNG</option>
        <option value="image/webp">WebP</option>
      </select>
    </div>

    <div class="form-row">
      <label>Quality (JPEG / WebP)</label>
      <input
        id="convert_quality"
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        value="0.9"
      />
    </div>

    <button id="convert_image" class="btn" style="margin-top:6px">
      Convert Image
    </button>

    <p class="small muted" style="margin-top:8px">
      Convert image formats directly in your browser.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="convert_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <div id="convert_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#convert_file');
  const formatEl = document.querySelector('#convert_format');
  const qualityEl = document.querySelector('#convert_quality');
  const resultEl = document.querySelector('#convert_result');
  const previewEl = document.querySelector('#convert_preview');

  /* ---------------- LOGIC ---------------- */
  function convertImage() {
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

    const format = formatEl.value;
    const quality = Number(qualityEl.value);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');

      // Fill background white for formats without alpha (JPEG)
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        blob => {
          const url = URL.createObjectURL(blob);
          const ext =
            format === 'image/jpeg'
              ? 'jpg'
              : format === 'image/png'
              ? 'png'
              : 'webp';

          previewEl.innerHTML = `
            <img src="${url}" style="max-width:100%;border-radius:6px" />
            <div style="margin-top:6px">
              <a href="${url}" download="converted-image.${ext}">
                Download Image
              </a>
            </div>
          `;

          const originalSize = (file.size / 1024).toFixed(1);
          const newSize = (blob.size / 1024).toFixed(1);

          resultEl.innerText =
            `Converted to ${ext.toUpperCase()} · ${originalSize} KB → ${newSize} KB`;
          resultEl.style.opacity = 1;
        },
        format,
        format === 'image/png' ? undefined : quality
      );
    };

    resultEl.innerText = 'Processing...';
    resultEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#convert_image')
    .addEventListener('click', convertImage);
}
