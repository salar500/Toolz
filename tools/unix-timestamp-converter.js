export function renderUnixTimestampConverter(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Unix Timestamp</label>
      <input
        id="unix_input"
        type="number"
        placeholder="e.g. 1700000000"
      />
    </div>

    <div class="form-row">
      <label>Direction</label>
      <select id="unix_direction">
        <option value="to_date">Unix → Date</option>
        <option value="to_unix">Date → Unix</option>
      </select>
    </div>

    <div class="form-row">
      <label>Date & Time</label>
      <input
        id="date_input"
        type="datetime-local"
      />
    </div>

    <button id="unix_convert" class="btn" style="margin-top:6px">
      Convert
    </button>

    <p class="small muted" style="margin-top:8px">
      Convert Unix timestamps to human-readable dates and vice versa.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Conversion Result</div>
      <div
        id="unix_result"
        style="font-size:16px;font-weight:600;opacity:.6">
        No conversion yet
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const unixInput = document.querySelector('#unix_input');
  const dateInput = document.querySelector('#date_input');
  const directionEl = document.querySelector('#unix_direction');
  const resultEl = document.querySelector('#unix_result');

  /* ---------------- LOGIC ---------------- */
  function convert() {
    const direction = directionEl.value;

    if (direction === 'to_date') {
      const ts = Number(unixInput.value);

      if (!ts) {
        resultEl.innerText = 'Please enter a Unix timestamp';
        resultEl.style.opacity = 1;
        return;
      }

      const date = new Date(ts * 1000);

      if (isNaN(date.getTime())) {
        resultEl.innerText = 'Invalid Unix timestamp';
        return;
      }

      resultEl.style.opacity = .4;
      setTimeout(() => {
        resultEl.innerText = date.toLocaleString();
        resultEl.style.opacity = 1;
      }, 120);
    }

    if (direction === 'to_unix') {
      const value = dateInput.value;

      if (!value) {
        resultEl.innerText = 'Please select a date and time';
        resultEl.style.opacity = 1;
        return;
      }

      const date = new Date(value);

      const unix = Math.floor(date.getTime() / 1000);

      resultEl.style.opacity = .4;
      setTimeout(() => {
        resultEl.innerText = unix.toString();
        resultEl.style.opacity = 1;
      }, 120);
    }
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#unix_convert')
    .addEventListener('click', convert);
}
