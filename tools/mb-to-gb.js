export function renderMbToGb(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */

  inputs.innerHTML = `
    <div class="form-row">
      <label>Megabytes (MB)</label>
      <input
        id="mb_input"
        type="number"
        min="0"
        step="0.01"
        placeholder="e.g. 1024"
        value="${tool.prefill?.mb || ''}"
      />
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */

  result.innerHTML = `
    <div class="result-box">
      <div class="small">Gigabytes (GB)</div>
      <div
        id="gb_output"
        style="font-size:32px;font-weight:700;margin-top:6px"
      >
        —
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */

  const mbInput = document.querySelector('#mb_input');
  const gbOutput = document.querySelector('#gb_output');

  /* ---------------- LOGIC ---------------- */

  const convert = () => {
    const mb = Number(mbInput.value);

    if (mb < 0 || isNaN(mb)) {
      gbOutput.innerText = '—';
      return;
    }

    const gb = mb / 1024; // Binary standard
    gbOutput.innerText = gb.toFixed(4) + ' GB';
  };

  /* ---------------- EVENTS ---------------- */

  mbInput.addEventListener('input', convert);
  convert(); // auto-run if prefilled
}
