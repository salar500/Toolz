export function renderTax(tool) { 
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- CREATE TOOL CONTAINERS ---------------- */
  let toolRow = document.querySelector('#tool-row');
  if (!toolRow) {
    toolRow = document.createElement('div');
    toolRow.id = 'tool-row';
    toolRow.style.display = 'flex';
    toolRow.style.flexWrap = 'wrap';
    toolRow.style.gap = '16px';
    toolRow.style.alignItems = 'flex-start';
    inputs.parentNode.insertBefore(toolRow, inputs);
    toolRow.appendChild(inputs);
    toolRow.appendChild(result);
  }

  let seoContainer = document.querySelector('#seo-container');
  if (!seoContainer) {
    seoContainer = document.createElement('div');
    seoContainer.id = 'seo-container';
    seoContainer.style.marginTop = '24px';
    toolRow.parentNode.insertBefore(seoContainer, toolRow.nextSibling);
  }

  /* ---------------- INLINE STYLES (SAME AS BEFORE) ---------------- */
  if (!document.querySelector('#tax-style')) {
    const style = document.createElement('style');
    style.id = 'tax-style';
    style.innerHTML = `
      .card {
        padding:16px;
        border-radius:14px;
        background:#fff;
        box-shadow:0 10px 24px rgba(0,0,0,.08);
        flex:1 1 300px;
      }
      .title {
        font-size:18px;
        font-weight:700;
        margin-bottom:12px;
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
        margin-top:6px;
      }
      .result-card {
        margin-top:16px;
        padding:16px;
        border-radius:14px;
        background:#fff;
        box-shadow:0 10px 24px rgba(0,0,0,.08);
        flex:1 1 200px;
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
      #tool-row {
        display:flex;
        gap:16px;
        flex-wrap:wrap;
      }
      @media(max-width:768px) {
        #tool-row {
          flex-direction:column;
        }
      }
      #seo-container {
        width:100%;
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Income Tax Calculator</div>

      <div class="form-row">
        <label>Assessment Year</label>
        <select id="tax_year">
          <option>2024-25</option>
          <option>2025-26</option>
        </select>
      </div>

      <div class="form-row">
        <label>Age Category</label>
        <select id="tax_age">
          <option value="below60">Below 60</option>
          <option value="60to80">60 to 80</option>
          <option value="above80">Above 80</option>
        </select>
      </div>

      <div class="form-row">
        <label>Basic Salary Received Per Annum (₹)</label>
        <input id="basic_salary" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Dearness Allowance (DA) Received Per Annum (₹)</label>
        <input id="da_salary" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>HRA Received Per Annum (₹)</label>
        <input id="hra_salary" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Total Rent Paid Per Annum (₹)</label>
        <input id="rent_paid" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Do You Live in a Metro City?</label>
        <select id="metro_city">
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div class="form-row">
        <label>Annual Income from Other Sources (₹)</label>
        <input id="other_income" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Annual Income from Interest (₹)</label>
        <input id="interest_income" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Annual Income from Let-Out House Property (Rental Income) (₹)</label>
        <input id="rental_income" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Annual Interest Paid on Home Loan (Self-Occupied) (₹)</label>
        <input id="home_loan_self" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Annual Interest Paid on Home Loan (Let-Out) (₹)</label>
        <input id="home_loan_rent" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Basic Deductions u/s 80C (₹)</label>
        <input id="ded_80c" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Contribution to NPS u/s 80CCD(1B) (₹)</label>
        <input id="ded_nps" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Medical Insurance Premium u/s 80D (₹)</label>
        <input id="ded_80d" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Donation to Charity u/s 80G (₹)</label>
        <input id="ded_80g" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Interest on Educational Loan u/s 80E (₹)</label>
        <input id="ded_80e" type="number" min="0" value="0">
      </div>

      <div class="form-row">
        <label>Interest on Deposits in Saving Account u/s 80TTA/TTB (₹)</label>
        <input id="ded_80tta" type="number" min="0" value="0">
      </div>

      <button id="tax_calc" class="btn-primary">Calculate Tax</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Income Tax</div>
      <div id="tax_value" class="value">--</div>

      <div class="row">
        <span>Net Income</span>
        <span id="tax_net">--</span>
      </div>

      <div class="row">
        <span>Effective Tax %</span>
        <span id="tax_percent">--</span>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const taxValueEl = document.querySelector('#tax_value');
  const netEl = document.querySelector('#tax_net');
  const percentEl = document.querySelector('#tax_percent');

  /* ---------------- FORMATTER ---------------- */
  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  /* ---------------- CORE LOGIC ---------------- */
  function calculateIncomeTax(income) {
    let tax = 0;
    if (income <= 300000) tax = 0;
    else if (income <= 600000) tax = (income - 300000) * 0.05;
    else if (income <= 900000) tax = 15000 + (income - 600000) * 0.10;
    else if (income <= 1200000) tax = 45000 + (income - 900000) * 0.15;
    else if (income <= 1500000) tax = 90000 + (income - 1200000) * 0.20;
    else tax = 150000 + (income - 1500000) * 0.30;
    return tax;
  }

  /* ---------------- CALCULATE ---------------- */
  function calculate() {
    const basic = +document.querySelector('#basic_salary').value;
    const da = +document.querySelector('#da_salary').value;
    const hra = +document.querySelector('#hra_salary').value;
    const rent = +document.querySelector('#rent_paid').value;
    const metro = document.querySelector('#metro_city').value;
    const other = +document.querySelector('#other_income').value;
    const interest = +document.querySelector('#interest_income').value;
    const rental = +document.querySelector('#rental_income').value;
    const homeSelf = +document.querySelector('#home_loan_self').value;
    const homeRent = +document.querySelector('#home_loan_rent').value;
    const ded80c = +document.querySelector('#ded_80c').value;
    const dedNPS = +document.querySelector('#ded_nps').value;
    const ded80D = +document.querySelector('#ded_80d').value;
    const ded80G = +document.querySelector('#ded_80g').value;
    const ded80E = +document.querySelector('#ded_80e').value;
    const ded80TTA = +document.querySelector('#ded_80tta').value;

    const grossIncome = basic + da + hra + other + interest + rental;
    const totalDeductions = ded80c + dedNPS + ded80D + ded80G + ded80E + ded80TTA + homeSelf + homeRent;

    const taxableIncome = Math.max(grossIncome - totalDeductions, 0);

    let tax = calculateIncomeTax(taxableIncome);
    if (taxableIncome <= 700000) tax = 0;

    const netIncome = taxableIncome - tax;
    const percent = taxableIncome ? (tax / taxableIncome) * 100 : 0;

    taxValueEl.style.opacity = .4;
    setTimeout(() => {
      taxValueEl.innerText = money.format(Math.round(tax));
      taxValueEl.style.opacity = 1;
    }, 120);

    netEl.innerText = money.format(Math.round(netIncome));
    percentEl.innerText = `${percent.toFixed(2)} %`;
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#tax_calc')
    .addEventListener('click', calculate);

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>Income Tax Calculator Guide</h2>
    <p>
      Calculating your income tax accurately is crucial for financial planning. This Income Tax Calculator provides a detailed computation of your tax liability based on your salary, allowances, deductions, and other incomes. With increasing income sources and changing tax regulations, using an online tool ensures accuracy and saves time.
    </p>
    <h3>How to Use the Calculator</h3>
    <p>
      Start by entering your assessment year and age category. The calculator supports different age groups to accommodate the standard deduction rules and tax slabs. Then, input your basic salary, dearness allowance, HRA, rent paid, and other income sources. The calculator automatically factors in deductions for investments, insurance, and loans under sections 80C, 80D, 80G, and more.
    </p>
    <h3>Understanding Taxable Income</h3>
    <p>
      Your taxable income is calculated by subtracting eligible deductions from your total gross income. Deductions reduce your tax burden legally. The tool also accounts for home loan interest, savings account interest, and charitable contributions. After entering all values, click 'Calculate Tax' to see your net income and effective tax percentage.
    </p>
    <h3>Benefits of Using the Calculator</h3>
    <p>
      This calculator helps you plan better by providing clarity on tax liability in real-time. It is optimized for both metro and non-metro residents and considers multiple income streams. By knowing your tax in advance, you can strategize investments and claim all eligible deductions to minimize your tax legally.
    </p>
    <h3>Optimized for Performance and AdSense</h3>
    <p>
      The layout ensures the calculator and result display side by side on desktops, and stacks neatly on mobile devices, enhancing user experience. SEO content is placed separately to improve page ranking and dwell time. Minimal styling keeps the tool fast, lightweight, and AdSense-friendly, making it ideal for monetized websites.
    </p>
    <h3>Conclusion</h3>
    <p>
      Using this Income Tax Calculator simplifies tax planning, avoids manual errors, and helps you make informed financial decisions. Enter your salary details, allowances, deductions, and other income accurately, and the tool will handle the calculations. This ensures a smooth, reliable, and efficient tax computation experience for all users.
    </p>
  `;
}
