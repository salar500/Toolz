export function renderHashtagGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Enter Keyword or Phrase</label>
      <input id="hashtag_input" type="text" placeholder="e.g. travel, food, fitness"
        value="${tool.prefill?.keyword || ''}">
    </div>

    <div class="form-row">
      <label>Number of Hashtags</label>
      <input id="hashtag_count" type="number" min="1" max="30" value="${tool.prefill?.count || 10}">
    </div>

    <button id="hashtag_generate" class="btn" style="margin-top:6px">
      Generate Hashtags
    </button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box">
      <div class="small">Generated Hashtags</div>
      <div id="hashtag_list" style="margin-top:6px; line-height:1.6; word-break:break-word"></div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const keywordEl = document.querySelector('#hashtag_input');
  const countEl = document.querySelector('#hashtag_count');
  const listEl = document.querySelector('#hashtag_list');
  const generateBtn = document.querySelector('#hashtag_generate');

  /* ---------------- LOGIC ---------------- */
  function generateHashtags() {
    const keyword = keywordEl.value.trim().replace(/\s+/g, '');
    if (!keyword) {
      listEl.innerText = 'Please enter a keyword or phrase.';
      return;
    }

    const count = Math.min(Math.max(Number(countEl.value), 1), 30);

    const results = new Set();

    const variations = [
      `#${keyword}`,
      `#${keyword}Life`,
      `#${keyword}Daily`,
      `#${keyword}Love`,
      `#${keyword}Fun`,
      `#${keyword}Inspo`,
      `#${keyword}Vibes`,
      `#${keyword}Goals`,
      `#${keyword}Style`,
      `#${keyword}World`,
      `#${keyword}Time`,
      `#${keyword}Community`
    ];

    while (results.size < count) {
      const tag = variations[Math.floor(Math.random() * variations.length)];
      results.add(tag);
    }

    listEl.innerHTML = Array.from(results).join(' ');
  }

  /* ---------------- EVENTS ---------------- */
  generateBtn.addEventListener('click', generateHashtags);

  generateHashtags(); // auto-run if prefilled
}
