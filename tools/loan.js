export function renderLoan(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- CREATE TOOL ROW WRAPPER ---------------- */
  let toolRow = document.querySelector('#tool-row');
  if (!toolRow) {
    toolRow = document.createElement('div');
    toolRow.id = 'tool-row';

    inputs.parentNode.insertBefore(toolRow, inputs);
    toolRow.appendChild(inputs);
    toolRow.appendChild(result);
  }

  /* ---------------- CREATE SEO CONTAINER ---------------- */
  let seoContainer = document.querySelector('#seo-container');
  if (!seoContainer) {
    seoContainer = document.createElement('div');
    seoContainer.id = 'seo-container';
    toolRow.parentNode.insertBefore(seoContainer, toolRow.nextSibling);
  }

  /* ---------------- INLINE STYLES ---------------- */
  const style = document.createElement('style');
  style.innerHTML = `
    #tool-row {
      display:flex;
      gap:20px;
      align-items:flex-start;
      margin-bottom:30px;
    }

    #inputs, #result {
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
      box-shadow:0 10px 24px rgba(0,0,0,.08);
    }

    .title {
      font-size:18px;
      font-weight:700;
      margin-bottom:10px;
    }

    .form-row {
      margin-bottom:12px;
    }

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
      box-shadow:0 6px 14px rgba(22,163,74,.35);
      margin-top:6px;
    }

    .result-card {
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
      color:#2563eb;
    }

    .row {
      display:flex;
      justify-content:space-between;
      font-size:14px;
      padding:6px 0;
      border-top:1px dashed #e5e7eb;
    }

    .seo-content {
      margin-top:20px;
      padding:24px;
      background:#fff;
      border-radius:14px;
      box-shadow:0 10px 24px rgba(0,0,0,.06);
      line-height:1.8;
      font-size:15px;
      color:#374151;
    }

    .seo-content h2 {
      font-size:22px;
      margin-bottom:12px;
      font-weight:800;
      color:#111827;
    }

    .seo-content h3 {
      font-size:17px;
      margin-top:20px;
      margin-bottom:10px;
      font-weight:700;
      color:#1f2937;
    }

    .seo-content p {
      margin-bottom:14px;
    }
  `;
  document.head.appendChild(style);

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Loan Eligibility Calculator</div>

      <div class="form-row">
        <label>Monthly EMI (₹)</label>
        <input id="loan_emi" type="number"
          value="${tool.prefill?.emi || 20000}">
      </div>

      <div class="form-row">
        <label>Interest Rate (% p.a)</label>
        <input id="loan_rate" type="number" step="0.1"
          value="${tool.prefill?.rate || 9}">
      </div>

      <div class="form-row">
        <label>Loan Tenure (Years)</label>
        <input id="loan_years" type="number"
          value="${tool.prefill?.years || 20}">
      </div>

      <button id="loan_calc" class="btn-primary">
        Calculate Loan Amount
      </button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Loan Amount You Can Get</div>
      <div id="loan_amount" class="value">--</div>

      <div class="row">
        <span>Total Interest</span>
        <span id="loan_interest">--</span>
      </div>

      <div class="row">
        <span>Total Payable</span>
        <span id="loan_total">--</span>
      </div>
    </div>
  `;

  /* ---------------- SEO CONTENT BELOW TOOL ROW ---------------- */
  seoContainer.innerHTML = `
    <div class="seo-content">
      <h2>Loan Eligibility Calculator – Smart EMI Based Planning Tool</h2>

      <p>
        This advanced loan eligibility calculator helps you determine the maximum loan amount you can afford based on your EMI capacity, interest rate, and loan tenure. Whether you are planning a home loan, personal loan, or business loan, knowing your eligibility before applying helps you avoid rejection and financial stress.
      </p>

      <p>
        By entering your preferred monthly EMI, expected annual interest rate, and repayment tenure, you instantly receive a realistic loan estimate along with total interest payable and total repayment amount.
      </p>

      <h3>Why EMI-Based Calculation Matters</h3>
      <p>
        Most banks calculate loans based on EMI affordability. If your EMI is too high compared to your income, your loan may be rejected. This tool reverses the EMI formula to calculate how much principal you qualify for.
      </p>

      <h3>Plan Smarter, Borrow Better</h3>
      <p>
        Longer tenure increases eligibility but also increases total interest. Shorter tenure reduces total interest but raises EMI burden. Use this calculator multiple times to compare scenarios and make confident financial decisions.
      </p>

      <p>
        Responsible borrowing ensures financial stability. Always maintain emergency savings and avoid overleveraging your income. This tool gives you clarity before approaching lenders.
      </p>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const emiEl = document.querySelector('#loan_emi');
  const rateEl = document.querySelector('#loan_rate');
  const yearsEl = document.querySelector('#loan_years');

  const amountEl = document.querySelector('#loan_amount');
  const interestEl = document.querySelector('#loan_interest');
  const totalEl = document.querySelector('#loan_total');

  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  /* ---------------- CALCULATION ---------------- */
  const calculate = () => {
    const EMI = +emiEl.value;
    const R = +rateEl.value;
    const Y = +yearsEl.value;

    if (!EMI || R < 0 || !Y) return;

    const r = R / 12 / 100;
    const n = Y * 12;

    let loan;
    if (r === 0) {
      loan = EMI * n;
    } else {
      loan =
        (EMI * (Math.pow(1 + r, n) - 1)) /
        (r * Math.pow(1 + r, n));
    }

    const total = EMI * n;
    const interest = total - loan;

    amountEl.innerText = money.format(Math.round(loan));
    interestEl.innerText = money.format(Math.round(interest));
    totalEl.innerText = money.format(Math.round(total));
  };

  /* ---------------- EVENT ---------------- */
  document
    .querySelector('#loan_calc')
    .addEventListener('click', calculate);
}
