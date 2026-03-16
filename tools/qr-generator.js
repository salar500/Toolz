// Make sure to include QRCode library in your project:
// <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>

export function renderQrGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>QR Code Text / URL</label>
      <input id="qr_text" type="text" placeholder="Enter text or URL"
        value="${tool.prefill?.text || 'https://toolzenhub.com'}">
    </div>

    <div class="form-row">
      <label>Size (px)</label>
      <input id="qr_size" type="number" min="100" max="1000" value="250">
    </div>

    <button id="qr_generate" class="btn" style="margin-top:6px">
      Generate QR Code
    </button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated QR Code</div>
      <canvas id="qr_canvas" style="margin-top:6px; background:#fff;"></canvas>
      <button id="qr_download" class="btn" style="margin-top:6px">Download PNG</button>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const textEl = document.querySelector('#qr_text');
  const sizeEl = document.querySelector('#qr_size');
  const canvasEl = document.querySelector('#qr_canvas');
  const generateBtn = document.querySelector('#qr_generate');
  const downloadBtn = document.querySelector('#qr_download');

  /* ---------------- LOGIC ---------------- */
  async function generateQR() {
    const text = textEl.value.trim();
    const size = Number(sizeEl.value) || 250;

    if (!text) {
      alert('Please enter text or URL for the QR code.');
      return;
    }

    try {
      await QRCode.toCanvas(canvasEl, text, {
        width: size,
        margin: 2,
        color: {
          dark: '#000',
          light: '#ffffff'
        }
      });
    } catch (err) {
      alert('Error generating QR code: ' + err.message);
    }
  }

  function downloadQR() {
    const link = document.createElement('a');
    link.href = canvasEl.toDataURL('image/png');
    link.download = 'qr-code.png';
    link.click();
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateQR);
  downloadBtn.addEventListener('click', downloadQR);

  generateQR(); // auto-generate if prefilled
}
