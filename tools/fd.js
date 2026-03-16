export function renderFD(tool) {
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
  if (!document.querySelector('#fd-layout-style')) {
    const style = document.createElement('style');
    style.id = 'fd-layout-style';
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
      <div class="title">Fixed Deposit Calculator</div>

      <div class="form-row">
        <label>Deposit Amount (₹)</label>
        <input id="fd_principal" type="number" min="1"
          value="${tool.prefill?.principal || ''}">
      </div>

      <div class="form-row">
        <label>Interest Rate (% p.a)</label>
        <input id="fd_rate" type="number" min="0" step="0.01"
          value="${tool.prefill?.rate || ''}">
      </div>

      <div class="form-row">
        <label>Time Period (Years)</label>
        <input id="fd_time" type="number" min="0.25" step="0.25"
          value="${tool.prefill?.time || ''}">
      </div>

      <div class="form-row">
        <label>Compounding Frequency</label>
        <select id="fd_frequency">
          <option value="1">Yearly</option>
          <option value="2">Half-Yearly</option>
          <option value="4" selected>Quarterly</option>
          <option value="12">Monthly</option>
        </select>
      </div>

      <button id="fd_calc" class="btn-primary">Calculate FD</button>
    </div>
  `;

  /* ---------------- RESULT ONLY ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Maturity Amount</div>
      <div id="fd_amount" class="value">--</div>

      <div class="row">
        <span>Total Investment</span>
        <span id="fd_principal_out">--</span>
      </div>

      <div class="row">
        <span>Interest Earned</span>
        <span id="fd_interest_out">--</span>
      </div>
    </div>
  `;

  /* ---------------- SEO CONTENT ONLY ---------------- */
  seoContainer.innerHTML = `
    <h2>Fixed Deposit Calculator – Secure Your Savings Efficiently</h2>
    <p>
      A fixed deposit (FD) is a reliable way to grow your savings with guaranteed returns.
      Planning your investments and understanding the maturity amount is essential to
      meet financial goals like buying a home, funding education, or retirement planning.
      Our Fixed Deposit Calculator provides a simple, accurate method to calculate
      your returns instantly.
    </p>

    <h3>Why Use a Fixed Deposit Calculator?</h3>
    <p>
      Manually calculating compound interest can be complicated and prone to errors.
      By entering the deposit amount, interest rate, tenure, and compounding frequency,
      this calculator instantly displays your maturity amount and interest earned.
      It helps compare different banks and schemes for optimal returns.
    </p>

    <h3>Understanding Compounding Frequency</h3>
    <p>
      Compounding frequency directly affects the interest earned. Quarterly, monthly,
      or half-yearly compounding can significantly change your returns over the deposit
      period. Experimenting with different options using this tool enables smarter
      investment planning.
    </p>

    <h3>Choosing the Right Deposit Period</h3>
    <p>
      Short-term deposits provide flexibility but lower returns, while long-term deposits
      offer higher interest due to compounding. The FD Calculator allows you to visualize
      growth over different periods and select the tenure that best fits your financial
      objectives.
    </p>

    <h3>Impact of Interest Rates</h3>
    <p>
      Interest rates vary across banks and economic conditions. A slight increase in rate
      can significantly enhance maturity returns. Using this calculator, you can explore
      multiple scenarios, ensuring that your investment decisions are data-driven.
    </p>

    <h3>Benefits of Monitoring Your Investments</h3>
    <p>
      Regularly using this FD calculator helps track your savings, plan reinvestments,
      and compare schemes. It ensures maximum growth of your funds while keeping risk
      minimal, providing clarity for long-term financial planning.
    </p>

    <h3>Achieve Your Financial Goals</h3>
    <p>
      Whether saving for a major purchase, education, or retirement, this tool allows
      you to set realistic expectations and strategize your deposits. Start calculating
      today to take full control of your savings journey.
    </p>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const principalEl = document.querySelector('#fd_principal');
  const rateEl = document.querySelector('#fd_rate');
  const timeEl = document.querySelector('#fd_time');
  const freqEl = document.querySelector('#fd_frequency');

  const amountEl = document.querySelector('#fd_amount');
  const principalOut = document.querySelector('#fd_principal_out');
  const interestOut = document.querySelector('#fd_interest_out');

  /* ---------------- FORMATTER ---------------- */
  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  });

  /* ---------------- CORE LOGIC (UNCHANGED) ---------------- */
  function calculateFD(P, R, T, N) {
    if (!P || R < 0 || T <= 0) return null;

    const rate = R / 100;
    const amount = P * Math.pow(1 + rate / N, N * T);
    const interest = amount - P;

    return { amount, interest };
  }

  /* ---------------- CALCULATE ---------------- */
  function calculate() {
    const P = +principalEl.value;
    const R = +rateEl.value;
    const T = +timeEl.value;
    const N = +freqEl.value;

    if (!P || T <= 0) return;

    const res = calculateFD(P, R, T, N);
    if (!res) return;

    amountEl.style.opacity = .4;
    setTimeout(() => {
      amountEl.innerText = money.format(res.amount);
      amountEl.style.opacity = 1;
    }, 120);

    principalOut.innerText = money.format(P);
    interestOut.innerText = money.format(res.interest);
  }

  /* ---------------- EVENTS ---------------- */
  document.querySelector('#fd_calc').addEventListener('click', calculate);
}
