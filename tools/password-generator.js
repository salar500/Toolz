export function renderPasswordGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INLINE STYLES (EMI STYLE) ---------------- */
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
    }
    .btn-secondary {
      width:100%;
      margin-top:10px;
      padding:10px;
      border-radius:10px;
      border:1px solid #e5e7eb;
      font-weight:600;
      cursor:pointer;
      background:#f9fafb;
    }
    .result-card {
      margin-top:16px;
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
      text-align:center;
    }
    .small {
      font-size:12px;
      color:#6b7280;
    }
    .value {
      font-size:26px;
      font-weight:800;
      margin-top:8px;
      word-break:break-all;
      color:#1d4ed8;
      transition:.25s;
    }
  `;
  document.head.appendChild(style);

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Password Generator</div>

      <div class="form-row">
        <label>Password Length</label>
        <input id="password_length" type="number" min="4" max="64"
          value="${tool.prefill?.length || 12}">
      </div>

      <div class="form-row">
        <label>Include Uppercase Letters</label>
        <select id="password_uppercase">
          <option value="yes" selected>Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div class="form-row">
        <label>Include Numbers</label>
        <select id="password_numbers">
          <option value="yes" selected>Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div class="form-row">
        <label>Include Special Characters</label>
        <select id="password_special">
          <option value="yes" selected>Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <button id="password_generate" class="btn-primary">
        Generate Password
      </button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Generated Password</div>
      <div id="password_result" class="value">--</div>
      <button id="copy_password" class="btn-secondary">
        Copy Password
      </button>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const lengthEl = document.querySelector('#password_length');
  const uppercaseEl = document.querySelector('#password_uppercase');
  const numbersEl = document.querySelector('#password_numbers');
  const specialEl = document.querySelector('#password_special');
  const resultEl = document.querySelector('#password_result');
  const generateBtn = document.querySelector('#password_generate');
  const copyBtn = document.querySelector('#copy_password');

  /* ---------------- LOGIC (UNCHANGED) ---------------- */
  function generatePassword() {
    const length = Number(lengthEl.value) || 12;
    const includeUppercase = uppercaseEl.value === 'yes';
    const includeNumbers = numbersEl.value === 'yes';
    const includeSpecial = specialEl.value === 'yes';

    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = lowerChars;
    if (includeUppercase) charset += upperChars;
    if (includeNumbers) charset += numberChars;
    if (includeSpecial) charset += specialChars;

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    resultEl.style.opacity = 0.4;
    setTimeout(() => {
      resultEl.innerText = password;
      resultEl.style.opacity = 1;
    }, 120);
  }

  /* ---------------- COPY ---------------- */
  copyBtn.addEventListener('click', () => {
    const pwd = resultEl.innerText;
    if (!pwd || pwd === '--') return;

    navigator.clipboard.writeText(pwd);
    copyBtn.innerText = 'Copied!';
    setTimeout(() => {
      copyBtn.innerText = 'Copy Password';
    }, 1200);
  });

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generatePassword);
}
