export function renderEMI(tool) {
  const root = document.querySelector('#tool-root');
  if (!root) return;

  root.innerHTML = `
  <!-- HEADER -->
  <header class="container">
    <h1>EMI Calculator</h1>
    <p class="subtitle">Calculate your loan EMI, interest & total repayment instantly</p>
  </header>

  <!-- TOP AD -->
  <div class="container">
    <div class="ad-slot" id="ad-top"></div>
  </div>

  <!-- MAIN -->
  <main class="container grid">

    <!-- INPUT -->
    <section class="card">
      <h2>Loan Details</h2>

      <div class="segmented" id="emi_mode">
        <button data-mode="emi" class="active">EMI</button>
        <button data-mode="tenure">Tenure</button>
      </div>

      <div class="form-group">
        <label>Loan Amount (₹)</label>
        <input id="emi_principal" type="number"
          value="${tool.prefill?.principal || 1000000}">
      </div>

      <div class="form-group">
        <label>Interest Rate (% p.a)</label>
        <input id="emi_rate" type="number" step="0.1"
          value="${tool.prefill?.rate || 8}">
      </div>

      <div class="form-group" id="tenure_wrap">
        <label>Tenure (Years)</label>
        <input id="emi_tenure" type="number"
          value="${tool.prefill?.tenure || 5}">
      </div>

      <div class="form-group hidden" id="emi_wrap">
        <label>Monthly EMI (₹)</label>
        <input id="emi_amount" type="number"
          value="${tool.prefill?.emi || 20000}">
      </div>

      <button id="emi_calc" class="btn">Calculate</button>
    </section>

    <!-- RESULT -->
    <section class="card" aria-live="polite">
      <h2>Your Result</h2>

      <div class="result-box">
        <div class="small" id="primary_label">Monthly EMI</div>
        <div id="primary_value">--</div>
      </div>

      <div class="result-list">
        <div><span>Principal</span><span id="out_principal">--</span></div>
        <div><span>Total Interest</span><span id="out_interest">--</span></div>
        <div><span>Total Amount</span><span id="out_total">--</span></div>
      </div>
    </section>
  </main>

  <!-- MIDDLE AD -->
  <div class="container">
    <div class="ad-slot" id="ad-middle"></div>
  </div>

  <!-- SEO CONTENT -->
  <section class="container seo">
    <article>
      <h2>EMI Calculator – Plan Your Loan Smartly</h2>
      <p>
        Use this EMI calculator to estimate your monthly loan payments instantly.
        It helps you understand how much you need to pay every month and how much
        interest you will pay over time.
      </p>

      <h3>What is EMI?</h3>
      <p>
        EMI (Equated Monthly Installment) is the fixed payment you make each month
        to repay a loan. It includes both principal and interest.
      </p>

      <h3>Why Use an EMI Calculator?</h3>
      <p>
        It helps you compare loan options, plan your finances better, and avoid
        over-borrowing.
      </p>

      <h3>How to Reduce EMI?</h3>
      <p>
        You can reduce EMI by increasing tenure, lowering interest rates, or making
        a higher down payment.
      </p>
    </article>
  </section>

  <!-- FAQ -->
  <section class="container faq">
    <h2>Frequently Asked Questions</h2>

    <h3>How is EMI calculated?</h3>
    <p>EMI is calculated using loan amount, interest rate, and tenure.</p>

    <h3>What is a good EMI amount?</h3>
    <p>Your EMI should ideally be less than 30–40% of your monthly income.</p>
  </section>

  <!-- BOTTOM AD -->
  <div class="container">
    <div class="ad-slot" id="ad-bottom"></div>
  </div>
  `;

  /* ---------------- STYLES ---------------- */
  if (!document.querySelector('#emi-style')) {
    const style = document.createElement('style');
    style.id = 'emi-style';
    style.textContent = `
      *{box-sizing:border-box}
      body{margin:0;font-family:system-ui;background:#f8f9fa}

      .container{
        max-width:1100px;
        margin:auto;
        padding:16px;
      }

      .grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:20px;
      }

      .card{
        background:#fff;
        padding:16px;
        border-radius:12px;
        box-shadow:0 2px 6px rgba(0,0,0,.05);
      }

      .form-group{
        display:flex;
        flex-direction:column;
        gap:6px;
        margin-bottom:12px;
      }

      input,button{
        padding:10px;
        font-size:16px;
      }

      .btn{
        background:#2563eb;
        color:#fff;
        border:none;
        cursor:pointer;
      }

      .segmented{
        display:flex;
        margin-bottom:12px;
      }

      .segmented button{
        flex:1;
        padding:10px;
        border:none;
        cursor:pointer;
        background:#eee;
      }

      .segmented .active{
        background:#2563eb;
        color:#fff;
      }

      .hidden{display:none}

      .result-box{
        text-align:center;
        margin-bottom:10px;
      }

      #primary_value{
        font-size:28px;
        font-weight:700;
      }

      .result-list div{
        display:flex;
        justify-content:space-between;
        padding:6px 0;
        border-bottom:1px solid #eee;
      }

      .ad-slot{
        min-height:120px;
        background:#f1f1f1;
        margin:10px 0;
      }

      @media(max-width:768px){
        .grid{grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------------- LOGIC ---------------- */

  let mode = 'emi';

  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  const toggleMode = (newMode) => {
    mode = newMode;
    document.querySelectorAll('#emi_mode button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    document.querySelector('#tenure_wrap')
      .classList.toggle('hidden', mode !== 'emi');

    document.querySelector('#emi_wrap')
      .classList.toggle('hidden', mode !== 'tenure');
  };

  document.querySelector('#emi_mode').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      toggleMode(e.target.dataset.mode);
    }
  });

  const calcEMI = (P, R, Y) => {
    const r = R / 12 / 100;
    const n = Y * 12;
    const emi = (P * r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1);
    return { emi, total: emi*n, interest: emi*n - P };
  };

  document.querySelector('#emi_calc').addEventListener('click', () => {
    const P = +document.querySelector('#emi_principal').value;
    const R = +document.querySelector('#emi_rate').value;

    document.querySelector('#out_principal').innerText = money.format(P);

    if (mode === 'emi') {
      const Y = +document.querySelector('#emi_tenure').value;
      const res = calcEMI(P, R, Y);

      document.querySelector('#primary_value').innerText =
        money.format(Math.round(res.emi));

      document.querySelector('#out_interest').innerText =
        money.format(Math.round(res.interest));

      document.querySelector('#out_total').innerText =
        money.format(Math.round(res.total));
    }
  });
}
