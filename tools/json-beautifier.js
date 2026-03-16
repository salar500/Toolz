export function renderJsonBeautifier(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Paste JSON</label>
      <textarea
        id="json_input"
        rows="8"
        style="width:100%"
        placeholder='{"key":"value"}'></textarea>
    </div>

    <button id="json_beautify" class="btn" style="margin-top:6px">
      Beautify JSON
    </button>

    <p class="small muted" style="margin-top:8px">
      Beautify (pretty-print) JSON for readability.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Beautified JSON</div>
      <textarea
        id="json_output"
        rows="8"
        style="width:100%;margin-top:8px;font-size:12px;display:none">
      </textarea>

      <div id="json_actions" style="margin-top:6px;display:none">
        <button id="json_copy" class="btn small">Copy</button>
        <button id="json_download" class="btn small">Download .json</button>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#json_input');
  const beautifyBtn = document.querySelector('#json_beautify');
  const outputEl = document.querySelector('#json_output');
  const actionsEl = document.querySelector('#json_actions');
  const copyBtn = document.querySelector('#json_copy');
  const downloadBtn = document.querySelector('#json_download');

  /* ---------------- LOGIC ---------------- */
  function beautifyJson() {
    const text = inputEl.value.trim();
    if (!text) {
      alert('Please enter JSON');
      return;
    }

    try {
      const obj = JSON.parse(text);
      const pretty = JSON.stringify(obj, null, 2);
      outputEl.value = pretty;
      outputEl.style.display = 'block';
      actionsEl.style.display = 'flex';
      outputEl.select();
    } catch (err) {
      alert('Invalid JSON: ' + err.message);
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
    const blob = new Blob([outputEl.value], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'beautified.json';
    a.click();

    URL.revokeObjectURL(url);
  });

  /* ---------------- EVENTS ---------------- */
  beautifyBtn.addEventListener('click', beautifyJson);
}
