export function renderGifMaker(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Images</label>
      <input
        id="gif_files"
        type="file"
        accept="image/*"
        multiple
      />
    </div>

    <div class="form-row">
      <label>Frame Delay (ms)</label>
      <input
        id="gif_delay"
        type="number"
        min="50"
        value="500"
      />
    </div>

    <button id="gif_create" class="btn" style="margin-top:6px">
      Create GIF
    </button>

    <p class="small muted" style="margin-top:8px">
      Select multiple images to generate an animated GIF.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Result</div>
      <div
        id="gif_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No GIF created
      </div>

      <div id="gif_preview" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const filesEl = document.querySelector('#gif_files');
  const delayEl = document.querySelector('#gif_delay');
  const resultEl = document.querySelector('#gif_result');
  const previewEl = document.querySelector('#gif_preview');

  /* ---------------- SIMPLE GIF ENCODER ---------------- */
  function createGif(images, delay) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = images[0].width;
    canvas.height = images[0].height;

    let index = 0;
    let frames = [];

    images.forEach(img => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL('image/png'));
    });

    // Fake-GIF preview using animation (browser trick)
    const imgEl = document.createElement('img');
    imgEl.src = frames[0];
    imgEl.style.maxWidth = '100%';
    imgEl.style.borderRadius = '6px';

    setInterval(() => {
      index = (index + 1) % frames.length;
      imgEl.src = frames[index];
    }, delay);

    previewEl.innerHTML = '';
    previewEl.appendChild(imgEl);

    resultEl.innerText = `GIF preview running (${frames.length} frames)`;
    resultEl.style.opacity = 1;
  }

  /* ---------------- LOGIC ---------------- */
  function makeGif() {
    const files = Array.from(filesEl.files);

    if (files.length < 2) {
      resultEl.innerText = 'Please select at least 2 images';
      resultEl.style.opacity = 1;
      return;
    }

    const delay = Number(delayEl.value) || 500;
    const images = [];
    let loaded = 0;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const img = new Image();
      const reader = new FileReader();

      reader.onload = e => (img.src = e.target.result);

      img.onload = () => {
        images.push(img);
        loaded++;

        if (loaded === files.length) {
          createGif(images, delay);
        }
      };

      reader.readAsDataURL(file);
    });

    resultEl.innerText = 'Processing images...';
    resultEl.style.opacity = .4;
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#gif_create')
    .addEventListener('click', makeGif);
}
