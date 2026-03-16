export function renderAlarmClock(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Set Alarm Time</label>
      <input id="alarm_time" type="time" />
    </div>

    <div class="form-row">
      <label>Alarm Label (optional)</label>
      <input id="alarm_label" type="text" placeholder="e.g., Wake up!" />
    </div>

    <div class="form-row" style="margin-top:6px">
      <button id="alarm_set" class="btn" style="margin-right:6px">Set Alarm</button>
      <button id="alarm_clear" class="btn">Clear Alarm</button>
    </div>
  `;

  result.innerHTML = `
    <div class="result-box">
      <div class="small">Alarm Status</div>
      <div id="alarm_status" style="font-size:20px; font-weight:600; margin-top:6px; opacity:.7">
        No alarm set
      </div>
    </div>
  `;

  /* ---------------- Elements ---------------- */
  const timeEl = document.querySelector('#alarm_time');
  const labelEl = document.querySelector('#alarm_label');
  const statusEl = document.querySelector('#alarm_status');
  const setBtn = document.querySelector('#alarm_set');
  const clearBtn = document.querySelector('#alarm_clear');

  /* ---------------- Variables ---------------- */
  let alarmTimeout = null;

  /* ---------------- Helpers ---------------- */
  function setAlarm() {
    clearAlarm();

    const timeValue = timeEl.value;
    if (!timeValue) {
      statusEl.innerText = 'Please select a valid time';
      return;
    }

    const now = new Date();
    const [hours, minutes] = timeValue.split(':').map(Number);
    let alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

    // If time already passed today, set for tomorrow
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const diff = alarmTime - now;

    alarmTimeout = setTimeout(() => {
      alert(labelEl.value || 'Alarm ringing!');
      statusEl.innerText = 'No alarm set';
    }, diff);

    statusEl.innerText = `Alarm set for ${alarmTime.toLocaleTimeString()}${labelEl.value ? ' (' + labelEl.value + ')' : ''}`;
  }

  function clearAlarm() {
    if (alarmTimeout) {
      clearTimeout(alarmTimeout);
      alarmTimeout = null;
    }
    statusEl.innerText = 'No alarm set';
  }

  /* ---------------- Events ---------------- */
  setBtn.addEventListener('click', setAlarm);
  clearBtn.addEventListener('click', clearAlarm);
}
