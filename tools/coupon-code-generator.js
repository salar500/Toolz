export function renderCouponCodeGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Code Length</label>
      <input id="coupon_length" type="number" min="4" max="20" value="${tool.prefill?.length || 8}">
    </div>

    <div class="form-row">
      <label>Include Alphabets?</label>
      <select id="coupon_alpha">
        <option value="yes" selected>Yes (Alphanumeric)</option>
        <option value="no">No (Digits Only)</option>
      </select>
    </div>

    <div class="form-row">
      <label>Include Special Characters?</label>
      <select id="coupon_special">
        <option value="no" selected>No</option>
        <option value="yes">Yes</option>
      </select>
    </div>

    <button id="coupon_generate" class="btn" style="margin-top:6px">Generate Coupon Code</button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated Coupon Code</div>
      <div id="coupon_result" style="font-size:28px;font-weight:700;margin-top:6px;opacity:.6">--</div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const lengthEl = document.querySelector('#coupon_length');
  const alphaEl = document.querySelector('#coupon_alpha');
  const specialEl = document.querySelector('#coupon_special');
  const resultEl = document.querySelector('#coupon_result');
  const generateBtn = document.querySelector('#coupon_generate');

  /* ---------------- LOGIC ---------------- */
  function generateCouponCode() {
    const length = Math.min(Math.max(+lengthEl.value || 8, 4), 20);
    const includeAlpha = alphaEl.value === 'yes';
    const includeSpecial = specialEl.value === 'yes';

    const digits = '0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specials = '!@#$%^&*';
    
    let chars = digits;
    if (includeAlpha) chars += letters;
    if (includeSpecial) chars += specials;

    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    resultEl.style.opacity = 0.4;
    setTimeout(() => {
      resultEl.innerText = code;
      resultEl.style.opacity = 1;
    }, 100);
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateCouponCode);
}
