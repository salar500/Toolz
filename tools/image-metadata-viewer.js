export function renderImageMetadataViewer(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Image</label>
      <input
        id="meta_file"
        type="file"
        accept="image/*"
      />
    </div>

    <p class="small muted" style="margin-top:8px">
      View basic image metadata directly in your browser.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Image Metadata</div>
      <div
        id="meta_status"
        style="font-size:14px;font-weight:600;opacity:.6">
        No image selected
      </div>

      <div id="meta_output" style="margin-top:10px"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const fileEl = document.querySelector('#meta_file');
  const statusEl = document.querySelector('#meta_status');
  const outputEl = document.querySelector('#meta_output');

  /* ---------------- LOGIC ---------------- */
  function readMetadata(file) {
    if (!file) {
      statusEl.innerText = 'Please select an image file';
      statusEl.style.opacity = 1;
      return;
    }

    if (!file.type.startsWith('image/')) {
      statusEl.innerText = 'Invalid image file';
      statusEl.style.opacity = 1;
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => (img.src = e.target.result);

    img.onload = () => {
      const sizeKB = (file.size / 1024).toFixed(1);
      const lastModified = file.lastModified
        ? new Date(file.lastModified).toLocaleString()
        : 'Unknown';

      outputEl.innerHTML = `
        <table style="width:100%;font-size:13px">
          <tr>
            <td class="muted">File Name</td>
            <td>${file.name}</td>
          </tr>
          <tr>
            <td class="muted">File Type</td>
            <td>${file.type}</td>
          </tr>
          <tr>
            <td class="muted">File Size</td>
            <td>${sizeKB} KB</td>
          </tr>
          <tr>
            <td class="muted">Dimensions</td>
            <td>${img.width} × ${img.height} px</td>
          </tr>
          <tr>
            <td class="muted">Last Modified</td>
            <td>${lastModified}</td>
          </tr>
        </table>

        <div style="margin-top:10px">
          <img
            src="${img.src}"
            style="max-width:100%;border-radius:6px"
          />
        </div>
      `;

      statusEl.innerText = 'Metadata loaded';
      statusEl.style.opacity = 1;
    };

    statusEl.innerText = 'Reading metadata...';
    statusEl.style.opacity = .4;

    reader.readAsDataURL(file);
  }

  /* ---------------- EVENTS ---------------- */
  fileEl.addEventListener('change', () => {
    readMetadata(fileEl.files[0]);
  });
}
