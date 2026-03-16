export function renderImageRotate(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="rotate_file"
        type="file"
        accept="image/*"
      />
    </div>

    <div class="form-row">
      <label>Rotation</label>
      <select id="rotate_angle">
        <option value="90">90° Clockwise</option>
        <option value="180">180°</option>
        <option value="270">270° Clockwise</option>
        <option value="-90">90° Counter-Clockwise</option>
      </select>
    </div>

    <button id="rotate_image" class="btn" style="margin-top:6px">
      Rotate Image
    </button>

    <p class="small muted" style="margin-top:8px">
      Rotate images directly in your browser.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="rotate_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <div id="rotate_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#rotate_file');
  const angleEl = document.querySelector('#rotate_angle');
  const resultEl = document.querySelector('#rotate_result');
  const previewEl = document.querySelector('#rotate_preview');

  /* ---------------- LOGIC ---------------- */
  function rotateImage() {
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

    const angle = Number(angleEl.value);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const radians = (angle * Math.PI) / 180;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Swap width/height for 90° or 270°
      if (Math.abs(angle) === 90 || Math.abs(angle) === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2
      );

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);

        previewEl.innerHTML = `
          <img src="${url}" style="max-width:100%;border-radius:6px" />
          <div style="margin-top:6px">
            <a href="${url}" download="rotated-image.png">
              Download Image
            </a>
          </div>
        `;

        resultEl.innerText = `Rotated ${angle}°`;
        resultEl.style.opacity = 1;
      });
    };

    resultEl.innerText = 'Processing...';
    resultEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#rotate_image')
    .addEventListener('click', rotateImage);
}
