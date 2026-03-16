export function renderRandomNumberGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Minimum Value</label>
      <input id="rng_min" type="number" value="${tool.prefill?.min || 1}">
    </div>

    <div class="form-row">
      <label>Maximum Value</label>
      <input id="rng_max" type="number" value="${tool.prefill?.max || 100}">
    </div>

    <div class="form-row">
      <label>How Many Numbers?</label>
      <input id="rng_count" type="number" min="1" max="50" value="${tool.prefill?.count || 5}">
    </div>

    <button id="rng_generate" class="btn" style="margin-top:6px">
      Generate Numbers
    </button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated Numbers</div>
      <div id="rng_list" style="margin-top:6px; line-height:1.6; word-break:break-word">—</div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const minEl = document.querySelector('#rng_min');
  const maxEl = document.querySelector('#rng_max');
  const countEl = document.querySelector('#rng_count');
  const listEl = document.querySelector('#rng_list');
  const generateBtn = document.querySelector('#rng_generate');

  /* ---------------- LOGIC ---------------- */
  function generateNumbers() {
    const min = Number(minEl.value);
    const max = Number(maxEl.value);
    const count = Math.min(Math.max(Number(countEl.value), 1), 50);

    if (isNaN(min) || isNaN(max) || min > max) {
      listEl.innerText = 'Please enter a valid min and max range.';
      return;
    }

    const numbers = [];
    for (let i = 0; i < count; i++) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.push(num);
    }

    listEl.innerText = numbers.join(', ');
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateNumbers);

  generateNumbers(); // auto-run if prefilled
}
