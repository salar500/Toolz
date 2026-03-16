export function renderSpeechToText(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <button id="start_speech" class="btn">
      Start Recording
    </button>
    <button id="stop_speech" class="btn" style="margin-left:6px">
      Stop Recording
    </button>

    <p class="small muted" style="margin-top:8px">
      Converts your speech to text using your device's microphone.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Speech-to-Text Output</div>
      <textarea
        id="speech_output"
        rows="8"
        style="width:100%;margin-top:8px;font-size:14px"
        readonly
      ></textarea>

      <div id="speech_actions" style="margin-top:6px;display:none">
        <button id="speech_copy" class="btn small">Copy</button>
        <button id="speech_download" class="btn small">Download .txt</button>
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const startBtn = document.querySelector('#start_speech');
  const stopBtn = document.querySelector('#stop_speech');
  const outputEl = document.querySelector('#speech_output');
  const actionsEl = document.querySelector('#speech_actions');
  const copyBtn = document.querySelector('#speech_copy');
  const downloadBtn = document.querySelector('#speech_download');

  /* ---------------- LOGIC ---------------- */
  let recognition;
  let isRecording = false;

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser.');
    startBtn.disabled = true;
    stopBtn.disabled = true;
  } else {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      outputEl.value = transcript;
      if (transcript.length > 0) {
        actionsEl.style.display = 'flex';
      }
    };

    recognition.onerror = function (event) {
      alert('Speech recognition error: ' + event.error);
      isRecording = false;
    };
  }

  function startRecording() {
    if (!recognition) return;
    recognition.start();
    isRecording = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
  }

  function stopRecording() {
    if (!recognition) return;
    recognition.stop();
    isRecording = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }

  /* ---------------- ACTIONS ---------------- */
  copyBtn.addEventListener('click', () => {
    outputEl.select();
    document.execCommand('copy');
    alert('Copied to clipboard');
  });

  downloadBtn.addEventListener('click', () => {
    const blob = new Blob([outputEl.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speech-to-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ---------------- EVENTS ---------------- */
  startBtn.addEventListener('click', startRecording);
  stopBtn.addEventListener('click', stopRecording);

  // Initialize buttons
  stopBtn.disabled = true;
}
