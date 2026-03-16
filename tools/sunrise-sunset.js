export function renderSunriseSunset(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Latitude</label>
      <input
        id="latitude"
        type="number"
        step="any"
        placeholder="e.g. 40.7128"
      />
    </div>

    <div class="form-row">
      <label>Longitude</label>
      <input
        id="longitude"
        type="number"
        step="any"
        placeholder="e.g. -74.0060"
      />
    </div>

    <div class="form-row">
      <label>Date</label>
      <input
        id="sun_date"
        type="date"
      />
    </div>

    <button id="sun_calculate" class="btn" style="margin-top:6px">
      Get Sunrise & Sunset
    </button>

    <p class="small muted" style="margin-top:8px">
      Calculates sunrise and sunset times for a given location and date.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Sun Times</div>
      <div
        id="sun_result"
        style="font-size:15px;font-weight:600;opacity:.6">
        No data yet
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const latEl = document.querySelector('#latitude');
  const lonEl = document.querySelector('#longitude');
  const dateEl = document.querySelector('#sun_date');
  const resultEl = document.querySelector('#sun_result');

  /* ---------------- LOGIC ---------------- */
  async function calculate() {
    const lat = latEl.value;
    const lon = lonEl.value;
    const date = dateEl.value;

    if (!lat || !lon) {
      resultEl.innerText = 'Please enter both latitude and longitude';
      resultEl.style.opacity = 1;
      return;
    }

    const selectedDate = date || new Date().toISOString().split('T')[0];

    resultEl.innerText = 'Fetching data...';
    resultEl.style.opacity = .4;

    try {
      const res = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${selectedDate}&formatted=0`
      );
      const data = await res.json();

      if (data.status !== 'OK') {
        resultEl.innerText = 'Unable to fetch sunrise/sunset data';
        resultEl.style.opacity = 1;
        return;
      }

      const sunrise = new Date(data.results.sunrise);
      const sunset = new Date(data.results.sunset);

      const format = d =>
        d.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

      resultEl.innerHTML = `
        <div>🌅 Sunrise: ${format(sunrise)}</div>
        <div>🌇 Sunset: ${format(sunset)}</div>
      `;
      resultEl.style.opacity = 1;
    } catch (err) {
      resultEl.innerText = 'Error fetching data';
      resultEl.style.opacity = 1;
    }
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#sun_calculate')
    .addEventListener('click', calculate);
}
