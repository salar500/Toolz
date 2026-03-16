export function renderBusinessNameGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- EMI STYLE (UI ONLY) ---------------- */
  const style = document.createElement('style');
  style.innerHTML = `
    .card {
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
    }
    .title {
      font-size:18px;
      font-weight:700;
      margin-bottom:6px;
    }
    .subtitle {
      font-size:13px;
      color:#6b7280;
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
      box-shadow:0 6px 14px rgba(37,99,235,.35);
    }
    .result-card {
      margin-top:16px;
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
    }
    .result-card ul {
      margin-top:8px;
      padding-left:18px;
    }
    .result-card li {
      font-weight:600;
      margin-bottom:4px;
    }
    .small {
      font-size:12px;
      color:#6b7280;
    }
    .btn-secondary {
      margin-top:10px;
      padding:10px 14px;
      border-radius:10px;
      border:1px solid #e5e7eb;
      font-weight:600;
      background:#f9fafb;
      cursor:pointer;
    }
  `;
  document.head.appendChild(style);

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Business Name Generator</div>
      <div class="subtitle">
        Generate short, brandable business names using artificial intelligence
      </div>

      <div class="form-row">
        <label>Enter Keywords</label>
        <input
          id="business_keywords"
          type="text"
          placeholder="e.g. tech, green, coffee"
          value="${tool.prefill?.keywords || ''}">
      </div>

      <div class="form-row">
        <label>Number of Names</label>
        <input
          id="business_count"
          type="number"
          min="1"
          max="100"
          value="${tool.prefill?.count || 10}">
      </div>

      <button id="business_generate" class="btn-primary">
        Generate Business Names
      </button>

      <p class="small" style="margin-top:8px">
        Names are generated instantly and locally in your browser.
      </p>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Generated Business Names</div>
      <ul id="business_names"></ul>
      <button id="business_copy" class="btn-secondary" style="display:none">
        Copy All Names
      </button>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const keywordsEl = document.querySelector('#business_keywords');
  const countEl = document.querySelector('#business_count');
  const namesEl = document.querySelector('#business_names');
  const generateBtn = document.querySelector('#business_generate');
  const copyBtn = document.querySelector('#business_copy');

  /* ---------------- LOGIC (UNCHANGED) ---------------- */
  function generateNames() {
    const keywords = keywordsEl.value
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const count = Math.min(Math.max(Number(countEl.value), 1), 20);

    if (!keywords.length) {
      namesEl.innerHTML = '<li>Please enter at least one keyword.</li>';
      copyBtn.style.display = 'none';
      return;
    }

    const suffixes = [
      'Solutions','Labs','Works','Studio','Co',
      'Tech','Design','Group','Hub','Creative'
    ];

    const results = new Set();

    while (results.size < count) {
      const word = keywords[Math.floor(Math.random() * keywords.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const name = `${capitalize(word)} ${suffix}`;
      results.add(name);
    }

    namesEl.innerHTML = Array.from(results)
      .map(n => `<li>${n}</li>`)
      .join('');

    copyBtn.style.display = 'inline-block';
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ---------------- COPY ---------------- */
  copyBtn.addEventListener('click', () => {
    const text = [...namesEl.querySelectorAll('li')]
      .map(li => li.innerText)
      .join('\n');

    navigator.clipboard.writeText(text);
    copyBtn.innerText = 'Copied!';
    setTimeout(() => (copyBtn.innerText = 'Copy All Names'), 1200);
  });

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateNames);

  generateNames(); // auto-run if prefilled
}
