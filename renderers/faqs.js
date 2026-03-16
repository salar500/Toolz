export async function renderFAQ(toolId) {
  try {
    const res = await fetch('data/faqs.json');
    if (!res.ok) return;

    const data = await res.json();
    const faqs = data[toolId];
    if (!faqs || !faqs.length) return;

    const container = document.createElement('section');
    container.style.marginTop = '28px';
    container.innerHTML = `
      <h2 style="color:var(--green);font-size:18px;margin-bottom:12px">
        Frequently Asked Questions
      </h2>
      ${faqs.map(f => `
        <details style="margin-bottom:10px;border:1px solid var(--border);border-radius:8px;padding:10px">
          <summary style="cursor:pointer;font-weight:600">${f.q}</summary>
          <p class="muted" style="margin-top:6px">${f.a}</p>
        </details>
      `).join('')}
    `;

    document.querySelector('#main').appendChild(container);

  } catch(e) {
    console.warn('FAQ load skipped');
  }
}
