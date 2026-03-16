export function renderWorkHoursCalculator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Start Time</label>
      <input
        id="start_time"
        type="datetime-local"
      />
    </div>

    <div class="form-row">
      <label>End Time</label>
      <input
        id="end_time"
        type="datetime-local"
      />
    </div>

    <div class="form-row">
      <label>Break Duration (minutes)</label>
      <input
        id="break_minutes"
        type="number"
        min="0"
        placeholder="e.g. 30"
      />
    </div>

    <button id="work_calculate" class="btn" style="margin-top:6px">
      Calculate Work Hours
    </button>

    <p class="small muted" style="margin-top:8px">
      Calculates total working hours after deducting break time.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Total Work Time</div>
      <div
        id="work_result"
        style="font-size:16px;font-weight:600;opacity:.6">
        No calculation yet
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const startInput = document.querySelector('#start_time');
  const endInput = document.querySelector('#end_time');
  const breakInput = document.querySelector('#break_minutes');
  const resultEl = document.querySelector('#work_result');

  /* ---------------- LOGIC ---------------- */
  function calculate() {
    const startValue = startInput.value;
    const endValue = endInput.value;
    const breakMinutes = Number(breakInput.value) || 0;

    if (!startValue || !endValue) {
      resultEl.innerText = 'Please select both start and end times';
      resultEl.style.opacity = 1;
      return;
    }

    const start = new Date(startValue);
    const end = new Date(endValue);

    if (end <= start) {
      resultEl.innerText = 'End time must be after start time';
      return;
    }

    const totalMs = end - start;
    const breakMs = breakMinutes * 60 * 1000;

    if (breakMs >= totalMs) {
      resultEl.innerText = 'Break time cannot exceed total duration';
      return;
    }

    const workMs = totalMs - breakMs;
    const hours = Math.floor(workMs / (1000 * 60 * 60));
    const minutes = Math.floor((workMs % (1000 * 60 * 60)) / (1000 * 60));

    resultEl.style.opacity = .4;
    setTimeout(() => {
      resultEl.innerText = `${hours}h ${minutes}m`;
      resultEl.style.opacity = 1;
    }, 120);
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#work_calculate')
    .addEventListener('click', calculate);
}
