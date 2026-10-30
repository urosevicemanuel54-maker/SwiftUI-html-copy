/* Liquid Glass Kit · tiny SF Symbols-style icon set (24px grid, stroke 2) */
(function () {
  const F = 'fill="currentColor" stroke="none"';
  const fwd = `<path ${F} d="M3 6.2v11.6a.8.8 0 0 0 1.2.7L12 13.4v4.4a.8.8 0 0 0 1.2.7l8.7-5.8a.8.8 0 0 0 0-1.4L13.2 5.5a.8.8 0 0 0-1.2.7v4.4L4.2 5.5A.8.8 0 0 0 3 6.2z"/>`;
  const heart = 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z';
  const ICONS = {
    house: `<path ${F} d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>`,
    grid: `<rect ${F} x="3" y="3" width="7.6" height="7.6" rx="2"/><rect ${F} x="13.4" y="3" width="7.6" height="7.6" rx="2"/><rect ${F} x="3" y="13.4" width="7.6" height="7.6" rx="2"/><rect ${F} x="13.4" y="13.4" width="7.6" height="7.6" rx="2"/>`,
    radio: `<circle ${F} cx="12" cy="12" r="2.5"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>`,
    music: `<path d="M9 18V5l11-2v13"/><circle ${F} cx="6" cy="18" r="3"/><circle ${F} cx="17" cy="16" r="3"/>`,
    library: `<rect x="3" y="4" width="4" height="16" rx="1"/><rect x="9" y="4" width="4" height="16" rx="1"/><path d="m15 5.5 3.6-1 3.6 14.6-3.6 1z"/>`,
    search: `<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/>`,
    person: `<circle cx="12" cy="8" r="4"/><path d="M4 20.5c1.5-4 4.5-6 8-6s6.5 2 8 6"/>`,
    gear: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>`,
    bell: `<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>`,
    heart: `<path d="${heart}"/>`,
    'heart-fill': `<path ${F} d="${heart}"/>`,
    plus: `<path d="M12 5v14M5 12h14"/>`,
    minus: `<path d="M5 12h14"/>`,
    'chevron-right': `<path d="m9 6 6 6-6 6"/>`,
    'chevron-left': `<path d="m15 6-6 6 6 6"/>`,
    'chevron-down': `<path d="m6 9 6 6 6-6"/>`,
    xmark: `<path d="M18 6 6 18M6 6l12 12"/>`,
    ellipsis: `<circle ${F} cx="5" cy="12" r="1.8"/><circle ${F} cx="12" cy="12" r="1.8"/><circle ${F} cx="19" cy="12" r="1.8"/>`,
    share: `<path d="M12 3v12M8 7l4-4 4 4"/><path d="M7 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1"/>`,
    trash: `<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>`,
    star: `<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>`,
    'star-fill': `<path ${F} d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>`,
    wifi: `<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle ${F} cx="12" cy="19.5" r="1.2"/>`,
    bluetooth: `<path d="m7 7 10 10-5 4V3l5 4L7 17"/>`,
    airplane: `<path ${F} d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>`,
    antenna: `<rect ${F} x="3" y="15" width="3.2" height="5" rx="1"/><rect ${F} x="8.3" y="11" width="3.2" height="9" rx="1"/><rect ${F} x="13.6" y="7" width="3.2" height="13" rx="1"/><rect ${F} x="18.9" y="3" width="3.2" height="17" rx="1" opacity=".35"/>`,
    moon: `<path ${F} d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>`,
    sun: `<circle ${F} cx="12" cy="12" r="4.5"/><path d="M12 1.5v2M12 20.5v2M4.6 4.6 6 6M18 18l1.4 1.4M1.5 12h2M20.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>`,
    play: `<path ${F} d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5z"/>`,
    pause: `<rect ${F} x="5.5" y="4" width="4.5" height="16" rx="1.3"/><rect ${F} x="14" y="4" width="4.5" height="16" rx="1.3"/>`,
    forward: fwd,
    backward: `<g transform="matrix(-1 0 0 1 24 0)">${fwd}</g>`,
    camera: `<path d="M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>`,
    photo: `<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m21 16-5-5-9 9"/>`,
    sparkles: `<path ${F} d="M11 2.5l2 5.6 5.5 2-5.5 2-2 5.6-2-5.6-5.5-2 5.5-2z"/><path ${F} d="M19 14.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/>`,
    check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
    bolt: `<path ${F} d="M13 2 4 14h7l-1 8 9-12h-7z"/>`,
    flame: `<path ${F} d="M12 22c4 0 7-2.7 7-6.8 0-3.6-2.4-6.3-4.3-8.4-.4 2-1.5 3.4-3 3.9.5-3.3-.9-6.5-3.4-8.7C8.3 6.2 5 9.3 5 15.2 5 19.3 8 22 12 22z"/>`,
    location: `<path ${F} d="M3 11 21 3l-8 18-2-8z"/>`,
    lock: `<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>`,
    mic: `<rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/>`,
    info: `<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle ${F} cx="12" cy="7.8" r="1.1"/>`,
    speaker: `<path ${F} d="M3.5 9.5H7L11.5 5.5v13L7 14.5H3.5z"/><path d="M15 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>`,
    'speaker-low': `<path ${F} d="M5.5 9.5H9L13.5 5.5v13L9 14.5H5.5z"/><path d="M17 9.5a3.5 3.5 0 0 1 0 5"/>`,
    shuffle: `<path d="M16 4h4v4M4 20 20 4M20 16v4h-4M15 15l5 5M4 4l5 5"/>`,
    repeat: `<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>`,
    list: `<path d="M9 6h11M9 12h11M9 18h11"/><circle ${F} cx="4.5" cy="6" r="1.3"/><circle ${F} cx="4.5" cy="12" r="1.3"/><circle ${F} cx="4.5" cy="18" r="1.3"/>`,
    compose: `<path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M18.4 2.6a2 2 0 0 1 2.9 2.9L12 14.8l-3.8.9.9-3.8z"/>`,
    download: `<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>`,
    bookmark: `<path d="M6 3h12v18l-6-4.5L6 21z"/>`,
    flashlight: `<path d="M7 2h10v4l-2 4v11a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V10L7 6z"/><path d="M12 13v3"/>`,
    timer: `<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M10 2h4"/>`,
    calculator: `<rect x="5" y="2.5" width="14" height="19" rx="3"/><path d="M8.5 7h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>`,
    rotation: `<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/><rect ${F} x="9.5" y="9.5" width="5" height="4" rx="1"/>`,
    mirror: `<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>`,
    hand: `<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/>`,
    globe: `<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>`,
    drop: `<path d="M12 2.5S5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.5 12 2.5z"/>`,
    eye: `<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
    message: `<path ${F} d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 5 3.7 6.5L5 21.5l4-2c1 .3 2 .5 3 .5 5.5 0 10-3.8 10-8.5S17.5 3 12 3z"/>`,
    calendar: `<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>`,
    cloud: `<path ${F} d="M7 19a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 9.5 4.8 4.8 0 0 1 18 19z"/>`,
    figure: `<circle ${F} cx="13" cy="4" r="2"/><path d="m7 22 3-7 3 3v4M10 15l-1-5 4-2 3 3 3 1M9 10l-3 2"/>`,
    paintbrush: `<path d="M18.4 2.6a2 2 0 0 1 2.9 2.9l-8.6 8.6-2.9-2.9z"/><path d="M9.2 12.3c-2 0-3.7 1.4-3.7 3.5 0 1.8-1.5 3-2.5 3.2 1.2 1.5 3 2 4.6 2a4.4 4.4 0 0 0 4.4-4.4c0-.6-.1-1.1-.3-1.6"/>`,
    'square-stack': `<rect x="7" y="7" width="14" height="14" rx="3"/><path d="M4 16V6a3 3 0 0 1 3-3h10"/>`,
    'arrow-up': `<path d="M12 20V4M5.5 10.5 12 4l6.5 6.5"/>`,
  };
  function icon(name, cls = '') {
    const body = ICONS[name] || ICONS.sparkles;
    return `<svg class="lg-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  function renderIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach((el) => {
      if (el.dataset.iconDone === el.dataset.icon) return;
      el.innerHTML = icon(el.dataset.icon);
      el.dataset.iconDone = el.dataset.icon;
    });
  }
  window.LGIcons = { icon, renderIcons, names: Object.keys(ICONS) };
})();
