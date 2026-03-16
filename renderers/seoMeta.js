export async function renderSEOMeta(tool) {
  if (!tool) return;

  const title = `${tool.title} Online Free | ToolZen Hub`;
  const desc =
    tool.desc ||
    `Free online ${tool.title}. Fast, accurate, and easy to use on ToolZen Hub.`;

  document.title = title;

  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = desc;
}
