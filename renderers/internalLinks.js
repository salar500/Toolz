export function renderInternalLinks(category) {
  if (!category?.tools?.length) return;

  const section = document.createElement('section');
  section.style.marginTop = '30px';

  section.innerHTML = `
    <h2 style="color:var(--green);font-size:18px">
      Related Tools
    </h2>
    <ul class="small">
      ${category.tools.map(t =>
        `<li><a href="tool.html?id=${t.id}">${t.title}</a></li>`
      ).join('')}
    </ul>
  `;

  document.querySelector('#main').appendChild(section);
}
