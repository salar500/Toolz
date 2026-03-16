export function renderRandomString(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Length</label>
      <input id="str_length" type="number" value="16" min="1" style="width:100px"/>
    </div>

    <div class="form-row" style="margin-top:6px">
      <label>Character Set</label>
      <select id="char_set" style="width:100%">
        <option value="alphanumeric">Alphanumeric (a-z, A-Z, 0-9)</option>
        <option value="alpha">Alphabetic (a-z, A-Z)</option>
        <option value="numeric">Numeric (0-9)</option>
        <option value="hex">Hexadecimal (0-9, a-f)</option>
        <option value="custom">Custom</option>
      </select>
    </div>

    <div class="form-row" style="margin-top:6px; display:none" id="custom_set_row">
      <label>Custom Characters</label>
      <input id="custom_chars" type="text" placeholder="Enter your characters here"/>
    </div>

    <button id="generate_str" class="btn" style="margin-top:6px">
      Generate Random String
    </button>

    <p class="small muted" style="margin-top:8px">
      Generates a random string of specified length and character set.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Random String</div>
      <textarea
        id="str_output"
        rows="3"
        style="width:100%;margin-top:8px;font-size:12px;display:none">
      </textarea>

      <div id="str_actions" style="margin-top:6px;display:none">
        <button id="str_copy" class="btn small">Copy</button>
        <button id="str_download" class="btn small">Download .txt</button>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const lengthEl = document.querySelector('#str_length');
  const charsetEl = document.querySelector('#char_set');
  const customRowEl = document.querySelector('#custom_set_row');
  const customCharsEl = document.querySelector('#custom_chars');
  const generateBtn = document.querySelector('#generate_str');
  const outputEl = document.querySelector('#str_output');
  const actionsEl = document.querySelector('#str_actions');
  const copyBtn = document.querySelector('#str_copy');
  const downloadBtn = document.querySelector('#str_download');

  /* ---------------- LOGIC ---------------- */
  const charSets = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numeric: '0123456789',
    hex: '0123456789abcdef',
  };

  charsetEl.addEventListener('change', () => {
    customRowEl.style.display = charsetEl.value === 'custom' ? 'block' : 'none';
  });

  function generateRandomString() {
    const length = parseInt(lengthEl.value);
    if (isNaN(length) || length <= 0) {
      alert('Invalid length');
      return;
    }

    let chars = charsetEl.value === 'custom' ? customCharsEl.value : charSets[charsetEl.value];
    if (!chars) {
      alert('Character set is empty');
      return;
    }

    let resultStr = '';
    for (let i = 0; i < length; i++) {
      resultStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    outputEl.value = resultStr;
    outputEl.style.display = 'block';
    actionsEl.style.display = 'flex';
    outputEl.select();
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
    a.download = 'random-string.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateRandomString);
}
