export function renderIpFinder(tool) {
  const inputs = document.querySelector('#inputs');
  const result = document.querySelector('#result');

  /* ---------------- INPUT UI ---------------- */
  inputs.innerHTML = `
    <button id="ip_find" class="btn">
      Find My IP
    </button>

    <p class="small muted" style="margin-top:8px">
      Click to fetch your public IP address and location info.
    </p>
  `;

  /* ---------------- RESULT UI ---------------- */
  result.innerHTML = `
    <div class="result-box" style="transition:opacity .25s ease">
      <div class="small">IP Information</div>
      <div
        id="ip_result"
        style="font-size:14px;font-weight:600;opacity:.6;white-space:pre-line">
        No IP fetched yet
      </div>
    </div>
  `;

  /* ---------------- ELEMENTS ---------------- */
  const buttonEl = document.querySelector('#ip_find');
  const resultEl = document.querySelector('#ip_result');

  /* ---------------- LOGIC ---------------- */
  async function findIP() {
    resultEl.innerText = 'Fetching IP...';
    resultEl.style.opacity = 0.6;

    try {
      // Using ipify public API
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      const ip = data.ip;

      let geoInfo = '';

      // Optionally get geolocation using ip-api.com
      try {
        const geoRes = await fetch(`https://ip-api.com/json/${ip}`);
        const geoData = await geoRes.json();
        if (geoData.status === 'success') {
          geoInfo = `\nLocation: ${geoData.city}, ${geoData.regionName}, ${geoData.country}`;
          geoInfo += `\nISP: ${geoData.isp}`;
          geoInfo += `\nTimezone: ${geoData.timezone}`;
        }
      } catch {}

      resultEl.innerText = `Your IP: ${ip}${geoInfo}`;
      resultEl.style.opacity = 1;
    } catch (err) {
      resultEl.innerText = 'Failed to fetch IP: ' + err.message;
      resultEl.style.opacity = 1;
    }
  }

  /* ---------------- EVENTS ---------------- */
  buttonEl.addEventListener('click', findIP);
}
