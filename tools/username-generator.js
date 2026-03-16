export function renderUsernameGenerator(tool) {
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
      background:linear-gradient(135deg,#16a34a,#15803d);
      color:#fff;
      box-shadow:0 6px 14px rgba(22,163,74,.35);
    }
    .result-card {
      margin-top:16px;
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
      text-align:center;
    }
    .value {
      font-size:28px;
      font-weight:800;
      margin-top:6px;
      word-break:break-all;
      color:#1d4ed8;
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
      <div class="title">Username Generator</div>

      <div class="form-row">
        <label>Your Word</label>
        <input id="username_base" type="text"
          placeholder="Enter name, word, brand..."
          value="${tool.prefill?.base || ''}">
      </div>

      <div class="form-row">
        <label>Category</label>
        <select id="username_category">
          <option value="random" selected>Random Category</option>
          <option value="gaming">Gaming</option>
          <option value="tech">Tech</option>
          <option value="social">Social</option>
          <option value="business">Business</option>
        </select>
      </div>

      <div class="form-row">
        <label>Length of Category Word</label>
        <select id="username_length">
          <option value="any" selected>Any</option>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>

      <div class="form-row">
        <label>Category Word Start Letter</label>
        <select id="username_start">
          <option value="any" selected>Any</option>
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
        </select>
      </div>

      <div class="form-row">
        <label>Your Word Position</label>
        <select id="username_position">
          <option value="random" selected>Random</option>
          <option value="start">Start</option>
          <option value="end">End</option>
        </select>
      </div>

      <button id="username_generate" class="btn-primary">
        Generate Username
      </button>

      <p class="small" style="margin-top:8px">
        Usernames are generated instantly and locally in your browser.
      </p>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Generated Username</div>
      <div id="username_result" class="value">--</div>
      <button id="username_copy" class="btn-secondary" style="display:none">
        Copy Username
      </button>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const baseEl = document.querySelector('#username_base');
  const resultEl = document.querySelector('#username_result');
  const generateBtn = document.querySelector('#username_generate');
  const copyBtn = document.querySelector('#username_copy');

  /* ---------------- LOGIC (UNCHANGED) ---------------- */
  function generateUsername() {
    const base = baseEl.value.trim() || 'user';
    const randomNum = Math.floor(Math.random() * 10000);
    const username = `${base}${randomNum}`;

    resultEl.style.opacity = 0.4;
    copyBtn.style.display = 'none';

    setTimeout(() => {
      resultEl.innerText = username;
      resultEl.style.opacity = 1;
      copyBtn.style.display = 'inline-block';
    }, 120);
  }

  /* ---------------- COPY ---------------- */
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(resultEl.innerText);
    copyBtn.innerText = 'Copied!';
    setTimeout(() => (copyBtn.innerText = 'Copy Username'), 1200);
  });

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateUsername);
}
