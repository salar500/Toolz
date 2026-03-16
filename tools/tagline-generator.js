export function renderTaglineGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Brand / Concept</label>
      <input id="tagline_input" type="text" placeholder="Enter brand or concept" value="${tool.prefill?.brand || ''}">
    </div>

    <div class="form-row">
      <label>Number of Taglines</label>
      <input id="tagline_count" type="number" min="1" max="10" value="${tool.prefill?.count || 5}">
    </div>

    <button id="tagline_generate" class="btn" style="margin-top:6px">Generate Taglines</button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated Taglines</div>
      <ul id="tagline_results" style="margin-top:6px; padding-left:16px;"></ul>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#tagline_input');
  const countEl = document.querySelector('#tagline_count');
  const resultsEl = document.querySelector('#tagline_results');
  const generateBtn = document.querySelector('#tagline_generate');

  /* ---------------- LOGIC ---------------- */
  const sampleTemplates = [
    "{brand}: Making life simpler",
    "Experience the {brand} difference",
    "{brand}: Innovation meets excellence",
    "Trust {brand} for your future",
    "Where {brand} meets quality",
    "{brand}: Your partner in success",
    "Discover the power of {brand}",
    "{brand}: Crafted for you",
    "Step into the world of {brand}",
    "Unleash possibilities with {brand}"
  ];

  function generateTaglines() {
    const brand = inputEl.value.trim();
    const count = Math.min(Math.max(+countEl.value || 5, 1), 10);

    if (!brand) {
      alert("Please enter a brand or concept.");
      return;
    }

    resultsEl.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const template = sampleTemplates[Math.floor(Math.random() * sampleTemplates.length)];
      const tagline = template.replace("{brand}", brand);
      const li = document.createElement('li');
      li.innerText = tagline;
      resultsEl.appendChild(li);
    }
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateTaglines);
}
