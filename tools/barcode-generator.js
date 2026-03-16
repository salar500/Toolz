// Make sure JsBarcode is included:
// <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>

export function renderBarcodeGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI (EMI STYLE) ---------------- */
  inputs.innerHTML = `
    <div style="
      background:linear-gradient(135deg,#0f172a,#1e293b);
      padding:18px;
      border-radius:16px;
      color:#fff;
      box-shadow:0 14px 40px rgba(0,0,0,.25);
    ">
      <div class="form-row" style="display:flex; flex-direction:column; gap:6px">
        <label style="font-size:13px; opacity:.85">Barcode Data</label>
        <input
          id="barcode_text"
          type="text"
          placeholder="ABC-abc-1234"
          value="${tool.prefill?.text || 'ABC-abc-1234'}"
          style="
            padding:12px;
            border-radius:12px;
            border:none;
            outline:none;
            font-size:14px;
          "
        >
      </div>

      <div class="form-row" style="margin-top:12px; display:flex; flex-direction:column; gap:6px">
        <label style="font-size:13px; opacity:.85">Barcode Format</label>
        <select
          id="barcode_format"
          style="
            padding:12px;
            border-radius:12px;
            border:none;
            font-size:14px;
          "
        >
          <optgroup label="Linear Codes">
            <option value="CODE128">Code-128</option>
            <option value="CODE39">Code-39</option>
            <option value="ITF">Interleaved 2 of 5</option>
            <option value="MSI">MSI</option>
          </optgroup>

          <optgroup label="EAN / UPC">
            <option value="EAN13">EAN-13</option>
            <option value="EAN8">EAN-8</option>
            <option value="UPC">UPC-A</option>
          </optgroup>
        </select>
      </div>

      <button
        id="barcode_generate"
        style="
          margin-top:14px;
          width:100%;
          padding:14px;
          border-radius:14px;
          font-weight:600;
          background:#22c55e;
          color:#052e16;
          border:none;
          cursor:pointer;
        "
      >
        Generate Barcode
      </button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div style="margin-top:18px">
      <div style="font-size:12px; opacity:.6">Generated Barcode</div>

      <div style="
        margin-top:10px;
        padding:14px;
        background:#ffffff;
        border-radius:16px;
        box-shadow:0 10px 30px rgba(0,0,0,.12);
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:12px;
      ">
        <svg id="barcode_svg"></svg>

        <button
          id="barcode_download"
          style="
            padding:10px 16px;
            border-radius:12px;
            font-size:13px;
            font-weight:600;
            background:linear-gradient(135deg,#4f46e5,#9333ea);
            color:#fff;
            border:none;
            cursor:pointer;
          "
        >
          Download PNG
        </button>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const textEl = document.querySelector('#barcode_text');
  const formatEl = document.querySelector('#barcode_format');
  const svgEl = document.querySelector('#barcode_svg');
  const downloadBtn = document.querySelector('#barcode_download');
  const generateBtn = document.querySelector('#barcode_generate');

  /* ---------------- LOGIC ---------------- */
  function generateBarcode() {
    const text = textEl.value.trim();
    const format = formatEl.value;

    if (!text) {
      alert('Please enter barcode data.');
      return;
    }

    if (!window.JsBarcode) {
      alert('JsBarcode library not loaded.');
      return;
    }

    try {
      window.JsBarcode(svgEl, text, {
        format,
        displayValue: true,
        fontSize: 14,
        lineColor: '#000',
        width: format === 'CODE39' ? 1.5 : 2,
        height: 70,
        margin: 12
      });
    } catch (err) {
      alert('Invalid barcode data for the selected format.');
    }
  }

  function downloadBarcode() {
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = png;
      a.download = 'barcode.png';
      a.click();
    };

    img.src =
      'data:image/svg+xml;base64,' +
      btoa(unescape(encodeURIComponent(svgData)));
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateBarcode);
  downloadBtn.addEventListener('click', downloadBarcode);

  generateBarcode(); // auto-generate
}
