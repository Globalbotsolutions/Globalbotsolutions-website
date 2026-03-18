const logoSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420"><defs><radialGradient id="g" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="%230ea5e9" stop-opacity="0.35"/><stop offset="100%" stop-color="%23020517" stop-opacity="0"/></radialGradient><linearGradient id="ring" x1="0" x2="1"><stop offset="0%" stop-color="%2360a5fa"/><stop offset="100%" stop-color="%2393c5fd"/></linearGradient><linearGradient id="face" x1="0" x2="1"><stop offset="0%" stop-color="%230ea5e9"/><stop offset="100%" stop-color="%2338bdf8"/></linearGradient></defs><rect width="420" height="420" rx="60" fill="%23060f23"/><circle cx="210" cy="170" r="150" fill="url(%23g)"/><path d="M210 55c70 0 128 47 145 111-5 73-59 130-130 140l-39 37c-6 6-16 0-13-8l11-31C118 292 72 236 72 170 72 106 134 55 210 55Z" fill="none" stroke="url(%23ring)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><rect x="140" y="115" width="140" height="100" rx="36" fill="%23dbeafe" stroke="%230b2559" stroke-width="10"/><rect x="160" y="132" width="100" height="52" rx="18" fill="%23082548"/><circle cx="190" cy="158" r="12" fill="%2393c5fd"/><circle cx="230" cy="158" r="12" fill="%2393c5fd"/><path d="M190 193c10 9 30 9 40 0" fill="none" stroke="%23082548" stroke-width="8" stroke-linecap="round"/><path d="M210 98V70" stroke="%230b2559" stroke-width="10" stroke-linecap="round"/><circle cx="210" cy="54" r="14" fill="url(%23face)" stroke="%230b2559" stroke-width="8"/><path d="M140 148h-18M280 148h18" stroke="%230b2559" stroke-width="10" stroke-linecap="round"/></svg>`;

const industries = [
  "Transportation",
  "Dental",
  "Real Estate",
  "Restaurants",
  "E-commerce",
  "Law Firms",
  "Gyms",
  "Home Services"
];

const services = {
  en: [
    {
      title: "Chatbot Customer Support",
      desc: "Answer common customer questions instantly and reduce repetitive calls, texts, and emails."
    },
    {
      title: "FAQ Automation",
      desc: "Train your bot on your website, services, policies, and business information."
    },
    {
      title: "Lead Capture",
      desc: "Guide visitors toward calling, booking, requesting a quote, or sending an inquiry."
    },
    {
      title: "Website Integration",
      desc: "We customize and deploy the chatbot on your website with a branded, professional look."
    }
  ],
  es: [
    {
      title: "Atención al Cliente con Chatbot",
      desc: "Responde preguntas comunes al instante y reduce llamadas, mensajes y correos repetitivos."
    },
    {
      title: "Automatización de FAQ",
      desc: "Entrena tu bot con tu sitio web, servicios, políticas e información del negocio."
    },
    {
      title: "Captura de Prospectos",
      desc: "Guía a los visitantes para llamar, reservar, solicitar una cotización o enviar una consulta."
    },
    {
      title: "Integración en Sitio Web",
      desc: "Personalizamos e instalamos el chatbot en tu sitio con una imagen profesional."
    }
  ]
};

const processData = {
  en: [
    {
      step: "STEP 01",
      title: "We study your business",
      desc: "We train the chatbot using your website, FAQs, services, and company information."
    },
    {
      step: "STEP 02",
      title: "We customize your bot",
      desc: "We set the tone, branding, welcome message, and customer flow for your business."
    },
    {
      step: "STEP 03",
      title: "We launch and optimize",
      desc: "We deploy the bot on your website and refine it as new customer questions come in."
    }
  ],
  es: [
    {
      step: "PASO 01",
      title: "Estudiamos tu negocio",
      desc: "Entrenamos el chatbot usando tu sitio web, preguntas frecuentes, servicios e información de la empresa."
    },
    {
      step: "PASO 02",
      title: "Personalizamos tu bot",
      desc: "Definimos el tono, la marca, el mensaje de bienvenida y el flujo del cliente para tu negocio."
    },
    {
      step: "PASO 03",
      title: "Lanzamos y optimizamos",
      desc: "Instalamos el bot en tu sitio web y lo mejoramos según las nuevas preguntas de los clientes."
    }
  ]
};

const content = {
  en: {
    nav: ["Services", "Languages", "Process", "Pricing", "Contact"],
    demo: "Get a Demo",
    badge: "Customer service, FAQ answering, and lead capture",
    heroTitle: "Professional Chatbots That Make Your Business Look Faster, Smarter, and More Available",
    heroText: "We build custom front-end chatbot experiences for business websites that answer customer questions, automate FAQs, and guide visitors toward calling, booking, or requesting a quote.",
    cta1: "Start My Website",
    cta2: "View Bilingual Layout",
    bilingualEyebrow: "Bilingual Layout",
    bilingualTitle: "Organized Horizontal Language Boxes",
    bilingualText: "Your website can present English and Spanish offers in separate, clean side-by-side boxes.",
    box1Label: "English",
    box1Title: "Chatbots for Business Websites",
    box1Bullets: [
      "Answer customer questions automatically",
      "Train the bot on your website and services",
      "Capture leads and quote requests",
      "Deploy a branded chat experience"
    ],
    box2Label: "Español",
    box2Title: "Chatbots con IA para sitios web de negocios",
    box2Bullets: [
      "Responde preguntas de clientes automáticamente",
      "Entrena el bot con tu sitio web y servicios",
      "Captura prospectos y solicitudes de cotización",
      "Instala una experiencia de chat con tu marca"
    ],
    requestDemo: "Request a Demo",
    servicesEyebrow: "SERVICES",
    servicesTitle: "What GlobalBotSolutions Offers",
    servicesText: "A focused website and chatbot service designed to help local businesses answer faster, look more professional, and turn traffic into real inquiries.",
    processEyebrow: "HOW IT WORKS",
    processTitle: "Simple Process, Professional Result",
    processText: "A clean workflow that gets your client-facing website and chatbot ready without making the setup feel overwhelming.",
    industriesEyebrow: "INDUSTRIES",
    industriesTitle: "Built for Service Businesses",
    industriesText: "This structure can be customized for many industries that need better customer communication and faster website response times.",
    pricingEyebrow: "PRICING",
    pricingTitle: "Simple Pricing to Start Selling Fast",
    pricingText: "A clear structure that helps you present setup pricing and ongoing monthly management without overcomplicating the offer.",
    setupLabel: "ONE-TIME STARTUP FEE",
    monthlyLabel: "MONTHLY FEE",
    setupFeatures: [
      "Custom chatbot setup",
      "Website and FAQ training",
      "Branded styling",
      "Welcome message creation",
      "Lead capture prompts"
    ],
    monthlyFeatures: [
      "Bot updates and improvements",
      "Content refreshes",
      "Prompt refinements",
      "Support and monitoring",
      "Performance optimization"
    ],
    sendInquiry: "Send Inquiry",
    contactEyebrow: "CONTACT",
    contactTitle: "Let's Build Your Front-End Website",
    contactText: "Use this section to collect leads from business owners who want a modern website, a branded chatbot, and a cleaner customer experience.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    offerLabel: "Offer",
    offerValue: "AI chatbot website setup + monthly management",
    businessName: "Business name",
    yourName: "Your name",
    emailAddress: "Email address",
    details: "Tell us about your business and what you want the chatbot to do",
    footer: "© 2026 GlobalBotSolutions. All rights reserved."
  },
  es: {
    nav: ["Servicios", "Idiomas", "Proceso", "Precios", "Contacto"],
    demo: "Solicitar Demo",
    badge: "Servicio al cliente, respuestas FAQ y captura de prospectos",
    heroTitle: "Chatbots Profesionales con IA Que Hacen Que Tu Negocio Se Vea Más Rápido, Inteligente y Disponible",
    heroText: "Creamos experiencias de chatbot para sitios web de negocios que responden preguntas de clientes, automatizan preguntas frecuentes y guían a los visitantes a llamar, reservar o solicitar una cotización.",
    cta1: "Crear Mi Sitio Web",
    cta2: "Ver Diseño Bilingüe",
    bilingualEyebrow: "DISEÑO BILINGÜE",
    bilingualTitle: "Cajas Horizontales Organizadas por Idioma",
    bilingualText: "Tu sitio web puede presentar ofertas en inglés y español en cajas separadas y limpias.",
    box1Label: "English",
    box1Title: "Chatbots for Business Websites",
    box1Bullets: [
      "Answer customer questions automatically",
      "Train the bot on your website and services",
      "Capture leads and quote requests",
      "Deploy a branded chat experience"
    ],
    box2Label: "Español",
    box2Title: "Chatbots con IA para sitios web de negocios",
    box2Bullets: [
      "Responde preguntas de clientes automáticamente",
      "Entrena el bot con tu sitio web y servicios",
      "Captura prospectos y solicitudes de cotización",
      "Instala una experiencia de chat con tu marca"
    ],
    requestDemo: "Solicitar Demo",
    servicesEyebrow: "SERVICIOS",
    servicesTitle: "Lo Que Ofrece GlobalBotSolutions",
    servicesText: "Un servicio enfocado para ayudar a negocios locales a responder más rápido, verse más profesionales y convertir tráfico en consultas reales.",
    processEyebrow: "CÓMO FUNCIONA",
    processTitle: "Proceso Simple, Resultado Profesional",
    processText: "Un flujo limpio que deja listo tu sitio web y chatbot sin que la configuración se sienta complicada.",
    industriesEyebrow: "INDUSTRIAS",
    industriesTitle: "Diseñado para Negocios de Servicios",
    industriesText: "Esta estructura puede personalizarse para muchas industrias que necesitan mejor comunicación con clientes y respuesta más rápida en su sitio web.",
    pricingEyebrow: "PRECIOS",
    pricingTitle: "Precios Simples para Empezar a Vender Rápido",
    pricingText: "Una estructura clara para presentar el costo inicial y la gestión mensual sin complicar demasiado la oferta.",
    setupLabel: "CARGO INICIAL ÚNICO",
    monthlyLabel: "CARGO MENSUAL",
    setupFeatures: [
      "Configuración personalizada del chatbot",
      "Entrenamiento con sitio web y FAQ",
      "Estilo con marca",
      "Mensaje de bienvenida",
      "Prompts para captar prospectos"
    ],
    monthlyFeatures: [
      "Actualizaciones y mejoras",
      "Refrescos de contenido",
      "Refinamiento de prompts",
      "Soporte y monitoreo",
      "Optimización de rendimiento"
    ],
    sendInquiry: "Enviar Consulta",
    contactEyebrow: "CONTACTO",
    contactTitle: "Construyamos Tu Sitio Web Front-End",
    contactText: "Usa esta sección para captar dueños de negocios que quieren un sitio web moderno, un chatbot con marca y una mejor experiencia para el cliente.",
    emailLabel: "Correo",
    phoneLabel: "Teléfono",
    offerLabel: "Oferta",
    offerValue: "Configuración de sitio web con chatbot + gestión mensual",
    businessName: "Nombre del negocio",
    yourName: "Tu nombre",
    emailAddress: "Correo electrónico",
    details: "Cuéntanos sobre tu negocio y lo que quieres que haga el chatbot",
    footer: "© 2026 GlobalBotSolutions. Todos los derechos reservados."
  }
};

let currentLang = "en";

function setAllLogos() {
  const logos = document.querySelectorAll(".logo");
  logos.forEach((logo) => {
    logo.src = logoSvg;
  });
}

function renderBullets(containerId, bullets) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  bullets.forEach((bullet) => {
    const row = document.createElement("div");
    row.className = "bullet-item";

    const dot = document.createElement("span");
    dot.className = "bullet-dot";
    dot.textContent = "•";

    const text = document.createElement("span");
    text.textContent = bullet;

    row.appendChild(dot);
    row.appendChild(text);
    container.appendChild(row);
  });
}

function renderServices(lang) {
  const grid = document.getElementById("services-grid");
  grid.innerHTML = "";

  services[lang].forEach((item) => {
    const card = document.createElement("div");
    card.className = "service-card";

    const logo = document.createElement("img");
    logo.src = logoSvg;
    logo.alt = "GlobalBotSolutions logo";
    logo.className = "logo logo-sm";

    const title = document.createElement("h3");
    title.className = "service-card-title";
    title.textContent = item.title;

    const text = document.createElement("p");
    text.className = "service-card-text";
    text.textContent = item.desc;

    card.appendChild(logo);
    card.appendChild(title);
    card.appendChild(text);
    grid.appendChild(card);
  });
}

function renderProcess(lang) {
  const grid = document.getElementById("process-grid");
  grid.innerHTML = "";

  processData[lang].forEach((item) => {
    const card = document.createElement("div");
    card.className = "process-card";

    const step = document.createElement("p");
    step.className = "process-step";
    step.textContent = item.step;

    const title = document.createElement("h3");
    title.className = "process-card-title";
    title.textContent = item.title;

    const text = document.createElement("p");
    text.className = "process-card-text";
    text.textContent = item.desc;

    card.appendChild(step);
    card.appendChild(title);
    card.appendChild(text);
    grid.appendChild(card);
  });
}

function renderIndustries() {
  const wrap = document.getElementById("industries-wrap");
  wrap.innerHTML = "";

  industries.forEach((industry) => {
    const pill = document.createElement("div");
    pill.className = "industry-pill";
    pill.textContent = industry;
    wrap.appendChild(pill);
  });
}

function renderPricingFeatures(containerId, features) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  features.forEach((feature) => {
    const line = document.createElement("div");
    line.className = "feature-line";
    line.textContent = `✓ ${feature}`;
    container.appendChild(line);
  });
}

function renderChatMessages(lang) {
  const message1 = document.getElementById("chat-message-1");
  const message2 = document.getElementById("chat-message-2");
  const message3 = document.getElementById("chat-message-3");

  if (lang === "en") {
    message1.textContent =
      "Hello! I'm here to help answer questions, automate FAQs, and capture leads for your business website.";
    message2.textContent =
      "Can you build a bot that answers customer service questions and sends us more inquiries?";
    message3.textContent =
      "Yes. We create branded chatbot experiences that can answer common questions, guide visitors, and help convert traffic into leads.";
  } else {
    message1.textContent =
      "¡Hola! Estoy aquí para ayudar a responder preguntas, automatizar preguntas frecuentes y captar prospectos para tu sitio web de negocio.";
    message2.textContent =
      "¿Puedes crear un bot que responda preguntas de servicio al cliente y nos envíe más consultas?";
    message3.textContent =
      "Sí. Creamos experiencias de chatbot con tu marca que pueden responder preguntas comunes, guiar visitantes y ayudar a convertir tráfico en prospectos.";
  }
}

function updateLanguageButtons(lang) {
  const btnEn = document.getElementById("btn-en");
  const btnEs = document.getElementById("btn-es");

  btnEn.classList.toggle("active", lang === "en");
  btnEs.classList.toggle("active", lang === "es");
}

function renderContent(lang) {
  currentLang = lang;
  const t = content[lang];

  // Nav
  document.getElementById("nav-services").textContent = t.nav[0];
  document.getElementById("nav-languages").textContent = t.nav[1];
  document.getElementById("nav-process").textContent = t.nav[2];
  document.getElementById("nav-pricing").textContent = t.nav[3];
  document.getElementById("nav-contact").textContent = t.nav[4];

  // Header button
  document.getElementById("header-demo-btn").textContent = t.demo;

  // Hero
  document.getElementById("hero-badge").lastChild.textContent = ` ${t.badge}`;
  document.getElementById("hero-title").textContent = t.heroTitle;
  document.getElementById("hero-text").textContent = t.heroText;
  document.getElementById("hero-cta1").textContent = t.cta1;

  // Bilingual section
  document.getElementById("bilingual-eyebrow").textContent = t.bilingualEyebrow;
  document.getElementById("bilingual-title").textContent = t.bilingualTitle;
  document.getElementById("bilingual-text").textContent = t.bilingualText;

  document.getElementById("box1-label").textContent = t.box1Label;
  document.getElementById("box1-title").textContent = t.box1Title;
  document.getElementById("box1-cta").textContent = t.requestDemo;

  document.getElementById("box2-label").textContent = t.box2Label;
  document.getElementById("box2-title").textContent = t.box2Title;
  document.getElementById("box2-cta").textContent = t.requestDemo;

  renderBullets("box1-bullets", t.box1Bullets);
  renderBullets("box2-bullets", t.box2Bullets);

  // Services section
  document.getElementById("services-eyebrow").textContent = t.servicesEyebrow;
  document.getElementById("services-title").textContent = t.servicesTitle;
  document.getElementById("services-text").textContent = t.servicesText;
  renderServices(lang);

  // Process section
  document.getElementById("process-eyebrow").textContent = t.processEyebrow;
  document.getElementById("process-title").textContent = t.processTitle;
  document.getElementById("process-text").textContent = t.processText;
  renderProcess(lang);

  // Industries section
  document.getElementById("industries-eyebrow").textContent = t.industriesEyebrow;
  document.getElementById("industries-title").textContent = t.industriesTitle;
  document.getElementById("industries-text").textContent = t.industriesText;

  // Pricing section
  document.getElementById("pricing-eyebrow").textContent = t.pricingEyebrow;
  document.getElementById("pricing-title").textContent = t.pricingTitle;
  document.getElementById("pricing-text").textContent = t.pricingText;
  document.getElementById("setup-label").textContent = t.setupLabel;
  document.getElementById("monthly-label").textContent = t.monthlyLabel;
  document.getElementById("pricing-cta-1").textContent = t.sendInquiry;
  document.getElementById("pricing-cta-2").textContent = t.sendInquiry;
  renderPricingFeatures("setup-features", t.setupFeatures);
  renderPricingFeatures("monthly-features", t.monthlyFeatures);

  // Contact section
  document.getElementById("contact-eyebrow").textContent = t.contactEyebrow;
  document.getElementById("contact-title").textContent = t.contactTitle;
  document.getElementById("contact-text").textContent = t.contactText;
  document.getElementById("email-label").textContent = t.emailLabel;
  document.getElementById("phone-label").textContent = t.phoneLabel;
  document.getElementById("offer-label").textContent = t.offerLabel;
  document.getElementById("offer-value").textContent = t.offerValue;
  document.getElementById("business-name").placeholder = t.businessName;
  document.getElementById("your-name").placeholder = t.yourName;
  document.getElementById("email-address").placeholder = t.emailAddress;
  document.getElementById("details").placeholder = t.details;
  document.getElementById("contact-submit").textContent = t.sendInquiry;

  // Footer
  document.getElementById("footer-text").textContent = t.footer;
  document.getElementById("footer-services").textContent = t.nav[0];
  document.getElementById("footer-pricing").textContent = t.nav[3];
  document.getElementById("footer-contact").textContent = t.nav[4];

  // Chat messages
  renderChatMessages(lang);

  // Button state
  updateLanguageButtons(lang);
}

document.addEventListener("DOMContentLoaded", function () {
  setAllLogos();
  renderIndustries();
  renderContent("en");

  document.getElementById("btn-en").addEventListener("click", function () {
    renderContent("en");
  });

  document.getElementById("btn-es").addEventListener("click", function () {
    renderContent("es");
  });
});
