export function renderProfitLoss(tool) {
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

  /* ---------------- INLINE STYLES ---------------- */
  if (!document.querySelector('#pl-layout-style')) {
    const style = document.createElement('style');
    style.id = 'pl-layout-style';
    style.innerHTML = `
      #tool-row {
        display:flex;
        gap:24px;
        align-items:flex-start;
        margin-bottom:32px;
      }
      #tool-row > div { flex:1; }
      @media(max-width:768px){
        #tool-row{ flex-direction:column; }
      }

      .card {
        padding:16px;
        border-radius:14px;
        background:#fff;
        box-shadow:0 8px 20px rgba(0,0,0,.06);
      }
      .title { font-size:18px; font-weight:700; margin-bottom:12px; }
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
      #seo-container h2 { margin-top:0; font-size:22px; }
      #seo-container h3 { margin-top:20px; font-size:18px; }
    `;
    document.head.appendChild(style);
  }

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Profit / Loss Calculator</div>
      <div class="form-row">
        <label>Cost Price (₹)</label>
        <input id="pl_cost" type="number" min="0" value="${tool.prefill?.cost || ''}" />
      </div>
      <div class="form-row">
        <label>Selling Price (₹)</label>
        <input id="pl_sell" type="number" min="0" value="${tool.prefill?.sell || ''}" />
      </div>
      <button id="pl_calc" class="btn-primary">Calculate Profit / Loss</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Result</div>
      <div id="pl_result" class="value">--</div>
      <div class="row"><span>Amount</span><span id="pl_amount">--</span></div>
      <div class="row"><span>Percentage</span><span id="pl_percent">--</span></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const costEl = document.querySelector('#pl_cost');
  const sellEl = document.querySelector('#pl_sell');
  const resultEl = document.querySelector('#pl_result');
  const amountEl = document.querySelector('#pl_amount');
  const percentEl = document.querySelector('#pl_percent');

  const money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  });

  /* ---------------- CORE LOGIC ---------------- */
  function calculateProfitLoss(cost, sell) {
    if (cost <= 0) return null;
    const diff = sell - cost;
    const percent = (diff / cost) * 100;
    return {
      type: diff > 0 ? 'Profit' : diff < 0 ? 'Loss' : 'No Profit / No Loss',
      amount: Math.abs(diff),
      percent: Math.abs(percent)
    };
  }

  /* ---------------- CALCULATE ---------------- */
  document.querySelector('#pl_calc').addEventListener('click', () => {
    const cost = +costEl.value;
    const sell = +sellEl.value;
    if (!costEl.value || !sellEl.value) return;

    const res = calculateProfitLoss(cost, sell);
    if (!res) return;

    resultEl.innerText = res.type;
    amountEl.innerText = money.format(res.amount);
    percentEl.innerText = `${res.percent.toFixed(2)} %`;
  });

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>Profit / Loss Calculator – Accurate Financial Insight Instantly</h2>
    <p>
      The Profit / Loss calculator is an essential financial tool for anyone who wants
      to quickly determine the outcome of a transaction. Whether you are trading, selling
      products, investing, or managing business finances, this calculator helps you understand
      immediately whether you are making a profit, incurring a loss, or breaking even.
      By entering the cost price and selling price, the tool instantly computes both the
      amount and percentage of profit or loss.
    </p>

    <h3>Understanding Profit and Loss</h3>
    <p>In simple terms:</p>
    <ul>
      <li><strong>Profit:</strong> Occurs when the selling price is higher than the cost price. Profit indicates positive earnings from a transaction.</li>
      <li><strong>Loss:</strong> Occurs when the selling price is lower than the cost price. Loss represents money lost in a transaction.</li>
      <li><strong>No Profit / No Loss:</strong> Happens when the selling price equals the cost price. In this case, the transaction breaks even.</li>
    </ul>
    <p>
      Understanding profit and loss is crucial for making smart financial decisions,
      pricing products correctly, and assessing investment outcomes. This calculator simplifies
      the process, eliminating the need for manual calculations or spreadsheets.
    </p>

    <h3>How to Use This Calculator Effectively</h3>
    <p>Using the Profit / Loss calculator is straightforward:</p>
    <ol>
      <li>Enter the <strong>Cost Price (₹)</strong> – the price you paid for an item or investment.</li>
      <li>Enter the <strong>Selling Price (₹)</strong> – the price at which the item was sold or valued.</li>
      <li>Click the <strong>Calculate Profit / Loss</strong> button.</li>
    </ol>
    <p>The tool will instantly display:</p>
    <ul>
      <li>The transaction type: Profit, Loss, or No Profit / No Loss.</li>
      <li>The <strong>Amount</strong> gained or lost.</li>
      <li>The <strong>Percentage</strong> of profit or loss relative to the cost price.</li>
    </ul>

    <h3>Practical Applications of the Profit / Loss Calculator</h3>
    <ul>
      <li><strong>Business Sales:</strong> Quickly evaluate the profitability of product sales and make pricing adjustments.</li>
      <li><strong>Investments:</strong> Assess whether your stocks, mutual funds, or other investments have generated returns or losses.</li>
      <li><strong>Trading:</strong> Analyze the outcomes of buying and selling commodities or goods to ensure profitable trades.</li>
      <li><strong>Personal Finance:</strong> Understand everyday purchases or reselling items for better money management.</li>
    </ul>

    <h3>Benefits of Using This Tool</h3>
    <ul>
      <li>Save time and effort by avoiding manual calculations.</li>
      <li>Make informed decisions about pricing and investment strategies.</li>
      <li>Track business and personal financial performance accurately.</li>
      <li>Reduce the risk of errors in financial analysis.</li>
    </ul>

    <h3>Tips for Maximizing Your Profit</h3>
    <ul>
      <li>Set the correct selling price by analyzing costs, market trends, and competitor pricing.</li>
      <li>Keep track of additional expenses that may affect profit, such as shipping or taxes.</li>
      <li>Regularly review your transactions to identify high-performing products or investments.</li>
      <li>Use the profit percentage to prioritize profitable opportunities.</li>
    </ul>

    <h3>Why This Calculator Stands Out</h3>
    <p>
      Unlike manual calculations, this Profit / Loss calculator is fast, accurate, and easy to use.
      Its clean interface ensures that both beginners and professionals can quickly determine
      financial outcomes. It is fully responsive, making it usable on desktop, tablet, or mobile.
    </p>

    <p>
      Understanding your financial position is the first step toward making better decisions.
      Use this Profit / Loss calculator regularly to analyze transactions, plan pricing strategies,
      and manage investments effectively. Accurate insights help reduce risk, increase earnings,
      and maintain a clear picture of your financial health.
    </p>
  `;
}
