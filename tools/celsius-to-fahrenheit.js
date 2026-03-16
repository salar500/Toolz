export function renderCelsiusToFahrenheit(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INLINE STYLES ---------------- */
  const style = document.createElement('style');
  style.innerHTML = `
    .card {
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
    }
    .title {
      font-size:18px;
      font-weight:700;
      margin-bottom:10px;
    }
    .form-row {
      margin-bottom:12px;
    }
    .form-row label {
      display:block;
      font-size:13px;
      font-weight:600;
      margin-bottom:4px;
    }
    .form-row input {
      width:100%;
      padding:10px;
      border-radius:8px;
      border:1px solid #d1d5db;
      font-size:14px;
    }
    .segmented {
      display:flex;
      background:#f2f4f8;
      padding:4px;
      border-radius:10px;
      margin-bottom:14px;
    }
    .segmented button {
      flex:1;
      border:none;
      background:transparent;
      padding:10px;
      font-weight:600;
      border-radius:8px;
      cursor:pointer;
      color:#555;
      transition:.25s;
    }
    .segmented button.active {
      background:linear-gradient(135deg,#2563eb,#1d4ed8);
      color:#fff;
      box-shadow:0 4px 10px rgba(37,99,235,.3);
    }
    .result-card {
      margin-top:16px;
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
    }
    .small {
      font-size:12px;
      color:#6b7280;
    }
    .value {
      font-size:28px;
      font-weight:700;
      margin-top:6px;
      color:#1d4ed8;
      transition:.25s;
    }
  `;
  document.head.appendChild(style);

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Celsius ↔ Fahrenheit Converter</div>

      <div class="segmented" id="converter_mode">
        <button data-mode="c-to-f" class="active">C° → F°</button>
        <button data-mode="f-to-c">F° → C°</button>
      </div>

      <div class="form-row">
        <label id="input_label">Temperature in Celsius (°C)</label>
        <input id="temp_input" type="number" step="0.01" placeholder="e.g. 37">
      </div>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small" id="output_label">Temperature in Fahrenheit (°F)</div>
      <div class="value" id="temp_output">—</div>
      <div class="small muted" id="formula_label" style="margin-top:10px">
        Formula: (°C × 9 / 5) + 32
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#temp_input');
  const outputEl = document.querySelector('#temp_output');
  const inputLabel = document.querySelector('#input_label');
  const outputLabel = document.querySelector('#output_label');
  const formulaLabel = document.querySelector('#formula_label');
  const modeButtons = document.querySelectorAll('#converter_mode button');

  let mode = 'c-to-f';

  /* ---------------- TOGGLE MODE ---------------- */
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      mode = btn.dataset.mode;

      if (mode === 'c-to-f') {
        inputLabel.innerText = 'Temperature in Celsius (°C)';
        outputLabel.innerText = 'Temperature in Fahrenheit (°F)';
        formulaLabel.innerText = 'Formula: (°C × 9 / 5) + 32';
      } else {
        inputLabel.innerText = 'Temperature in Fahrenheit (°F)';
        outputLabel.innerText = 'Temperature in Celsius (°C)';
        formulaLabel.innerText = 'Formula: (°F − 32) × 5 / 9';
      }

      inputEl.value = '';
      outputEl.innerText = '—';
    });
  });

  /* ---------------- CONVERT LOGIC ---------------- */
  function convert() {
    const val = Number(inputEl.value);
    if (isNaN(val)) {
      outputEl.innerText = '—';
      return;
    }

    if (mode === 'c-to-f') {
      outputEl.innerText = `${((val * 9 / 5) + 32).toFixed(2)} °F`;
    } else {
      outputEl.innerText = `${((val - 32) * 5 / 9).toFixed(2)} °C`;
    }
  }

  inputEl.addEventListener('input', convert);
}
