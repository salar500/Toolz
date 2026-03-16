export function renderImageCompress(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="compress_file"
        type="file"
        accept="image/*"
      />
    </div>

    <div class="form-row">
      <label>Quality</label>
      <input
        id="compress_quality"
        type="range"
        min="0.1"
        max="1"
        step="0.05"
        value="0.8"
      />
      <div class="small muted">
        Lower quality = smaller file size
      </div>
    </div>

    <button id="compress_image" class="btn" style="margin-top:6px">
      Compress Image
    </button>

    <p class="small muted" style="margin-top:8px">
      Compress images directly in your browser without uploading.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="compress_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <div id="compress_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#compress_file');
  const qualityEl = document.querySelector('#compress_quality');
  const resultEl = document.querySelector('#compress_result');
  const previewEl = document.querySelector('#compress_preview');

  /* ---------------- LOGIC ---------------- */
  function compressImage() {
    const file = fileEl.files[0];

    if (!file) {
      resultEl.innerText = 'Please select an image file';
      resultEl.style.opacity = 1;
      return;
    }

    if (!file.type.startsWith('image/')) {
      resultEl.innerText = 'Invalid file type';
      return;
    }

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
      ctx.drawImage(img, 0, 0);

      const quality = Number(qualityEl.value);

      canvas.toBlob(
        blob => {
          const url = URL.createObjectURL(blob);

          const originalSize = (file.size / 1024).toFixed(1);
          const compressedSize = (blob.size / 1024).toFixed(1);

          previewEl.innerHTML = `
            <img src="${url}" style="max-width:100%;border-radius:6px" />
            <div style="margin-top:6px">
              <a href="${url}" download="compressed-image.jpg">
                Download Image
              </a>
            </div>
          `;

          resultEl.innerText =
            `Original: ${originalSize} KB → Compressed: ${compressedSize} KB`;
          resultEl.style.opacity = 1;
        },
        'image/jpeg',
        quality
      );
    };

    resultEl.innerText = 'Processing...';
    resultEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#compress_image')
    .addEventListener('click', compressImage);
}
