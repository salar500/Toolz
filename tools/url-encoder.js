export function renderUrlEncoder(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Enter Text to Encode</label>
      <textarea
        id="url_input"
        rows="4"
        style="width:100%"
        placeholder="Enter text to URL-encode..."></textarea>
    </div>

    <button id="url_encode" class="btn" style="margin-top:6px">
      Encode URL
    </button>

    <p class="small muted" style="margin-top:8px">
      Converts plain text into a URL-encoded string.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Encoded Output</div>
      <textarea
        id="url_output"
        rows="4"
        style="width:100%;margin-top:8px;font-size:12px;display:none">
      </textarea>

      <div id="url_actions" style="margin-top:6px;display:none">
        <button id="url_copy" class="btn small">Copy</button>
        <button id="url_download" class="btn small">Download .txt</button>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#url_input');
  const encodeBtn = document.querySelector('#url_encode');
  const outputEl = document.querySelector('#url_output');
  const actionsEl = document.querySelector('#url_actions');
  const copyBtn = document.querySelector('#url_copy');
  const downloadBtn = document.querySelector('#url_download');

  /* ---------------- LOGIC ---------------- */
  function encodeUrl() {
    const text = inputEl.value.trim();
    if (!text) {
      alert('Please enter text to encode');
      return;
    }

    try {
      const encoded = encodeURIComponent(text);
      outputEl.value = encoded;
      outputEl.style.display = 'block';
      actionsEl.style.display = 'flex';
      outputEl.select();
    } catch (err) {
      alert('Error encoding text: ' + err.message);
      outputEl.style.display = 'none';
      actionsEl.style.display = 'none';
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
  encodeBtn.addEventListener('click', encodeUrl);
}
