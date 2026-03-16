export function renderSeasonCalculator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Date</label>
      <input
        id="season_date"
        type="date"
      />
    </div>

    <div class="form-row">
      <label>Hemisphere</label>
      <select id="hemisphere">
        <option value="north">Northern Hemisphere</option>
        <option value="south">Southern Hemisphere</option>
      </select>
    </div>

    <button id="season_calculate" class="btn" style="margin-top:6px">
      Calculate Season
    </button>

    <p class="small muted" style="margin-top:8px">
      Determines the season based on date and hemisphere.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Season</div>
      <div
        id="season_result"
        style="font-size:18px;font-weight:600;opacity:.6">
        No calculation yet
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const dateEl = document.querySelector('#season_date');
  const hemiEl = document.querySelector('#hemisphere');
  const resultEl = document.querySelector('#season_result');

  /* ---------------- LOGIC ---------------- */
  function calculateSeason() {
    const value = dateEl.value;
    const hemisphere = hemiEl.value;

    if (!value) {
      resultEl.innerText = 'Please select a date';
      resultEl.style.opacity = 1;
      return;
    }

    const date = new Date(value);
    const month = date.getMonth() + 1; // 1–12
    const day = date.getDate();

    let season;

    if (hemisphere === 'north') {
      if (
        (month === 3 && day >= 20) ||
        month === 4 ||
        month === 5 ||
        (month === 6 && day < 21)
      ) {
        season = '🌸 Spring';
      } else if (
        (month === 6 && day >= 21) ||
        month === 7 ||
        month === 8 ||
        (month === 9 && day < 23)
      ) {
        season = '☀️ Summer';
      } else if (
        (month === 9 && day >= 23) ||
        month === 10 ||
        month === 11 ||
        (month === 12 && day < 21)
      ) {
        season = '🍂 Autumn';
      } else {
        season = '❄️ Winter';
      }
    } else {
      // Southern Hemisphere (opposite seasons)
      if (
        (month === 3 && day >= 20) ||
        month === 4 ||
        month === 5 ||
        (month === 6 && day < 21)
      ) {
        season = '🍂 Autumn';
      } else if (
        (month === 6 && day >= 21) ||
        month === 7 ||
        month === 8 ||
        (month === 9 && day < 23)
      ) {
        season = '❄️ Winter';
      } else if (
        (month === 9 && day >= 23) ||
        month === 10 ||
        month === 11 ||
        (month === 12 && day < 21)
      ) {
        season = '🌸 Spring';
      } else {
        season = '☀️ Summer';
      }
    }

    resultEl.style.opacity = .4;
    setTimeout(() => {
      resultEl.innerText = season;
      resultEl.style.opacity = 1;
    }, 120);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#season_calculate')
    .addEventListener('click', calculateSeason);
}
