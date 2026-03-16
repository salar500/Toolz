export function renderCompoundInterest(tool) {
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
  if (!document.querySelector('#ci-layout-style')) {
    const style = document.createElement('style');
    style.id = 'ci-layout-style';
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
        #tool-row {
          flex-direction:column;
        }
      }

      .card {
        padding:16px;
        border-radius:14px;
        background:#fff;
        box-shadow:0 10px 24px rgba(0,0,0,.08);
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
        box-shadow:0 6px 14px rgba(37,99,235,.35);
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
      <div class="title">Compound Interest Calculator</div>

      <div class="form-row">
        <label>Principal Amount (₹)</label>
        <input id="ci_principal" type="number" min="1"
          value="${tool.prefill?.principal || ''}">
      </div>

      <div class="form-row">
        <label>Annual Interest Rate (%)</label>
        <input id="ci_rate" type="number" min="0" step="0.01"
          value="${tool.prefill?.rate || ''}">
      </div>

      <div class="form-row">
        <label>Time Period (Years)</label>
        <input id="ci_time" type="number" min="1" step="0.1"
          value="${tool.prefill?.time || ''}">
      </div>

      <div class="form-row">
        <label>Compounding Frequency</label>
        <select id="ci_frequency">
          <option value="1">Yearly</option>
          <option value="2">Half-Yearly</option>
          <option value="4">Quarterly</option>
          <option value="12">Monthly</option>
        </select>
      </div>

      <button id="ci_calc" class="btn-primary">Calculate Interest</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Final Amount</div>
      <div class="value" id="ci_amount">--</div>

      <div class="row">
        <span>Total Investment</span>
        <span id="ci_principal_out">--</span>
      </div>

      <div class="row">
        <span>Total Interest</span>
        <span id="ci_interest_out">--</span>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const principalEl = document.querySelector('#ci_principal');
  const rateEl = document.querySelector('#ci_rate');
  const timeEl = document.querySelector('#ci_time');
  const freqEl = document.querySelector('#ci_frequency');

  const amountEl = document.querySelector('#ci_amount');
  const principalOut = document.querySelector('#ci_principal_out');
  const interestOut = document.querySelector('#ci_interest_out');

  /* ---------------- FORMATTER ---------------- */
  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  });

  /* ---------------- CORE LOGIC (UNCHANGED) ---------------- */
  function calculateCompoundInterest(P, R, T, N) {
    if (!P || T <= 0) return null;
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

    if (!P || R < 0 || !T) return;

    const res = calculateCompoundInterest(P, R, T, N);
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
  document.querySelector('#ci_calc').addEventListener('click', calculate);

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>Compound Interest Calculator – Grow Your Wealth Efficiently</h2>
    <p>
      A compound interest calculator is an essential financial tool that allows you
      to project your investment growth over time. Whether you are saving for retirement,
      a home, or your child's education, understanding how your money compounds
      helps in making informed financial decisions. By factoring in principal, interest rate,
      time period, and compounding frequency, this calculator provides a clear picture
      of your future wealth.
    </p>

    <h3>Understanding Compound Interest</h3>
    <p>
      Compound interest is the process where interest is calculated not only on the
      initial principal but also on the accumulated interest of previous periods.
      This “interest on interest” effect accelerates wealth growth over time,
      making early and consistent investing highly beneficial.
    </p>

    <h3>How This Calculator Works</h3>
    <p>
      By entering your principal amount, annual interest rate, investment duration,
      and compounding frequency, the calculator instantly computes your final amount
      along with total interest earned. You can experiment with different compounding
      options—yearly, half-yearly, quarterly, or monthly—to see how more frequent
      compounding increases returns over time.
    </p>

    <h3>Importance of Compounding Frequency</h3>
    <p>
      The frequency of compounding plays a significant role in the growth of your investment.
      Monthly compounding typically yields higher returns compared to quarterly or yearly
      compounding due to more frequent accumulation of interest. This calculator allows
      you to visualize these differences quickly.
    </p>

    <h3>Benefits of Using a Compound Interest Calculator</h3>
    <ul>
      <li>Quickly estimate future value of investments</li>
      <li>Plan long-term savings efficiently</li>
      <li>Compare different investment scenarios</li>
      <li>Set realistic financial goals and timelines</li>
    </ul>

    <p>
      Regularly using a compound interest calculator can significantly improve your financial
      literacy and decision-making. Whether you are a novice investor or a seasoned saver,
      seeing the tangible effects of compounding helps motivate consistent investing and
      better financial planning. Start entering different values today to explore how
      your wealth can grow over the years.
    </p>
  `;
}
