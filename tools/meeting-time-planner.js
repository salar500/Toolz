import { WORLD_CITIES } from '../data/worldCities.js';

export function renderMeetingTimePlanner(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- STYLES ---------------- */
  const style = document.createElement('style');
  style.innerHTML = `
    .card{padding:16px;border-radius:14px;background:#fff;box-shadow:0 10px 24px rgba(0,0,0,.08)}
    .title{font-size:18px;font-weight:700;margin-bottom:12px}
    .form-row{margin-bottom:12px}
    .form-row label{display:block;font-size:13px;font-weight:600;margin-bottom:4px}
    .form-row input,.form-row select{width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db}
    .btn-primary{width:100%;padding:12px;border-radius:10px;border:none;font-weight:700;background:#2563eb;color:#fff}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    th,td{padding:10px;border-bottom:1px solid #e5e7eb}
    tr.good{background:#dcfce7} tr.ok{background:#fef9c3} tr.bad{background:#fee2e2}
    tr:hover{cursor:pointer;opacity:.85}
    .modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center}
    .modal-card{background:#fff;padding:20px;border-radius:14px;width:90%;max-width:360px}
    .modal-card button{margin-top:12px;width:100%;padding:10px;border:none;background:#2563eb;color:#fff}
    .small{font-size:12px;color:#6b7280}
  `;
  document.head.appendChild(style);

  /* ---------------- DATA ---------------- */
  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const ALL_ZONES = (() => {
    const seen = new Set();
    return WORLD_CITIES.filter(c => !seen.has(c.zone) && seen.add(c.zone));
  })();

  function buildOptions(zones, selected, showNone) {
    return `
      ${showNone ? `<option value="">None</option>` : ``}
      ${zones.map(c => `
        <option value="${c.zone}" ${c.zone === selected ? 'selected' : ''}>
          ${c.country} — ${c.zone}
        </option>
      `).join('')}
    `;
  }

  /* ---------------- UI ---------------- */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Meeting Time Planner</div>

      <div class="form-row">
        <label>Date</label>
        <input type="date" id="mtp_date">
      </div>

      <div class="form-row">
        <label>Search Your Location</label>
        <input id="search1" placeholder="India, Asia, New York">
      </div>

      <div class="form-row">
        <label>Your Location</label>
        <select id="tz1"></select>
      </div>

      <div class="form-row">
        <label>Search Other Location</label>
        <input id="search2" placeholder="London, Tokyo">
      </div>

      <div class="form-row">
        <label>Other Location</label>
        <select id="tz2"></select>
      </div>

      <button class="btn-primary" id="gen">Find Time</button>
    </div>
  `;

  result.innerHTML = `
    <div class="card">
      <div class="title">Available Time Slots</div>
      <div class="small">Green = overlap working hours (9–5)</div>
      <div id="table"></div>
    </div>
  `;

  const tz1 = document.querySelector('#tz1');
  const tz2 = document.querySelector('#tz2');

  tz1.innerHTML = buildOptions(ALL_ZONES, userTZ, false);
  tz2.innerHTML = buildOptions(ALL_ZONES, '', true);

  /* ---------------- SEARCH (FIXED) ---------------- */

  document.querySelector('#search1').oninput = e => {
    const q = e.target.value.toLowerCase();
    const filtered = ALL_ZONES.filter(c =>
      `${c.country} ${c.zone}`.toLowerCase().includes(q)
    );
    tz1.innerHTML = buildOptions(filtered, tz1.value, false);
  };

  document.querySelector('#search2').oninput = e => {
    const q = e.target.value.toLowerCase();
    const filtered = ALL_ZONES.filter(c =>
      `${c.country} ${c.zone}`.toLowerCase().includes(q)
    );

    // 🔑 KEY FIX: show "None" ONLY when not searching
    tz2.innerHTML = buildOptions(
      filtered,
      tz2.value,
      q.length === 0
    );
  };

  /* ---------------- TIME LOGIC ---------------- */
  const dateEl = document.querySelector('#mtp_date');
  const table = document.querySelector('#table');
  dateEl.valueAsDate = new Date();

  const hourInTZ = (d,tz)=>+new Intl.DateTimeFormat('en-US',{hour:'numeric',hour12:false,timeZone:tz}).format(d);
  const format = (d,tz)=>new Intl.DateTimeFormat('en-US',{weekday:'short',hour:'2-digit',minute:'2-digit',timeZone:tz}).format(d);
  const score = (a,b)=> (a>=9&&a<17)&&(b>=9&&b<17)?'good':(a>=9&&a<17||b>=9&&b<17)?'ok':'bad';

  document.querySelector('#gen').onclick = () => {
    const base = new Date(dateEl.value + 'T00:00:00Z');
    let html = `<table><thead><tr>
      <th>UTC</th>
      <th>${tz1.options[tz1.selectedIndex].text}</th>
      ${tz2.value ? `<th>${tz2.options[tz2.selectedIndex].text}</th>` : ''}
    </tr></thead><tbody>`;

    for(let h=0;h<24;h++){
      const d=new Date(base);d.setUTCHours(h);
      const cls = tz2.value ? score(hourInTZ(d,tz1.value),hourInTZ(d,tz2.value)) :
        (hourInTZ(d,tz1.value)>=9&&hourInTZ(d,tz1.value)<17?'good':'bad');

      html+=`<tr class="${cls}">
        <td>${format(d,'UTC')}</td>
        <td>${format(d,tz1.value)}</td>
        ${tz2.value?`<td>${format(d,tz2.value)}</td>`:''}
      </tr>`;
    }
    table.innerHTML = html + '</tbody></table>';
  };
}
