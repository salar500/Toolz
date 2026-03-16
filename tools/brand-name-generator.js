export function renderBrandNameGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Enter Keywords</label>
      <input id="brand_keywords" type="text" placeholder="e.g. smart, eco, blue"
        value="${tool.prefill?.keywords || ''}">
    </div>

    <div class="form-row">
      <label>Number of Names</label>
      <input id="brand_count" type="number" min="1" max="20" value="${tool.prefill?.count || 10}">
    </div>

    <button id="brand_generate" class="btn" style="margin-top:6px">
      Generate Brand Names
    </button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated Brand Names</div>
      <ul id="brand_names" style="margin-top:6px; padding-left:20px"></ul>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const keywordsEl = document.querySelector('#brand_keywords');
  const countEl = document.querySelector('#brand_count');
  const namesEl = document.querySelector('#brand_names');
  const generateBtn = document.querySelector('#brand_generate');

  /* ---------------- LOGIC ---------------- */
  function generateNames() {
    const keywords = keywordsEl.value
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const count = Math.min(Math.max(Number(countEl.value), 1), 20);

    if (!keywords.length) {
      namesEl.innerHTML = '<li>Please enter at least one keyword.</li>';
      return;
    }

    const prefixes = ['Neo', 'Ultra', 'Eco', 'Smart', 'Pure', 'Go', 'One', 'Max', 'Blue', 'Bright'];
    const suffixes = ['ly', 'io', 'ify', 'able', 'hub', 'zone', 'works', 'labs', 'co', 'x'];

    const results = new Set();

    while (results.size < count) {
      const word = keywords[Math.floor(Math.random() * keywords.length)];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

      const name = `${prefix}${capitalize(word)}${suffix}`;
      results.add(name);
    }

    namesEl.innerHTML = Array.from(results)
      .map(n => `<li>${n}</li>`)
      .join('');
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateNames);

  generateNames(); // auto-run if prefilled
}
