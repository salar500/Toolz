export function renderColorPicker(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Color</label>
      <input id="color_input" type="color" value="#ff0000" style="width:100px"/>
    </div>

    <button id="color_copy" class="btn" style="margin-top:6px">
      Copy Color Values
    </button>

    <p class="small muted" style="margin-top:8px">
      Pick a color and get its Hex, RGB, and HSL values.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Color Values</div>
      <div id="color_display" style="margin-top:8px;padding:10px;border-radius:6px;opacity:.8">
        Hex: #ff0000
        <br>RGB: rgb(255, 0, 0)
        <br>HSL: hsl(0, 100%, 50%)
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const colorEl = document.querySelector('#color_input');
  const displayEl = document.querySelector('#color_display');
  const copyBtn = document.querySelector('#color_copy');

  /* ---------------- LOGIC ---------------- */
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  function updateColorValues() {
    const hex = colorEl.value;
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    displayEl.innerHTML = `
      Hex: ${hex} <br>
      RGB: rgb(${r}, ${g}, ${b}) <br>
      HSL: hsl(${h}, ${s}%, ${l}%)
    `;
    displayEl.style.backgroundColor = hex;
    displayEl.style.color = l > 50 ? '#000' : '#fff';
  }

  /* ---------------- ACTIONS ---------------- */
  copyBtn.addEventListener('click', () => {
    const text = displayEl.innerText;
    navigator.clipboard.writeText(text);
    alert('Color values copied to clipboard');
  });

  /* ---------------- EVENTS ---------------- */
  colorEl.addEventListener('input', updateColorValues);

  // Initial display
  updateColorValues();
}
