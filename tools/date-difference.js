export function renderDateDifference(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Start Date</label>
      <input id="dd_start" type="date"
        value="${tool.prefill?.start || ''}" />
    </div>

    <div class="form-row">
      <label>End Date</label>
      <input id="dd_end" type="date"
        value="${tool.prefill?.end || ''}" />
    </div>

    <button id="dd_calc" class="btn" style="margin-top:6px">
      Calculate Difference
    </button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Date Difference</div>
      <div id="dd_days"
        style="font-size:28px;font-weight:700;opacity:.6">--</div>

      <div class="row">
        <span>Years</span>
        <span id="dd_years">--</span>
      </div>
      <div class="row">
        <span>Months</span>
        <span id="dd_months">--</span>
      </div>
      <div class="row">
        <span>Days</span>
        <span id="dd_remaining_days">--</span>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const startEl = document.querySelector('#dd_start');
  const endEl = document.querySelector('#dd_end');

  const daysEl = document.querySelector('#dd_days');
  const yearsEl = document.querySelector('#dd_years');
  const monthsEl = document.querySelector('#dd_months');
  const remDaysEl = document.querySelector('#dd_remaining_days');

  /* ---------------- CORE LOGIC ---------------- */
  function calculateDifference(start, end) {
    if (end < start) return null;

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonthDays = new Date(
        end.getFullYear(),
        end.getMonth(),
        0
      ).getDate();
      days += prevMonthDays;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.round(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    return { years, months, days, totalDays };
  }

  /* ---------------- CALCULATE ---------------- */
  function calculate() {
    if (!startEl.value || !endEl.value) return;

    const start = new Date(startEl.value);
    const end = new Date(endEl.value);

    const diff = calculateDifference(start, end);
    if (!diff) return;

    daysEl.style.opacity = .4;
    setTimeout(() => {
      daysEl.innerText = `${diff.totalDays} Days`;
      daysEl.style.opacity = 1;
    }, 120);

    yearsEl.innerText = diff.years;
    monthsEl.innerText = diff.months;
    remDaysEl.innerText = diff.days;
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#dd_calc')
    .addEventListener('click', calculate);
}
