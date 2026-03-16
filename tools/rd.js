export function renderRD(tool) {
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

  /* ---------------- INLINE STYLES (NO DUPLICATION) ---------------- */
  if (!document.querySelector('#rd-layout-style')) {
    const style = document.createElement('style');
    style.id = 'rd-layout-style';
    style.innerHTML = `
      #tool-row {
        display:flex;
        gap:24px;
        align-items:flex-start;
        margin-bottom:32px;
        flex-wrap:wrap;
      }

      #tool-row > div {
        flex:1;
        min-width:280px;
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

      .form-row input,
      .form-row select {
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
        color:#1d4ed8;
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
      <div class="title">Recurring Deposit (RD) Calculator</div>

      <div class="form-row">
        <label>Monthly Deposit (₹)</label>
        <input id="rd_monthly" type="number" min="1"
          value="${tool.prefill?.monthly || ''}">
      </div>

      <div class="form-row">
        <label>Interest Rate (% p.a)</label>
        <input id="rd_rate" type="number" min="0" step="0.01"
          value="${tool.prefill?.rate || ''}">
      </div>

      <div class="form-row">
        <label>Time Period (Years)</label>
        <input id="rd_time" type="number" min="1"
          value="${tool.prefill?.time || ''}">
      </div>

      <button id="rd_calc" class="btn-primary">Calculate RD</button>
    </div>
  `;

  /* ---------------- RESULT ONLY ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Maturity Amount</div>
      <div id="rd_amount" class="value">--</div>

      <div class="row">
        <span>Total Investment</span>
        <span id="rd_invested">--</span>
      </div>

      <div class="row">
        <span>Interest Earned</span>
        <span id="rd_interest">--</span>
      </div>
    </div>
  `;

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>Recurring Deposit (RD) Calculator – Grow Your Savings Monthly</h2>
    <p>
      Recurring deposits are a disciplined way to save regularly and earn interest
      over time. With fixed monthly contributions, RDs provide predictable returns
      and help you plan for future financial goals such as education, marriage,
      or emergency funds. Our RD Calculator lets you estimate your maturity amount
      and interest earned quickly and accurately.
    </p>

    <h3>Why Use an RD Calculator?</h3>
    <p>
      Calculating maturity manually can be tedious and prone to mistakes, especially
      with monthly compounding. This calculator instantly shows you the total maturity
      amount, total invested capital, and interest earned, enabling better financial
      decisions and comparison across banks or schemes.
    </p>

    <h3>Understanding RD Growth</h3>
    <p>
      Regular monthly deposits combined with compound interest result in significant
      savings growth over time. By adjusting the monthly deposit, interest rate,
      or tenure, you can see how small changes can impact your overall returns.
      This insight helps you plan efficiently and meet long-term objectives.
    </p>

    <h3>Choosing the Right Tenure</h3>
    <p>
      Longer tenures typically yield higher interest due to compounding. However,
      short-term RDs offer flexibility. Using this calculator, you can experiment
      with different durations to identify the tenure that balances liquidity and
      returns for your needs.
    </p>

    <h3>Impact of Interest Rates</h3>
    <p>
      Higher interest rates significantly boost maturity returns. The RD Calculator
      allows you to quickly assess the effect of varying interest rates, helping
      you select the most lucrative options while maintaining risk-free growth.
    </p>

    <h3>Benefits of Regular Monitoring</h3>
    <p>
      Using this tool regularly helps you track your savings, plan reinvestments,
      and ensure that your financial goals stay on course. It also allows comparisons
      across banks and schemes for maximum returns while keeping your savings secure.
    </p>

    <h3>Conclusion</h3>
    <p>
      Our RD Calculator is designed for simplicity, accuracy, and clarity. Start
      using it today to manage your monthly savings effectively, plan your future
      expenses, and achieve your financial objectives with confidence.
    </p>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const monthlyEl = document.querySelector('#rd_monthly');
  const rateEl = document.querySelector('#rd_rate');
  const timeEl = document.querySelector('#rd_time');

  const amountEl = document.querySelector('#rd_amount');
  const investedEl = document.querySelector('#rd_invested');
  const interestEl = document.querySelector('#rd_interest');

  /* ---------------- FORMATTER ---------------- */
  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  });

  /* ---------------- CORE LOGIC ---------------- */
  function calculateRD(monthly, rate, years) {
    const n = years * 12;
    const r = rate / 100 / 12;

    let maturity = 0;
    for (let i = 0; i < n; i++) {
      maturity += monthly * Math.pow(1 + r, n - i);
    }

    const invested = monthly * n;
    const interest = maturity - invested;

    return { maturity, invested, interest };
  }

  /* ---------------- CALCULATE ---------------- */
  function calculate() {
    const M = +monthlyEl.value;
    const R = +rateEl.value;
    const T = +timeEl.value;

    if (!M || T <= 0) return;

    const res = calculateRD(M, R, T);

    amountEl.style.opacity = .4;
    setTimeout(() => {
      amountEl.innerText = money.format(res.maturity);
      amountEl.style.opacity = 1;
    }, 120);

    investedEl.innerText = money.format(res.invested);
    interestEl.innerText = money.format(res.interest);
  }

  /* ---------------- EVENTS ---------------- */
  document.querySelector('#rd_calc').addEventListener('click', calculate);
}
