export function renderReverseTimer(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Hours</label>
      <input id="rt_hours" type="number" min="0" placeholder="0" />
    </div>

    <div class="form-row">
      <label>Minutes</label>
      <input id="rt_minutes" type="number" min="0" max="59" placeholder="0" />
    </div>

    <div class="form-row">
      <label>Seconds</label>
      <input id="rt_seconds" type="number" min="0" max="59" placeholder="0" />
    </div>

    <div class="form-row">
      <button id="rt_start" class="btn">Start</button>
      <button id="rt_pause" class="btn" style="margin-left:6px" disabled>
        Pause
      </button>
      <button id="rt_reset" class="btn" style="margin-left:6px" disabled>
        Reset
      </button>
    </div>

    <p class="small muted" style="margin-top:8px">
      Countdown timer that runs in reverse until zero.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div
        id="rt_display"
        style="font-size:28px;font-weight:700;text-align:center">
        00:00:00
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const hoursEl = document.querySelector('#rt_hours');
  const minutesEl = document.querySelector('#rt_minutes');
  const secondsEl = document.querySelector('#rt_seconds');
  const startBtn = document.querySelector('#rt_start');
  const pauseBtn = document.querySelector('#rt_pause');
  const resetBtn = document.querySelector('#rt_reset');
  const displayEl = document.querySelector('#rt_display');

  /* ---------------- STATE ---------------- */
  let totalSeconds = 0;
  let remainingSeconds = 0;
  let interval = null;

  /* ---------------- UTILS ---------------- */
  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return (
      String(h).padStart(2, '0') +
      ':' +
      String(m).padStart(2, '0') +
      ':' +
      String(s).padStart(2, '0')
    );
  }

  /* ---------------- LOGIC ---------------- */
  function startTimer() {
    if (interval) return;

    const h = Number(hoursEl.value) || 0;
    const m = Number(minutesEl.value) || 0;
    const s = Number(secondsEl.value) || 0;

    if (!totalSeconds) {
      totalSeconds = h * 3600 + m * 60 + s;
      remainingSeconds = totalSeconds;
    }

    if (remainingSeconds <= 0) return;

    displayEl.innerText = formatTime(remainingSeconds);

    interval = setInterval(() => {
      remainingSeconds--;
      displayEl.innerText = formatTime(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(interval);
        interval = null;
        pauseBtn.disabled = true;
        startBtn.disabled = false;
      }
    }, 1000);

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function pauseTimer() {
    if (!interval) return;
    clearInterval(interval);
    interval = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }

  function resetTimer() {
    clearInterval(interval);
    interval = null;
    totalSeconds = 0;
    remainingSeconds = 0;

    displayEl.innerText = '00:00:00';

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
  }

  /* ---------------- EVENTS ---------------- */
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
}
