export function renderMortgage(tool) {
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
  if (!document.querySelector('#mortgage-layout-style')) {
    const style = document.createElement('style');
    style.id = 'mortgage-layout-style';
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
      <div class="title">Home-Loan Calculator</div>

      <div class="form-row">
        <label>Property Price (₹)</label>
        <input id="mort_price" type="number" min="1"
          value="${tool.prefill?.price || ''}">
      </div>

      <div class="form-row">
        <label>Down Payment (₹)</label>
        <input id="mort_down" type="number" min="0"
          value="${tool.prefill?.down || ''}">
      </div>

      <div class="form-row">
        <label>Interest Rate (% p.a)</label>
        <input id="mort_rate" type="number" min="0" step="0.01"
          value="${tool.prefill?.rate || ''}">
      </div>

      <div class="form-row">
        <label>Loan Tenure (Years)</label>
        <input id="mort_years" type="number" min="1"
          value="${tool.prefill?.years || ''}">
      </div>

      <button id="mort_calc" class="btn-primary">
        Calculate Mortgage
      </button>
    </div>
  `;

  /* ---------------- RESULT ONLY ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Monthly EMI</div>
      <div id="mort_emi" class="value">--</div>

      <div class="row">
        <span>Loan Amount</span>
        <span id="mort_loan">--</span>
      </div>

      <div class="row">
        <span>Total Interest</span>
        <span id="mort_interest">--</span>
      </div>

      <div class="row">
        <span>Total Payment</span>
        <span id="mort_total">--</span>
      </div>
    </div>
  `;

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>Home Loan Calculator – Plan Your Mortgage Smartly</h2>
    <p>
      A home loan is a major financial commitment, and planning your monthly
      payments in advance is essential. This Home-Loan Calculator helps you
      determine your monthly EMI, total interest, and overall payment effortlessly.
      It allows you to make informed decisions about down payments, loan tenure,
      and interest rates to suit your financial goals.
    </p>

    <h3>Why Use a Home Loan Calculator?</h3>
    <p>
      Calculating EMIs manually involves complex formulas. With this tool,
      you can instantly see how different interest rates, loan amounts,
      and tenures affect your monthly payment. It helps you plan effectively
      and ensures affordability over the long term.
    </p>

    <h3>Understanding Loan Components</h3>
    <p>
      Your monthly EMI consists of principal repayment and interest. Initially,
      the interest component is higher, gradually reducing as you pay down
      the principal. The calculator allows you to estimate this accurately
      and choose the repayment plan that fits your budget.
    </p>

    <h3>Impact of Down Payment</h3>
    <p>
      The down payment directly reduces the loan amount and therefore the EMI.
      Higher down payments result in lower EMIs and less total interest paid.
      This tool lets you experiment with various down payment options to find
      the optimal balance between upfront payment and monthly affordability.
    </p>

    <h3>Choosing Loan Tenure</h3>
    <p>
      A longer loan tenure reduces your EMI but increases the total interest paid.
      Shorter tenures increase EMIs but save you on interest. Using this calculator,
      you can find the ideal loan duration that balances monthly budget
      constraints and long-term savings.
    </p>

    <h3>Benefits of Using the Mortgage Calculator</h3>
    <ul>
      <li>Quickly estimate monthly EMI</li>
      <li>Plan affordable down payments</li>
      <li>Compare different loan tenures</li>
      <li>Make informed borrowing decisions</li>
    </ul>

    <p>
      Start using this Home-Loan Calculator to plan your mortgage efficiently,
      avoid financial strain, and make smart long-term investment choices.
    </p>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const priceEl = document.querySelector('#mort_price');
  const downEl = document.querySelector('#mort_down');
  const rateEl = document.querySelector('#mort_rate');
  const yearsEl = document.querySelector('#mort_years');

  const emiEl = document.querySelector('#mort_emi');
  const loanEl = document.querySelector('#mort_loan');
  const interestEl = document.querySelector('#mort_interest');
  const totalEl = document.querySelector('#mort_total');

  /* ---------------- FORMATTER ---------------- */
  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  /* ---------------- CORE LOGIC (UNCHANGED) ---------------- */
  function calculateMortgageEMI(P, R, Y) {
    if (P <= 0 || Y <= 0) return null;

    const r = R / 12 / 100;
    const n = Y * 12;

    if (r === 0) {
      const emi = P / n;
      return { emi, interest: 0, total: P };
    }

    const emi =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const total = emi * n;

    return {
      emi,
      interest: total - P,
      total
    };
  }

  /* ---------------- CALCULATE ---------------- */
  function calculate() {
    const price = +priceEl.value;
    const down = +downEl.value;
    const rate = +rateEl.value;
    const years = +yearsEl.value;

    if (!price || years <= 0 || rate < 0) return;
    if (down < 0 || down > price) return;

    const loanAmount = price - down;
    if (loanAmount <= 0) return;

    const res = calculateMortgageEMI(loanAmount, rate, years);
    if (!res) return;

    emiEl.style.opacity = .4;
    setTimeout(() => {
      emiEl.innerText = money.format(Math.round(res.emi));
      emiEl.style.opacity = 1;
    }, 120);

    loanEl.innerText = money.format(loanAmount);
    interestEl.innerText = money.format(Math.round(res.interest));
    totalEl.innerText = money.format(Math.round(res.total));
  }

  /* ---------------- EVENTS ---------------- */
  document.querySelector('#mort_calc').addEventListener('click', calculate);
}
