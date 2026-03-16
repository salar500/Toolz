export function renderTimeSubtractor(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Base Time</label>
      <input
        id="base_time"
        type="datetime-local"
      />
    </div>

    <div class="form-row">
      <label>Subtract Hours</label>
      <input
        id="sub_hours"
        type="number"
        placeholder="0"
      />
    </div>

    <div class="form-row">
      <label>Subtract Minutes</label>
      <input
        id="sub_minutes"
        type="number"
        placeholder="0"
      />
    </div>

    <div class="form-row">
      <label>Subtract Seconds</label>
      <input
        id="sub_seconds"
        type="number"
        placeholder="0"
      />
    </div>

    <button id="time_subtract" class="btn" style="margin-top:6px">
      Subtract Time
    </button>

    <p class="small muted" style="margin-top:8px">
      Subtracts hours, minutes, and seconds from a selected date & time.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Resulting Time</div>
      <div
        id="time_subtract_result"
        style="font-size:16px;font-weight:600;opacity:.6">
        No calculation yet
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const baseTimeEl = document.querySelector('#base_time');
  const hoursEl = document.querySelector('#sub_hours');
  const minutesEl = document.querySelector('#sub_minutes');
  const secondsEl = document.querySelector('#sub_seconds');
  const resultEl = document.querySelector('#time_subtract_result');

  /* ---------------- LOGIC ---------------- */
  function subtractTime() {
    const baseValue = baseTimeEl.value;

    if (!baseValue) {
      resultEl.innerText = 'Please select a base date and time';
      resultEl.style.opacity = 1;
      return;
    }

    const hours = Number(hoursEl.value) || 0;
    const minutes = Number(minutesEl.value) || 0;
    const seconds = Number(secondsEl.value) || 0;

    const baseDate = new Date(baseValue);

    if (isNaN(baseDate.getTime())) {
      resultEl.innerText = 'Invalid base time';
      return;
    }

    const totalMs =
      hours * 3600000 +
      minutes * 60000 +
      seconds * 1000;

    const newDate = new Date(baseDate.getTime() - totalMs);

    resultEl.style.opacity = .4;
    setTimeout(() => {
      resultEl.innerText = newDate.toLocaleString();
      resultEl.style.opacity = 1;
    }, 120);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#time_subtract')
    .addEventListener('click', subtractTime);
}
