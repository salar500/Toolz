export function renderCalorie(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- CREATE TOOL CONTAINERS ---------------- */
  let toolRow = document.querySelector('#tool-row');
  if (!toolRow) {
    toolRow = document.createElement('div');
    toolRow.id = 'tool-row';
    toolRow.style.display = 'flex';
    toolRow.style.flexWrap = 'wrap';
    toolRow.style.gap = '16px';
    toolRow.style.alignItems = 'flex-start';
    inputs.parentNode.insertBefore(toolRow, inputs);
    toolRow.appendChild(inputs);
    toolRow.appendChild(result);
  }

  let seoContainer = document.querySelector('#seo-container');
  if (!seoContainer) {
    seoContainer = document.createElement('div');
    seoContainer.id = 'seo-container';
    seoContainer.style.marginTop = '24px';
    toolRow.parentNode.insertBefore(seoContainer, toolRow.nextSibling);
  }

  /* ---------------- INLINE STYLES (SAME AS BEFORE) ---------------- */
  if (!document.querySelector('#calorie-style')) {
    const style = document.createElement('style');
    style.id = 'calorie-style';
    style.innerHTML = `
      .card {
        padding:16px;
        border-radius:14px;
        background:#fff;
        box-shadow:0 10px 24px rgba(0,0,0,.08);
        flex:1 1 300px;
      }
      .title {
        font-size:18px;
        font-weight:700;
        margin-bottom:12px;
      }
      .form-row {
        margin-bottom:12px;
      }
      .form-row label {
        display:block;
        font-size:13px;
        font-weight:600;
        margin-bottom:4px;
      }
      .form-row input,
      .form-row select {
        width:100%;
        padding:10px;
        border-radius:8px;
        border:1px solid #d1d5db;
        font-size:14px;
      }
      .btn-primary {
        width:100%;
        padding:12px;
        border-radius:10px;
        border:none;
        font-weight:700;
        font-size:15px;
        cursor:pointer;
        background:linear-gradient(135deg,#16a34a,#15803d);
        color:#fff;
        box-shadow:0 6px 14px rgba(22,163,74,.35);
        margin-top:6px;
      }
      .result-card {
        margin-top:16px;
        padding:16px;
        border-radius:14px;
        background:#fff;
        box-shadow:0 10px 24px rgba(0,0,0,.08);
        flex:1 1 200px;
      }
      .small {
        font-size:12px;
        color:#6b7280;
      }
      .value {
        font-size:30px;
        font-weight:800;
        margin:6px 0 14px;
        color:#16a34a;
        transition:.25s;
      }
      #tool-row {
        display:flex;
        gap:16px;
        flex-wrap:wrap;
      }
      @media(max-width:768px) {
        #tool-row {
          flex-direction:column;
        }
      }
      #seo-container {
        width:100%;
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Calorie Calculator</div>

      <div class="form-row">
        <label>Gender</label>
        <select id="cal_gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="form-row">
        <label>Age (years)</label>
        <input id="cal_age" type="number" min="1" value="${tool.prefill?.age || ''}" />
      </div>

      <div class="form-row">
        <label>Height (cm)</label>
        <input id="cal_height" type="number" min="50" value="${tool.prefill?.height || ''}" />
      </div>

      <div class="form-row">
        <label>Weight (kg)</label>
        <input id="cal_weight" type="number" min="1" value="${tool.prefill?.weight || ''}" />
      </div>

      <div class="form-row">
        <label>Activity Level</label>
        <select id="cal_activity">
          <option value="1.2">Sedentary (little exercise)</option>
          <option value="1.375">Lightly active</option>
          <option value="1.55">Moderately active</option>
          <option value="1.725">Very active</option>
          <option value="1.9">Extra active</option>
        </select>
      </div>

      <button id="cal_calc" class="btn-primary">Calculate Calories</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Daily Calorie Needs</div>
      <div id="cal_value" class="value">--</div>
      <div class="muted" style="margin-top:6px">
        Estimated calories required per day
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const genderEl = document.querySelector('#cal_gender');
  const ageEl = document.querySelector('#cal_age');
  const heightEl = document.querySelector('#cal_height');
  const weightEl = document.querySelector('#cal_weight');
  const activityEl = document.querySelector('#cal_activity');
  const calValueEl = document.querySelector('#cal_value');

  /* ---------------- CORE LOGIC ---------------- */
  function calculateBMR(gender, age, height, weight) {
    if (!age || !height || !weight) return null;
    return gender === 'male'
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  /* ---------------- CALCULATE ---------------- */
  function calculate() {
    const gender = genderEl.value;
    const age = +ageEl.value;
    const height = +heightEl.value;
    const weight = +weightEl.value;
    const activity = +activityEl.value;

    const bmr = calculateBMR(gender, age, height, weight);
    if (!bmr) return;

    const calories = bmr * activity;

    calValueEl.style.opacity = .4;
    setTimeout(() => {
      calValueEl.innerText = `${Math.round(calories)} kcal/day`;
      calValueEl.style.opacity = 1;
    }, 120);
  }

  /* ---------------- EVENTS ---------------- */
  document.querySelector('#cal_calc').addEventListener('click', calculate);

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>Daily Calorie Calculator Guide</h2>
    <p>
      Understanding your daily calorie needs is essential for maintaining a healthy weight and lifestyle. This Calorie Calculator estimates the number of calories your body requires each day based on age, gender, height, weight, and activity level. Whether your goal is weight loss, maintenance, or muscle gain, knowing your caloric requirement is the first step.
    </p>
    <h3>How to Use the Calorie Calculator</h3>
    <p>
      Begin by selecting your gender, then input your age, height in centimeters, and weight in kilograms. Choose your activity level carefully, as this affects the total calories needed. The calculator uses the Mifflin–St Jeor Equation to compute Basal Metabolic Rate (BMR) and multiplies it by the activity factor to determine daily calorie needs accurately.
    </p>
    <h3>Understanding Your Caloric Needs</h3>
    <p>
      Your BMR represents the energy your body requires at rest to maintain vital functions. By factoring in your activity level, the calculator adjusts for calories burned through daily movement and exercise. This ensures a realistic estimate tailored to your lifestyle. Users with sedentary jobs will have lower needs than those with active routines.
    </p>
    <h3>Benefits of Using This Tool</h3>
    <p>
      By knowing your daily caloric requirements, you can plan meals more effectively, track progress, and make informed decisions about nutrition and fitness. This tool also helps identify the energy balance required to achieve weight goals, whether it’s reducing calories for fat loss or increasing for muscle gain.
    </p>
    <h3>Optimized for Web Performance and AdSense</h3>
    <p>
      The layout ensures the calculator and result display side by side on desktop and stack on mobile devices, providing a smooth user experience. The SEO content is placed separately to maximize page engagement and dwell time. Minimal styling keeps the tool fast, lightweight, and AdSense-friendly.
    </p>
    <h3>Conclusion</h3>
    <p>
      This Daily Calorie Calculator provides a reliable estimate of your caloric needs with an easy-to-use interface. By entering accurate personal information and selecting your activity level, you can quickly determine the calories required to support your health and fitness objectives, making nutritional planning simpler and more precise.
    </p>
  `;
}
