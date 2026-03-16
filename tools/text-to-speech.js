export function renderTextToSpeech(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Enter Text</label>
      <textarea
        id="tts_input"
        rows="6"
        style="width:100%"
        placeholder="Enter text to speak..."></textarea>
    </div>

    <div class="form-row" style="margin-top:6px">
      <label>Voice</label>
      <select id="tts_voice" style="width:100%"></select>
    </div>

    <div class="form-row" style="margin-top:6px">
      <label>Rate</label>
      <input id="tts_rate" type="number" value="1" min="0.1" max="2" step="0.1" style="width:80px"/>
      <label style="margin-left:10px">Pitch</label>
      <input id="tts_pitch" type="number" value="1" min="0" max="2" step="0.1" style="width:80px"/>
    </div>

    <button id="tts_play" class="btn" style="margin-top:6px">Play</button>
    <button id="tts_pause" class="btn" style="margin-left:6px;margin-top:6px">Pause</button>
    <button id="tts_stop" class="btn" style="margin-left:6px;margin-top:6px">Stop</button>

    <p class="small muted" style="margin-top:8px">
      Converts text to speech using your device's built-in voices.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Text-to-Speech Output</div>
      <div id="tts_status" style="margin-top:8px;font-size:14px;opacity:0.6">
        Idle
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const inputEl = document.querySelector('#tts_input');
  const voiceEl = document.querySelector('#tts_voice');
  const rateEl = document.querySelector('#tts_rate');
  const pitchEl = document.querySelector('#tts_pitch');
  const playBtn = document.querySelector('#tts_play');
  const pauseBtn = document.querySelector('#tts_pause');
  const stopBtn = document.querySelector('#tts_stop');
  const statusEl = document.querySelector('#tts_status');

  /* ---------------- LOGIC ---------------- */
  if (!('speechSynthesis' in window)) {
    alert('Text-to-Speech not supported in this browser.');
    playBtn.disabled = true;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    return;
  }

  let synth = window.speechSynthesis;
  let utterance;
  let voices = [];

  function populateVoices() {
    voices = synth.getVoices();
    voiceEl.innerHTML = '';
    voices.forEach((voice, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.text = `${voice.name} (${voice.lang})${voice.default ? ' [default]' : ''}`;
      voiceEl.appendChild(option);
    });
  }

  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  function speakText() {
    const text = inputEl.value.trim();
    if (!text) return alert('Please enter text to speak');

    if (synth.speaking) synth.cancel();

    utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[voiceEl.value] || null;
    utterance.rate = parseFloat(rateEl.value);
    utterance.pitch = parseFloat(pitchEl.value);

    utterance.onstart = () => (statusEl.innerText = 'Speaking...');
    utterance.onend = () => (statusEl.innerText = 'Idle');
    utterance.onerror = () => (statusEl.innerText = 'Error occurred');

    synth.speak(utterance);
  }

  function pauseSpeech() {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      statusEl.innerText = 'Paused';
    }
  }

  function resumeSpeech() {
    if (synth.paused) {
      synth.resume();
      statusEl.innerText = 'Speaking...';
    }
  }

  function stopSpeech() {
    if (synth.speaking) {
      synth.cancel();
      statusEl.innerText = 'Idle';
    }
  }

  /* ---------------- EVENTS ---------------- */
  playBtn.addEventListener('click', speakText);
  pauseBtn.addEventListener('click', () => {
    if (!synth.paused) pauseSpeech();
    else resumeSpeech();
  });
  stopBtn.addEventListener('click', stopSpeech);
}
