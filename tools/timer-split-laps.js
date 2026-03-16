export function renderTimerSplitLaps(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <button id="timer_start" class="btn">Start</button>
      <button id="timer_lap" class="btn" style="margin-left:6px" disabled>
        Lap
      </button>
      <button id="timer_reset" class="btn" style="margin-left:6px" disabled>
        Reset
      </button>
    </div>

    <p class="small muted" style="margin-top:8px">
      Start the timer and record split lap times.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div
        id="timer_display"
        style="font-size:28px;font-weight:700;text-align:center">
        00:00.000
      </div>

      <div
        id="lap_container"
        style="margin-top:10px;font-size:14px;opacity:.85">
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const startBtn = document.querySelector('#timer_start');
  const lapBtn = document.querySelector('#timer_lap');
  const resetBtn = document.querySelector('#timer_reset');
  const displayEl = document.querySelector('#timer_display');
  const lapContainer = document.querySelector('#lap_container');

  /* ---------------- STATE ---------------- */
  let startTime = 0;
  let elapsed = 0;
  let interval = null;
  let lapCount = 0;

  /* ---------------- UTILS ---------------- */
  function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;

    return (
      String(minutes).padStart(2, '0') +
      ':' +
      String(seconds).padStart(2, '0') +
      '.' +
      String(millis).padStart(3, '0')
    );
  }

  /* ---------------- LOGIC ---------------- */
  function startTimer() {
    if (interval) return;

    startTime = Date.now() - elapsed;
    interval = setInterval(() => {
      elapsed = Date.now() - startTime;
      displayEl.innerText = formatTime(elapsed);
    }, 10);

    startBtn.disabled = true;
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function recordLap() {
    lapCount++;
    const lapTime = formatTime(elapsed);

    const lapEl = document.createElement('div');
    lapEl.innerText = `Lap ${lapCount}: ${lapTime}`;
    lapContainer.prepend(lapEl);
  }

  function resetTimer() {
    clearInterval(interval);
    interval = null;
    elapsed = 0;
    lapCount = 0;

    displayEl.innerText = '00:00.000';
    lapContainer.innerHTML = '';

    startBtn.disabled = false;
    lapBtn.disabled = true;
    resetBtn.disabled = true;
  }

  /* ---------------- EVENTS ---------------- */
  startBtn.addEventListener('click', startTimer);
  lapBtn.addEventListener('click', recordLap);
  resetBtn.addEventListener('click', resetTimer);
}
