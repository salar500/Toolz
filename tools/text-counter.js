export function renderTextCounter(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Enter Text</label>
      <textarea
        id="text_input"
        rows="8"
        style="width:100%"
        placeholder="Type or paste text here..."></textarea>
    </div>

    <p class="small muted" style="margin-top:8px">
      Counts characters, words, lines, and sentences in real-time.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Text Statistics</div>
      <div id="text_stats" style="font-size:14px;font-weight:600;opacity:.8;white-space:pre-line">
        Characters: 0
        Words: 0
        Lines: 0
        Sentences: 0
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#text_input');
  const statsEl = document.querySelector('#text_stats');

  /* ---------------- LOGIC ---------------- */
  function updateStats() {
    const text = inputEl.value;

    const characters = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lines = text.split(/\r?\n/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    statsEl.innerText = 
      `Characters: ${characters}\n` +
      `Words: ${words}\n` +
      `Lines: ${lines}\n` +
      `Sentences: ${sentences}`;
  }

  /* ---------------- EVENTS ---------------- */
  inputEl.addEventListener('input', updateStats);

  // Initial stats
  updateStats();
}
