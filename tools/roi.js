export function renderROI(tool) {
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
  if (!document.querySelector('#roi-layout-style')) {
    const style = document.createElement('style');
    style.id = 'roi-layout-style';
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

      .card {
        padding:16px;
        border-radius:14px;
        background:#fff;
        box-shadow:0 8px 20px rgba(0,0,0,.06);
      }

      .title {
        font-size:18px;
        font-weight:700;
        margin-bottom:12px;
      }

      .form-row { margin-bottom:12px; }

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

      .btn-primary {
        width:100%;
        padding:12px;
        border-radius:10px;
        border:none;
        font-weight:700;
        font-size:15px;
        cursor:pointer;
        background:linear-gradient(135deg,#16a34a,#15803d);
        color:#fff;
      }

      .result-card {
        padding:16px;
        border-radius:14px;
        background:#fff;
        box-shadow:0 8px 20px rgba(0,0,0,.06);
      }

      .small { font-size:12px; color:#6b7280; }

      .value {
        font-size:30px;
        font-weight:800;
        margin:6px 0 14px;
        color:#16a34a;
      }

      .row {
        display:flex;
        justify-content:space-between;
        font-size:14px;
        padding:6px 0;
        border-top:1px dashed #e5e7eb;
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

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">ROI Calculator</div>

      <div class="form-row">
        <label>Investment Amount (₹)</label>
        <input id="roi_invest" type="number" min="0" value="${tool.prefill?.invest || ''}" />
      </div>

      <div class="form-row">
        <label>Return Amount (₹)</label>
        <input id="roi_return" type="number" min="0" value="${tool.prefill?.return || ''}" />
      </div>

      <div class="form-row">
        <label>Investment Start Year</label>
        <input id="roi_start" type="number" min="1900" value="${tool.prefill?.start || ''}" />
      </div>

      <div class="form-row">
        <label>Investment End Year</label>
        <input id="roi_end" type="number" min="1900" value="${tool.prefill?.end || ''}" />
      </div>

      <button id="roi_calc" class="btn-primary">Calculate ROI</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">ROI Result</div>
      <div class="value" id="roi_type">--</div>

      <div class="row"><span>Net Gain / Loss</span><span id="roi_amount">--</span></div>
      <div class="row"><span>ROI Percentage</span><span id="roi_percent">--</span></div>
      <div class="row"><span>Annualized ROI (%)</span><span id="roi_annual">--</span></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const investEl = document.querySelector('#roi_invest');
  const returnEl = document.querySelector('#roi_return');
  const startEl = document.querySelector('#roi_start');
  const endEl = document.querySelector('#roi_end');

  const typeEl = document.querySelector('#roi_type');
  const amountEl = document.querySelector('#roi_amount');
  const percentEl = document.querySelector('#roi_percent');
  const annualEl = document.querySelector('#roi_annual');

  /* ---------------- FORMATTER ---------------- */
  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  });

  /* ---------------- CORE LOGIC ---------------- */
  function calculateROI(invest, ret, start, end) {
    if (invest <= 0 || end <= start) return null;

    const diff = ret - invest;
    const percent = (diff / invest) * 100;
    const years = end - start;
    const annualized = years > 0 ? (Math.pow(ret / invest, 1 / years) - 1) * 100 : 0;

    return {
      type: diff > 0 ? 'Profit' : diff < 0 ? 'Loss' : 'No Gain / No Loss',
      amount: Math.abs(diff),
      percent: percent,
      annualized: annualized
    };
  }

  /* ---------------- CALCULATE ---------------- */
  document.querySelector('#roi_calc').addEventListener('click', () => {
    const invest = +investEl.value;
    const ret = +returnEl.value;
    const start = +startEl.value;
    const end = +endEl.value;

    if (!invest || !ret || !start || !end) return;

    const res = calculateROI(invest, ret, start, end);
    if (!res) return;

    typeEl.innerText = res.type;
    amountEl.innerText = money.format(res.amount);
    percentEl.innerText = `${res.percent.toFixed(2)} %`;
    annualEl.innerText = `${res.annualized.toFixed(2)} %`;
  });

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>ROI Calculator – Track Your Investment Returns</h2>
    <p>
      Return on Investment (ROI) is a crucial metric for evaluating the profitability of any investment.
      This ROI calculator helps you determine the net gain or loss, ROI percentage, and annualized return
      to make better financial decisions. Using this tool, you can instantly see the performance of your
      investments and compare different options to maximize profits.
    </p>

    <h3>How to Use the ROI Calculator</h3>
    <p>
      Simply enter the investment amount, expected return, and the start and end years of your investment.
      Click the 'Calculate ROI' button to view the results. The calculator will display whether you made
      a profit or loss, the total ROI percentage, and annualized ROI for a clear understanding of returns.
    </p>

    <h3>Understanding the Results</h3>
    <p>
      <strong>Net Gain / Loss:</strong> Difference between the return and initial investment.<br/>
      <strong>ROI Percentage:</strong> Total return expressed as a percentage of the investment.<br/>
      <strong>Annualized ROI:</strong> Yearly compounded return, useful for comparing investments over time.
    </p>

    <h3>Benefits of Using the ROI Calculator</h3>
    <p>
      Accurately evaluate investments, plan for financial goals, and identify the most profitable
      opportunities. This tool saves time, reduces calculation errors, and allows informed decision-making.
    </p>
  `;
}
