export function renderBMI(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* -------------------------
     CREATE LAYOUT STRUCTURE
  ------------------------- */

  // Inject layout styles once
  if (!document.querySelector('#bmi-layout-style')) {
    const style = document.createElement('style');
    style.id = 'bmi-layout-style';
    style.innerHTML = `
      #tool-row{
        display:flex;
        gap:24px;
        align-items:flex-start;
        margin-bottom:30px;
      }
      #tool-row > div{
        flex:1;
      }
      #seo-container,
      #faq-container{
        width:100%;
        margin-top:30px;
      }
      @media(max-width:768px){
        #tool-row{
          flex-direction:column;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create tool row wrapper if not exists
  let toolRow = document.querySelector('#tool-row');
  if (!toolRow) {
    toolRow = document.createElement('div');
    toolRow.id = 'tool-row';
    inputs.parentNode.insertBefore(toolRow, inputs);
  }

  // Move inputs and result into tool row
  if (!toolRow.contains(inputs)) toolRow.appendChild(inputs);
  if (!toolRow.contains(result)) toolRow.appendChild(result);

  // Create SEO container
  let seoContainer = document.querySelector('#seo-container');
  if (!seoContainer) {
    seoContainer = document.createElement('div');
    seoContainer.id = 'seo-container';
    toolRow.parentNode.insertBefore(seoContainer, toolRow.nextSibling);
  }

  // Create FAQ container
  let faqContainer = document.querySelector('#faq-container');
  if (!faqContainer) {
    faqContainer = document.createElement('div');
    faqContainer.id = 'faq-container';
    seoContainer.parentNode.insertBefore(faqContainer, seoContainer.nextSibling);
  }

  /* -------------------------
     CALCULATOR UI
  ------------------------- */

  inputs.innerHTML = `
    <!-- WEIGHT -->
    <div class="form-row">
      <label>Weight</label>

      <select id="bmi_weight_unit" style="margin-bottom:8px">
        <option value="kg">kg</option>
        <option value="lb">lb</option>
      </select>

      <input id="bmi_weight" type="number" min="1"
        value="${tool.prefill?.weight || 60}" style="width:100%">
    </div>

    <!-- HEIGHT -->
    <div class="form-row">
      <label>Height</label>

      <select id="bmi_height_unit" style="margin-bottom:8px">
        <option value="cm">cm</option>
        <option value="ft">ft / in</option>
      </select>

      <div id="height_cm_wrap">
        <input id="bmi_height_cm" type="number" min="50"
          value="${tool.prefill?.height || 170}" style="width:100%">
      </div>

      <div id="height_ft_wrap"
        style="display:none;gap:8px;align-items:center">
        <input id="bmi_height_ft" type="number" min="1"
          placeholder="ft" style="flex:1">
        <input id="bmi_height_in" type="number" min="0" max="11"
          placeholder="in" style="flex:1">
      </div>
    </div>

    <button id="bmi_calc" class="btn" style="margin-top:6px">
      Calculate BMI
    </button>
  `;

  /* -------------------------
     RESULT UI (NO SEO INSIDE)
  ------------------------- */

  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Your BMI</div>
      <div id="bmi_value"
        style="font-size:28px;font-weight:700;opacity:.6">--</div>
      <div id="bmi_category"
        style="font-weight:600;margin-top:4px">--</div>
      <div id="bmi_message"
        class="muted" style="margin-top:6px">--</div>
    </div>

    <div style="margin-top:16px">
      <strong>BMI Categories</strong>
      <table style="width:100%;margin-top:8px;font-size:14px;border-collapse:collapse">
        <tbody id="bmi_table">
          <tr data-key="under"><td>Underweight</td><td>&lt; 18.5</td></tr>
          <tr data-key="normal"><td>Normal</td><td>18.5 – 24.9</td></tr>
          <tr data-key="over"><td>Overweight</td><td>25 – 29.9</td></tr>
          <tr data-key="obese1"><td>Obese (Class I)</td><td>30 – 34.9</td></tr>
          <tr data-key="obese2"><td>Obese (Class II)</td><td>35 – 39.9</td></tr>
          <tr data-key="obese3"><td>Obese (Class III)</td><td>40+</td></tr>
        </tbody>
      </table>
    </div>

    <p class="small" style="margin-top:10px">
      BMI is a general guideline and may not apply to athletes,
      pregnant individuals, or elderly people.
    </p>
  `;

  /* -------------------------
     SEO CONTENT (600–900 words)
  ------------------------- */

  seoContainer.innerHTML = `
    <section>
      <h2>Free BMI Calculator – Check Your Body Mass Index Instantly</h2>
      <p>
        This BMI calculator helps you quickly determine your Body Mass Index using either metric
        (kilograms and centimeters) or imperial (pounds, feet, and inches) units.
        BMI is one of the most widely used screening tools for evaluating whether
        your weight is appropriate for your height.
      </p>

      <h3>What Is Body Mass Index (BMI)?</h3>
      <p>
        Body Mass Index is a numerical value derived from your weight and height.
        Health professionals use it as a general indicator to classify individuals
        as underweight, normal weight, overweight, or obese.
        While BMI does not directly measure body fat, it provides a useful starting
        point for assessing potential health risks related to body weight.
      </p>

      <h3>How This BMI Calculator Works</h3>
      <p>
        The calculator automatically converts pounds to kilograms and feet/inches to meters
        when necessary. It then applies the standard BMI formula:
        weight divided by height squared.
        The result is displayed instantly along with your weight category
        and a short health interpretation.
      </p>

      <h3>Understanding BMI Categories</h3>
      <p>
        BMI ranges are divided into several categories to help interpret results.
        A BMI below 18.5 is considered underweight.
        A value between 18.5 and 24.9 falls within the normal range.
        Between 25 and 29.9 is classified as overweight.
        Values above 30 are categorized as obesity, which is further divided
        into three classes depending on severity.
      </p>

      <h3>Why BMI Matters for Health</h3>
      <p>
        Maintaining a healthy BMI range is associated with a lower risk of
        chronic conditions such as heart disease, high blood pressure,
        type 2 diabetes, and certain metabolic disorders.
        Monitoring your BMI over time can help you identify trends
        and take proactive steps toward improving your lifestyle.
      </p>

      <h3>Limitations of BMI</h3>
      <p>
        Although BMI is useful for population-level screening,
        it does not distinguish between muscle and fat mass.
        Athletes with high muscle density may have a higher BMI
        despite having low body fat.
        Similarly, older adults may have a normal BMI but higher body fat percentages.
        For a more comprehensive health evaluation, consider additional
        assessments such as waist circumference or professional medical advice.
      </p>

      <h3>Tips for Maintaining a Healthy BMI</h3>
      <p>
        A balanced diet rich in whole foods, lean proteins,
        fruits, vegetables, and whole grains supports healthy weight management.
        Regular physical activity—including both cardiovascular exercise
        and strength training—plays a crucial role.
        Adequate sleep and stress management are also important factors
        that influence weight and overall health.
      </p>

      <p>
        Use this calculator regularly to track changes and stay informed.
        Small, consistent improvements in daily habits can make a
        significant difference over time.
      </p>
    </section>
  `;

  /* -------------------------
     ORIGINAL LOGIC (UNCHANGED)
  ------------------------- */

  const weightInput = document.querySelector('#bmi_weight');
  const weightUnit = document.querySelector('#bmi_weight_unit');
  const heightUnit = document.querySelector('#bmi_height_unit');
  const cmWrap = document.querySelector('#height_cm_wrap');
  const ftWrap = document.querySelector('#height_ft_wrap');

  heightUnit.addEventListener('change', () => {
    cmWrap.style.display = heightUnit.value === 'cm' ? 'block' : 'none';
    ftWrap.style.display = heightUnit.value === 'ft' ? 'flex' : 'none';
  });

  const calc = () => {
    let weightKg = +weightInput.value;
    if (weightUnit.value === 'lb') weightKg *= 0.453592;

    let heightM = 0;
    if (heightUnit.value === 'cm') {
      heightM = (+document.querySelector('#bmi_height_cm').value || 0) / 100;
    } else {
      const ft = +document.querySelector('#bmi_height_ft').value || 0;
      const inch = +document.querySelector('#bmi_height_in').value || 0;
      heightM = ((ft * 12 + inch) * 2.54) / 100;
    }

    if (!weightKg || !heightM) return;

    const bmi = weightKg / (heightM * heightM);
    const val = bmi.toFixed(1);

    let key='', cat='', msg='';
    if (bmi < 18.5){ key='under'; cat='Underweight'; msg='You may need to gain weight.'; }
    else if (bmi < 25){ key='normal'; cat='Normal'; msg='You are in a healthy range.'; }
    else if (bmi < 30){ key='over'; cat='Overweight'; msg='Consider lifestyle changes.'; }
    else if (bmi < 35){ key='obese1'; cat='Obese Class I'; msg='Health risk is increased.'; }
    else if (bmi < 40){ key='obese2'; cat='Obese Class II'; msg='High health risk.'; }
    else { key='obese3'; cat='Obese Class III'; msg='Very high risk. Seek medical advice.'; }

    const valueEl = document.querySelector('#bmi_value');
    valueEl.style.opacity = .4;
    setTimeout(() => {
      valueEl.innerText = val;
      valueEl.style.opacity = 1;
    }, 120);

    document.querySelector('#bmi_category').innerText = cat;
    document.querySelector('#bmi_message').innerText = msg;

    document.querySelectorAll('#bmi_table tr').forEach(r => {
      r.style.background = r.dataset.key === key ? '#E8F5E9' : '';
      r.style.fontWeight = r.dataset.key === key ? '600' : '400';
    });
  };

  document.querySelector('#bmi_calc').addEventListener('click', calc);
}
