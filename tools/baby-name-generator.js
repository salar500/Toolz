export function renderBabyNameGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Gender</label>
      <select id="baby_gender">
        <option value="boy">Boy</option>
        <option value="girl">Girl</option>
        <option value="unisex">Unisex</option>
      </select>
    </div>

    <div class="form-row">
      <label>Keywords (Optional)</label>
      <input id="baby_keywords" type="text" placeholder="e.g. strong, cute, happy"
        value="${tool.prefill?.keywords || ''}">
    </div>

    <div class="form-row">
      <label>Number of Names</label>
      <input id="baby_count" type="number" min="1" max="20" value="${tool.prefill?.count || 10}">
    </div>

    <button id="baby_generate" class="btn" style="margin-top:6px">
      Generate Baby Names
    </button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated Baby Names</div>
      <ul id="baby_names" style="margin-top:6px; padding-left:20px"></ul>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const genderEl = document.querySelector('#baby_gender');
  const keywordsEl = document.querySelector('#baby_keywords');
  const countEl = document.querySelector('#baby_count');
  const namesEl = document.querySelector('#baby_names');
  const generateBtn = document.querySelector('#baby_generate');

  /* ---------------- LOGIC ---------------- */
  const baseNames = {
    boy: ['Liam','Noah','Oliver','Elijah','James','William','Benjamin','Lucas','Henry','Alexander'],
    girl: ['Olivia','Emma','Ava','Charlotte','Sophia','Amelia','Isabella','Mia','Evelyn','Harper'],
    unisex: ['Alex','Taylor','Jordan','Riley','Casey','Skyler','Quinn','Avery','Morgan','Rowan']
  };

  function generateNames() {
    const gender = genderEl.value;
    const keywords = keywordsEl.value
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const count = Math.min(Math.max(Number(countEl.value), 1), 20);

    const results = new Set();

    while (results.size < count) {
      const base = baseNames[gender][Math.floor(Math.random() * baseNames[gender].length)];
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
