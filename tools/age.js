export function renderAge(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- LAYOUT STRUCTURE ---------------- */
  let toolRow = document.querySelector('#tool-row');
  if (!toolRow) {
    toolRow = document.createElement('div');
    toolRow.id = 'tool-row';
    toolRow.style.display = 'flex';
    toolRow.style.gap = '20px';
    toolRow.style.alignItems = 'stretch';
    toolRow.style.flexWrap = 'wrap';
    toolRow.style.marginBottom = '30px';

    if (inputs && result) {
      const parent = inputs.parentNode;
      parent.insertBefore(toolRow, inputs);
      toolRow.appendChild(inputs);
      toolRow.appendChild(result);
    }
  }

  inputs.style.flex = '1 1 320px';
  result.style.flex = '1 1 320px';

  if (!document.querySelector('#tool-row-responsive-style')) {
    const style = document.createElement('style');
    style.id = 'tool-row-responsive-style';
    style.innerHTML = `
      @media (max-width: 768px) {
        #tool-row {
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(style);
  }

  let seoContainer = document.querySelector('#seo-container');
  if (!seoContainer) {
    seoContainer = document.createElement('div');
    seoContainer.id = 'seo-container';
    seoContainer.style.width = '100%';
    seoContainer.style.marginTop = '20px';
    seoContainer.style.lineHeight = '1.7';
    seoContainer.style.fontSize = '15px';

    toolRow.parentNode.insertBefore(seoContainer, toolRow.nextSibling);
  }

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="form-row">
      <label>Date of Birth</label>
      <input id="age_dob" type="date"
        value="${tool.prefill?.dob || ''}" />
    </div>

    <div class="form-row">
      <label>Age As On</label>
      <input id="age_as_on" type="date"
        value="${new Date().toISOString().split('T')[0]}" />
    </div>

    <button id="age_calc" class="btn" style="margin-top:6px">
      Calculate Age
    </button>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">Your Age</div>
      <div id="age_value"
        style="font-size:28px;font-weight:700;opacity:.6">--</div>

      <div class="row">
        <span>Years</span>
        <span id="age_years">--</span>
      </div>
      <div class="row">
        <span>Months</span>
        <span id="age_months">--</span>
      </div>
      <div class="row">
        <span>Days</span>
        <span id="age_days">--</span>
      </div>
    </div>
  `;

  /* ---------------- SEO CONTENT ---------------- */
  seoContainer.innerHTML = `
    <h2>Free Online Age Calculator – Accurate Years, Months & Days</h2>
    <p>
      Our Age Calculator helps you quickly determine your exact age in years,
      months, and days based on your date of birth. Whether you need your age
      for official forms, job applications, school admissions, insurance
      documents, or retirement planning, this tool provides instant and
      accurate results.
    </p>

    <h3>How the Age Calculator Works</h3>
    <p>
      The calculator compares your selected Date of Birth with a chosen
      "Age As On" date. It calculates the precise difference between the two
      dates, adjusting for month lengths and leap years. The result displays
      your total completed years along with remaining months and days.
    </p>

    <p>
      Unlike simple year subtraction methods, this tool performs proper
      calendar-based calculations. It accounts for different month lengths
      (28–31 days) and ensures accurate day adjustments when borrowing from
      previous months.
    </p>

    <h3>Why Use an Online Age Calculator?</h3>
    <p>
      Manually calculating age can be confusing, especially when dealing with
      varying month lengths or leap years. An online calculator eliminates
      guesswork and reduces errors. This is particularly useful for:
    </p>
    <ul>
      <li>Government and competitive exam eligibility checks</li>
      <li>Retirement and pension planning</li>
      <li>Insurance and policy documentation</li>
      <li>School and university admissions</li>
      <li>Medical and health records</li>
    </ul>

    <h3>Features of This Age Tool</h3>
    <ul>
      <li>Instant age calculation</li>
      <li>Accurate year, month, and day breakdown</li>
      <li>Custom “Age As On” date support</li>
      <li>Mobile-friendly responsive layout</li>
      <li>Clean, distraction-free interface</li>
    </ul>

    <h3>Understanding Age in Years, Months, and Days</h3>
    <p>
      Age is typically expressed in completed years. However, certain
      applications require a more detailed breakdown. For example, infant age
      is often measured in months and days. Legal and financial processes may
      also require exact age calculations to the day.
    </p>

    <p>
      This calculator ensures that partial months and day differences are
      calculated properly. If the ending day is smaller than the birth day,
      the system adjusts by borrowing days from the previous month. Similarly,
      month differences are corrected when necessary.
    </p>

    <h3>Common Questions</h3>
    <p><strong>Is this age calculator accurate?</strong><br>
      Yes. It uses real calendar date logic to compute precise differences.
    </p>

    <p><strong>Can I calculate age for past or future dates?</strong><br>
      Absolutely. Simply change the “Age As On” date to any desired day.
    </p>

    <p><strong>Does it work on mobile devices?</strong><br>
      Yes. The calculator and result sections stack vertically on smaller
      screens for easy usability.
    </p>

    <h3>Benefits of Knowing Your Exact Age</h3>
    <p>
      Knowing your exact age can help with milestone tracking, eligibility
      verification, financial planning, and long-term goal setting. It can
      also assist parents tracking child development stages and professionals
      handling age-sensitive documentation.
    </p>

    <p>
      Bookmark this free Age Calculator for quick access whenever you need
      accurate and reliable age results. It’s fast, simple, and designed for
      clarity and precision.
    </p>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const dobInput = document.querySelector('#age_dob');
  const asOnInput = document.querySelector('#age_as_on');

  const ageValue = document.querySelector('#age_value');
  const yearsEl = document.querySelector('#age_years');
  const monthsEl = document.querySelector('#age_months');
  const daysEl = document.querySelector('#age_days');

  /* ---------------- AGE LOGIC ---------------- */
  function calculateAge(dob, asOn) {
    const start = new Date(dob);
    const end = new Date(asOn);

    if (start > end) return null;

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonthDays = new Date(
        end.getFullYear(),
        end.getMonth(),
        0
      ).getDate();
      days += prevMonthDays;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }

  /* ---------------- CALCULATE ---------------- */
  function calculate() {
    if (!dobInput.value || !asOnInput.value) return;

    const age = calculateAge(dobInput.value, asOnInput.value);
    if (!age) return;

    ageValue.style.opacity = .4;
    setTimeout(() => {
      ageValue.innerText = `${age.years} Years`;
      ageValue.style.opacity = 1;
    }, 120);

    yearsEl.innerText = age.years;
    monthsEl.innerText = age.months;
    daysEl.innerText = age.days;
  }

  /* ---------------- EVENTS ---------------- */
  document
    .querySelector('#age_calc')
    .addEventListener('click', calculate);
}
