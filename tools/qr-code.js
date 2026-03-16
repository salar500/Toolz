export function renderQrCodeGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- EMI STYLE (UI ONLY) ---------------- */
  if (!document.querySelector('#qr-emi-style')) {
    const style = document.createElement('style');
    style.id = 'qr-emi-style';
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
      .segmented {
        display:flex;
        background:#f2f4f8;
        padding:4px;
        border-radius:10px;
        margin-bottom:14px;
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
        box-shadow:0 4px 10px rgba(37,99,235,.3);
      }
      .form-row { margin-bottom:12px; }
      .form-row label {
        display:block;
        font-size:13px;
        font-weight:600;
        margin-bottom:4px;
      }
      .form-row textarea {
        width:100%;
        padding:10px;
        border-radius:8px;
        border:1px solid #d1d5db;
        font-size:14px;
        resize:vertical;
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
      .small { font-size:12px; color:#6b7280; }
      .btn-secondary {
        display:inline-block;
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
  }

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Static QR Code Generator</div>

      <div class="segmented" id="qr_type">
        <button data-type="url" class="active">Website</button>
        <button data-type="wifi">WiFi</button>
        <button data-type="vcard">vCard</button>
        <button data-type="whatsapp">WhatsApp</button>
        <button data-type="text">Text</button>
      </div>

      <div class="form-row">
        <label id="qr_label">Enter Website URL</label>
        <textarea id="qr_input" rows="4" placeholder="https://website.com"></textarea>
      </div>

      <button id="qr_generate" class="btn-primary">Generate QR Code</button>

      <p class="small" style="margin-top:8px">
        This generates a static QR code that works forever and does not rely on any server.
      </p>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">QR Code</div>
      <div id="qr_output" style="margin-top:12px"></div>
      <a id="qr_download" class="btn-secondary" style="display:none">Download QR Code</a>
      <p class="small" style="margin-top:8px">🔒 Data is generated locally and never stored.</p>
    </div>
  `;

  let type = 'url';

  const inputEl = document.querySelector('#qr_input');
  const outputEl = document.querySelector('#qr_output');
  const downloadBtn = document.querySelector('#qr_download');
  const labelEl = document.querySelector('#qr_label');

  document.querySelector('#qr_type').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    [...e.currentTarget.children].forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    type = e.target.dataset.type;
  });

  function formatQRData(value) {
    switch (type) {
      case 'wifi': {
        const [ssid, pass, sec] = value.split('|');
        return `WIFI:T:${sec || 'WPA'};S:${ssid};P:${pass};;`;
      }
      case 'vcard': {
        const [name, phone, email] = value.split(',');
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name || ''}\nTEL:${phone || ''}\nEMAIL:${email || ''}\nEND:VCARD`;
      }
      case 'whatsapp':
        return `https://wa.me/${value}`;
      default:
        return value;
    }
  }

  document.querySelector('#qr_generate').addEventListener('click', () => {
    if (typeof QRCode === 'undefined') {
      alert('QRCode library not loaded');
      return;
    }

    const value = inputEl.value.trim();
    if (!value) return alert('Please enter data');

    outputEl.innerHTML = '';
    downloadBtn.style.display = 'none';

    const qrText = formatQRData(value);

    new QRCode(outputEl, {
      text: qrText,
      width: 220,
      height: 220,
      correctLevel: QRCode.CorrectLevel.H
    });

    setTimeout(() => {
      const canvas = outputEl.querySelector('canvas');
      if (canvas) {
        downloadBtn.href = canvas.toDataURL('image/png');
        downloadBtn.download = 'qr-code.png';
        downloadBtn.style.display = 'inline-block';
      }
    }, 100);
  });
}
