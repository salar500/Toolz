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

  /* ✅ TOP AD (NEW) */
  let adTop = document.querySelector('#ad-top');
  if (!adTop) {
    adTop = document.createElement('div');
    adTop.id = 'ad-top';
    adTop.className = 'ad-slot';
    toolRow.parentNode.insertBefore(adTop, toolRow);
  }

  let seoContainer = document.querySelector('#seo-container');
  if (!seoContainer) {
    seoContainer = document.createElement('div');
    seoContainer.id = 'seo-container';
    toolRow.parentNode.insertBefore(seoContainer, toolRow.nextSibling);
  }

  /* ✅ MIDDLE AD (NEW) */
  let adMiddle = document.querySelector('#ad-middle');
  if (!adMiddle) {
    adMiddle = document.createElement('div');
    adMiddle.id = 'ad-middle';
    adMiddle.className = 'ad-slot';
    seoContainer.parentNode.insertBefore(adMiddle, seoContainer);
  }

  let faqContainer = document.querySelector('#faq-container');
  if (!faqContainer) {
    faqContainer = document.createElement('div');
    faqContainer.id = 'faq-container';
    seoContainer.parentNode.insertBefore(faqContainer, seoContainer.nextSibling);
  }

  /* ✅ BOTTOM AD (NEW) */
  let adBottom = document.querySelector('#ad-bottom');
  if (!adBottom) {
    adBottom = document.createElement('div');
    adBottom.id = 'ad-bottom';
    adBottom.className = 'ad-slot';
    faqContainer.parentNode.insertBefore(adBottom, faqContainer.nextSibling);
  }

  /* ---------------- STYLES (ONLY ADDITIONS) ---------------- */
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

      /* ✅ AD SAFE SPACE */
      .ad-slot {
        min-height:120px;
        background:#f1f1f1;
        margin:12px 0;
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
        padding:12px; /* mobile improvement */
        border-radius:8px;
        border:1px solid #d1d5db;
        font-size:16px;
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
        padding:12px;
        font-weight:600;
        border-radius:8px;
        cursor:pointer;
        color:#555;
      }

      .segmented button.active {
        background:linear-gradient(135deg,#2563eb,#1d4ed8);
        color:#fff;
      }

      .btn-primary {
        width:100%;
        padding:14px;
        border-radius:10px;
        border:none;
        font-weight:700;
        font-size:16px;
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

      .value {
        font-size:30px;
        font-weight:800;
      }

      #seo-container {
        background:#fff;
        padding:26px;
        border-radius:14px;
        margin-bottom:20px;
        line-height:1.7;
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------------- YOUR INPUT UI (UNCHANGED) ---------------- */
  inputs.innerHTML = inputs.innerHTML;
  result.innerHTML = result.innerHTML;

  /* ---------------- SEO (UPGRADED) ---------------- */
  seoContainer.innerHTML = `
    <h2>EMI Calculator – Calculate Loan EMI Instantly</h2>
    <p>
      Use this free EMI calculator to calculate your monthly loan EMI,
      interest payable, and total repayment amount quickly.
    </p>

    <h3>What is EMI?</h3>
    <p>
      EMI (Equated Monthly Installment) is the fixed amount you pay every month
      towards loan repayment.
    </p>

    <h3>How to Reduce EMI?</h3>
    <p>
      Increase tenure, reduce interest rate, or increase down payment.
    </p>
  `;

  /* ---------------- FAQ (NEW SEO BOOST) ---------------- */
  faqContainer.innerHTML = `
    <h2>FAQs</h2>

    <h3>How is EMI calculated?</h3>
    <p>It depends on loan amount, interest rate, and tenure.</p>

    <h3>What is a good EMI?</h3>
    <p>Ideally less than 30–40% of your income.</p>
  `;

  /* ---------------- YOUR ORIGINAL LOGIC (UNCHANGED) ---------------- */
}
