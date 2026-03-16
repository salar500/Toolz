export function renderSloganGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Brand / Concept</label>
      <input id="slogan_input" type="text" placeholder="Enter brand or concept" value="${tool.prefill?.brand || ''}">
    </div>

    <div class="form-row">
      <label>Number of Slogans</label>
      <input id="slogan_count" type="number" min="1" max="10" value="${tool.prefill?.count || 5}">
    </div>

    <button id="slogan_generate" class="btn" style="margin-top:6px">Generate Slogans</button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated Slogans</div>
      <ul id="slogan_results" style="margin-top:6px; padding-left:16px;"></ul>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#slogan_input');
  const countEl = document.querySelector('#slogan_count');
  const resultsEl = document.querySelector('#slogan_results');
  const generateBtn = document.querySelector('#slogan_generate');

  /* ---------------- LOGIC ---------------- */
  const sampleTemplates = [
    "{brand}: Reach for the stars",
    "Feel the power of {brand}",
    "{brand}: Beyond your expectations",
    "Life is better with {brand}",
    "Empowering you with {brand}",
    "{brand}: Innovation you can trust",
    "Choose {brand}, choose success",
    "Experience the magic of {brand}",
    "{brand}: Where dreams come alive",
    "Transform your world with {brand}"
  ];

  function generateSlogans() {
    const brand = inputEl.value.trim();
    const count = Math.min(Math.max(+countEl.value || 5, 1), 10);

    if (!brand) {
      alert("Please enter a brand or concept.");
      return;
    }

    resultsEl.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const template = sampleTemplates[Math.floor(Math.random() * sampleTemplates.length)];
      const slogan = template.replace("{brand}", brand);
      const li = document.createElement('li');
      li.innerText = slogan;
      resultsEl.appendChild(li);
    }
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateSlogans);
}
