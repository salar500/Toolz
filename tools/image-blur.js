export function renderImageBlur(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="blur_file"
        type="file"
        accept="image/*"
      />
    </div>

    <div class="form-row">
      <label>Blur Strength</label>
      <input
        id="blur_amount"
        type="range"
        min="0"
        max="20"
        value="5"
      />
      <div class="small muted">Higher = more blur</div>
    </div>

    <button id="blur_apply" class="btn" style="margin-top:6px">
      Apply Blur
    </button>

    <p class="small muted" style="margin-top:8px">
      Blur images directly in your browser.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="blur_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <div id="blur_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#blur_file');
  const blurEl = document.querySelector('#blur_amount');
  const resultEl = document.querySelector('#blur_result');
  const previewEl = document.querySelector('#blur_preview');

  /* ---------------- LOGIC ---------------- */
  function blurImage() {
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

    const blurAmount = Number(blurEl.value);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => (img.src = e.target.result);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);

        previewEl.innerHTML = `
          <img src="${url}" style="max-width:100%;border-radius:6px" />
          <div style="margin-top:6px">
            <a href="${url}" download="blurred-image.png">
              Download Image
            </a>
          </div>
        `;

        resultEl.innerText = `Blur applied (${blurAmount}px)`;
        resultEl.style.opacity = 1;
      });
    };

    resultEl.innerText = 'Processing...';
    resultEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#blur_apply')
    .addEventListener('click', blurImage);
}
