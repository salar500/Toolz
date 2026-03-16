export function renderCountdown(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Countdown Target Time</label>
      <input id="cd_target" type="datetime-local" />
    </div>

    <div class="form-row" style="margin-top:6px">
      <button id="cd_start" class="btn" style="margin-right:6px">Start</button>
      <button id="cd_pause" class="btn" style="margin-right:6px">Pause</button>
      <button id="cd_reset" class="btn">Reset</button>
    </div>
  `;

  result.innerHTML = `
    <div class="result-box">
      <div class="small">Time Remaining</div>
      <div id="cd_time" style="font-size:32px; font-weight:700; margin-top:6px">00:00:00</div>
    </div>
  `;

  /* ---------------- Elements ---------------- */
  const targetEl = document.querySelector('#cd_target');
  const timeEl = document.querySelector('#cd_time');
  const startBtn = document.querySelector('#cd_start');
  const pauseBtn = document.querySelector('#cd_pause');
  const resetBtn = document.querySelector('#cd_reset');

  /* ---------------- Variables ---------------- */
  let targetTime = null;
  let timerInterval = null;
  let pausedRemaining = null;

  /* ---------------- Helpers ---------------- */
  function formatTime(ms) {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  function updateCountdown() {
    const now = Date.now();
    let remaining = targetTime - now;
    if (pausedRemaining !== null) remaining = pausedRemaining;
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      remaining = 0;
      alert("Countdown finished!");
    }
    timeEl.innerText = formatTime(remaining);
  }

  /* ---------------- Actions ---------------- */
  function startCountdown() {
    if (!targetEl.value) {
      alert("Please set a target date/time");
      return;
    }

    if (pausedRemaining !== null) {
      // resume
      targetTime = Date.now() + pausedRemaining;
      pausedRemaining = null;
    } else {
      targetTime = new Date(targetEl.value).getTime();
      if (isNaN(targetTime) || targetTime <= Date.now()) {
        alert("Target time must be in the future");
        return;
      }
    }

    if (timerInterval) return;
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 500);
  }

  function pauseCountdown() {
    if (!timerInterval) return;
    clearInterval(timerInterval);
    timerInterval = null;
    pausedRemaining = targetTime - Date.now();
  }

  function resetCountdown() {
    clearInterval(timerInterval);
    timerInterval = null;
    pausedRemaining = null;
    timeEl.innerText = "00:00:00";
  }

  /* ---------------- Events ---------------- */
  startBtn.addEventListener('click', startCountdown);
  pauseBtn.addEventListener('click', pauseCountdown);
  resetBtn.addEventListener('click', resetCountdown);
}
