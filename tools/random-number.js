export function renderRandomNumberGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- EMI STYLE (UI ONLY) ---------------- */
  const style = document.createElement('style');
  style.innerHTML = `
    .emi-card {
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
    }
    .emi-title {
      font-size:18px;
      font-weight:700;
      margin-bottom:10px;
    }
    .emi-form-row {
      margin-bottom:12px;
    }
    .emi-form-row label {
      display:block;
      font-size:13px;
      font-weight:600;
      margin-bottom:4px;
    }
    .emi-form-row input,
    .emi-form-row select {
      width:100%;
      padding:10px;
      border-radius:8px;
      border:1px solid #d1d5db;
      font-size:14px;
    }
    .emi-btn {
      width:100%;
      padding:12px;
      border-radius:10px;
      border:none;
      font-weight:700;
      font-size:15px;
      cursor:pointer;
      background:linear-gradient(135deg,#2563eb,#1d4ed8);
      color:#fff;
      box-shadow:0 6px 14px rgba(37,99,235,.35);
    }
    .emi-result {
      margin-top:16px;
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
      text-align:center;
    }
    .emi-small {
      font-size:12px;
      color:#6b7280;
    }
    .emi-actions {
      display:flex;
      gap:8px;
      justify-content:center;
      margin-top:10px;
    }
    .emi-secondary {
      padding:10px 14px;
      border-radius:10px;
      border:1px solid #e5e7eb;
      font-weight:600;
      background:#f9fafb;
      cursor:pointer;
    }
  `;
  document.head.appendChild(style);

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="emi-card">
      <div class="emi-title">Random Number Generator</div>

      <div class="emi-form-row">
        <label>Lower Limit</label>
        <input id="num_min" type="text" value="1">
      </div>

      <div class="emi-form-row">
        <label>Upper Limit</label>
        <input id="num_max" type="text" value="100">
      </div>

      <div class="emi-form-row">
        <label>Type of Result</label>
        <select id="num_type">
          <option value="integer" selected>Integer</option>
          <option value="decimal">Decimal</option>
        </select>
      </div>

      <div class="emi-form-row">
        <label>How many numbers?</label>
        <input id="num_count" type="number" min="1" max="50" value="1">
      </div>

      <div class="emi-form-row">
        <label>Precision (digits)</label>
        <input id="num_precision" type="number" min="0" max="999" value="2">
      </div>

      <button id="num_generate" class="emi-btn">
        Generate Random Number
      </button>

      <p class="emi-small" style="margin-top:8px">
        Works fully offline. Supports very large integers and high-precision decimals.
      </p>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="emi-result">
      <div class="emi-small">Generated Result</div>
      <textarea id="num_output" rows="4" style="width:100%;margin-top:10px;display:none" readonly></textarea>

      <div class="emi-actions" id="num_actions" style="display:none">
        <button id="num_copy" class="emi-secondary">Copy</button>
        <button id="num_download" class="emi-secondary">Download</button>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const minEl = document.querySelector('#num_min');
  const maxEl = document.querySelector('#num_max');
  const typeEl = document.querySelector('#num_type');
  const countEl = document.querySelector('#num_count');
  const precisionEl = document.querySelector('#num_precision');
  const generateBtn = document.querySelector('#num_generate');
  const outputEl = document.querySelector('#num_output');
  const actionsEl = document.querySelector('#num_actions');
  const copyBtn = document.querySelector('#num_copy');
  const downloadBtn = document.querySelector('#num_download');

  /* ---------------- LOGIC ---------------- */
  function generateRandom() {
    const min = parseFloat(minEl.value);
    const max = parseFloat(maxEl.value);
    const count = Math.max(1, Number(countEl.value));
    const precision = Math.max(0, Number(precisionEl.value));

    if (isNaN(min) || isNaN(max) || min > max) {
      alert('Invalid range');
      return;
    }

    const results = [];
    for (let i = 0; i < count; i++) {
      if (typeEl.value === 'integer') {
        const n = Math.floor(Math.random() * (max - min + 1)) + min;
        results.push(n.toString());
      } else {
        const n = Math.random() * (max - min) + min;
        results.push(n.toFixed(precision));
      }
    }

    outputEl.value = results.join('\n');
    outputEl.style.display = 'block';
    actionsEl.style.display = 'flex';
  }

  /* ---------------- ACTIONS ---------------- */
  copyBtn.addEventListener('click', () => {
    outputEl.select();
    document.execCommand('copy');
  });

  downloadBtn.addEventListener('click', () => {
    const blob = new Blob([outputEl.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'random-numbers.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateRandom);
}
