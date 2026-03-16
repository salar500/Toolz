export function renderPomodoroTimer(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Work Duration (minutes)</label>
      <input id="pomodoro_work" type="number" min="1" value="25" />
    </div>

    <div class="form-row">
      <label>Break Duration (minutes)</label>
      <input id="pomodoro_break" type="number" min="1" value="5" />
    </div>

    <div class="form-row" style="margin-top:6px">
      <button id="pomodoro_start" class="btn" style="margin-right:6px">Start</button>
      <button id="pomodoro_pause" class="btn" style="margin-right:6px">Pause</button>
      <button id="pomodoro_reset" class="btn">Reset</button>
    </div>
  `;

  result.innerHTML = `
    <div class="result-box">
      <div class="small">Pomodoro Timer</div>
      <div id="pomodoro_time" style="font-size:32px; font-weight:700; margin-top:6px">25:00</div>
      <div id="pomodoro_phase" style="font-size:16px; margin-top:4px; opacity:.8">Work</div>
    </div>
  `;

  /* ---------------- Elements ---------------- */
  const workInput = document.querySelector('#pomodoro_work');
  const breakInput = document.querySelector('#pomodoro_break');
  const timeEl = document.querySelector('#pomodoro_time');
  const phaseEl = document.querySelector('#pomodoro_phase');
  const startBtn = document.querySelector('#pomodoro_start');
  const pauseBtn = document.querySelector('#pomodoro_pause');
  const resetBtn = document.querySelector('#pomodoro_reset');

  /* ---------------- Variables ---------------- */
  let timerInterval = null;
  let remainingSeconds = +workInput.value * 60;
  let currentPhase = 'Work'; // or 'Break'

  /* ---------------- Helpers ---------------- */
  function formatTime(sec) {
    const minutes = String(Math.floor(sec / 60)).padStart(2, '0');
    const seconds = String(sec % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function updateDisplay() {
    timeEl.innerText = formatTime(remainingSeconds);
    phaseEl.innerText = currentPhase;
  }

  function switchPhase() {
    if (currentPhase === 'Work') {
      currentPhase = 'Break';
      remainingSeconds = +breakInput.value * 60;
    } else {
      currentPhase = 'Work';
      remainingSeconds = +workInput.value * 60;
    }
    updateDisplay();
  }

  /* ---------------- Actions ---------------- */
  function startTimer() {
    if (timerInterval) return; // already running
    if (remainingSeconds <= 0) remainingSeconds = +workInput.value * 60;

    timerInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds < 0) {
        switchPhase();
        alert(`${currentPhase} phase started!`);
      }
      updateDisplay();
    }, 1000);
  }

  function pauseTimer() {
    if (!timerInterval) return;
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    currentPhase = 'Work';
    remainingSeconds = +workInput.value * 60;
    updateDisplay();
  }

  /* ---------------- Events ---------------- */
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);

  updateDisplay();
}
