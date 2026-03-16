export function renderBMR(tool) {
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
  if (!document.querySelector('#bmr-style')) {
    const style = document.createElement('style');
    style.id = 'bmr-style';
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
      <div class="title">BMR Calculator</div>

      <div class="form-row">
        <label>Gender</label>
        <select id="bmr_gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="form-row">
        <label>Age (years)</label>
        <input id="bmr_age" type="number" min="1" value="${tool.prefill?.age || ''}" />
      </div>

      <div class="form-row">
        <label>Height (cm)</label>
        <input id="bmr_height" type="number" min="50" value="${tool.prefill?.height || ''}" />
      </div>

      <div class="form-row">
        <label>Weight (kg)</label>
        <input id="bmr_weight" type="number" min="1" value="${tool.prefill?.weight || ''}" />
      </div>

      <button id="bmr_calc" class="btn-primary">Calculate BMR</button>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Basal Metabolic Rate</div>
      <div id="bmr_value" class="value">--</div>
      <div class="muted" style="margin-top:6px">
        Calories/day needed at complete rest
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const genderEl = document.querySelector('#bmr_gender');
  const ageEl = document.querySelector('#bmr_age');
  const heightEl = document.querySelector('#bmr_height');
  const weightEl = document.querySelector('#bmr_weight');
  const bmrValueEl = document.querySelector('#bmr_value');

  /* ---------------- BMR LOGIC ---------------- */
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

    const bmr = calculateBMR(gender, age, height, weight);
    if (!bmr) return;

    bmrValueEl.style.opacity = .4;
    setTimeout(() => {
      bmrValueEl.innerText = `${Math.round(bmr)} kcal/day`;
      bmrValueEl.style.opacity = 1;
    }, 120);
  }

  /* ---------------- EVENTS ---------------- */
  document.querySelector('#bmr_calc').addEventListener('click', calculate);

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>BMR Calculator Guide</h2>
    <p>
      Basal Metabolic Rate (BMR) represents the number of calories your body needs at complete rest to maintain vital functions such as breathing, circulation, and cell production. This BMR Calculator estimates your daily caloric needs based on gender, age, height, and weight. Understanding your BMR helps in planning diet, fitness, and weight management strategies effectively.
    </p>
    <h3>How to Use the BMR Calculator</h3>
    <p>
      Start by selecting your gender, then enter your age, height in centimeters, and weight in kilograms. Once you click 'Calculate BMR', the tool computes your basal caloric requirement using the Mifflin–St Jeor Equation, one of the most reliable formulas for estimating BMR. Ensure your inputs are accurate for the best results.
    </p>
    <h3>Understanding Your BMR</h3>
    <p>
      Your BMR is the minimum energy your body needs to sustain life while at rest. It does not include calories burned from daily activities or exercise. Knowing your BMR is useful for creating effective diet plans, whether you aim to lose weight, maintain, or gain weight. It serves as a baseline for calculating total daily energy expenditure (TDEE).
    </p>
    <h3>Benefits of Using This Tool</h3>
    <p>
      By calculating your BMR, you gain insight into your metabolism and can plan your meals and calorie intake accordingly. Coupled with activity tracking, this information allows precise adjustments to achieve specific health and fitness goals. It is also an essential first step before using other calorie or nutrition calculators.
    </p>
    <h3>Optimized for Web Performance and AdSense</h3>
    <p>
      The BMR calculator is designed to display the calculator and result side by side on desktops and stack on mobile devices for a smooth experience. SEO content is separated to enhance page ranking and user engagement. Minimal styling keeps the tool lightweight, fast, and AdSense-friendly.
    </p>
    <h3>Conclusion</h3>
    <p>
      Using this BMR Calculator helps you understand the calories required for your body at rest. Enter accurate personal data and use the results as a foundation for diet and fitness planning. It provides a reliable, easy-to-use tool to manage nutrition and maintain a healthy lifestyle.
    </p>
  `;
}
