export function renderPngToJpg(tool) {
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
    .form-row label {
      font-size:13px;
      font-weight:600;
      margin-bottom:6px;
      display:block;
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
    }
    .preview {
      max-width:100%;
      margin-top:10px;
      border-radius:8px;
    }
  `;
  document.head.appendChild(style);

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">PNG ↔ JPG Converter</div>

      <div class="segmented" id="img_mode">
        <button data-mode="png-jpg" class="active">PNG → JPG</button>
        <button data-mode="jpg-png">JPG → PNG</button>
      </div>

      <div class="form-row">
        <label>Select Image</label>
        <input id="img_input" type="file" accept="image/png,image/jpeg">
      </div>

      <button id="convert_btn" class="btn-primary">Convert</button>
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
  let mode = 'png-jpg';

  /* ---------------- ELEMENTS ---------------- */
  const fileInput = document.querySelector('#img_input');
  const convertBtn = document.querySelector('#convert_btn');
  const downloadLink = document.querySelector('#download_link');
  const preview = document.querySelector('#preview');

  /* ---------------- TOGGLE ---------------- */
  document.querySelector('#img_mode').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;

    [...e.currentTarget.children].forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    mode = e.target.dataset.mode;
    fileInput.value = '';
    preview.style.display = 'none';
    downloadLink.innerText = '—';

    fileInput.accept =
      mode === 'png-jpg' ? 'image/png' : 'image/jpeg';
  });

  /* ---------------- CONVERT ---------------- */
  convertBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) return alert('Select an image');

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);

        const isPng = mode === 'jpg-png';
        const mime = isPng ? 'image/png' : 'image/jpeg';
        const ext = isPng ? 'png' : 'jpg';

        const data = canvas.toDataURL(mime, 0.9);

        downloadLink.href = data;
        downloadLink.download = file.name.replace(/\.\w+$/, `.${ext}`);
        downloadLink.innerText = `Download ${ext.toUpperCase()}`;

        preview.src = data;
        preview.style.display = 'block';
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
