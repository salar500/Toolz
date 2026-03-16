export function renderStopwatch(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <button id="sw_start" class="btn" style="margin-right:6px">Start</button>
      <button id="sw_pause" class="btn" style="margin-right:6px">Pause</button>
      <button id="sw_reset" class="btn">Reset</button>
    </div>
  `;

  result.innerHTML = `
    <div class="result-box">
      <div class="small">Elapsed Time</div>
      <div id="sw_time" style="font-size:32px; font-weight:700; margin-top:6px">00:00:00.0</div>
    </div>
  `;

  /* ---------------- Elements ---------------- */
  const timeEl = document.querySelector('#sw_time');
  const startBtn = document.querySelector('#sw_start');
  const pauseBtn = document.querySelector('#sw_pause');
  const resetBtn = document.querySelector('#sw_reset');

  /* ---------------- Variables ---------------- */
  let startTime = 0;
  let elapsed = 0;
  let timerInterval = null;

  /* ---------------- Helpers ---------------- */
  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const tenths = Math.floor((ms % 1000) / 100);
    return `${hours}:${minutes}:${seconds}.${tenths}`;
  }

  function updateTime() {
    const now = Date.now();
    elapsed = now - startTime;
    timeEl.innerText = formatTime(elapsed);
  }

  /* ---------------- Actions ---------------- */
  function startStopwatch() {
    if (timerInterval) return;
    startTime = Date.now() - elapsed;
    timerInterval = setInterval(updateTime, 100);
  }

  function pauseStopwatch() {
    if (!timerInterval) return;
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetStopwatch() {
    pauseStopwatch();
    elapsed = 0;
    timeEl.innerText = formatTime(elapsed);
  }

  /* ---------------- Events ---------------- */
  startBtn.addEventListener('click', startStopwatch);
  pauseBtn.addEventListener('click', pauseStopwatch);
  resetBtn.addEventListener('click', resetStopwatch);
}
