export function renderCmToInch(tool) {
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
  if (!document.querySelector('#cm-inch-style')) {
    const style = document.createElement('style');
    style.id = 'cm-inch-style';
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
      <div class="title">CM ↔ Inch Converter</div>

      <div class="segmented" id="converter_mode">
        <button data-mode="cm-to-inch" class="active">CM → Inch</button>
        <button data-mode="inch-to-cm">Inch → CM</button>
      </div>

      <div class="form-row">
        <label id="input_label">Length in Centimeters (cm)</label>
        <input id="length_input" type="number" step="0.01" placeholder="e.g. 170">
      </div>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small" id="output_label">Length in Inches (in)</div>
      <div class="value" id="length_output">—</div>
      <div class="small muted" id="formula_label" style="margin-top:10px">Formula: cm ÷ 2.54</div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#length_input');
  const outputEl = document.querySelector('#length_output');
  const inputLabel = document.querySelector('#input_label');
  const outputLabel = document.querySelector('#output_label');
  const formulaLabel = document.querySelector('#formula_label');
  const modeButtons = document.querySelectorAll('#converter_mode button');

  let mode = 'cm-to-inch';

  /* ---------------- TOGGLE MODE ---------------- */
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      mode = btn.dataset.mode;

      if (mode === 'cm-to-inch') {
        inputLabel.innerText = 'Length in Centimeters (cm)';
        outputLabel.innerText = 'Length in Inches (in)';
        formulaLabel.innerText = 'Formula: cm ÷ 2.54';
      } else {
        inputLabel.innerText = 'Length in Inches (in)';
        outputLabel.innerText = 'Length in Centimeters (cm)';
        formulaLabel.innerText = 'Formula: in × 2.54';
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

    if (mode === 'cm-to-inch') {
      outputEl.innerText = `${(val / 2.54).toFixed(2)} in`;
    } else {
      outputEl.innerText = `${(val * 2.54).toFixed(2)} cm`;
    }
  }

  inputEl.addEventListener('input', convert);

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>CM ↔ Inch Converter – Quick & Accurate Measurement Tool</h2>
    <p>
      Easily convert between centimeters and inches using this CM ↔ Inch Converter.
      Whether you are measuring height, length, or any other dimension, this tool
      provides instant and precise results.
    </p>

    <h3>How to Use the Converter</h3>
    <ol>
      <li>Select the conversion mode: CM → Inch or Inch → CM.</li>
      <li>Enter the value in the input field.</li>
      <li>The converted result appears instantly below.</li>
    </ol>

    <h3>Conversion Formulas</h3>
    <ul>
      <li><strong>Centimeters to Inches:</strong> inches = centimeters ÷ 2.54</li>
      <li><strong>Inches to Centimeters:</strong> centimeters = inches × 2.54</li>
    </ul>

    <h3>Practical Applications</h3>
    <ul>
      <li>Convert height measurements for fitness or health tracking.</li>
      <li>Convert lengths for sewing, carpentry, or DIY projects.</li>
      <li>Quickly switch between metric and imperial units when needed.</li>
    </ul>

    <h3>Benefits of Using This Tool</h3>
    <ul>
      <li>Fast, accurate, and easy to use.</li>
      <li>No manual calculations required.</li>
      <li>Accessible on all devices – desktop, tablet, or mobile.</li>
      <li>Helps maintain consistency when measuring and comparing units.</li>
    </ul>

    <p>
      Use this CM ↔ Inch Converter regularly to ensure precise measurements,
      improve accuracy in your projects, and simplify conversions between metric
      and imperial systems.
    </p>
  `;
}
