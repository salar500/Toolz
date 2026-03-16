export function renderColorPaletteGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- EMI STYLE ---------------- */
  const style = document.createElement('style');
  style.innerHTML = `
    .palette-card {
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
    }
    .palette-title {
      font-size:18px;
      font-weight:700;
      margin-bottom:10px;
    }
    .palette-controls {
      display:flex;
      gap:8px;
      margin-bottom:14px;
    }
    .palette-controls select {
      flex:1;
      padding:10px;
      border-radius:8px;
      border:1px solid #d1d5db;
      font-weight:600;
    }
    .palette-btn {
      width:100%;
      padding:12px;
      border-radius:10px;
      border:none;
      font-weight:700;
      cursor:pointer;
      background:linear-gradient(135deg,#2563eb,#1d4ed8);
      color:#fff;
      box-shadow:0 6px 14px rgba(37,99,235,.35);
    }
    .palette-result {
      margin-top:16px;
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
    }
    .colors {
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:10px;
      margin-top:12px;
    }
    .color-box {
      height:90px;
      border-radius:10px;
      display:flex;
      align-items:flex-end;
      justify-content:center;
      padding:6px;
      font-size:12px;
      font-weight:700;
      color:#fff;
      cursor:pointer;
      transition:.2s;
    }
    .color-box:hover {
      transform:scale(1.04);
    }
    .palette-actions {
      margin-top:12px;
      text-align:center;
    }
    .palette-copy {
      padding:10px 14px;
      border-radius:10px;
      border:1px solid #e5e7eb;
      font-weight:600;
      background:#f9fafb;
      cursor:pointer;
    }
    .small {
      font-size:12px;
      color:#6b7280;
      text-align:center;
      margin-top:8px;
    }
  `;
  document.head.appendChild(style);

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="palette-card">
      <div class="palette-title">Color Palette Generator</div>

      <div class="palette-controls">
        <select id="palette_type">
          <option value="random">Random</option>
          <option value="pastel">Pastel</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="warm">Warm</option>
          <option value="cool">Cool</option>
        </select>
      </div>

      <button id="palette_generate" class="palette-btn">
        Generate Palette
      </button>

      <p class="small">
        Click any color to copy its HEX code
      </p>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="palette-result">
      <div class="small">Generated Palette</div>

      <div class="colors" id="palette_colors"></div>

      <div class="palette-actions">
        <button id="palette_copy_all" class="palette-copy">
          Copy Full Palette
        </button>
      </div>

      <p class="small">
        🔒 Generated locally · No data stored
      </p>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const typeEl = document.querySelector('#palette_type');
  const colorsEl = document.querySelector('#palette_colors');
  const generateBtn = document.querySelector('#palette_generate');
  const copyAllBtn = document.querySelector('#palette_copy_all');

  let currentColors = [];

  /* ---------------- COLOR HELPERS ---------------- */
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomColor(type) {
    let r, g, b;

    switch (type) {
      case 'pastel':
        r = rand(180, 255); g = rand(180, 255); b = rand(180, 255);
        break;
      case 'dark':
        r = rand(0, 80); g = rand(0, 80); b = rand(0, 80);
        break;
      case 'light':
        r = rand(200, 255); g = rand(200, 255); b = rand(200, 255);
        break;
      case 'warm':
        r = rand(180, 255); g = rand(80, 160); b = rand(60, 120);
        break;
      case 'cool':
        r = rand(60, 120); g = rand(120, 200); b = rand(180, 255);
        break;
      default:
        r = rand(0,255); g = rand(0,255); b = rand(0,255);
    }

    return `#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`.toUpperCase();
  }

  /* ---------------- GENERATE ---------------- */
  function generatePalette() {
    colorsEl.innerHTML = '';
    currentColors = [];

    for (let i = 0; i < 4; i++) {
      const hex = randomColor(typeEl.value);
      currentColors.push(hex);

      const box = document.createElement('div');
      box.className = 'color-box';
      box.style.background = hex;
      box.innerText = hex;

      box.addEventListener('click', () => {
        navigator.clipboard.writeText(hex);
      });

      colorsEl.appendChild(box);
    }
  }

  /* ---------------- COPY ALL ---------------- */
  copyAllBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentColors.join(', '));
  });

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generatePalette);

  generatePalette(); // auto-generate on load
}
