export function renderUuidGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI (EMI STYLE) ---------------- */
  inputs.innerHTML = `
    <div style="
      background: linear-gradient(135deg,#4f46e5,#9333ea);
      padding:16px;
      border-radius:14px;
      color:#fff;
      box-shadow:0 12px 30px rgba(0,0,0,.15);
    ">
      <div class="form-row" style="display:flex; flex-direction:column; gap:6px">
        <label style="font-size:13px; opacity:.9">Number of UUIDs</label>
        <input 
          id="uuid_count"
          type="number"
          min="1"
          max="20"
          value="${tool.prefill?.count || 1}"
          style="
            padding:10px;
            border-radius:10px;
            border:none;
            outline:none;
            font-size:14px;
          "
        >
      </div>

      <button 
        id="uuid_generate"
        class="btn"
        style="
          margin-top:12px;
          width:100%;
          padding:12px;
          border-radius:12px;
          font-weight:600;
          background:#fff;
          color:#4f46e5;
          border:none;
          cursor:pointer;
        "
      >
        Generate UUID(s)
      </button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="margin-top:16px">
      <div class="small" style="font-size:12px; opacity:.6">Generated UUID(s)</div>
      <div 
        id="uuid_list"
        style="
          margin-top:10px;
          display:flex;
          flex-direction:column;
          gap:10px
        "
      >—</div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const countEl = document.querySelector('#uuid_count');
  const listEl = document.querySelector('#uuid_list');
  const generateBtn = document.querySelector('#uuid_generate');

  /* ---------------- LOGIC ---------------- */
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function renderUUIDs() {
    const count = Math.min(Math.max(Number(countEl.value), 1), 20);
    listEl.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const uuid = generateUUID();

      const row = document.createElement('div');
      row.style.cssText = `
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        padding:12px 14px;
        background:#ffffff;
        border-radius:14px;
        box-shadow:0 6px 18px rgba(0,0,0,.08);
        font-family:monospace;
        font-size:14px;
      `;

      const text = document.createElement('span');
      text.innerText = uuid;
      text.style.wordBreak = 'break-all';

      const copyBtn = document.createElement('button');
      copyBtn.innerText = 'Copy';
      copyBtn.style.cssText = `
        padding:6px 12px;
        border-radius:10px;
        font-size:12px;
        font-weight:600;
        background:linear-gradient(135deg,#4f46e5,#9333ea);
        color:#fff;
        border:none;
        cursor:pointer;
        white-space:nowrap;
      `;

      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(uuid);
        copyBtn.innerText = 'Copied';
        setTimeout(() => (copyBtn.innerText = 'Copy'), 1200);
      });

      row.appendChild(text);
      row.appendChild(copyBtn);
      listEl.appendChild(row);
    }
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', renderUUIDs);

  renderUUIDs();
}
