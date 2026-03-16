export function renderCsvToJson(tool) {
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
    .form-row input,
    .form-row textarea {
      width:100%;
      padding:10px;
      border-radius:8px;
      border:1px solid #d1d5db;
      font-size:14px;
      font-family:monospace;
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
  `;
  document.head.appendChild(style);

  /*/* ---------------- INPUT UI ---------------- */
inputs.innerHTML = `
  <div class="card">
    <div class="title">CSV ↔ JSON Converter</div>

    <div class="segmented" id="converter_mode">
      <button data-mode="csv-to-json" class="active">CSV → JSON</button>
      <button data-mode="json-to-csv">JSON → CSV</button>
    </div>

    <div class="form-row" id="csv_input_wrap">
      <label>Paste CSV Data</label>
      <textarea id="csv_text" rows="6" placeholder="name,age,city&#10;John,25,Delhi"></textarea>
    </div>

    <div class="form-row" id="json_input_wrap" style="display:none">
      <label>Paste JSON Data</label>
      <textarea id="json_text" rows="10" placeholder='[{"name":"John","age":25}]'></textarea>
    </div>

    <button id="convert_btn" class="btn" style="margin-top:6px">Convert</button>
  </div>
`;


  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small" id="output_label">Output</div>
      <textarea id="output_text" rows="10" readonly style="width:100%;margin-top:8px">—</textarea>
      <button id="copy_btn" class="btn" style="margin-top:8px">Copy</button>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const modeButtons = document.querySelectorAll('#converter_mode button');
  const csvWrap = document.querySelector('#csv_input_wrap');
  const jsonWrap = document.querySelector('#json_input_wrap');
  const csvFile = document.querySelector('#csv_file');
  const csvText = document.querySelector('#csv_text');
  const jsonText = document.querySelector('#json_text');
  const outputText = document.querySelector('#output_text');
  const convertBtn = document.querySelector('#convert_btn');
  const copyBtn = document.querySelector('#copy_btn');

  let mode = 'csv-to-json';

  /* ---------------- TOGGLE MODE ---------------- */
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      mode = btn.dataset.mode;

      if (mode === 'csv-to-json') {
        csvWrap.style.display = 'block';
        jsonWrap.style.display = 'none';
        outputText.value = '—';
      } else {
        csvWrap.style.display = 'none';
        jsonWrap.style.display = 'block';
        outputText.value = '—';
      }
    });
  });

  /* ---------------- PARSERS ---------------- */
  function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i] ?? '');
      return obj;
    });
  }

  function convertCSVtoJSON() {
    let csv = csvText.value.trim();
    if (!csv && csvFile.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        csvText.value = e.target.result;
        convertCSVtoJSON();
      };
      reader.readAsText(csvFile.files[0]);
      return;
    }
    if (!csv) {
      outputText.value = 'No CSV data provided';
      return;
    }
    try {
      const json = parseCSV(csv);
      outputText.value = JSON.stringify(json, null, 2);
    } catch {
      outputText.value = 'Invalid CSV format';
    }
  }

  function convertJSONtoCSV() {
    let jsonStr = jsonText.value.trim();
    if (!jsonStr) {
      outputText.value = 'No JSON data provided';
      return;
    }
    try {
      const arr = JSON.parse(jsonStr);
      if (!Array.isArray(arr) || arr.length === 0) throw new Error();
      const headers = Object.keys(arr[0]);
      const lines = arr.map(obj => headers.map(h => obj[h] ?? '').join(','));
      outputText.value = headers.join(',') + '\n' + lines.join('\n');
    } catch {
      outputText.value = 'Invalid JSON format';
    }
  }

  /* ---------------- EVENTS ---------------- */
  convertBtn.addEventListener('click', () => {
    if (mode === 'csv-to-json') convertCSVtoJSON();
    else convertJSONtoCSV();
  });

  copyBtn.addEventListener('click', () => {
    outputText.select();
    document.execCommand('copy');
  });
}
