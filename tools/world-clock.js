import { WORLD_CITIES } from '../data/worldCities.js';

/* =======================
   Inject CSS once
======================= */
function injectWorldClockCSS() {
  if (document.getElementById('world-clock-css')) return;

  const style = document.createElement('style');
  style.id = 'world-clock-css';
  style.textContent = `
    .world-clock-table {
      width: 100%;
      border-collapse: collapse;
      font-family: monospace;
    }

    .world-clock-table td {
      padding: 6px 10px;
      vertical-align: middle;
      border: 1px solid rgba(255,255,255,0.05);
      width: 25%;
    }

    .world-clock-table tr:nth-child(odd) td {
      background: rgba(0, 0, 0, 0.015);
    }

    .world-clock-table tr:nth-child(even) td {
      background: rgba(0, 0, 0, 0.03);
    }

    .wc-cell {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      overflow: hidden;
    }

    .wc-country {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-width: 80px;
      overflow: hidden;
    }

    .wc-city {
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .wc-region {
      font-size: 11px;
      opacity: 0.6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .wc-time {
      font-size: 13px;
      opacity: 0.85;
      text-align: right;
      white-space: nowrap;
    }

    .wc-utc {
      font-size: 12px;
      opacity: 0.6;
      margin-left: 6px;
      white-space: nowrap;
    }

    .wc-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 13px;
      flex-wrap: wrap;
    }

    .wc-controls label {
      opacity: 0.7;
    }

    .wc-controls select,
    .wc-controls input {
      background: transparent;
      color: inherit;
      border: 1px solid rgba(255,255,255,0.2);
      padding: 4px 8px;
      font-family: monospace;
    }

    /* === Search highlight for white + green UI === */

      /* Bold Search label */
      .wc-controls label:first-of-type {
        font-weight: 700;
        color: #0f7a4a; /* deep green */
      }

      /* Search input base */
      .wc-controls input {
        background: #f4fff9;
        border: 2px solid #0f7a4a;
        border-radius: 6px;
        min-width: 220px;
        padding: 6px 10px;
        font-weight: 600;
        color: #0a4f32;
        transition: all 0.2s ease;
        box-shadow: 0 0 0 rgba(15, 122, 74, 0);
      }

      /* Hover */
      .wc-controls input:hover {
        border-color: #12a060;
      }

      /* Focus (strong, noticeable) */
      .wc-controls input:focus {
        outline: none;
        background: #ecfff5;
        border-color: #12a060;
        box-shadow: 0 0 0 4px rgba(18, 160, 96, 0.35);
      }

      /* Placeholder */
      .wc-controls input::placeholder {
        color: #5fae8b;
        font-weight: 500;
      }




    .world-clock-layout #inputs {
      grid-column: 1 / -1;
    }

    @media (max-width: 600px) {
      .wc-cell {
        flex-wrap: wrap;
      }

      .wc-time, .wc-utc {
        text-align: left;
      }
    }
  `;
  document.head.appendChild(style);
}

/* =======================
   Main renderer
======================= */
let clockInterval = null;

