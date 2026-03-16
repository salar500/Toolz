export function renderMemeTextGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Upload Image</label>
      <input id="meme_image" type="file" accept="image/*" />
    </div>

    <div class="form-row">
      <label>Top Text</label>
      <input id="meme_top_text" type="text" placeholder="Enter top text" value="${tool.prefill?.top || ''}">
    </div>

    <div class="form-row">
      <label>Bottom Text</label>
      <input id="meme_bottom_text" type="text" placeholder="Enter bottom text" value="${tool.prefill?.bottom || ''}">
    </div>

    <button id="meme_generate" class="btn" style="margin-top:6px">Generate Meme</button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated Meme</div>
      <canvas id="meme_canvas" style="margin-top:6px; max-width:100%; background:#fff;"></canvas>
      <button id="meme_download" class="btn" style="margin-top:6px">Download Meme</button>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const imageEl = document.querySelector('#meme_image');
  const topTextEl = document.querySelector('#meme_top_text');
  const bottomTextEl = document.querySelector('#meme_bottom_text');
  const canvasEl = document.querySelector('#meme_canvas');
  const generateBtn = document.querySelector('#meme_generate');
  const downloadBtn = document.querySelector('#meme_download');
  const ctx = canvasEl.getContext('2d');

  let img = new Image();

  /* ---------------- LOGIC ---------------- */
  function generateMeme() {
    if (!img.src) {
      alert('Please upload an image first.');
      return;
    }

    const canvasWidth = img.width;
    const canvasHeight = img.height;
    canvasEl.width = canvasWidth;
    canvasEl.height = canvasHeight;

    // Draw image
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, 0, 0);

    // Text settings
    const fontSize = Math.floor(canvasHeight / 10);
    ctx.font = `${fontSize}px Impact`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.floor(fontSize / 10);
    ctx.textAlign = 'center';

    // Draw top text
    const topText = topTextEl.value.toUpperCase();
    ctx.fillText(topText, canvasWidth / 2, fontSize + 10);
    ctx.strokeText(topText, canvasWidth / 2, fontSize + 10);

    // Draw bottom text
    const bottomText = bottomTextEl.value.toUpperCase();
    ctx.fillText(bottomText, canvasWidth / 2, canvasHeight - 10);
    ctx.strokeText(bottomText, canvasWidth / 2, canvasHeight - 10);
  }

  function downloadMeme() {
    const link = document.createElement('a');
    link.href = canvasEl.toDataURL('image/png');
    link.download = 'meme.png';
    link.click();
  }

  /* ---------------- EVENTS ---------------- */
  imageEl.addEventListener('change', () => {
    const file = imageEl.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  generateBtn.addEventListener('click', generateMeme);
  downloadBtn.addEventListener('click', downloadMeme);
}
