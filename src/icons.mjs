// Inline stroke icons (24x24). Decorative by default (aria-hidden).
const p = {
  website: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><circle cx="6.5" cy="6.5" r=".6" fill="currentColor"/><circle cx="9" cy="6.5" r=".6" fill="currentColor"/><path d="M7 13h6M7 16h10"/>',
  voice: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/><path d="M15 3a6 6 0 0 1 6 6M15 7a2 2 0 0 1 2 2"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9.5h8M8 12.5h5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
  support: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19a3 3 0 0 1-3 3h-3"/>',
  nfc: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M19 8.5a5 5 0 0 1 0 7M21.5 6a9 9 0 0 1 0 12"/><path d="M7 12h5"/>',
  maintenance: '<path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5L16 12l-4-4 2.5-2.5Z"/>',
  automation: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M6 8l5 8.3M18 8l-5 8.3"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  play: '<path d="M8 5v14l11-7L8 5Z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>',
  restart: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  star: '<path d="m12 4 2.4 5 5.4.7-4 3.7 1 5.4L12 16.3 7.2 18.8l1-5.4-4-3.7 5.4-.7L12 4Z"/>',
  // industries
  restaurant: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1-3 4-3 7h3v11"/>',
  barber: '<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="M8.5 8.5 20 18M8.5 15.5 20 6"/>',
  salon: '<path d="M8 3c3 0 5 2.5 5 6s-2 5-2 8M8 3C5 3 4 6 4 8s1 3 1 5M13 9h7M14 13h5M15 17h3"/>',
  dental: '<path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7 .5 3 1 6.5 2.5 6.5s1.5-3.5 2.5-5.5c.5-1 1.5-1 2 0 1 2 1 5.5 2.5 5.5S17.5 17.5 18 14.5c.5-2.5 2-4 2-7C20 5 18.5 3 16 3c-1.7 0-2.6 1-4 1S8.7 3 7 3Z"/>',
  auto: '<path d="M5 16h14M6.5 16v2.5M17.5 16v2.5M4 16l1.5-6A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 16"/><circle cx="8" cy="13" r=".8" fill="currentColor"/><circle cx="16" cy="13" r=".8" fill="currentColor"/>',
  transport: '<rect x="3" y="5" width="18" height="11" rx="2"/><path d="M3 11h18"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/>',
  laundry: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4.5"/><path d="M7 6.5h2"/>',
  hvac: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5 4.2 16.5"/><path d="m9.5 4.5 2.5 2 2.5-2M9.5 19.5l2.5-2 2.5 2"/>',
  home: '<path d="M4 11 12 4l8 7v9H4v-9Z"/><path d="M10 20v-5h4v5"/>',
};

export function icon(name, cls = "icon") {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${p[name] || ""}</svg>`;
}
