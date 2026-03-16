
export function renderBase64Encoder(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Input Text</label>
      <textarea
        id="b64_text_input"
        rows="4"
        style="width:100%"
        placeholder="Enter text to encode to Base64"></textarea>
    </div>

    <div class="form-row">
      <label>Or select an image</label>
      <input
        id="b64_file_input"
        type="file"
        accept="image/*"
      />
    </div>

    <button id="b64_encode" class="btn" style="margin-top:6px">
      Encode to Base64
    </button>

    <p class="small muted" style="margin-top:8px">
      Encode text or image into Base64 format.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Base64 Output</div>
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
  const textInputEl = document.querySelector('#b64_text_input');
  const fileInputEl = document.querySelector('#b64_file_input');
  const encodeBtn = document.querySelector('#b64_encode');
  const outputEl = document.querySelector('#b64_output');
  const actionsEl = document.querySelector('#b64_actions');
  const copyBtn = document.querySelector('#b64_copy');
  const downloadBtn = document.querySelector('#b64_download');

  /* ---------------- LOGIC ---------------- */
  function encodeBase64() {
    const text = textInputEl.value.trim();
    const file = fileInputEl.files[0];

    outputEl.style.display = 'none';
    actionsEl.style.display = 'none';

    if (!text && !file) {
      alert('Enter text or select an image to encode');
      return;
    }

    if (text) {
      // Encode text
      const encoded = btoa(text);
      outputEl.value = encoded;
      outputEl.style.display = 'block';
      actionsEl.style.display = 'flex';
      outputEl.select();
    } else if (file) {
      // Encode image
      if (!file.type.startsWith('image/')) {
        alert('Invalid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        const base64 = e.target.result; // already includes data:image/...;base64,
        outputEl.value = base64;
        outputEl.style.display = 'block';
        actionsEl.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    }
  }

  /* ---------------- ACTIONS ---------------- */
  copyBtn.addEventListener('click', () => {
    outputEl.select();
    document.execCommand('copy');
    alert('Copied to clipboard');
  });

  downloadBtn.addEventListener('click', () => {
    const blob = new Blob([outputEl.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'encoded.txt';
    a.click();

    URL.revokeObjectURL(url);
  });

  /* ---------------- EVENTS ---------------- */
  encodeBtn.addEventListener('click', encodeBase64);
}