export function renderWorldClock() {
  const root = document.getElementById('inputs');
  if (!root) return;

  injectWorldClockCSS();

  const wrap = root.closest('.tool-wrap');
  if (wrap) wrap.classList.add('world-clock-layout');

  if (clockInterval) clearInterval(clockInterval);

  const originalData = [...WORLD_CITIES];
  let filteredData = [...WORLD_CITIES];
  let currentData = [...WORLD_CITIES];

  const controls = document.createElement('div');
  controls.className = 'wc-controls';
  controls.innerHTML = `
    <label>Search:</label>
    <input type="text" placeholder="Country,zone or time…" />
    <label>Sort:</label>
    <select>
      <option value="default">Popular / Default</option>
      <option value="country-az">Country A–Z</option>
      <option value="country-za">Country Z–A</option>
      <option value="time">Local Time</option>
      <option value="continent">Continent</option>
    </select>
  `;

  const searchInput = controls.querySelector('input');
  const select = controls.querySelector('select');

  root.innerHTML = '';
  root.appendChild(controls);

  let table = buildTable(currentData);
  root.appendChild(table);

  /* ===== SEARCH (now includes TIME) ===== */
  searchInput.oninput = () => {
    const q = searchInput.value.trim().toLowerCase();

    filteredData = !q
      ? [...originalData]
      : originalData.filter(item => {
          const zone = item.zone || '';
          const country = item.country || '';

          // generate time string ONLY for search
          let timeStr = '';
          try {
            const now = new Date();
            timeStr = now.toLocaleTimeString('en-GB', {
              timeZone: zone,
              hour: '2-digit',
              minute: '2-digit'
            }).toLowerCase();
          } catch {}

          return (
            country.toLowerCase().includes(q) ||
            zone.toLowerCase().includes(q) ||
            timeStr.includes(q)
          );
        });

    currentData = [...filteredData];
    table.remove();
    table = buildTable(currentData);
    root.appendChild(table);
  };

  select.onchange = () => {
    const value = select.value;
    currentData = [...filteredData];

    if (value === 'country-az') {
      currentData.sort((a, b) =>
        (a.country || '').localeCompare(b.country || '')
      );
    }

    if (value === 'country-za') {
      currentData.sort((a, b) =>
        (b.country || '').localeCompare(a.country || '')
      );
    }

    if (value === 'time') {
      const now = new Date();
      currentData.sort((a, b) =>
        new Date(now.toLocaleString('en-US', { timeZone: a.zone })) -
        new Date(now.toLocaleString('en-US', { timeZone: b.zone }))
      );
    }

    if (value === 'continent') {
      currentData.sort((a, b) =>
        (a.zone || '').split('/')[0]
          .localeCompare((b.zone || '').split('/')[0])
      );
    }

    table.remove();
    table = buildTable(currentData);
    root.appendChild(table);
  };

  clockInterval = setInterval(() => {
    if (table.isConnected) updateTimes(table, currentData);
  }, 1000);
}

/* =======================
   Table / Cells / Time
======================= */
function buildTable(data) {
  const table = document.createElement('table');
  table.className = 'world-clock-table';
  const columns = 4;
  const rows = Math.ceil(data.length / columns);

  let index = 0;
  for (let r = 0; r < rows; r++) {
    const tr = document.createElement('tr');
    for (let c = 0; c < columns; c++) {
      const td = document.createElement('td');
      if (index < data.length) {
        td.dataset.index = index;
        td.appendChild(createCellContent(data[index]));
      }
      tr.appendChild(td);
      index++;
    }
    table.appendChild(tr);
  }
  return table;
}

function createCellContent(item) {
  const wrap = document.createElement('div');
  wrap.className = 'wc-cell';

  const parts = (item.zone || '').split('/');
  const cityName = parts.at(-1)?.replace(/_/g, ' ') || 'Unknown';
  const regionName = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : '';

  const countryWrap = document.createElement('span');
  countryWrap.className = 'wc-country';

  countryWrap.innerHTML = `
    <span class="wc-city">${cityName}</span>
    <span class="wc-region">${regionName}</span>
  `;

  const time = document.createElement('span');
  time.className = 'wc-time';

  const utc = document.createElement('span');
  utc.className = 'wc-utc';

  wrap.append(countryWrap, time, utc);
  updateSingleTime(item, time, utc);
  return wrap;
}

function getUTCOffset(timeZone) {
  try {
    const now = new Date();
    const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const local = new Date(now.toLocaleString('en-US', { timeZone }));
    const offset = (local - utc) / 36e5;
    const sign = offset >= 0 ? '+' : '-';
    const abs = Math.abs(offset);
    return `UTC${sign}${Math.floor(abs)}:${String(
      Math.round((abs % 1) * 60)
    ).padStart(2, '0')}`;
  } catch {
    return '';
  }
}

function updateSingleTime(item, timeEl, utcEl) {
  const now = new Date();
  const t = now.toLocaleTimeString('en-GB', {
    timeZone: item.zone,
    hour: '2-digit',
    minute: '2-digit'
  });
  const d = now.toLocaleDateString('en-GB', {
    timeZone: item.zone,
    weekday: 'short'
  });

  timeEl.textContent = `${d} ${t}`;
  utcEl.textContent = `(${getUTCOffset(item.zone)})`;
}

function updateTimes(table, data) {
  table.querySelectorAll('td').forEach(td => {
    const i = Number(td.dataset.index);
    if (!Number.isNaN(i)) {
      updateSingleTime(
        data[i],
        td.querySelector('.wc-time'),
        td.querySelector('.wc-utc')
      );
    }
  });
}
