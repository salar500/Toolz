export function renderImageToBase64(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="b64_file"
        type="file"
        accept="image/*"
      />
    </div>

    <button id="b64_convert" class="btn" style="margin-top:6px">
      Convert to Base64
    </button>

    <p class="small muted" style="margin-top:8px">
      Converts an image to Base64 encoding.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Base64 Output</div>
      <div
        id="b64_status"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image processed
      </div>

      <textarea
        id="b64_output"
        rows="6"
        style="width:100%;margin-top:8px;font-size:12px;display:none">
      </textarea>

      <div id="b64_actions" style="margin-top:6px;display:none">
        <button id="b64_copy" class="btn small">Copy</button>
        <button id="b64_download" class="btn small">Download .txt</button>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#b64_file');
  const statusEl = document.querySelector('#b64_status');
  const outputEl = document.querySelector('#b64_output');
  const actionsEl = document.querySelector('#b64_actions');
  const copyBtn = document.querySelector('#b64_copy');
  const downloadBtn = document.querySelector('#b64_download');

  /* ---------------- LOGIC ---------------- */
  function convertToBase64() {
    const file = fileEl.files[0];

    if (!file) {
      statusEl.innerText = 'Please select an image file';
      statusEl.style.opacity = 1;
      return;
    }

    if (!file.type.startsWith('image/')) {
      statusEl.innerText = 'Invalid image file';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      outputEl.value = reader.result;
      outputEl.style.display = 'block';
      actionsEl.style.display = 'flex';
      actionsEl.style.gap = '6px';

      statusEl.innerText = 'Base64 generated';
      statusEl.style.opacity = 1;
    };

    statusEl.innerText = 'Converting...';
    statusEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- ACTIONS ---------------- */
  copyBtn.addEventListener('click', () => {
    outputEl.select();
    document.execCommand('copy');
    statusEl.innerText = 'Copied to clipboard';
  });

  downloadBtn.addEventListener('click', () => {
    const blob = new Blob([outputEl.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'image-base64.txt';
    a.click();

    URL.revokeObjectURL(url);
  });

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#b64_convert')
    .addEventListener('click', convertToBase64);
}
