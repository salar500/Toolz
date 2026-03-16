export function renderClipboardViewer(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <button id="clipboard_read" class="btn">
      Read Clipboard
    </button>

    <p class="small muted" style="margin-top:8px">
      Click to view text content currently stored in your clipboard.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Clipboard Content</div>
      <div
        id="clipboard_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No content read yet
      </div>

      <textarea
        id="clipboard_output"
        rows="6"
        style="width:100%;margin-top:8px;font-size:12px;display:none">
      </textarea>

      <div id="clipboard_actions" style="margin-top:6px;display:none">
        <button id="clipboard_copy" class="btn small">Copy</button>
        <button id="clipboard_download" class="btn small">Download .txt</button>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const readBtn = document.querySelector('#clipboard_read');
  const resultEl = document.querySelector('#clipboard_result');
  const outputEl = document.querySelector('#clipboard_output');
  const actionsEl = document.querySelector('#clipboard_actions');
  const copyBtn = document.querySelector('#clipboard_copy');
  const downloadBtn = document.querySelector('#clipboard_download');

  /* ---------------- LOGIC ---------------- */
  async function readClipboard() {
    try {
      const text = await navigator.clipboard.readText();

      if (!text) {
        resultEl.innerText = 'Clipboard is empty or contains non-text data';
        resultEl.style.opacity = 1;
        return;
      }

      outputEl.value = text;
      outputEl.style.display = 'block';
      actionsEl.style.display = 'flex';
      actionsEl.style.gap = '6px';

      resultEl.innerText = 'Clipboard content read';
      resultEl.style.opacity = 1;
    } catch (err) {
      resultEl.innerText = `Error reading clipboard: ${err.message}`;
      resultEl.style.opacity = 1;
    }
  }

  /* ---------------- ACTIONS ---------------- */
  copyBtn.addEventListener('click', () => {
    outputEl.select();
    document.execCommand('copy');
    resultEl.innerText = 'Copied to clipboard';
  });

  downloadBtn.addEventListener('click', () => {
    const blob = new Blob([outputEl.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'clipboard.txt';
    a.click();

    URL.revokeObjectURL(url);
  });

  /* ---------------- EVENTS ---------------- */
  readBtn.addEventListener('click', readClipboard);
}
