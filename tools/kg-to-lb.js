export function renderKgToLbs(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- LAYOUT STRUCTURE ---------------- */
  let toolRow = document.querySelector('#tool-row');
  if (!toolRow) {
    toolRow = document.createElement('div');
    toolRow.id = 'tool-row';
    inputs.parentNode.insertBefore(toolRow, inputs);
    toolRow.appendChild(inputs);
    toolRow.appendChild(result);
  }

  let seoContainer = document.querySelector('#seo-container');
  if (!seoContainer) {
    seoContainer = document.createElement('div');
    seoContainer.id = 'seo-container';
    toolRow.parentNode.insertBefore(seoContainer, toolRow.nextSibling);
  }

  /* ---------------- INLINE STYLES ---------------- */
  if (!document.querySelector('#kg-lb-style')) {
    const style = document.createElement('style');
    style.id = 'kg-lb-style';
    style.innerHTML = `
      #tool-row { display:flex; gap:24px; align-items:flex-start; margin-bottom:32px; }
      #tool-row > div { flex:1; }
      @media(max-width:768px){ #tool-row{ flex-direction:column; } }

      .card { padding:16px; border-radius:14px; background:#fff; box-shadow:0 8px 20px rgba(0,0,0,.06); }
      .title { font-size:18px; font-weight:700; margin-bottom:12px; }
      .form-row { margin-bottom:12px; }
      .form-row label { display:block; font-size:13px; font-weight:600; margin-bottom:4px; }
      .form-row input { width:100%; padding:10px; border-radius:8px; border:1px solid #d1d5db; font-size:14px; }

      .segmented { display:flex; background:#f2f4f8; padding:4px; border-radius:10px; margin-bottom:14px; }
      .segmented button { flex:1; border:none; background:transparent; padding:10px; font-weight:600; border-radius:8px; cursor:pointer; color:#555; transition:.25s; }
      .segmented button.active { background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; box-shadow:0 4px 10px rgba(37,99,235,.3); }

      .result-card { margin-top:16px; padding:16px; border-radius:14px; background:#fff; box-shadow:0 8px 20px rgba(0,0,0,.06); }
      .small { font-size:12px; color:#6b7280; }
      .value { font-size:28px; font-weight:700; margin-top:6px; color:#1d4ed8; transition:.25s; }

      #seo-container { background:#fff; padding:26px; border-radius:14px; box-shadow:0 8px 20px rgba(0,0,0,.05); margin-bottom:28px; line-height:1.8; font-size:15px; }
      #seo-container h2 { margin-top:0; font-size:22px; }
      #seo-container h3 { margin-top:20px; font-size:18px; }
    `;
    document.head.appendChild(style);
  }

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Kg ↔ Lbs Converter</div>

      <div class="segmented" id="converter_mode">
        <button data-mode="kg-to-lb" class="active">Kg → Lbs</button>
        <button data-mode="lb-to-kg">Lbs → Kg</button>
      </div>

      <div class="form-row">
        <label id="input_label">Weight in Kilograms (kg)</label>
        <input id="weight_input" type="number" min="0" step="0.01" placeholder="e.g. 70" value="${tool.prefill?.kg || ''}">
      </div>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small" id="output_label">Weight in Pounds (lb)</div>
      <div class="value" id="weight_output">—</div>
      <div class="small muted" id="formula_label" style="margin-top:10px">Formula: kg × 2.20462</div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#weight_input');
  const outputEl = document.querySelector('#weight_output');
  const inputLabel = document.querySelector('#input_label');
  const outputLabel = document.querySelector('#output_label');
  const formulaLabel = document.querySelector('#formula_label');
  const modeButtons = document.querySelectorAll('#converter_mode button');

  let mode = 'kg-to-lb';

  /* ---------------- TOGGLE MODE ---------------- */
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      mode = btn.dataset.mode;

      if (mode === 'kg-to-lb') {
        inputLabel.innerText = 'Weight in Kilograms (kg)';
        outputLabel.innerText = 'Weight in Pounds (lb)';
        formulaLabel.innerText = 'Formula: kg × 2.20462';
      } else {
        inputLabel.innerText = 'Weight in Pounds (lb)';
        outputLabel.innerText = 'Weight in Kilograms (kg)';
        formulaLabel.innerText = 'Formula: lb ÷ 2.20462';
      }

      inputEl.value = '';
      outputEl.innerText = '—';
    });
  });

  /* ---------------- CONVERT LOGIC ---------------- */
  function convert() {
    const val = Number(inputEl.value);
    if (isNaN(val) || val < 0) {
      outputEl.innerText = '—';
      return;
    }

    if (mode === 'kg-to-lb') {
      outputEl.innerText = `${(val * 2.2046226218).toFixed(2)} lb`;
    } else {
      outputEl.innerText = `${(val / 2.2046226218).toFixed(2)} kg`;
    }
  }

  inputEl.addEventListener('input', convert);
  convert(); // auto-run if prefilled

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>Kg ↔ Lbs Converter – Fast & Accurate Weight Conversion</h2>
    <p>
      Convert weights easily between kilograms and pounds using this intuitive Kg ↔ Lbs Converter.
      Perfect for fitness tracking, shipping calculations, or any scenario requiring quick and precise weight conversions.
    </p>

    <h3>How to Use</h3>
    <ol>
      <li>Select the conversion mode: Kg → Lbs or Lbs → Kg.</li>
      <li>Enter the weight value in the input field.</li>
      <li>The converted result will display instantly below.</li>
    </ol>

    <h3>Conversion Formulas</h3>
    <ul>
      <li><strong>Kilograms to Pounds:</strong> lbs = kg × 2.20462</li>
      <li><strong>Pounds to Kilograms:</strong> kg = lbs ÷ 2.20462</li>
    </ul>

    <h3>Practical Applications</h3>
    <ul>
      <li>Fitness and bodybuilding: track your weight in preferred units.</li>
      <li>Shipping and logistics: convert packages and parcels accurately.</li>
      <li>International travel: quickly switch between metric and imperial units.</li>
    </ul>

    <h3>Benefits of Using This Converter</h3>
    <ul>
      <li>Fast and precise results without manual calculation.</li>
      <li>Easy-to-use interface suitable for all users.</li>
      <li>Responsive design, works well on desktop, tablet, or mobile.</li>
      <li>Ensures consistency when measuring or comparing weights.</li>
    </ul>

    <p>
      Regular use of this Kg ↔ Lbs Converter helps maintain accuracy in weight measurements,
      simplifies unit conversions, and saves time in daily fitness or business tasks.
    </p>
  `;
}
