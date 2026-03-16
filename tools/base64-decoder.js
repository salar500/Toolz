export function renderBase64Decoder(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Base64 Input</label>
      <textarea
        id="b64_input"
        rows="6"
        style="width:100%"
        placeholder="Paste your Base64 string here">
      </textarea>
    </div>

    <button id="b64_decode" class="btn" style="margin-top:6px">
      Decode
    </button>

    <p class="small muted" style="margin-top:8px">
      Decodes a Base64 string into text or image.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Decoded Output</div>
      <div
        id="b64_status"
        style="font-size:14px;font-weight:600;opacity:.6">
        No data decoded yet
      </div>

      <textarea
        id="b64_text_output"
        rows="6"
        style="width:100%;margin-top:8px;font-size:12px;display:none">
      </textarea>

      <div id="b64_image_output" style="margin-top:10px;display:none"></div>

      <div id="b64_actions" style="margin-top:6px;display:none">
        <button id="b64_copy" class="btn small">Copy Text</button>
        <button id="b64_download" class="btn small">Download File</button>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#b64_input');
  const decodeBtn = document.querySelector('#b64_decode');
  const statusEl = document.querySelector('#b64_status');
  const textOutputEl = document.querySelector('#b64_text_output');
  const imageOutputEl = document.querySelector('#b64_image_output');
  const actionsEl = document.querySelector('#b64_actions');
  const copyBtn = document.querySelector('#b64_copy');
  const downloadBtn = document.querySelector('#b64_download');

  /* ---------------- LOGIC ---------------- */
  function decodeBase64() {
    const input = inputEl.value.trim();
    if (!input) {
      statusEl.innerText = 'Please enter a Base64 string';
      statusEl.style.opacity = 1;
      return;
    }

    let isImage = /^data:image\/([a-zA-Z]+);base64,/.test(input);
    textOutputEl.style.display = 'none';
    imageOutputEl.style.display = 'none';
    actionsEl.style.display = 'none';

    try {
      if (isImage) {
        imageOutputEl.innerHTML = `<img src="${input}" style="max-width:100%;border-radius:6px" />`;
        imageOutputEl.style.display = 'block';
        downloadBtn.onclick = () => {
          const a = document.createElement('a');
          a.href = input;
          a.download = 'image.png';
          a.click();
        };
        actionsEl.style.display = 'flex';
        copyBtn.style.display = 'none'; // copy not needed for images
      } else {
        const decoded = atob(input);
        textOutputEl.value = decoded;
        textOutputEl.style.display = 'block';
        actionsEl.style.display = 'flex';
        copyBtn.style.display = 'inline-block';
        copyBtn.onclick = () => {
          textOutputEl.select();
          document.execCommand('copy');
          statusEl.innerText = 'Text copied to clipboard';
        };
        downloadBtn.onclick = () => {
          const blob = new Blob([decoded], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'decoded.txt';
          a.click();
          URL.revokeObjectURL(url);
        };
      }

      statusEl.innerText = 'Decoding successful';
      statusEl.style.opacity = 1;
    } catch (err) {
      statusEl.innerText = 'Invalid Base64 string';
      statusEl.style.opacity = 1;
    }
  }

  /* ---------------- EVENTS ---------------- */
  decodeBtn.addEventListener('click', decodeBase64);
}
