// Portfolio entries. Add real client projects here once the client has approved publishing.
//
// Fields:
//   id          unique slug
//   type        "concept" (sample project, fictional business) or "client" (real, authorized work)
//   name        project / business name (concepts must be fictional)
//   industry    key from form.industries in the content files
//   categories  any of: website, chatbot, booking, automation, bilingual
//   services    keys from the services catalog
//   summary     { en, es }
//   url         live link — ONLY for client projects with permission
//   image       optional screenshot path (e.g. "/img/portfolio/acme-desktop.webp");
//               when omitted, a generated preview mockup is drawn from `theme`
//   theme       colors used for the generated preview mockup
//
export const portfolio = [
  {
    id: "harbor-dental",
    type: "concept",
    name: "Harbor Point Dental",
    industry: "dental",
    categories: ["website", "chatbot", "booking", "bilingual"],
    services: ["website-design", "ai-chatbots", "online-booking"],
    summary: {
      en: "A calm, bilingual practice website with a new-patient chat assistant and an appointment request flow.",
      es: "Un sitio bilingüe y tranquilo para un consultorio, con asistente de chat para pacientes nuevos y solicitudes de cita.",
    },
    theme: { bg: "#EEF6F8", ink: "#0F3B4C", accent: "#1F8FA8", block: "#CFE6EC" },
  },
  {
    id: "fade-district",
    type: "concept",
    name: "Fade District Barbers",
    industry: "barbershop",
    categories: ["website", "booking"],
    services: ["website-design", "online-booking", "nfc-review-cards"],
    summary: {
      en: "A bold barbershop site with a style gallery, online booking by barber and review cards at every chair.",
      es: "Un sitio llamativo para barbería con galería de estilos, reservas por barbero y tarjetas de reseñas en cada silla.",
    },
    theme: { bg: "#151515", ink: "#F3F3F3", accent: "#E0B04A", block: "#2A2A2A" },
  },
  {
    id: "turnpike-auto",
    type: "concept",
    name: "Turnpike Auto Care",
    industry: "auto-repair",
    categories: ["website", "automation", "bilingual"],
    services: ["website-design", "ai-receptionist", "business-automation"],
    summary: {
      en: "Service pages with quote requests routed by job type, plus an AI receptionist for calls while the team is in the bay.",
      es: "Páginas de servicios con cotizaciones canalizadas por tipo de trabajo y recepcionista con IA para cuando el equipo está ocupado.",
    },
    theme: { bg: "#F4F5F7", ink: "#1B2430", accent: "#D9442B", block: "#DCE0E6" },
  },
  {
    id: "mesa-azul",
    type: "concept",
    name: "Mesa Azul Cocina",
    industry: "restaurant",
    categories: ["website", "chatbot", "bilingual"],
    services: ["website-design", "ai-chatbots"],
    summary: {
      en: "A menu-first restaurant site in English and Spanish with a chat assistant for hours, reservations and catering.",
      es: "Un sitio de restaurante centrado en el menú, en inglés y español, con asistente de chat para horarios, reservaciones y catering.",
    },
    theme: { bg: "#FBF4EC", ink: "#2C1C12", accent: "#1E5BB8", block: "#F0E0CC" },
  },
  {
    id: "coastline-shuttle",
    type: "concept",
    name: "Coastline Shuttle Co.",
    industry: "transportation",
    categories: ["website", "chatbot", "automation"],
    services: ["website-design", "ai-chatbots", "business-automation"],
    summary: {
      en: "Trip request forms, a chatbot for routes and availability, and inquiries routed straight to dispatch.",
      es: "Formularios de solicitud de viaje, chatbot para rutas y disponibilidad, y consultas canalizadas directo a despacho.",
    },
    theme: { bg: "#EFF4FF", ink: "#0B1F4A", accent: "#2563EB", block: "#D6E2FB" },
  },
  {
    id: "polar-air",
    type: "concept",
    name: "Polar Air HVAC",
    industry: "hvac",
    categories: ["website", "booking", "automation"],
    services: ["website-design", "online-booking", "ai-receptionist"],
    summary: {
      en: "Service-area pages, estimate booking and after-hours call capture for urgent requests.",
      es: "Páginas por zona de servicio, agenda de presupuestos y atención de llamadas urgentes fuera de horario.",
    },
    theme: { bg: "#F1FAFB", ink: "#0B2E35", accent: "#0E9AA7", block: "#D3EEF1" },
  },
];
