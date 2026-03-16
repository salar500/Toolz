export function renderRandomNameGenerator(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- EMI STYLE ---------------- */
  const style = document.createElement('style');
  style.innerHTML = `
    .card {
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
    }
    .title {
      font-size:18px;
      font-weight:700;
      margin-bottom:10px;
    }
    .segmented {
      display:flex;
      background:#f2f4f8;
      padding:4px;
      border-radius:10px;
      margin-bottom:12px;
      gap:4px;
      flex-wrap:wrap;
    }
    .segmented button {
      flex:1;
      border:none;
      background:transparent;
      padding:8px;
      font-weight:600;
      border-radius:8px;
      cursor:pointer;
      color:#555;
      font-size:13px;
    }
    .segmented button.active {
      background:linear-gradient(135deg,#2563eb,#1d4ed8);
      color:#fff;
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
    .form-row select,
    .form-row input {
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
      cursor:pointer;
      background:linear-gradient(135deg,#16a34a,#15803d);
      color:#fff;
    }
    .btn-secondary {
      margin-top:10px;
      padding:10px 14px;
      border-radius:10px;
      border:1px solid #e5e7eb;
      font-weight:600;
      background:#f9fafb;
      cursor:pointer;
      width:100%;
    }
    .result-card {
      margin-top:16px;
      padding:16px;
      border-radius:14px;
      background:#fff;
      box-shadow:0 10px 24px rgba(0,0,0,.08);
    }
    .small {
      font-size:12px;
      color:#6b7280;
    }
  `;
  document.head.appendChild(style);

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Random Name Generator</div>

      <div class="segmented" id="gender_mode">
        <button data-g="male">Masculine</button>
        <button data-g="female">Feminine</button>
        <button data-g="neutral">Ambiguous</button>
        <button data-g="any" class="active">Either</button>
      </div>

      <div class="segmented" id="name_type">
        <button data-t="first" class="active">First Name</button>
        <button data-t="full">Full Name</button>
      </div>

      <div class="form-row">
        <label>Number of Names</label>
        <input id="name_count" type="number" min="1" max="20" value="${tool.prefill?.count || 5}">
      </div>

      <div class="form-row">
        <label>Category</label>
        <select id="name_category">
          <option value="any">All Categories</option>
          <option value="english">English</option>
          <option value="fantasy">Fantasy</option>
          <option value="mythology">Mythology</option>
          <option value="pop">Pop Culture</option>
        </select>
      </div>

      <button id="generate_btn" class="btn-primary">
        Generate Names
      </button>

      <p class="small" style="margin-top:8px">
        Names are generated instantly and never stored.
      </p>
    </div>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-card">
      <div class="small">Generated Names</div>
      <ul id="name_result" style="margin-top:8px;padding-left:16px"></ul>
      <button id="copy_btn" class="btn-secondary" style="display:none">
        Copy Names
      </button>
    </div>
  `;

  /* ---------------- STATE ---------------- */
  let gender = 'any';
  let type = 'first';

  /* ---------------- DATA ---------------- */
  const male = ['Liam','Noah','Oliver','Elijah','James','Lucas'];
  const female = ['Olivia','Emma','Ava','Sophia','Amelia','Mia'];
  const neutral = ['Alex','Taylor','Jordan','Casey','Avery','Quinn'];
  const surnames = ['Smith','Johnson','Brown','Taylor','Anderson','Walker'];

  /* ---------------- TOGGLES ---------------- */
  document.querySelector('#gender_mode').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    [...e.currentTarget.children].forEach(b=>b.classList.remove('active'));
    e.target.classList.add('active');
    gender = e.target.dataset.g;
  });

  document.querySelector('#name_type').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    [...e.currentTarget.children].forEach(b=>b.classList.remove('active'));
    e.target.classList.add('active');
    type = e.target.dataset.t;
  });

  /* ---------------- GENERATE (UNIQUE) ---------------- */
  document.querySelector('#generate_btn').addEventListener('click', () => {
    const count = Number(document.querySelector('#name_count').value) || 5;
    let pool =
      gender === 'male' ? male :
      gender === 'female' ? female :
      gender === 'neutral' ? neutral :
      male.concat(female, neutral);

    const resultEl = document.querySelector('#name_result');
    const copyBtn = document.querySelector('#copy_btn');
    resultEl.innerHTML = '';

    const generated = new Set();

    while (generated.size < count && generated.size < pool.length * 2) {
      const first = pool[Math.floor(Math.random() * pool.length)];
      const full = type === 'full'
        ? `${first} ${surnames[Math.floor(Math.random() * surnames.length)]}`
        : first;
      generated.add(full);
    }

    [...generated].forEach(name => {
      resultEl.innerHTML += `<li>${name}</li>`;
    });

    copyBtn.style.display = generated.size ? 'block' : 'none';
  });

  /* ---------------- COPY ---------------- */
  document.querySelector('#copy_btn').addEventListener('click', () => {
    const names = [...document.querySelectorAll('#name_result li')]
      .map(li => li.innerText)
      .join('\n');

    navigator.clipboard.writeText(names);
    alert('Names copied to clipboard');
  });
}
