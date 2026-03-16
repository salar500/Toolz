export function renderImageCrop(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="crop_file"
        type="file"
        accept="image/*"
      />
    </div>

    <div class="form-row">
      <label>Crop Width (px)</label>
      <input
        id="crop_width"
        type="number"
        min="1"
        placeholder="e.g. 300"
      />
    </div>

    <div class="form-row">
      <label>Crop Height (px)</label>
      <input
        id="crop_height"
        type="number"
        min="1"
        placeholder="e.g. 300"
      />
    </div>

    <div class="form-row">
      <label>Offset X (px)</label>
      <input
        id="crop_x"
        type="number"
        min="0"
        placeholder="0"
      />
    </div>

    <div class="form-row">
      <label>Offset Y (px)</label>
      <input
        id="crop_y"
        type="number"
        min="0"
        placeholder="0"
      />
    </div>

    <button id="crop_image" class="btn" style="margin-top:6px">
      Crop Image
    </button>

    <p class="small muted" style="margin-top:8px">
      Crop an image by specifying dimensions and offsets.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="crop_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <div id="crop_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#crop_file');
  const widthEl = document.querySelector('#crop_width');
  const heightEl = document.querySelector('#crop_height');
  const xEl = document.querySelector('#crop_x');
  const yEl = document.querySelector('#crop_y');
  const resultEl = document.querySelector('#crop_result');
  const previewEl = document.querySelector('#crop_preview');

  /* ---------------- LOGIC ---------------- */
  function cropImage() {
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

    const cropWidth = Number(widthEl.value);
    const cropHeight = Number(heightEl.value);
    const offsetX = Number(xEl.value) || 0;
    const offsetY = Number(yEl.value) || 0;

    if (!cropWidth || !cropHeight) {
      resultEl.innerText = 'Please enter crop width and height';
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      img.src = e.target.result;
    };

    img.onload = () => {
      if (
        offsetX + cropWidth > img.width ||
        offsetY + cropHeight > img.height
      ) {
        resultEl.innerText = 'Crop area exceeds image boundaries';
        resultEl.style.opacity = 1;
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        offsetX,
        offsetY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);

        previewEl.innerHTML = `
          <img src="${url}" style="max-width:100%;border-radius:6px" />
          <div style="margin-top:6px">
            <a href="${url}" download="cropped-image.png">
              Download Image
            </a>
          </div>
        `;

        resultEl.innerText = `Cropped to ${cropWidth} × ${cropHeight}px`;
        resultEl.style.opacity = 1;
      });
    };

    resultEl.innerText = 'Processing...';
    resultEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#crop_image')
    .addEventListener('click', cropImage);
}
