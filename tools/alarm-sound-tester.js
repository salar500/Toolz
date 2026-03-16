export function renderAlarmSoundTester(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Select Alarm Sound</label>
      <select id="alarm_sound">
        <option value="beep">Beep</option>
        <option value="chime">Chime</option>
        <option value="bell">Bell</option>
      </select>
    </div>

    <div class="form-row">
      <label>Volume</label>
      <input
        id="alarm_volume"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value="0.5"
      />
    </div>

    <button id="alarm_test" class="btn" style="margin-top:6px">
      Play Sound
    </button>

    <button id="alarm_stop" class="btn" style="margin-top:6px;margin-left:6px" disabled>
      Stop
    </button>

    <p class="small muted" style="margin-top:8px">
      Test alarm sounds and adjust volume.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Status</div>
      <div
        id="alarm_status"
        style="font-size:15px;font-weight:600;opacity:.6">
        Idle
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const soundEl = document.querySelector('#alarm_sound');
  const volumeEl = document.querySelector('#alarm_volume');
  const playBtn = document.querySelector('#alarm_test');
  const stopBtn = document.querySelector('#alarm_stop');
  const statusEl = document.querySelector('#alarm_status');

  /* ---------------- AUDIO ---------------- */
  const sounds = {
    beep: new Audio('/sounds/beep.mp3'),
    chime: new Audio('/sounds/chime.mp3'),
    bell: new Audio('/sounds/bell.mp3')
  };

  let currentAudio = null;

  /* ---------------- LOGIC ---------------- */
  function playSound() {
    const sound = soundEl.value;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    currentAudio = sounds[sound];
    currentAudio.volume = Number(volumeEl.value);
    currentAudio.loop = true;

    currentAudio.play();

    playBtn.disabled = true;
    stopBtn.disabled = false;

    statusEl.innerText = 'Playing...';
    statusEl.style.opacity = 1;
  }

  function stopSound() {
    if (!currentAudio) return;

    currentAudio.pause();
    currentAudio.currentTime = 0;

    playBtn.disabled = false;
    stopBtn.disabled = true;

    statusEl.innerText = 'Stopped';
  }

  /* ---------------- EVENTS ---------------- */
  playBtn.addEventListener('click', playSound);
  stopBtn.addEventListener('click', stopSound);
}
