import { SUN_CITIES } from '../data/sunTimes.js';
import SunCalc from 'suncalc';

export function renderSunTimeCalculator(tool) {
  /* ================= ENSURE CONTAINERS EXIST ================= */
  let inputs = document.querySelector('#inputs');
  let result = document.querySelector('#result');

  if (!inputs || !result) {
    console.error('SunTimeCalculator: #inputs or #result not found');
    console.log('Sun Time Calculator loaded');
    return;
  }

  /* ================= CLEAR OLD UI ================= */
  inputs.innerHTML = '';
  result.innerHTML = '';

  /* ================= STYLES (LOAD ONCE) ================= */
  if (!document.getElementById('sun-style')) {
    const style = document.createElement('style');
    style.id = 'sun-style';
    style.innerHTML = `
      .card{padding:16px;border-radius:14px;background:#fff;box-shadow:0 10px 24px rgba(0,0,0,.08)}
      .title{font-size:18px;font-weight:700;margin-bottom:12px}
      .form-row{margin-bottom:12px}
      .form-row label{display:block;font-size:13px;font-weight:600;margin-bottom:4px}
      .form-row input,.form-row select{width:100%;padding:10px;border-radius:8px;border:1px solid #d1d5db}
      .btn-primary{width:100%;padding:12px;border-radius:10px;border:none;font-weight:700;background:#2563eb;color:#fff}
      .stat{font-size:14px;margin:6px 0}
      .small{font-size:12px;color:#6b7280}
    `;
    document.head.appendChild(style);
  }

  /* ================= DATA ================= */
  const ALL_CITIES = [...SUN_CITIES];
  let CURRENT_LIST = [...ALL_CITIES];

  function buildOptions(list) {
    if (!list.length) {
      return `<option disabled>No matching cities</option>`;
    }

    return list.map((c, i) => `
      <option value="${i}">
        ${c.city}, ${c.country}
      </option>
    `).join('');
  }

  function format(date, tz) {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: tz
    }).format(date);
  }

  /* ================= UI ================= */
  inputs.innerHTML = `
    <div class="card">
      <div class="title">Sun Time Calculator</div>

      <div class="form-row">
        <label>Date</label>
        <input type="date" id="sun_date">
      </div>

      <div class="form-row">
        <label>Search City</label>
        <input id="sun_search" placeholder="City or Country">
      </div>

      <div class="form-row">
        <label>Location</label>
        <select id="sun_city"></select>
      </div>

      <button class="btn-primary" id="sun_calc">Show Sun Times</button>
    </div>
  `;

  result.innerHTML = `
    <div class="card">
      <div class="title">Sun Details</div>
      <div id="sun_output" class="small">
        Select a city and date
      </div>
    </div>
  `;

  const dateEl = inputs.querySelector('#sun_date');
  const searchEl = inputs.querySelector('#sun_search');
  const cityEl = inputs.querySelector('#sun_city');
  const output = result.querySelector('#sun_output');

  dateEl.valueAsDate = new Date();
  cityEl.innerHTML = buildOptions(CURRENT_LIST);

  /* ================= SEARCH ================= */
  searchEl.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();

    CURRENT_LIST = q
      ? ALL_CITIES.filter(c =>
          `${c.city} ${c.country}`.toLowerCase().includes(q)
        )
      : [...ALL_CITIES];

    cityEl.innerHTML = buildOptions(CURRENT_LIST);
  });

  /* ================= CALCULATION ================= */
  inputs.querySelector('#sun_calc').addEventListener('click', () => {
    const index = Number(cityEl.value);
    const city = CURRENT_LIST[index];
    if (!city) return;

    const date = new Date(dateEl.value);
    const times = SunCalc.getTimes(date, city.lat, city.lon);
    const pos = SunCalc.getPosition(date, city.lat, city.lon);

    const daylightMs = times.sunset - times.sunrise;
    const hours = Math.floor(daylightMs / 3600000);
    const mins = Math.floor((daylightMs % 3600000) / 60000);

    const altitude = (pos.altitude * 180 / Math.PI).toFixed(2);
    const azimuth = ((pos.azimuth * 180 / Math.PI) + 180).toFixed(2);

    output.innerHTML = `
      <div class="stat"><strong>Location:</strong> ${city.city}, ${city.country}</div>
      <div class="stat"><strong>Sunrise:</strong> ${format(times.sunrise, city.zone)}</div>
      <div class="stat"><strong>Sunset:</strong> ${format(times.sunset, city.zone)}</div>
      <div class="stat"><strong>Daylight:</strong> ${hours}h ${mins}m</div>
      <div class="stat"><strong>Sun Altitude:</strong> ${altitude}°</div>
      <div class="stat"><strong>Sun Direction:</strong> ${azimuth}°</div>
    `;
  });
}
