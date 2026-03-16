export function renderImageFlip(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="flip_file"
        type="file"
        accept="image/*"
      />
    </div>

    <div class="form-row">
      <label>Flip Direction</label>
      <select id="flip_direction">
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
      </select>
    </div>

    <button id="flip_image" class="btn" style="margin-top:6px">
      Flip Image
    </button>

    <p class="small muted" style="margin-top:8px">
      Flip images horizontally or vertically.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="flip_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <div id="flip_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#flip_file');
  const directionEl = document.querySelector('#flip_direction');
  const resultEl = document.querySelector('#flip_result');
  const previewEl = document.querySelector('#flip_preview');

  /* ---------------- LOGIC ---------------- */
  function flipImage() {
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

    const direction = directionEl.value;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.save();

      if (direction === 'horizontal') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
      }

      ctx.drawImage(img, 0, 0);
      ctx.restore();

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);

        previewEl.innerHTML = `
          <img src="${url}" style="max-width:100%;border-radius:6px" />
          <div style="margin-top:6px">
            <a href="${url}" download="flipped-image.png">
              Download Image
            </a>
          </div>
        `;

        resultEl.innerText =
          direction === 'horizontal'
            ? 'Flipped horizontally'
            : 'Flipped vertically';
        resultEl.style.opacity = 1;
      });
    };

    resultEl.innerText = 'Processing...';
    resultEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#flip_image')
    .addEventListener('click', flipImage);
}
