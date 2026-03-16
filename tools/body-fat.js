export function renderBodyFat(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- LAYOUT STRUCTURE ---------------- */
  let toolRow = document.querySelector('#tool-row');
  if (!toolRow) {
    toolRow = document.createElement('div');
    toolRow.id = 'tool-row';
    inputs.parentNode.insertBefore(toolRow, inputs);
    toolRow.appendChild(inputs);
    toolRow.appendChild(result);
  }

  let seoContainer = document.querySelector('#seo-container');
  if (!seoContainer) {
    seoContainer = document.createElement('div');
    seoContainer.id = 'seo-container';
    toolRow.parentNode.insertBefore(seoContainer, toolRow.nextSibling);
  }

  /* ---------------- INLINE STYLES ---------------- */
  if (!document.querySelector('#bf-layout-style')) {
    const style = document.createElement('style');
    style.id = 'bf-layout-style';
    style.innerHTML = `
      #tool-row { display:flex; gap:24px; align-items:flex-start; margin-bottom:32px; }
      #tool-row > div { flex:1; }
      @media(max-width:768px){ #tool-row{ flex-direction:column; } }

      .card { padding:16px; border-radius:14px; background:#fff; box-shadow:0 8px 20px rgba(0,0,0,.06); }
      .title { font-size:18px; font-weight:700; margin-bottom:12px; }
      .form-row { margin-bottom:12px; }
      .form-row label { display:block; font-size:13px; font-weight:600; margin-bottom:4px; }
      .form-row input, .form-row select { width:100%; padding:10px; border-radius:8px; border:1px solid #d1d5db; font-size:14px; }
      .btn-primary { width:100%; padding:12px; border-radius:10px; border:none; font-weight:700; font-size:15px; cursor:pointer; background:linear-gradient(135deg,#16a34a,#15803d); color:#fff; }
      .result-card { padding:16px; border-radius:14px; background:#fff; box-shadow:0 8px 20px rgba(0,0,0,.06); }
      .small { font-size:12px; color:#6b7280; }
      .value { font-size:30px; font-weight:800; margin:6px 0 14px; color:#1d4ed8; }
      #seo-container { background:#fff; padding:26px; border-radius:14px; box-shadow:0 8px 20px rgba(0,0,0,.05); margin-bottom:28px; line-height:1.8; font-size:15px; }
      #seo-container h2 { margin-top:0; font-size:22px; }
      #seo-container h3 { margin-top:20px; font-size:18px; }
      #bf_hip_wrap { display:none; }
    `;
    document.head.appendChild(style);
  }

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Body Fat Calculator</div>

      <div class="form-row">
        <label>Gender</label>
        <select id="bf_gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="form-row">
        <label>Height</label>
        <div style="display:flex; gap:8px; align-items:center;">
          <input id="bf_height_cm" type="number" min="1" placeholder="cm" style="flex:1">
          <span>OR</span>
          <input id="bf_height_ft" type="number" min="0" placeholder="ft" style="width:60px;">
          <input id="bf_height_in" type="number" min="0" placeholder="in" style="width:60px;">
        </div>
      </div>

      <div class="form-row">
        <label>Weight</label>
        <div style="display:flex; gap:8px;">
          <input id="bf_weight" type="number" min="1" style="flex:1;">
          <select id="bf_weight_unit" style="width:100px;">
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <label>Neck circumference (cm)</label>
        <input id="bf_neck" type="number" min="1">
      </div>

      <div class="form-row">
        <label>Waist circumference (cm)</label>
        <input id="bf_waist" type="number" min="1">
      </div>

      <div class="form-row" id="bf_hip_wrap">
        <label>Hip circumference (cm)</label>
        <input id="bf_hip" type="number" min="1">
      </div>

      <button id="bf_calc" class="btn-primary">Calculate Body Fat %</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Body Fat Percentage</div>
      <div id="bf_value" class="value">--</div>
      <div id="bf_category" style="font-weight:600">--</div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const genderEl = document.querySelector('#bf_gender');
  const heightCmEl = document.querySelector('#bf_height_cm');
  const heightFtEl = document.querySelector('#bf_height_ft');
  const heightInEl = document.querySelector('#bf_height_in');
  const weightEl = document.querySelector('#bf_weight');
  const weightUnitEl = document.querySelector('#bf_weight_unit');
  const neckEl = document.querySelector('#bf_neck');
  const waistEl = document.querySelector('#bf_waist');
  const hipEl = document.querySelector('#bf_hip');
  const hipWrap = document.querySelector('#bf_hip_wrap');
  const valueEl = document.querySelector('#bf_value');
  const categoryEl = document.querySelector('#bf_category');

  /* ---------------- GENDER TOGGLE ---------------- */
  genderEl.addEventListener('change', () => {
    hipWrap.style.display = genderEl.value === 'female' ? 'block' : 'none';
  });

  /* ---------------- CALCULATE ---------------- */
  function calculate() {
    const gender = genderEl.value;

    let heightCm = +heightCmEl.value;
    if (!heightCm) {
      heightCm = (+heightFtEl.value || 0) * 30.48 + (+heightInEl.value || 0) * 2.54;
    }

    let weight = +weightEl.value;
    if (weightUnitEl.value === 'lbs') weight /= 2.20462;

    const neck = +neckEl.value;
    const waist = +waistEl.value;
    const hip = +hipEl.value;

    if (!heightCm || !neck || !waist || (gender==='female' && !hip)) {
      alert('Please fill all required measurements');
      return;
    }

    if (waist <= neck) {
      alert('Waist must be greater than neck');
      return;
    }

    let bf;
    if (gender === 'male') {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(heightCm)) - 450;
    }

    if (!isFinite(bf) || bf <= 0) return;

    valueEl.innerText = `${bf.toFixed(1)} %`;
    categoryEl.innerText =
      gender === 'male'
        ? bf < 14 ? 'Athletes' : bf < 25 ? 'Average' : 'Obese'
        : bf < 21 ? 'Athletes' : bf < 32 ? 'Average' : 'Obese';
  }

  document.querySelector('#bf_calc').addEventListener('click', calculate);

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>Body Fat Calculator – Track Your Health Accurately</h2>
    <p>
      The Body Fat Calculator helps you estimate your body fat percentage using
      key measurements like height, weight, neck, waist, and hip (for females).
      Understanding body fat is essential for fitness, weight management, and
      overall health monitoring.
    </p>

    <h3>Why Measure Body Fat?</h3>
    <ul>
      <li>Provides a clearer picture of your fitness than weight alone.</li>
      <li>Helps identify potential health risks associated with high or low body fat.</li>
      <li>Tracks progress during training or dieting programs.</li>
    </ul>

    <h3>How to Use the Calculator</h3>
    <ol>
      <li>Select your gender.</li>
      <li>Enter your height (cm or ft/in), weight (kg or lbs), neck and waist measurements. Females must also enter hip circumference.</li>
      <li>Click <strong>Calculate Body Fat %</strong> to see your percentage and category.</li>
    </ol>

    <h3>Body Fat Categories</h3>
    <p>
      Categories help you understand where your body composition stands:
    </p>
    <ul>
      <li><strong>Athletes:</strong> Very fit with low body fat.</li>
      <li><strong>Average:</strong> Healthy and normal range.</li>
      <li><strong>Obese:</strong> Higher risk; consider lifestyle adjustments.</li>
    </ul>

    <h3>Tips for Managing Body Fat</h3>
    <ul>
      <li>Maintain a balanced diet rich in protein, vegetables, and healthy fats.</li>
      <li>Include regular physical activity with cardio and strength training.</li>
      <li>Track your progress over time, not just daily fluctuations.</li>
      <li>Consult a healthcare professional for personalized guidance if necessary.</li>
    </ul>

    <p>
      Using this Body Fat Calculator regularly allows you to monitor your health,
      adjust your fitness program, and set realistic goals. It provides fast,
      accurate insights to make informed decisions about your body composition.
    </p>
  `;
}
