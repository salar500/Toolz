export function renderUnitConverter(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- DATA ---------------- */
  const UNITS = {
    length: {
      label: 'Length',
      units: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        ft: 0.3048,
        inch: 0.0254
      }
    },
    weight: {
      label: 'Weight',
      units: {
        kg: 1,
        g: 0.001,
        lb: 0.453592,
        oz: 0.0283495
      }
    },
    temperature: {
      label: 'Temperature',
      units: ['c', 'f', 'k']
    }
  };

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Category</label>
      <select id="uc_category">
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temperature">Temperature</option>
      </select>
    </div>

    <div class="form-row">
      <label>Value</label>
      <input id="uc_value" type="number"
        value="${tool.prefill?.value || ''}" />
    </div>

    <div class="form-row">
      <label>From</label>
      <select id="uc_from"></select>
    </div>

    <div class="form-row">
      <label>To</label>
      <select id="uc_to"></select>
    </div>

    <button id="uc_calc" class="btn" style="margin-top:6px">
      Convert
    </button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Converted Value</div>
      <div id="uc_result"
        style="font-size:28px;font-weight:700;opacity:.6">--</div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const categoryEl = document.querySelector('#uc_category');
  const valueEl = document.querySelector('#uc_value');
  const fromEl = document.querySelector('#uc_from');
  const toEl = document.querySelector('#uc_to');
  const resultEl = document.querySelector('#uc_result');

  /* ---------------- HELPERS ---------------- */
  function populateUnits(category) {
    fromEl.innerHTML = '';
    toEl.innerHTML = '';

    const units =
      category === 'temperature'
        ? UNITS.temperature.units
        : Object.keys(UNITS[category].units);

    units.forEach(u => {
      fromEl.innerHTML += `<option value="${u}">${u}</option>`;
      toEl.innerHTML += `<option value="${u}">${u}</option>`;
    });
  }

  function convertTemperature(value, from, to) {
    let c;

    if (from === 'c') c = value;
    else if (from === 'f') c = (value - 32) * 5 / 9;
    else c = value - 273.15;

    if (to === 'c') return c;
    if (to === 'f') return (c * 9 / 5) + 32;
    return c + 273.15;
  }

  function convert(value, category, from, to) {
    if (category === 'temperature') {
      return convertTemperature(value, from, to);
    }

    const base = value * UNITS[category].units[from];
    return base / UNITS[category].units[to];
  }

  /* ---------------- CALCULATE ---------------- */
  function calculate() {
    const value = +valueEl.value;
    if (!valueEl.value) return;

    const category = categoryEl.value;
    const from = fromEl.value;
    const to = toEl.value;

    const converted = convert(value, category, from, to);

    resultEl.style.opacity = .4;
    setTimeout(() => {
      resultEl.innerText = converted.toFixed(4);
      resultEl.style.opacity = 1;
    }, 120);
  }

  /* ---------------- EVENTS ---------------- */
  categoryEl.addEventListener('change', () => {
    populateUnits(categoryEl.value);
  });

  document
    .querySelector('#uc_calc')
    .addEventListener('click', calculate);

  /* ---------------- INIT ---------------- */
  populateUnits(categoryEl.value);
}
