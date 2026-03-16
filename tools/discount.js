export function renderDiscount(tool) {
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
  if (!document.querySelector('#discount-layout-style')) {
    const style = document.createElement('style');
    style.id = 'discount-layout-style';
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
        color:#16a34a;
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
      <div class="title">Discount Calculator</div>

      <div class="form-row">
        <label>Original Price (₹)</label>
        <input id="dis_price" type="number" min="0"
          value="${tool.prefill?.price || ''}">
      </div>

      <div class="form-row">
        <label>Discount (%)</label>
        <input id="dis_percent" type="number" min="0" max="100" step="0.01"
          value="${tool.prefill?.percent || ''}">
      </div>

      <button id="dis_calc" class="btn-primary">Calculate Discount</button>
    </div>
  `;

  /* ---------------- RESULT ONLY ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Price After Discount</div>
      <div class="value" id="dis_final">--</div>

      <div class="row"><span>Discount Amount</span><span id="dis_amount">--</span></div>
      <div class="row"><span>You Save</span><span id="dis_save_percent">--</span></div>
    </div>
  `;

  /* ---------------- SEO CONTENT ONLY ---------------- */
  seoContainer.innerHTML = `
    <h2>Discount Calculator – Instantly Know Your Savings</h2>
    <p>
      Use this free online Discount Calculator to determine your final price instantly.
      Perfect for shoppers, small business owners, and deal hunters, it ensures you know
      exactly how much you save with any percentage discount.
    </p>

    <h3>How It Works</h3>
    <p>
      Enter the original price and the discount percentage, then click "Calculate Discount".
      The calculator will display the discounted price, the total discount amount, and
      the percentage you save.
    </p>

    <h3>Practical Applications</h3>
    <p>
      • Shopping during online or in-store sales<br>
      • Evaluating promotional offers<br>
      • Calculating bulk purchase discounts<br>
      • Business pricing strategy<br>
      • Financial planning and budgeting
    </p>

    <h3>Benefits of Using a Discount Calculator</h3>
    <p>
      Accurate, instant, and easy-to-use. Avoid miscalculations and make informed decisions.
      This tool enhances your shopping experience and helps you manage spending wisely.
    </p>

    <h3>Tips for Smart Shopping</h3>
    <p>
      Always double-check discounts and compare offers across stores. Use this calculator
      to ensure you are getting genuine savings and avoid overpaying.
    </p>

    <h3>Why This Tool Is Useful</h3>
    <p>
      This calculator is lightweight, mobile-friendly, and optimized for fast performance.
      It is an essential tool for anyone who wants transparency in pricing and better
      control over their expenses.
    </p>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const priceEl = document.querySelector('#dis_price');
  const percentEl = document.querySelector('#dis_percent');
  const finalEl = document.querySelector('#dis_final');
  const amountEl = document.querySelector('#dis_amount');
  const savePercentEl = document.querySelector('#dis_save_percent');

  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  });

  /* ---------------- CORE LOGIC (UNCHANGED) ---------------- */
  function calculateDiscount(price, percent) {
    if (price < 0 || percent < 0) return null;
    const discount = (price * percent) / 100;
    const finalPrice = price - discount;
    return { discount, finalPrice };
  }

  /* ---------------- CALCULATE ---------------- */
  function calculate() {
    const price = +priceEl.value;
    const percent = +percentEl.value;

    if (!priceEl.value || !percentEl.value) return;
    if (percent > 100) return;

    const res = calculateDiscount(price, percent);
    if (!res) return;

    finalEl.style.opacity = .4;
    setTimeout(() => {
      finalEl.innerText = money.format(res.finalPrice);
      finalEl.style.opacity = 1;
    }, 120);

    amountEl.innerText = money.format(res.discount);
    savePercentEl.innerText = percent.toFixed(2) + ' %';
  }

  /* ---------------- EVENTS ---------------- */
  document.querySelector('#dis_calc').addEventListener('click', calculate);
}
