// OTP Generator — EMI Style with proper TOTP
// Requires jsSHA for HMAC-SHA1: <script src="https://cdnjs.cloudflare.com/ajax/libs/jsSHA/3.2.0/sha.js"></script>

export function renderOtpGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div style="
      background:linear-gradient(135deg,#0f172a,#1e293b);
      padding:18px;
      border-radius:16px;
      color:#fff;
      box-shadow:0 14px 40px rgba(0,0,0,.25);
      display:flex;
      flex-direction:column;
      gap:12px;
    ">
      <div class="form-row" style="display:flex; flex-direction:column; gap:6px">
        <label style="font-size:13px; opacity:.85">OTP Length</label>
        <input id="otp_length" type="number" min="4" max="10" value="${tool.prefill?.length || 6}" 
          style="padding:12px;border-radius:12px;border:none;font-size:14px;outline:none;">
      </div>

      <div class="form-row" style="display:flex; flex-direction:column; gap:6px">
        <label style="font-size:13px; opacity:.85">Include Alphabets?</label>
        <select id="otp_alpha" style="padding:12px;border-radius:12px;border:none;font-size:14px;">
          <option value="no" selected>No (Digits Only)</option>
          <option value="yes">Yes (Alphanumeric)</option>
        </select>
      </div>

      <div class="form-row" style="display:flex; flex-direction:column; gap:6px">
        <label style="font-size:13px; opacity:.85">TOTP Secret</label>
        <input id="otp_secret" type="text" placeholder="Enter TOTP secret" value="${tool.prefill?.secret || 'CDHWR3SIYS6FVO3Y'}"
          style="padding:12px;border-radius:12px;border:none;font-size:14px;outline:none;">
      </div>

      <button id="otp_generate" style="
        margin-top:6px;
        padding:12px;
        border-radius:12px;
        font-weight:600;
        background:#22c55e;
        color:#052e16;
        border:none;
        cursor:pointer;
      ">Generate Random OTP</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div style="
      margin-top:18px;
      padding:14px;
      background:#fff;
      border-radius:16px;
      box-shadow:0 10px 30px rgba(0,0,0,.12);
      display:flex;
      flex-direction:column;
      gap:12px;
    ">
      <div style="font-size:12px; opacity:.6;">Random OTP</div>
      <div id="otp_result" style="font-size:28px; font-weight:700; opacity:.6;">--</div>

      <div style="font-size:12px; opacity:.6; margin-top:8px;">Time-based OTP (TOTP)</div>
      <div id="otp_totp" style="display:flex; justify-content:space-between; font-size:14px; opacity:.7;">
        <span>Previous: --</span>
        <span>Current: --</span>
        <span>Next: --</span>
      </div>

      <div id="otp_countdown" style="font-size:12px; opacity:.5;">Next in --s</div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const lengthEl = document.querySelector('#otp_length');
  const alphaEl = document.querySelector('#otp_alpha');
  const secretEl = document.querySelector('#otp_secret');
  const resultEl = document.querySelector('#otp_result');
  const generateBtn = document.querySelector('#otp_generate');
  const totpEl = document.querySelector('#otp_totp');
  const countdownEl = document.querySelector('#otp_countdown');

  /* ---------------- RANDOM OTP LOGIC ---------------- */
  function generateRandomOTP() {
    const length = Math.min(Math.max(+lengthEl.value || 6, 4), 10);
    const includeAlpha = alphaEl.value === 'yes';
    const digits = '0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const chars = includeAlpha ? digits + letters : digits;

    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += chars[Math.floor(Math.random() * chars.length)];
    }

    resultEl.style.opacity = 0.4;
    setTimeout(() => {
      resultEl.innerText = otp;
      resultEl.style.opacity = 1;
    }, 100);
  }

  /* ---------------- TOTP HELPER ---------------- */
  function generateTOTP(secret, step = 30, digits = 6, counterOverride = null) {
    const epoch = Math.floor(Date.now() / 1000);
    const counter = counterOverride !== null ? counterOverride : Math.floor(epoch / step);

    function base32ToBytes(base32) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      let bits = "";
      for (let i = 0; i < base32.length; i++) {
        const val = alphabet.indexOf(base32[i].toUpperCase());
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, "0");
      }
      const bytes = [];
      for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.substring(i, i + 8), 2));
      }
      return bytes;
    }

    const key = base32ToBytes(secret || "CDHWR3SIYS6FVO3Y");
    const counterBytes = new Uint8Array(8);
    let c = counter;
    for (let i = 7; i >= 0; i--) {
      counterBytes[i] = c & 0xff;
      c >>= 8;
    }

    const shaObj = new jsSHA("SHA-1", "ARRAYBUFFER");
    shaObj.setHMACKey(key, "UINT8ARRAY");
    shaObj.update(counterBytes);
    const hmac = shaObj.getHMAC("UINT8ARRAY");

    const offset = hmac[hmac.length - 1] & 0xf;
    const code = ((hmac[offset] & 0x7f) << 24) |
                 ((hmac[offset + 1] & 0xff) << 16) |
                 ((hmac[offset + 2] & 0xff) << 8) |
                 (hmac[offset + 3] & 0xff);

    return String(code % 10 ** digits).padStart(digits, "0");
  }

  /* ---------------- TOTP UPDATE ---------------- */
  function updateTOTPUI() {
    const secret = secretEl.value || "CDHWR3SIYS6FVO3Y";
    const step = 30;
    const now = Math.floor(Date.now() / 1000);
    const counter = Math.floor(now / step);

    const prev = generateTOTP(secret, step, 6, counter - 1);
    const curr = generateTOTP(secret, step, 6, counter);
    const next = generateTOTP(secret, step, 6, counter + 1);

    totpEl.innerHTML = `
      <span>Previous: ${prev}</span>
      <span>Current: ${curr}</span>
      <span>Next: ${next}</span>
    `;
    countdownEl.innerText = `Next in ${step - (now % step)}s`;
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateRandomOTP);

  generateRandomOTP();
  setInterval(updateTOTPUI, 1000);
  updateTOTPUI();
}
