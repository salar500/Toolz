export function renderIntervalTimer(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Number of Intervals</label>
      <input id="interval_count" type="number" min="1" value="5" />
    </div>

    <div class="form-row">
      <label>Work Duration (seconds)</label>
      <input id="interval_work" type="number" min="1" value="30" />
    </div>

    <div class="form-row">
      <label>Rest Duration (seconds)</label>
      <input id="interval_rest" type="number" min="1" value="15" />
    </div>

    <div class="form-row" style="margin-top:6px">
      <button id="interval_start" class="btn" style="margin-right:6px">Start</button>
      <button id="interval_pause" class="btn" style="margin-right:6px">Pause</button>
      <button id="interval_reset" class="btn">Reset</button>
    </div>
  `;

  result.innerHTML = `
    <div class="result-box">
      <div class="small">Interval Timer</div>
      <div id="interval_time" style="font-size:32px; font-weight:700; margin-top:6px">30</div>
      <div id="interval_phase" style="font-size:16px; margin-top:4px; opacity:.8">Work</div>
      <div id="interval_countdown" style="margin-top:4px; opacity:.8">Interval 1 of 5</div>
    </div>
  `;

  /* ---------------- Elements ---------------- */
  const countEl = document.querySelector('#interval_count');
  const workEl = document.querySelector('#interval_work');
  const restEl = document.querySelector('#interval_rest');
  const timeEl = document.querySelector('#interval_time');
  const phaseEl = document.querySelector('#interval_phase');
  const countdownEl = document.querySelector('#interval_countdown');
  const startBtn = document.querySelector('#interval_start');
  const pauseBtn = document.querySelector('#interval_pause');
  const resetBtn = document.querySelector('#interval_reset');

  /* ---------------- Variables ---------------- */
  let timerInterval = null;
  let remainingSeconds = +workEl.value;
  let currentPhase = 'Work';
  let currentInterval = 1;
  let totalIntervals = +countEl.value;

  /* ---------------- Helpers ---------------- */
  function updateDisplay() {
    timeEl.innerText = remainingSeconds;
    phaseEl.innerText = currentPhase;
    countdownEl.innerText = `Interval ${currentInterval} of ${totalIntervals}`;
  }

  function switchPhase() {
    if (currentPhase === 'Work') {
      currentPhase = 'Rest';
      remainingSeconds = +restEl.value;
    } else {
      currentInterval++;
      if (currentInterval > totalIntervals) {
        clearInterval(timerInterval);
        timerInterval = null;
        alert('All intervals completed!');
        return;
      }
      currentPhase = 'Work';
      remainingSeconds = +workEl.value;
    }
    updateDisplay();
  }

  /* ---------------- Actions ---------------- */
  function startTimer() {
    if (timerInterval) return; // already running
    timerInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds < 0) {
        switchPhase();
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
    currentInterval = 1;
    totalIntervals = +countEl.value;
    remainingSeconds = +workEl.value;
    updateDisplay();
  }

  /* ---------------- Events ---------------- */
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);

  updateDisplay();
}
