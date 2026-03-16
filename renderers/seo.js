export async function renderSEO(toolId) {
  try {
    const res = await fetch('data/seo.json');
    if (!res.ok) return;

    const data = await res.json();
    const seo = data[toolId];
    if (!seo) return;

    const section = document.createElement('section');
    section.style.marginTop = '30px';
    section.innerHTML = `
      <h2 style="color:var(--green);font-size:18px">About this tool</h2>
      <p class="muted">${seo.intro}</p>

      ${seo.formula ? `<p class="small"><strong>Formula:</strong> ${seo.formula}</p>` : ''}
      ${seo.note ? `<p class="small">${seo.note}</p>` : ''}
    `;

    document.querySelector('#main').appendChild(section);
  } catch {}
}
