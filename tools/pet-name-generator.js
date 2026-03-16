export function renderPetNameGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Pet Type</label>
      <select id="pet_type">
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="rabbit">Rabbit</option>
        <option value="hamster">Hamster</option>
        <option value="bird">Bird</option>
      </select>
    </div>

    <div class="form-row">
      <label>Keywords (Optional)</label>
      <input id="pet_keywords" type="text" placeholder="e.g. fluffy, tiny, happy"
        value="${tool.prefill?.keywords || ''}">
    </div>

    <div class="form-row">
      <label>Number of Names</label>
      <input id="pet_count" type="number" min="1" max="20" value="${tool.prefill?.count || 10}">
    </div>

    <button id="pet_generate" class="btn" style="margin-top:6px">
      Generate Pet Names
    </button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated Pet Names</div>
      <ul id="pet_names" style="margin-top:6px; padding-left:20px"></ul>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const typeEl = document.querySelector('#pet_type');
  const keywordsEl = document.querySelector('#pet_keywords');
  const countEl = document.querySelector('#pet_count');
  const namesEl = document.querySelector('#pet_names');
  const generateBtn = document.querySelector('#pet_generate');

  /* ---------------- LOGIC ---------------- */
  const baseNames = {
    dog: ['Buddy', 'Max', 'Charlie', 'Rocky', 'Daisy', 'Bella', 'Luna', 'Milo'],
    cat: ['Whiskers', 'Mittens', 'Lily', 'Shadow', 'Simba', 'Oreo', 'Cleo', 'Nala'],
    rabbit: ['Thumper', 'BunBun', 'Cocoa', 'Flopsy', 'Honey', 'Pumpkin'],
    hamster: ['Nibbles', 'Peanut', 'Fuzzy', 'Ginger', 'Marshmallow'],
    bird: ['Tweety', 'Sunny', 'Kiwi', 'Chirpy', 'Sky', 'Peppy']
  };

  function generateNames() {
    const type = typeEl.value;
    const keywords = keywordsEl.value
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const count = Math.min(Math.max(Number(countEl.value), 1), 20);

    const results = new Set();

    while (results.size < count) {
      const base = baseNames[type][Math.floor(Math.random() * baseNames[type].length)];
      const keyword = keywords.length ? keywords[Math.floor(Math.random() * keywords.length)] : '';
      const name = keyword ? `${capitalize(keyword)} ${base}` : base;
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
