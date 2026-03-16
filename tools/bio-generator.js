export function renderBioGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Enter Keyword or Theme</label>
      <input id="bio_keyword" type="text" placeholder="e.g. travel, fitness, tech"
        value="${tool.prefill?.keyword || ''}">
    </div>

    <div class="form-row">
      <label>Number of Bios</label>
      <input id="bio_count" type="number" min="1" max="10" value="${tool.prefill?.count || 5}">
    </div>

    <button id="bio_generate" class="btn" style="margin-top:6px">
      Generate Bios
    </button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated Bios</div>
      <div id="bio_list" style="margin-top:6px; line-height:1.6; word-break:break-word"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const keywordEl = document.querySelector('#bio_keyword');
  const countEl = document.querySelector('#bio_count');
  const listEl = document.querySelector('#bio_list');
  const generateBtn = document.querySelector('#bio_generate');

  /* ---------------- LOGIC ---------------- */
  function generateBios() {
    const keyword = keywordEl.value.trim();
    if (!keyword) {
      listEl.innerText = 'Please enter a keyword or theme.';
      return;
    }

    const count = Math.min(Math.max(Number(countEl.value), 1), 10);

    const templates = [
      `Lover of all things ${keyword}. 🌟`,
      `Exploring the world of ${keyword} one day at a time.`,
      `Sharing my ${keyword} journey here.`,
      `Passionate about ${keyword} and adventures.`,
      `Just a ${keyword} enthusiast trying to inspire.`,
      `Creating, learning, and living ${keyword}.`,
      `Your daily dose of ${keyword} inspiration.`,
      `Life through the lens of ${keyword}.`,
      `Obsessed with ${keyword} and good vibes.`,
      `Turning ${keyword} ideas into reality.`
    ];

    const results = new Set();
    while (results.size < count) {
      const bio = templates[Math.floor(Math.random() * templates.length)];
      results.add(bio);
    }

    listEl.innerHTML = Array.from(results).join('<br>');
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateBios);

  generateBios(); // auto-run if prefilled
}
