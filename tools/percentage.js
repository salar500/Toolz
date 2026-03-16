export function renderPercentage(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- LAYOUT STRUCTURE (MATCH EMI STYLE) ---------------- */
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

  /* ---------------- INLINE STYLES (NO DUPLICATION) ---------------- */
  if (!document.querySelector('#percentage-layout-style')) {
    const style = document.createElement('style');
    style.id = 'percentage-layout-style';
    style.innerHTML = `
      #tool-row {
        display:flex;
        gap:24px;
        align-items:flex-start;
        margin-bottom:32px;
      }

      #tool-row > div {
        flex:1;
      }

      @media(max-width:768px){
        #tool-row{
          flex-direction:column;
        }
      }

      #seo-container {
        background:#fff;
        padding:26px;
        border-radius:14px;
        box-shadow:0 8px 20px rgba(0,0,0,.05);
        margin-bottom:28px;
        line-height:1.8;
        font-size:15px;
      }

      #seo-container h2 {
        margin-top:0;
        font-size:22px;
      }

      #seo-container h3 {
        margin-top:20px;
        font-size:18px;
      }
    `;
    document.head.appendChild(style);
  }

  /* ================= INPUT UI ================= */
  inputs.innerHTML = `
    <style>
      .btn-row {
        display:flex;
        justify-content:flex-end;
        gap:8px;
        margin-top:10px;
      }
    </style>

    <div class="card">
      <h3 class="title">Percentage Calculator</h3>

      <div class="form-row">
        <label>Percentage (%)</label>
        <input id="p1_percent" type="number">
      </div>

      <div class="form-row">
        <label>Of Value</label>
        <input id="p1_base" type="number">
      </div>

      <div class="btn-row">
        <button id="p1_clear" class="btn muted">Clear</button>
        <button id="p1_calc" class="btn">Calculate</button>
      </div>
    </div>

    <div class="card">
      <h3 class="title">Common Percentage Calculations</h3>

      <div class="form-row">
        <label>What is</label>
        <input id="p2_percent" type="number" placeholder="%">
        <input id="p2_value" type="number" placeholder="of value">
      </div>

      <div class="btn-row">
        <button id="p2_clear" class="btn muted">Clear</button>
        <button id="p2_calc" class="btn">Calculate</button>
      </div>

      <hr>

      <div class="form-row">
        <label>Is What %</label>
        <input id="p3_part" type="number">
        <input id="p3_total" type="number">
      </div>

      <div class="btn-row">
        <button id="p3_clear" class="btn muted">Clear</button>
        <button id="p3_calc" class="btn">Calculate</button>
      </div>

      <hr>

      <div class="form-row">
        <label>Is % of What</label>
        <input id="p4_result" type="number">
        <input id="p4_percent" type="number">
      </div>

      <div class="btn-row">
        <button id="p4_clear" class="btn muted">Clear</button>
        <button id="p4_calc" class="btn">Calculate</button>
      </div>
    </div>

    <div class="card">
      <h3 class="title">Percentage Difference</h3>

      <div class="form-row">
        <label>Value 1</label>
        <input id="d1" type="number">
      </div>

      <div class="form-row">
        <label>Value 2</label>
        <input id="d2" type="number">
      </div>

      <div class="btn-row">
        <button id="diff_clear" class="btn muted">Clear</button>
        <button id="diff_calc" class="btn">Calculate</button>
      </div>
    </div>

    <div class="card">
      <h3 class="title">Percentage Change</h3>

      <div class="form-row">
        <label>Initial Value</label>
        <input id="c_initial" type="number">
      </div>

      <div class="form-row">
        <label>Final Value</label>
        <input id="c_final" type="number">
      </div>

      <div class="btn-row">
        <button id="change_clear" class="btn muted">Clear</button>
        <button id="change_calc" class="btn">Calculate</button>
      </div>
    </div>
  `;

  /* ================= RESULT UI ================= */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Result</div>
      <div id="pct_result" style="font-size:28px;font-weight:700">--</div>
      <div id="pct_formula" class="muted"></div>
    </div>
  `;

  /* ================= SEO CONTENT ================= */
  seoContainer.innerHTML = `
    <h2>Percentage Calculator – Accurate & Instant Results</h2>
    <p>
      This free online percentage calculator helps you quickly calculate percentages,
      percentage increases, decreases, and differences between two numbers.
      Whether you're solving academic math problems, calculating shopping discounts,
      tracking financial growth, or analyzing business data, this tool provides
      instant and reliable answers.
    </p>

    <h3>How to Calculate a Percentage</h3>
    <p>
      To find a percentage of a number, multiply the percentage value by the number
      and divide by 100. For example, 15% of 200 equals 30.
      Instead of performing manual calculations, this calculator gives you
      precise results in seconds.
    </p>

    <h3>Percentage Increase and Decrease</h3>
    <p>
      Percentage change shows how much a value has increased or decreased
      compared to its original amount. The formula subtracts the initial value
      from the final value, divides by the initial value, and multiplies by 100.
      This is commonly used in finance, economics, and performance tracking.
    </p>

    <h3>Percentage Difference</h3>
    <p>
      Percentage difference compares two values relative to their average.
      It is widely used in statistics and data analysis to measure variation
      between numbers.
    </p>

    <h3>Practical Uses of Percentage Calculations</h3>
    <ul>
      <li>Calculating discounts and taxes</li>
      <li>Measuring profit margins</li>
      <li>Tracking investment growth</li>
      <li>Analyzing academic grades</li>
      <li>Budget and expense planning</li>
    </ul>

    <p>
      Use this fast and lightweight percentage calculator anytime you need
      accurate results without complicated formulas. Bookmark it for quick access
      and simplify your everyday calculations.
    </p>
  `;

  const out = document.querySelector('#pct_result');
  const formula = document.querySelector('#pct_formula');

  const show = (val, text = '') => {
    out.innerText = val;
    formula.innerText = text;
  };

  p1_calc.onclick = () =>
    show(((+p1_percent.value / 100) * +p1_base.value).toFixed(2));
  p1_clear.onclick = () => show('--');

  p2_calc.onclick = () =>
    show(((+p2_percent.value / 100) * +p2_value.value).toFixed(2));
  p2_clear.onclick = () => show('--');

  p3_calc.onclick = () =>
    show(((+p3_part.value / +p3_total.value) * 100).toFixed(2) + '%');
  p3_clear.onclick = () => show('--');

  p4_calc.onclick = () =>
    show((+p4_result.value * 100 / +p4_percent.value).toFixed(2));
  p4_clear.onclick = () => show('--');

  diff_calc.onclick = () => {
    const a = +d1.value, b = +d2.value;
    show((Math.abs(a - b) / ((a + b) / 2) * 100).toFixed(2) + '%');
  };
  diff_clear.onclick = () => show('--');

  change_calc.onclick = () => {
    const i = +c_initial.value, f = +c_final.value;
    show(((f - i) / i * 100).toFixed(2) + '%');
  };
  change_clear.onclick = () => show('--');
}
