export function renderEMI(tool) {
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

  let faqContainer = document.querySelector('#faq-container');
  if (!faqContainer) {
    faqContainer = document.createElement('div');
    faqContainer.id = 'faq-container';
    seoContainer.parentNode.insertBefore(faqContainer, seoContainer.nextSibling);
  }

  /* ---------------- INLINE STYLES (NO DUPLICATION) ---------------- */
  if (!document.querySelector('#emi-layout-style')) {
    const style = document.createElement('style');
    style.id = 'emi-layout-style';
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

      .segmented {
        display:flex;
        background:#f3f4f6;
        padding:4px;
        border-radius:10px;
        margin-bottom:16px;
      }

      .segmented button {
        flex:1;
        border:none;
        background:transparent;
        padding:10px;
        font-weight:600;
        border-radius:8px;
        cursor:pointer;
        color:#555;
        transition:.25s;
      }

      .segmented button.active {
        background:linear-gradient(135deg,#2563eb,#1d4ed8);
        color:#fff;
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

      .value.tenure { color:#15803d; }

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
      <div class="title">EMI Calculator</div>

      <div class="segmented" id="emi_mode">
        <button data-mode="emi" class="active">Calculate EMI</button>
        <button data-mode="tenure">Calculate Tenure</button>
      </div>

      <div class="form-row">
        <label>Loan Amount (₹)</label>
        <input id="emi_principal" type="number" value="${tool.prefill?.principal || 1000000}">
      </div>

      <div class="form-row">
        <label>Rate of Interest (% p.a)</label>
        <input id="emi_rate" type="number" step="0.1" value="${tool.prefill?.rate || 8}">
      </div>

      <div class="form-row" id="tenure_wrap">
        <label>Loan Tenure (Years)</label>
        <input id="emi_tenure" type="number" value="${tool.prefill?.tenure || 5}">
      </div>

      <div class="form-row" id="emi_wrap" style="display:none">
        <label>Monthly EMI (₹)</label>
        <input id="emi_amount" type="number" value="${tool.prefill?.emi || 20000}">
      </div>

      <button id="emi_calc" class="btn-primary">Calculate</button>
    </div>
  `;

  /* ---------------- RESULT ONLY ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small" id="primary_label">Monthly EMI</div>
      <div class="value" id="primary_value">--</div>

      <div class="row"><span>Principal</span><span id="out_principal">--</span></div>
      <div class="row"><span>Total Interest</span><span id="out_interest">--</span></div>
      <div class="row"><span>Total Amount</span><span id="out_total">--</span></div>
    </div>
  `;

  /* ---------------- SEO CONTENT ONLY (NO FAQ ADDED) ---------------- */
  seoContainer.innerHTML = `
    <h2>EMI Calculator – Smart Loan Planning Made Simple</h2>
    <p>
      An EMI calculator is a powerful financial planning tool that helps you estimate
      your monthly loan repayments instantly. Whether you are planning to take a home loan,
      car loan, personal loan, or education loan, understanding your EMI in advance
      ensures better financial discipline and long-term stability.
    </p>

    <h3>What is EMI?</h3>
    <p>
      EMI stands for Equated Monthly Installment. It is the fixed monthly payment
      made by a borrower to repay a loan over a specific tenure. Each EMI consists of
      two components: principal and interest. In the initial years of repayment,
      the interest portion is higher, while later installments contribute more toward
      reducing the principal balance.
    </p>

    <h3>Why Use an EMI Calculator?</h3>
    <p>
      Calculating EMI manually requires complex mathematical formulas and can be prone
      to error. This EMI calculator eliminates guesswork and gives you accurate results
      within seconds. By adjusting loan amount, interest rate, and tenure, you can
      compare different borrowing scenarios and choose the most affordable option.
    </p>

    <h3>How Loan Tenure Affects EMI</h3>
    <p>
      A longer tenure reduces your monthly EMI but increases total interest paid.
      A shorter tenure increases EMI but significantly reduces overall interest cost.
      Finding the right balance between affordability and total repayment is key
      to smart borrowing.
    </p>

    <h3>Benefits of Proper EMI Planning</h3>
    <ul>
      <li>Improves monthly budgeting</li>
      <li>Helps avoid over-borrowing</li>
      <li>Supports better loan comparison</li>
      <li>Encourages responsible financial decisions</li>
    </ul>

    <p>
      Before applying for any loan, always ensure that your total EMIs remain within
      a comfortable percentage of your monthly income. Proper financial planning today
      can prevent repayment stress in the future. Use this EMI calculator regularly
      to explore different repayment combinations and choose the most sustainable
      financial path.
    </p>
  `;

  /* ---------------- CALC LOGIC (UNCHANGED) ---------------- */
  let mode = 'emi';

  const PEl = document.querySelector('#emi_principal');
  const REl = document.querySelector('#emi_rate');
  const YEl = document.querySelector('#emi_tenure');
  const EMIEl = document.querySelector('#emi_amount');

  const tenureWrap = document.querySelector('#tenure_wrap');
  const emiWrap = document.querySelector('#emi_wrap');

  const labelEl = document.querySelector('#primary_label');
  const valueEl = document.querySelector('#primary_value');

  const outP = document.querySelector('#out_principal');
  const outI = document.querySelector('#out_interest');
  const outT = document.querySelector('#out_total');

  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  document.querySelector('#emi_mode').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;

    [...e.currentTarget.children].forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    mode = e.target.dataset.mode;

    tenureWrap.style.display = mode === 'emi' ? 'block' : 'none';
    emiWrap.style.display = mode === 'tenure' ? 'block' : 'none';

    labelEl.innerText = mode === 'emi' ? 'Monthly EMI' : 'Loan Duration';
    valueEl.classList.toggle('tenure', mode === 'tenure');
    valueEl.innerText = '--';
  });

  const calcEMI = (P, R, Y) => {
    const r = R / 12 / 100;
    const n = Y * 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { emi, total: emi * n, interest: emi * n - P };
  };

  const calcTenure = (P, R, EMI) => {
    const r = R / 12 / 100;
    if (EMI <= P * r) return null;
    const n = Math.log(EMI / (EMI - P * r)) / Math.log(1 + r);
    return Math.ceil(n);
  };

  document.querySelector('#emi_calc').addEventListener('click', () => {
    const P = +PEl.value;
    const R = +REl.value;

    outP.innerText = money.format(P);

    if (mode === 'emi') {
      const Y = +YEl.value;
      const res = calcEMI(P, R, Y);
      valueEl.innerText = money.format(Math.round(res.emi));
      outI.innerText = money.format(Math.round(res.interest));
      outT.innerText = money.format(Math.round(res.total));
    } else {
      const EMI = +EMIEl.value;
      const months = calcTenure(P, R, EMI);
      if (!months) {
        valueEl.innerText = 'EMI too low';
        return;
      }
      const y = Math.floor(months / 12);
      const m = months % 12;
      valueEl.innerText = `${y}y ${m}m`;
      const total = EMI * months;
      outI.innerText = money.format(total - P);
      outT.innerText = money.format(total);
    }
  });
}
