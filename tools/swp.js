export function renderSWP(tool) {
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
  if (!document.querySelector('#swp-layout-style')) {
    const style = document.createElement('style');
    style.id = 'swp-layout-style';
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
        background:linear-gradient(135deg,#7c3aed,#6d28d9);
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
        transition:.25s;
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
      <div class="title">SWP Calculator</div>

      <div class="form-row">
        <label>Initial Investment (₹)</label>
        <input id="swp_initial" type="number"
          value="${tool.prefill?.initial || ''}">
      </div>

      <div class="form-row">
        <label>Monthly Withdrawal (₹)</label>
        <input id="swp_monthly" type="number"
          value="${tool.prefill?.monthly || ''}">
      </div>

      <div class="form-row">
        <label>Expected Return Rate (% p.a)</label>
        <input id="swp_rate" type="number" step="0.01"
          value="${tool.prefill?.rate || ''}">
      </div>

      <div class="form-row">
        <label>Withdrawal Duration (Years)</label>
        <input id="swp_years" type="number"
          value="${tool.prefill?.years || ''}">
      </div>

      <button id="swp_calc" class="btn-primary">Calculate SWP</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Remaining Portfolio Value</div>
      <div class="value" id="swp_balance">--</div>

      <div class="row">
        <span>Total Withdrawal</span>
        <span id="swp_withdrawn">--</span>
      </div>

      <div class="row">
        <span>Total Returns</span>
        <span id="swp_returns">--</span>
      </div>
    </div>
  `;

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>SWP Calculator – Strategic Wealth Withdrawal Made Easy</h2>
    <p>Systematic Withdrawal Plans (SWP) allow investors to withdraw a fixed amount from their investment portfolio at regular intervals while keeping the remaining corpus invested. This SWP calculator helps visualize portfolio longevity, potential returns, and total withdrawals over time.</p>

    <h3>Why Use an SWP Calculator?</h3>
    <p>Manual calculations for systematic withdrawals can be complex, especially when factoring in compounding returns. Our SWP calculator simplifies planning by giving accurate estimates of remaining balance, total withdrawals, and returns based on your inputs.</p>

    <h3>How SWP Works</h3>
    <p>Investors deposit an initial lump sum into a mutual fund or other investment vehicle, then withdraw a fixed monthly amount. The remaining investment continues to grow based on the expected return rate. This tool helps determine how long your funds will last and how much you can safely withdraw.</p>

    <h3>Benefits of SWP</h3>
    <ul>
      <li>Predictable monthly income</li>
      <li>Portfolio remains invested and continues to grow</li>
      <li>Helps with retirement planning or regular withdrawals</li>
      <li>Transparent visualization of withdrawals and returns</li>
    </ul>

    <h3>Tips for Effective Withdrawal</h3>
    <p>Start with realistic withdrawal amounts, monitor your portfolio performance, and adjust as needed. Use this SWP calculator to plan sustainable withdrawals and maximize the growth of your remaining portfolio.</p>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const initialEl = document.querySelector('#swp_initial');
  const monthlyEl = document.querySelector('#swp_monthly');
  const rateEl = document.querySelector('#swp_rate');
  const yearsEl = document.querySelector('#swp_years');

  const balanceEl = document.querySelector('#swp_balance');
  const withdrawnEl = document.querySelector('#swp_withdrawn');
  const returnsEl = document.querySelector('#swp_returns');

  /* ---------------- FORMATTER ---------------- */
  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  /* ---------------- CORE LOGIC ---------------- */
  function calculateSWP(initial, monthly, rate, years) {
    if (initial <= 0 || monthly <= 0 || years <= 0) return null;

    const n = years * 12;
    const r = rate / 100 / 12;

    let balance = initial;
    let totalWithdrawn = 0;

    for (let i = 0; i < n; i++) {
      balance = balance * (1 + r) - monthly;
      totalWithdrawn += monthly;
      if (balance <= 0) {
        balance = 0;
        break;
      }
    }

    const returns = balance + totalWithdrawn - initial;
    return { balance, totalWithdrawn, returns };
  }

  /* ---------------- CALCULATE ---------------- */
  document.querySelector('#swp_calc').addEventListener('click', () => {
    const initial = +initialEl.value;
    const monthly = +monthlyEl.value;
    const rate = +rateEl.value;
    const years = +yearsEl.value;

    if (!initial || !monthly || years <= 0) return;

    const res = calculateSWP(initial, monthly, rate, years);
    if (!res) return;

    balanceEl.style.opacity = .4;
    setTimeout(() => {
      balanceEl.innerText = money.format(Math.round(res.balance));
      balanceEl.style.opacity = 1;
    }, 120);

    withdrawnEl.innerText = money.format(res.totalWithdrawn);
    returnsEl.innerText = money.format(Math.round(res.returns));
  });
}
