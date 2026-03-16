export function renderBMIHowToSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to calculate BMI",
    "step": [
      { "@type": "HowToStep", "text": "Enter your weight" },
      { "@type": "HowToStep", "text": "Enter your height" },
      { "@type": "HowToStep", "text": "Click Calculate BMI" }
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
