export function renderTimezoneInfo(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Timezone</label>
      <select id="tz_select" style="width:100%">
        <option value="UTC">UTC</option>
        <option value="America/New_York">America/New_York</option>
        <option value="Europe/London">Europe/London</option>
        <option value="Asia/Tokyo">Asia/Tokyo</option>
        <option value="Australia/Sydney">Australia/Sydney</option>
        <!-- Add more as needed -->
      </select>
    </div>

    <button id="tz_show" class="btn" style="margin-top:6px">
      Show Time
    </button>

    <p class="small muted" style="margin-top:8px">
      Displays current date, time, offset, and abbreviation for selected timezone.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Timezone Info</div>
      <div
        id="tz_result"
        style="font-size:14px;font-weight:600;opacity:.6">
        No timezone selected
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const selectEl = document.querySelector('#tz_select');
  const resultEl = document.querySelector('#tz_result');

  /* ---------------- LOGIC ---------------- */
  function showTime() {
    const tz = selectEl.value;

    try {
      const now = new Date();
      const options = {
        timeZone: tz,
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short'
      };

      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(now);

      let dateStr = '';
      let timeStr = '';
      let weekday = '';
      parts.forEach(p => {
        if (p.type === 'weekday') weekday = p.value;
        else if (['year', 'month', 'day'].includes(p.type)) dateStr += p.value + '-';
        else if (['hour', 'minute', 'second'].includes(p.type)) timeStr += p.value + ':';
      });
      dateStr = dateStr.slice(0, -1);
      timeStr = timeStr.slice(0, -1);

      const tzOffset = (now.getTimezoneOffset() / 60).toFixed(2);
      const abbreviation = Intl.DateTimeFormat('en-US', { timeZoneName: 'short', timeZone: tz })
        .format(now)
        .split(' ')
        .pop();

      resultEl.innerHTML = `
        <div>Timezone: <b>${tz}</b></div>
        <div>Date: <b>${dateStr}</b></div>
        <div>Time: <b>${timeStr}</b></div>
        <div>Day: <b>${weekday}</b></div>
        <div>Offset (hrs): <b>${tzOffset}</b></div>
        <div>Abbreviation: <b>${abbreviation}</b></div>
      `;
      resultEl.style.opacity = 1;
    } catch (e) {
      resultEl.innerText = 'Error: invalid timezone';
      resultEl.style.opacity = 1;
    }
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#tz_show')
    .addEventListener('click', showTime);
}
