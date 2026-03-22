export function renderBMI(tool) {
  const root = document.querySelector('#tool-root');
  if (!root) return;

  root.innerHTML = `
  <!-- HEADER -->
  <header class="container">
    <h1>BMI Calculator</h1>
    <p class="subtitle">Free tool to check your Body Mass Index instantly</p>
  </header>

  <!-- TOP AD (SAFE - ENABLE LATER) -->
  <div class="container">
    <div class="ad-slot" id="ad-top"></div>
  </div>

  <!-- MAIN TOOL -->
  <main class="container grid">
    
    <!-- INPUT -->
    <section class="card">
      <h2>Enter Your Details</h2>

      <form id="bmi_form">
        <div class="form-group">
          <label for="bmi_weight">Weight</label>
          <select id="bmi_weight_unit">
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
          <input id="bmi_weight" type="number" min="1"
            value="${tool.prefill?.weight || 60}" required>
        </div>

        <div class="form-group">
          <label>Height</label>
          <select id="bmi_height_unit">
            <option value="cm">cm</option>
            <option value="ft">ft / in</option>
          </select>

          <div id="height_cm_wrap">
            <input id="bmi_height_cm" type="number" min="50"
              value="${tool.prefill?.height || 170}" required>
          </div>

          <div id="height_ft_wrap" class="hidden">
            <input id="bmi_height_ft" type="number" placeholder="ft">
            <input id="bmi_height_in" type="number" placeholder="in">
          </div>
        </div>

        <button class="btn" type="submit">Calculate BMI</button>
      </form>
    </section>

    <!-- RESULT -->
    <section class="card" aria-live="polite">
      <h2>Your Result</h2>

      <div class="result-box">
        <div class="small">Your BMI</div>
        <div id="bmi_value">--</div>
        <div id="bmi_category"></div>
        <p id="bmi_message"></p>
      </div>

      <table class="bmi-table">
        <thead>
          <tr><th>Category</th><th>BMI</th></tr>
        </thead>
        <tbody id="bmi_table">
          <tr data-key="under"><td>Underweight</td><td>&lt; 18.5</td></tr>
          <tr data-key="normal"><td>Normal</td><td>18.5 – 24.9</td></tr>
          <tr data-key="over"><td>Overweight</td><td>25 – 29.9</td></tr>
          <tr data-key="obese1"><td>Obese I</td><td>30 – 34.9</td></tr>
          <tr data-key="obese2"><td>Obese II</td><td>35 – 39.9</td></tr>
          <tr data-key="obese3"><td>Obese III</td><td>40+</td></tr>
        </tbody>
      </table>
    </section>
  </main>

  <!-- MIDDLE AD -->
  <div class="container">
    <div class="ad-slot" id="ad-middle"></div>
  </div>

  <!-- SEO CONTENT -->
  <section class="container seo">
    <article>
      <h2>What is BMI?</h2>
      <p>
        BMI (Body Mass Index) is a simple calculation using your weight and height
        to estimate body fat levels and overall health.
      </p>

      <h3>Why BMI is Important</h3>
      <p>
        Maintaining a healthy BMI helps reduce risks of diseases like diabetes,
        heart disease, and obesity.
      </p>

      <h3>Healthy BMI Range</h3>
      <p>
        A BMI between 18.5 and 24.9 is considered healthy.
      </p>
    </article>
  </section>

  <!-- FAQ -->
  <section class="container faq">
    <h2>Frequently Asked Questions</h2>

    <h3>What is a good BMI?</h3>
    <p>18.5 to 24.9 is considered healthy.</p>

    <h3>Can BMI be wrong?</h3>
    <p>Yes, it doesn't account for muscle mass or body composition.</p>
  </section>

  <!-- BOTTOM AD -->
  <div class="container">
    <div class="ad-slot" id="ad-bottom"></div>
  </div>
  `;

  /* -------------------------
     STYLES
  ------------------------- */
  if (!document.querySelector('#bmi-style')) {
    const style = document.createElement('style');
    style.id = 'bmi-style';
    style.textContent = `
      *{box-sizing:border-box}

      body{font-family:system-ui;margin:0;background:#f8f9fa}

      .container{
        max-width:1100px;
        margin:auto;
        padding:16px;
      }

      .grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:20px;
      }

      .card{
        background:#fff;
        padding:16px;
        border-radius:12px;
        box-shadow:0 2px 6px rgba(0,0,0,.05);
      }

      .form-group{
        display:flex;
        flex-direction:column;
        gap:6px;
        margin-bottom:12px;
      }

      input,select,button{
        padding:10px;
        font-size:16px;
      }

      .btn{
        background:#2e7d32;
        color:#fff;
        border:none;
        cursor:pointer;
      }

      .hidden{display:none}

      .result-box{
        text-align:center;
        padding:16px;
      }

      #bmi_value{
        font-size:32px;
        font-weight:700;
      }

      .bmi-table{
        width:100%;
        margin-top:10px;
        border-collapse:collapse;
      }

      .bmi-table td,.bmi-table th{
        padding:8px;
        border-bottom:1px solid #eee;
      }

      /* AD SAFE SPACE (prevents CLS) */
      .ad-slot{
        min-height:120px;
        background:#f1f1f1;
        margin:10px 0;
      }

      /* MOBILE */
      @media(max-width:768px){
        .grid{
          grid-template-columns:1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* -------------------------
     LOGIC
  ------------------------- */

  const form = document.querySelector('#bmi_form');
  const heightUnit = document.querySelector('#bmi_height_unit');
  const cmWrap = document.querySelector('#height_cm_wrap');
  const ftWrap = document.querySelector('#height_ft_wrap');

  heightUnit.addEventListener('change', () => {
    cmWrap.classList.toggle('hidden', heightUnit.value !== 'cm');
    ftWrap.classList.toggle('hidden', heightUnit.value !== 'ft');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let weight = parseFloat(document.querySelector('#bmi_weight').value);
    if (document.querySelector('#bmi_weight_unit').value === 'lb') {
      weight *= 0.453592;
    }

    let height = 0;

    if (heightUnit.value === 'cm') {
      height = parseFloat(document.querySelector('#bmi_height_cm').value) / 100;
    } else {
      const ft = parseFloat(document.querySelector('#bmi_height_ft').value) || 0;
      const inch = parseFloat(document.querySelector('#bmi_height_in').value) || 0;
      height = ((ft * 12 + inch) * 2.54) / 100;
    }

    if (!weight || !height) return;

    const bmi = weight / (height * height);
    const val = bmi.toFixed(1);

    const valueEl = document.querySelector('#bmi_value');
    const catEl = document.querySelector('#bmi_category');
    const msgEl = document.querySelector('#bmi_message');

    valueEl.textContent = val;

    let key, cat, msg;

    if (bmi < 18.5){
      key='under'; cat='Underweight'; msg='You may need to gain weight.';
    } else if (bmi < 25){
      key='normal'; cat='Normal'; msg='Healthy range.';
    } else if (bmi < 30){
      key='over'; cat='Overweight'; msg='Consider lifestyle changes.';
    } else {
      key='obese1'; cat='Obese'; msg='Consult a doctor.';
    }

    catEl.textContent = cat;
    msgEl.textContent = msg;

    document.querySelectorAll('#bmi_table tr').forEach(row=>{
      row.style.background = row.dataset.key === key ? '#E8F5E9' : '';
    });
  });
}
