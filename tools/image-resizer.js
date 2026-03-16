export function renderImageResizer(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- STYLES ---------------- */
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
    }
    .segmented button.active {
      background:linear-gradient(135deg,#2563eb,#1d4ed8);
      color:#fff;
    }
    .form-row {
      margin-bottom:12px;
    }
    .form-row label {
      font-size:13px;
      font-weight:600;
      margin-bottom:4px;
      display:block;
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
      cursor:pointer;
      background:linear-gradient(135deg,#16a34a,#15803d);
      color:#fff;
    }
    .result-card {
      margin-top:16px;
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
      text-align:center;
    }
    .preview {
      max-width:100%;
      margin-top:10px;
      border-radius:8px;
    }
    .small {
      font-size:12px;
      color:#6b7280;
    }
  `;
  document.head.appendChild(style);

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Advanced Image Resizer</div>

      <div class="segmented" id="resize_mode">
        <button data-mode="px" class="active">By Pixels</button>
        <button data-mode="percent">By Percentage</button>
      </div>

      <div class="form-row">
        <label>Select Image</label>
        <input id="img_input" type="file" accept="image/*">
      </div>

      <div id="px_wrap">
        <div class="form-row">
          <label>Width (px)</label>
          <input id="width_input" type="number" placeholder="e.g. 800">
        </div>
        <div class="form-row">
          <label>Height (px)</label>
          <input id="height_input" type="number" placeholder="e.g. 600">
        </div>
      </div>

      <div id="percent_wrap" style="display:none">
        <div class="form-row">
          <label>Resize Percentage (%)</label>
          <input id="percent_input" type="number" value="100">
        </div>
      </div>

      <div class="form-row">
        <label>Output Format</label>
        <select id="format_select">
          <option value="image/jpeg">JPG</option>
          <option value="image/png">PNG</option>
          <option value="image/webp">WEBP</option>
        </select>
      </div>

      <div class="form-row">
        <label>Quality (affects file size)</label>
        <input id="quality_input" type="range" min="0.1" max="1" step="0.1" value="0.9">
        <div class="small">Lower quality = smaller file</div>
      </div>

      <button id="resize_btn" class="btn-primary">Resize Image</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <a id="download_link">—</a>
      <img id="preview" class="preview" style="display:none">
    </div>
  `;

  /* ---------------- STATE ---------------- */
  let mode = 'px';

  /* ---------------- ELEMENTS ---------------- */
  const fileInput = document.querySelector('#img_input');
  const widthInput = document.querySelector('#width_input');
  const heightInput = document.querySelector('#height_input');
  const percentInput = document.querySelector('#percent_input');
  const formatSelect = document.querySelector('#format_select');
  const qualityInput = document.querySelector('#quality_input');
  const resizeBtn = document.querySelector('#resize_btn');
  const downloadLink = document.querySelector('#download_link');
  const preview = document.querySelector('#preview');

  /* ---------------- TOGGLE ---------------- */
  document.querySelector('#resize_mode').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;

    [...e.currentTarget.children].forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    mode = e.target.dataset.mode;
    document.querySelector('#px_wrap').style.display = mode === 'px' ? 'block' : 'none';
    document.querySelector('#percent_wrap').style.display = mode === 'percent' ? 'block' : 'none';
  });

  /* ---------------- RESIZE ---------------- */
  resizeBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) return alert('Select an image');

    const quality = +qualityInput.value;
    const format = formatSelect.value;

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let width, height;

        if (mode === 'percent') {
          const p = +percentInput.value / 100;
          width = img.width * p;
          height = img.height * p;
        } else {
          width = +widthInput.value;
          height = +heightInput.value;
        }

        if (!width || !height) return alert('Invalid size');

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        const data = canvas.toDataURL(format, quality);
        const ext = format.split('/')[1];

        downloadLink.href = data;
        downloadLink.download = `resized.${ext}`;
        downloadLink.innerText = `Download ${ext.toUpperCase()}`;

        preview.src = data;
        preview.style.display = 'block';
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
