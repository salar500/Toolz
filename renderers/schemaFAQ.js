export async function renderFAQSchema(toolId) {
  try {
    const res = await fetch('data/faqs.json');
    if (!res.ok) return;

    const data = await res.json();
    const faqs = data[toolId];
    if (!faqs?.length) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  } catch {}
}
