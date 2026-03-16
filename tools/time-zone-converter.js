/* ======================================================
   TOOLZEN — DENSE 24H TIME ZONE GRID
   + DAY CHANGE INDICATOR
   + DRAG TO REORDER
   + REMOVE TIME ZONE
   + LONG NAME SAFE (NO OVERLAP)
   + DYNAMIC ZONE COLUMN WIDTH
   + CURRENT LOCAL TIME HIGHLIGHT (PER ZONE)
====================================================== */

const ALL_TIMEZONES = Intl.supportedValuesOf
  ? Intl.supportedValuesOf("timeZone")
  : ["UTC"];

/* ===== FORMAT TIME PARTS ===== */
function formatParts(date, tz) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    weekday: "short"
  }).formatToParts(date);

  return {
    hour: Number(parts.find(p => p.type === "hour").value),
    time:
      parts.find(p => p.type === "hour").value + ":" +
      parts.find(p => p.type === "minute").value,
    meridiem: parts.find(p => p.type === "dayPeriod").value,
    weekday: parts.find(p => p.type === "weekday").value
  };
}

/* ===== RENDER FUNCTION ===== */
export function renderTimeZoneConverter(tool) {
  const inputs = document.getElementById("inputs");
  const result = document.getElementById("result");
  result.style.display = "none";

  inputs.innerHTML = `
    <div class="small">
      Drag rows to reorder. Remove zones anytime.
      <br><span style="opacity:.7">Columns stay UTC-aligned.</span>
    </div>

    <div style="display:flex;gap:8px;margin:10px 0">
      <input id="tz-input" placeholder="Asia/Kolkata" list="tz-list">
      <button class="btn" id="add-tz">Add</button>
    </div>

    <datalist id="tz-list">
      ${ALL_TIMEZONES.map(tz => `<option value="${tz}">`).join("")}
    </datalist>

    <div style="overflow:auto">
      <table class="tz-grid" id="time-grid"></table>
    </div>
  `;

  let zones = [
    "UTC",
    "Asia/Kolkata",
    "Europe/London",
    "Africa/Cairo"
  ];

  const grid = document.getElementById("time-grid");
  let dragIndex = null;

  function renderGrid() {
    grid.innerHTML = "";

    const now = new Date();
    const base = new Date(now);
    base.setUTCMinutes(0, 0, 0);

    /* ===== HEADER ===== */
    const head = document.createElement("tr");
    head.innerHTML =
      `<th class="sticky zone-head">Zone</th>` +
      [...Array(24)].map((_, h) =>
        `<th class="hour-head">${h}</th>`
      ).join("");
    grid.appendChild(head);

    /* ===== ROWS ===== */
    zones.forEach((tz, index) => {
      const row = document.createElement("tr");
      row.draggable = true;
      row.dataset.index = index;

      row.innerHTML = `
        <td class="sticky zone-name">
          <span class="drag-handle" title="Drag to reorder">⠿</span>
          <span class="zone-label" title="${tz}">${tz}</span>
          <button class="tz-remove" data-tz="${tz}" title="Remove">✕</button>
        </td>
      `;

      const currentHour = formatParts(now, tz).hour;

      for (let h = 0; h < 24; h++) {
        const utc = new Date(base);
        utc.setUTCHours(h);

        const utcDay = utc.toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: "UTC"
        });

        const { time, meridiem, weekday, hour } = formatParts(utc, tz);
        const showDay = weekday !== utcDay;

        const cell = document.createElement("td");
        cell.className = `time-cell ${hour === currentHour ? "now-local" : ""}`;

        cell.innerHTML = `
          <div class="t">${time}</div>
          <div class="m">${meridiem}</div>
          ${showDay ? `<div class="d">${weekday}</div>` : ""}
        `;

        row.appendChild(cell);
      }

      grid.appendChild(row);
    });
  }

  /* ===== ADD TIME ZONE ===== */
  document.getElementById("add-tz").onclick = () => {
    const tz = document.getElementById("tz-input").value.trim();
    if (!ALL_TIMEZONES.includes(tz)) {
      alert("Invalid timezone (example: Europe/London)");
      return;
    }
    if (!zones.includes(tz)) {
      zones.push(tz);
      renderGrid();
    }
  };

  /* ===== REMOVE TIME ZONE ===== */
  grid.onclick = e => {
    const btn = e.target.closest(".tz-remove");
    if (!btn) return;
    zones = zones.filter(z => z !== btn.dataset.tz);
    renderGrid();
  };

  /* ===== DRAG & DROP ===== */
  grid.addEventListener("dragstart", e => {
    const row = e.target.closest("tr");
    if (!row || !row.dataset.index) return;
    dragIndex = +row.dataset.index;
    row.classList.add("dragging");
  });

  grid.addEventListener("dragend", e => {
    const row = e.target.closest("tr");
    if (row) row.classList.remove("dragging");
  });

  grid.addEventListener("dragover", e => {
    e.preventDefault();
    const row = e.target.closest("tr");
    if (!row || !row.dataset.index) return;

    const dropIndex = +row.dataset.index;
    if (dragIndex === dropIndex) return;

    const moved = zones.splice(dragIndex, 1)[0];
    zones.splice(dropIndex, 0, moved);
    dragIndex = dropIndex;
    renderGrid();
  });

  renderGrid();
  setInterval(renderGrid, 60000); // keep highlight accurate

  /* ===== INLINE CSS ===== */
  const style = document.createElement("style");
  style.textContent = `
    .tz-grid {
      border-collapse: collapse;
      min-width: 900px;
    }

    .tz-grid th,
    .tz-grid td {
      border: 1px solid #e3e3e3;
      width: 42px;
      padding: 2px;
      text-align: center;
      vertical-align: middle;
    }

    .zone-head {
      font-size: 11px;
      background: #fafafa;
      min-width: 240px;
      max-width: 360px;
    }

    .hour-head {
      font-size: 11px;
      background: #fafafa;
    }

    .time-cell {
      font-size: 10px;
      line-height: 1.05;
    }

    .time-cell .t {
      font-weight: 500;
    }

    .time-cell .m {
      font-size: 9px;
      color: #777;
      text-transform: uppercase;
    }

    .time-cell .d {
      font-size: 9px;
      color: #999;
      line-height: 1;
    }

    /* CURRENT LOCAL TIME */
    .now-local {
      background: #e3f2fd;
      box-shadow: inset 0 0 0 1px #90caf9;
      font-weight: 600;
    }

    .zone-name {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      min-width: 240px;
      max-width: 360px;
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      background: #fff;
    }

    .zone-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .drag-handle {
      cursor: grab;
      font-size: 14px;
      color: #888;
      flex-shrink: 0;
    }

    .tz-remove {
      border: none;
      background: none;
      font-size: 12px;
      color: #999;
      cursor: pointer;
      flex-shrink: 0;
    }

    .tz-remove:hover {
      color: #d32f2f;
    }

    tr.dragging {
      opacity: 0.5;
    }

    .sticky {
      position: sticky;
      left: 0;
      z-index: 2;
      background: #fff;
    }
  `;
  document.head.appendChild(style);
}
