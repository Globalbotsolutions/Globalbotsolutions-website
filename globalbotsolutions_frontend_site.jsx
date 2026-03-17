import React from "react";

const logoSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420"><defs><radialGradient id="g" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="%230ea5e9" stop-opacity="0.35"/><stop offset="100%" stop-color="%23020517" stop-opacity="0"/></radialGradient><linearGradient id="ring" x1="0" x2="1"><stop offset="0%" stop-color="%2360a5fa"/><stop offset="100%" stop-color="%2393c5fd"/></linearGradient><linearGradient id="face" x1="0" x2="1"><stop offset="0%" stop-color="%230ea5e9"/><stop offset="100%" stop-color="%2338bdf8"/></linearGradient></defs><rect width="420" height="420" rx="60" fill="%23060f23"/><circle cx="210" cy="170" r="150" fill="url(%23g)"/><path d="M210 55c70 0 128 47 145 111-5 73-59 130-130 140l-39 37c-6 6-16 0-13-8l11-31C118 292 72 236 72 170 72 106 134 55 210 55Z" fill="none" stroke="url(%23ring)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><rect x="140" y="115" width="140" height="100" rx="36" fill="%23dbeafe" stroke="%230b2559" stroke-width="10"/><rect x="160" y="132" width="100" height="52" rx="18" fill="%23082548"/><circle cx="190" cy="158" r="12" fill="%2393c5fd"/><circle cx="230" cy="158" r="12" fill="%2393c5fd"/><path d="M190 193c10 9 30 9 40 0" fill="none" stroke="%23082548" stroke-width="8" stroke-linecap="round"/><path d="M210 98V70" stroke="%230b2559" stroke-width="10" stroke-linecap="round"/><circle cx="210" cy="54" r="14" fill="url(%23face)" stroke="%230b2559" stroke-width="8"/><path d="M140 148h-18M280 148h18" stroke="%230b2559" stroke-width="10" stroke-linecap="round"/></svg>`;

const industries = ["Transportation", "Dental", "Real Estate", "Restaurants", "E-commerce", "Law Firms", "Gyms", "Home Services"];

const services = {
  en: [
    { title: "Chatbot Customer Support", desc: "Answer common customer questions instantly and reduce repetitive calls, texts, and emails." },
    { title: "FAQ Automation", desc: "Train your bot on your website, services, policies, and business information." },
    { title: "Lead Capture", desc: "Guide visitors toward calling, booking, requesting a quote, or sending an inquiry." },
    { title: "Website Integration", desc: "We customize and deploy the chatbot on your website with a branded, professional look." },
  ],
  es: [
    { title: "Atención al Cliente con Chatbot", desc: "Responde preguntas comunes al instante y reduce llamadas, mensajes y correos repetitivos." },
    { title: "Automatización de FAQ", desc: "Entrena tu bot con tu sitio web, servicios, políticas e información del negocio." },
    { title: "Captura de Prospectos", desc: "Guía a los visitantes para llamar, reservar, solicitar una cotización o enviar una consulta." },
    { title: "Integración en Sitio Web", desc: "Personalizamos e instalamos el chatbot en tu sitio con una imagen profesional." },
  ],
};

const processData = {
  en: [
    { step: "STEP 01", title: "We study your business", desc: "We train the chatbot using your website, FAQs, services, and company information." },
    { step: "STEP 02", title: "We customize your bot", desc: "We set the tone, branding, welcome message, and customer flow for your business." },
    { step: "STEP 03", title: "We launch and optimize", desc: "We deploy the bot on your website and refine it as new customer questions come in." },
  ],
  es: [
    { step: "PASO 01", title: "Estudiamos tu negocio", desc: "Entrenamos el chatbot usando tu sitio web, preguntas frecuentes, servicios e información de la empresa." },
    { step: "PASO 02", title: "Personalizamos tu bot", desc: "Definimos el tono, la marca, el mensaje de bienvenida y el flujo del cliente para tu negocio." },
    { step: "PASO 03", title: "Lanzamos y optimizamos", desc: "Instalamos el bot en tu sitio web y lo mejoramos según las nuevas preguntas de los clientes." },
  ],
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
    box1Bullets: ["Answer customer questions automatically", "Train the bot on your website and services", "Capture leads and quote requests", "Deploy a branded chat experience"],
    box2Label: "Español",
    box2Title: "Chatbots con IA para sitios web de negocios",
    box2Bullets: ["Responde preguntas de clientes automáticamente", "Entrena el bot con tu sitio web y servicios", "Captura prospectos y solicitudes de cotización", "Instala una experiencia de chat con tu marca"],
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
    setupFeatures: ["Custom chatbot setup", "Website and FAQ training", "Branded styling", "Welcome message creation", "Lead capture prompts"],
    monthlyFeatures: ["Bot updates and improvements", "Content refreshes", "Prompt refinements", "Support and monitoring", "Performance optimization"],
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
    footer: "© 2026 GlobalBotSolutions. All rights reserved.",
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
    box1Bullets: ["Answer customer questions automatically", "Train the bot on your website and services", "Capture leads and quote requests", "Deploy a branded chat experience"],
    box2Label: "Español",
    box2Title: "Chatbots con IA para sitios web de negocios",
    box2Bullets: ["Responde preguntas de clientes automáticamente", "Entrena el bot con tu sitio web y servicios", "Captura prospectos y solicitudes de cotización", "Instala una experiencia de chat con tu marca"],
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
    setupFeatures: ["Configuración personalizada del chatbot", "Entrenamiento con sitio web y FAQ", "Estilo con marca", "Mensaje de bienvenida", "Prompts para captar prospectos"],
    monthlyFeatures: ["Actualizaciones y mejoras", "Refrescos de contenido", "Refinamiento de prompts", "Soporte y monitoreo", "Optimización de rendimiento"],
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
    footer: "© 2026 GlobalBotSolutions. Todos los derechos reservados.",
  },
};

function Logo({ className = "h-14 w-14" }: { className?: string }) {
  return <img src={logoSvg} alt="GlobalBotSolutions logo" className={`${className} rounded-2xl object-cover`} />;
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <div className="flex justify-center mb-5"><Logo className="h-16 w-16" /></div>
      <p className="text-sky-300 text-sm tracking-[0.3em] font-bold mb-3">{eyebrow}</p>
      <h2 className="text-3xl md:text-5xl font-black text-white mb-4">{title}</h2>
      <p className="text-slate-300 text-lg leading-relaxed">{text}</p>
    </div>
  );
}

function LanguageCard({ label, title, bullets, cta }: { label: string; title: string; bullets: string[]; cta: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent" />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Logo className="h-14 w-14" />
          <span className="rounded-full bg-blue-600/40 px-4 py-2 text-sm font-bold text-white">{label}</span>
        </div>
        <h3 className="text-2xl md:text-4xl font-black text-white mb-5">{title}</h3>
        <div className="space-y-4 mb-8">
          {bullets.map((b) => (
            <div key={b} className="flex items-start gap-3 text-slate-200 text-lg">
              <span className="text-sky-300">•</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
        <button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-lg">
          {cta}
        </button>
      </div>
    </div>
  );
}

export default function GlobalBotSolutionsFrontendSite() {
  const [lang, setLang] = React.useState<"en" | "es">("en");
  const t = content[lang];
  const s = services[lang];
  const p = processData[lang];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%)] pointer-events-none" />
      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Logo className="h-11 w-11" />
              <div>
                <div className="font-black text-lg">GlobalBotSolutions</div>
                <div className="text-xs text-slate-400">Chatbots for Business Websites</div>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-8 text-sm text-slate-300">
              <a href="#services">{t.nav[0]}</a>
              <a href="#languages">{t.nav[1]}</a>
              <a href="#process">{t.nav[2]}</a>
              <a href="#pricing">{t.nav[3]}</a>
              <a href="#contact">{t.nav[4]}</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-1 flex">
                <button onClick={() => setLang("en")} className={`px-3 py-2 rounded-xl text-sm font-bold ${lang === "en" ? "bg-blue-500 text-white" : "text-slate-300"}`}>EN</button>
                <button onClick={() => setLang("es")} className={`px-3 py-2 rounded-xl text-sm font-bold ${lang === "es" ? "bg-blue-500 text-white" : "text-slate-300"}`}>ES</button>
              </div>
              <a href="#contact" className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-bold">{t.demo}</a>
            </div>
          </div>
        </header>

        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <div className="mb-8"><Logo className="h-24 w-24" /></div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Welcome to your future chatbot
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-10">
            Scroll down to explore how your business can look smarter, faster, and more professional with AI automation.
          </p>
          <div className="animate-bounce text-slate-400 text-sm">↓ Scroll ↓</div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-blue-500/10 px-4 py-2 text-sm text-sky-200 mb-6">
              <span className="h-2 w-2 rounded-full bg-sky-400" /> {t.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">{t.heroTitle}</h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8">{t.heroText}</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="#contact" className="rounded-2xl bg-blue-500 px-6 py-4 text-center font-bold">{t.cta1}</a>
              
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_rgba(56,189,248,0.7),transparent_55%)]" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <Logo className="h-16 w-16" />
                <div>
                  <div className="text-2xl font-black">GlobalBotSolutions</div>
                  <div className="text-sky-200">Website Chatbot Agency</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="max-w-md rounded-[24px] bg-white px-5 py-4 text-slate-900">
                  {lang === "en"
                    ? "Hello! I'm here to help answer questions, automate FAQs, and capture leads for your business website."
                    : "¡Hola! Estoy aquí para ayudar a responder preguntas, automatizar preguntas frecuentes y captar prospectos para tu sitio web de negocio."}
                </div>
                <div className="max-w-md ml-auto rounded-[24px] bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-4 text-white">
                  {lang === "en"
                    ? "Can you build a bot that answers customer service questions and sends us more inquiries?"
                    : "¿Puedes crear un bot que responda preguntas de servicio al cliente y nos envíe más consultas?"}
                </div>
                <div className="max-w-md rounded-[24px] border border-white/10 bg-white/10 px-5 py-4 text-slate-100">
                  {lang === "en"
                    ? "Yes. We create branded chatbot experiences that can answer common questions, guide visitors, and help convert traffic into leads."
                    : "Sí. Creamos experiencias de chatbot con tu marca que pueden responder preguntas comunes, guiar visitantes y ayudar a convertir tráfico en prospectos."}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="max-w-7xl mx-auto px-6 py-20">
          <SectionTitle eyebrow={t.servicesEyebrow} title={t.servicesTitle} text={t.servicesText} />
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {s.map((item) => (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-7">
                <div className="mb-5"><Logo className="h-12 w-12" /></div>
                <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="process" className="max-w-7xl mx-auto px-6 py-20">
          <SectionTitle eyebrow={t.processEyebrow} title={t.processTitle} text={t.processText} />
          <div className="grid md:grid-cols-3 gap-6">
            {p.map((item) => (
              <div key={item.step} className="rounded-[28px] border border-white/10 bg-white/5 p-8">
                <p className="text-sky-300 text-sm tracking-[0.25em] font-bold mb-4">{item.step}</p>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <SectionTitle eyebrow={t.industriesEyebrow} title={t.industriesTitle} text={t.industriesText} />
          <div className="flex flex-wrap gap-4 justify-center">
            {industries.map((industry) => (
              <div key={industry} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white font-semibold">{industry}</div>
            ))}
          </div>
        </section>

        <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
          <SectionTitle eyebrow={t.pricingEyebrow} title={t.pricingTitle} text={t.pricingText} />
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
              <p className="text-slate-400 text-sm tracking-[0.25em] font-bold mb-4">{t.setupLabel}</p>
              <div className="text-6xl font-black mb-6">$399.99</div>
              <div className="space-y-3 mb-8">
                {t.setupFeatures.map((f) => <div key={f} className="text-slate-300">✓ {f}</div>)}
              </div>
              <a href="#contact" className="block rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-center text-lg font-bold">{t.sendInquiry}</a>
            </div>
            <div className="rounded-[28px] border border-blue-400/30 bg-blue-500/10 p-8">
              <p className="text-slate-300 text-sm tracking-[0.25em] font-bold mb-4">{t.monthlyLabel}</p>
              <div className="text-6xl font-black mb-6">$199.99</div>
              <div className="space-y-3 mb-8">
                {t.monthlyFeatures.map((f) => <div key={f} className="text-slate-200">✓ {f}</div>)}
              </div>
              <a href="#contact" className="block rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-center text-lg font-bold">{t.sendInquiry}</a>
            </div>
          </div>
        </section>

        <section id="contact" className="max-w-7xl mx-auto px-6 py-20">
          <SectionTitle eyebrow={t.contactEyebrow} title={t.contactTitle} text={t.contactText} />
          <div className="rounded-[32px] border border-white/10 bg-white/5 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><div className="text-slate-400 text-sm mb-1">{t.emailLabel}</div><div className="font-bold">infoglobalbotsolutions.com</div></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><div className="text-slate-400 text-sm mb-1">{t.phoneLabel}</div><div className="font-bold">307-217-8616</div></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><div className="text-slate-400 text-sm mb-1">{t.offerLabel}</div><div className="font-bold">{t.offerValue}</div></div>
                </div>
              </div>
              <div className="p-10 space-y-5 bg-slate-950/30">
                <input className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 outline-none" placeholder={t.businessName} />
                <input className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 outline-none" placeholder={t.yourName} />
                <input className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 outline-none" placeholder={t.emailAddress} />
                <textarea className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 min-h-[150px] outline-none" placeholder={t.details} />
                <button className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-bold">{t.sendInquiry}</button>
              </div>
            </div>
          </div>
        </section>

        <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-300">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <span>{t.footer}</span>
          </div>
          <div className="flex gap-5 text-sm">
            <a href="#services">{t.nav[0]}</a>
            <a href="#pricing">{t.nav[3]}</a>
            <a href="#contact">{t.nav[4]}</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
