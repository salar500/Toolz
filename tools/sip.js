export function renderSIP(tool) {
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
  if (!document.querySelector('#sip-layout-style')) {
    const style = document.createElement('style');
    style.id = 'sip-layout-style';
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
        background:linear-gradient(135deg,#2563eb,#1d4ed8);
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
      <div class="title">Investment Calculator</div>

      <div class="form-row">
        <label>Investment Type</label>
        <select id="inv_type">
          <option value="sip">SIP (Monthly)</option>
          <option value="lumpsum">Lump Sum (One-time)</option>
        </select>
      </div>

      <div class="form-row" id="sip_wrap">
        <label>Monthly Investment (₹)</label>
        <input id="sip_monthly" type="number">
      </div>

      <div class="form-row" id="lumpsum_wrap" style="display:none">
        <label>Lump Sum Investment (₹)</label>
        <input id="lump_amount" type="number">
      </div>

      <div class="form-row">
        <label>Expected Return Rate (% p.a)</label>
        <input id="inv_rate" type="number" step="0.01">
      </div>

      <div class="form-row">
        <label>Investment Duration (Years)</label>
        <input id="inv_years" type="number">
      </div>

      <button id="inv_calc" class="btn-primary">Calculate</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Total Value</div>
      <div class="value" id="inv_value">--</div>

      <div class="row">
        <span>Total Investment</span>
        <span id="inv_invested">--</span>
      </div>

      <div class="row">
        <span>Estimated Returns</span>
        <span id="inv_returns">--</span>
      </div>
    </div>
  `;

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>Comprehensive Guide to SIP and Lump Sum Investments</h2>
    <p>Investing wisely is crucial for building long-term wealth. Our SIP (Systematic Investment Plan) and Lump Sum Investment Calculator provides investors with a clear understanding of potential returns based on monthly contributions or one-time investments. Whether you are a beginner or experienced investor, understanding the power of compounding is key to financial success.</p>

    <h3>Why Calculate Your Investment Returns?</h3>
    <p>Knowing the estimated future value of your investments allows you to plan for your financial goals effectively. It helps you understand how much to invest monthly in a SIP or as a Lump Sum to reach your retirement, education, or wealth accumulation targets. Accurate calculations help in making informed decisions and avoid underestimating or overestimating the investment required.</p>

    <h3>How SIP Works</h3>
    <p>SIP allows you to invest a fixed amount every month in mutual funds. The calculator estimates the total amount based on the monthly investment, expected annual return rate, and investment duration. Compounding interest is applied, showing how your money grows over time. SIPs are ideal for disciplined investors who want gradual wealth creation without market timing.</p>

    <h3>Lump Sum Investments</h3>
    <p>Lump Sum investing involves investing a one-time amount at the beginning of the investment period. The calculator shows projected growth using the expected annual return rate over the years. Lump Sum can be beneficial in a growing market, but it requires careful timing and risk assessment. Our tool helps visualize potential returns and compare them with SIPs.</p>

    <h3>Benefits of Using Our Calculator</h3>
    <ul>
      <li>Quick and accurate investment projections</li>
      <li>Side-by-side comparison of SIP and Lump Sum results</li>
      <li>Clear display of total invested and estimated returns</li>
      <li>Helps in goal-oriented financial planning</li>
      <li>Minimal, clean, and AdSense-friendly layout</li>
    </ul>

    <h3>Tips for Maximizing Returns</h3>
    <p>Start investing early to leverage compounding, diversify your portfolio, and invest regularly. Monitor and adjust investments based on changing financial goals. Use tools like our SIP and Lump Sum calculator to track progress and ensure your investments align with expected returns.</p>

    <p>By understanding both SIP and Lump Sum investment strategies, investors can make informed decisions, manage risk effectively, and achieve financial goals. This tool provides a transparent, user-friendly interface to calculate, compare, and strategize investments for maximum growth over time.</p>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const typeEl = document.querySelector('#inv_type');
  const sipWrap = document.querySelector('#sip_wrap');
  const lumpWrap = document.querySelector('#lumpsum_wrap');

  const sipEl = document.querySelector('#sip_monthly');
  const lumpEl = document.querySelector('#lump_amount');
  const rateEl = document.querySelector('#inv_rate');
  const yearsEl = document.querySelector('#inv_years');

  const valueEl = document.querySelector('#inv_value');
  const investedEl = document.querySelector('#inv_invested');
  const returnsEl = document.querySelector('#inv_returns');

  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  /* ---------------- TOGGLE ---------------- */
  typeEl.addEventListener('change', () => {
    sipWrap.style.display = typeEl.value === 'sip' ? 'block' : 'none';
    lumpWrap.style.display = typeEl.value === 'lumpsum' ? 'block' : 'none';
  });

  /* ---------------- CALCULATE ---------------- */
  document.querySelector('#inv_calc').addEventListener('click', () => {
    const rate = +rateEl.value;
    const years = +yearsEl.value;
    if (rate <= 0 || years <= 0) return;

    let amount = 0;
    let invested = 0;

    if (typeEl.value === 'sip') {
      const monthly = +sipEl.value;
      if (monthly <= 0) return;

      const n = years * 12;
      const r = rate / 100 / 12;

      amount = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      invested = monthly * n;
    } else {
      const lump = +lumpEl.value;
      if (lump <= 0) return;

      amount = lump * Math.pow(1 + rate / 100, years);
      invested = lump;
    }

    const returns = amount - invested;

    valueEl.innerText = money.format(Math.round(amount));
    investedEl.innerText = money.format(Math.round(invested));
    returnsEl.innerText = money.format(Math.round(returns));
  });
}
