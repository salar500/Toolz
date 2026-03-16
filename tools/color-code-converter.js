export function renderColorCodeConverter(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Enter Color</label>
      <input
        id="color_input"
        type="text"
        placeholder="#FF0000 or rgb(255,0,0) or hsl(0,100%,50%)"
        style="width:100%"
      />
    </div>

    <button id="color_convert" class="btn" style="margin-top:6px">
      Convert Color
    </button>

    <p class="small muted" style="margin-top:8px">
      Convert between HEX, RGB, and HSL formats.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Converted Color</div>
      <div
        id="color_result"
        style="font-size:14px;font-weight:600;opacity:.6;white-space:pre-wrap">
        No color converted yet
      </div>
      <div id="color_preview" style="margin-top:10px;width:50px;height:50px;border-radius:6px;border:1px solid #ccc"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#color_input');
  const convertBtn = document.querySelector('#color_convert');
  const resultEl = document.querySelector('#color_result');
  const previewEl = document.querySelector('#color_preview');

  /* ---------------- UTILS ---------------- */
  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }

  function rgbToHex(r, g, b) {
    return (
      '#' +
      [r, g, b]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    );
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  function parseColor(input) {
    input = input.trim();
    let match;

    // HEX
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(input)) {
      const rgb = hexToRgb(input);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return { hex: input.toUpperCase(), rgb, hsl };
    }

    // RGB
    if ((match = input.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i))) {
      const r = Number(match[1]),
        g = Number(match[2]),
        b = Number(match[3]);
      const hex = rgbToHex(r, g, b);
      const hsl = rgbToHsl(r, g, b);
      return { hex, rgb: { r, g, b }, hsl };
    }

    // HSL
    if ((match = input.match(/^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/i))) {
      const h = Number(match[1]),
        s = Number(match[2]),
        l = Number(match[3]);
      const rgb = hslToRgb(h, s, l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      return { hex, rgb, hsl: { h, s, l } };
    }

    return null;
  }

  /* ---------------- LOGIC ---------------- */
  function convertColor() {
    const input = inputEl.value;
    const color = parseColor(input);

    if (!color) {
      resultEl.innerText = 'Invalid color format';
      resultEl.style.opacity = 1;
      previewEl.style.backgroundColor = 'transparent';
      return;
    }

    resultEl.innerHTML = `
      HEX: <b>${color.hex}</b>\n
      RGB: <b>rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})</b>\n
      HSL: <b>hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)</b>
    `;
    resultEl.style.opacity = 1;

    previewEl.style.backgroundColor = color.hex;
  }

  /* ---------------- EVENTS ---------------- */
  convertBtn.addEventListener('click', convertColor);
}
