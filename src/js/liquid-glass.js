/* =========================================================================
   Liquid Glass Kit · behaviour engine
   Vanilla JS. Exposes window.LG
   ========================================================================= */
(function () {
  const { icon, renderIcons } = window.LGIcons;
  const LG = (window.LG = { icon, renderIcons });
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const once = (el, key) => (el.dataset[key] ? false : (el.dataset[key] = '1'));
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  LG.h = h;

  /* ----------------------------------------------------------------------
     Refraction lens (Chromium): per-element SVG displacement map so the
     backdrop bends at the rim the way real glass does.
     ---------------------------------------------------------------------- */
  const ua = navigator.userAgent;
  LG.lensSupported = /Chrome|Chromium|Edg\//.test(ua) && !/CriOS|FxiOS|Firefox/.test(ua);
  let defs, lensId = 0;
  function ensureDefs() {
    if (defs) return defs;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
    svg.setAttribute('aria-hidden', 'true');
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs); document.body.appendChild(svg);
    return defs;
  }
  function lensMap(w, hgt, r, bezel) {
    const s = 0.5, cw = Math.max(2, Math.ceil(w * s)), ch = Math.max(2, Math.ceil(hgt * s));
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const ctx = c.getContext('2d'); const img = ctx.createImageData(cw, ch); const d = img.data;
    const hw = w / 2, hh = hgt / 2;
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        const px = (x + 0.5) / s - hw, py = (y + 0.5) / s - hh;
        const qx = Math.abs(px) - (hw - r), qy = Math.abs(py) - (hh - r);
        let sdf, nx, ny;
        if (qx > 0 && qy > 0) { const l = Math.hypot(qx, qy) || 1; sdf = l - r; nx = qx / l; ny = qy / l; }
        else if (qx > qy) { sdf = qx - r; nx = 1; ny = 0; }
        else { sdf = qy - r; nx = 0; ny = 1; }
        nx *= Math.sign(px) || 1; ny *= Math.sign(py) || 1;
        const inside = -sdf; const i = (y * cw + x) * 4;
        let m = 0;
        if (inside > 0 && inside < bezel) { const t = 1 - inside / bezel; m = t * t * (3 - 2 * t); }
        d[i] = 128 - nx * m * 127; d[i + 1] = 128 - ny * m * 127; d[i + 2] = 128; d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL();
  }
  function buildLens(el) {
    const w = Math.round(el.offsetWidth), hgt = Math.round(el.offsetHeight);
    if (w < 8 || hgt < 8) return;
    if (el._lensSize === w + 'x' + hgt) return;
    el._lensSize = w + 'x' + hgt;
    const cs = getComputedStyle(el);
    const r = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, w / 2, hgt / 2);
    const bezel = clamp(Math.min(w, hgt) * 0.32, 8, 28);
    const scale = +el.dataset.lens || clamp(Math.min(w, hgt) * 0.55, 14, 70);
    const NS = 'http://www.w3.org/2000/svg';
    let f = el._lensFilter;
    if (!f) {
      f = document.createElementNS(NS, 'filter');
      f.id = 'lg-lens-' + ++lensId;
      f.setAttribute('color-interpolation-filters', 'sRGB');
      f.setAttribute('filterUnits', 'userSpaceOnUse');
      f.innerHTML = '<feImage result="map" preserveAspectRatio="none"/><feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G"/>';
      ensureDefs().appendChild(f); el._lensFilter = f;
    }
    ['x', 'y'].forEach((a) => f.setAttribute(a, 0));
    f.setAttribute('width', w); f.setAttribute('height', hgt);
    const im = f.firstElementChild;
    im.setAttribute('href', lensMap(w, hgt, r, bezel));
    im.setAttribute('x', 0); im.setAttribute('y', 0); im.setAttribute('width', w); im.setAttribute('height', hgt);
    f.lastElementChild.setAttribute('scale', scale);
    el.style.setProperty('--lens', `url(#${f.id})`);
  }
  const lensRO = 'ResizeObserver' in window ? new ResizeObserver((entries) => {
    entries.forEach((e) => {
      const el = e.target; clearTimeout(el._lensT);
      el._lensT = setTimeout(() => LG.lensOn && buildLens(el), 140);
    });
  }) : null;
  LG.lensOn = false;
  LG.setLens = function (on) {
    LG.lensOn = !!on && LG.lensSupported;
    document.documentElement.classList.toggle('lens-on', LG.lensOn);
    document.querySelectorAll('[data-lens]').forEach((el) => {
      if (LG.lensOn) { el._lensSize = null; buildLens(el); lensRO && lensRO.observe(el); }
      else { el.style.removeProperty('--lens'); lensRO && lensRO.unobserve(el); }
    });
  };

  /* ---------------- interactive glass: light + squash ------------------- */
  function bindGlass(el) {
    if (!once(el, 'lgGlass')) return;
    const setL = (e) => { const r = el.getBoundingClientRect(); el.style.setProperty('--lx', e.clientX - r.left + 'px'); el.style.setProperty('--ly', e.clientY - r.top + 'px'); };
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') el.classList.add('lit'); setL(e); });
    el.addEventListener('pointermove', setL);
    el.addEventListener('pointerleave', () => el.classList.remove('lit', 'pressed'));
    el.addEventListener('pointerdown', (e) => { setL(e); el.classList.add('pressed'); });
    const up = () => el.classList.remove('pressed');
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  }

  /* ---------------- Toggle -------------------------------------------- */
  function bindToggle(el) {
    if (!once(el, 'lgInit')) return;
    el.setAttribute('role', 'switch');
    if (!el.hasAttribute('aria-checked')) el.setAttribute('aria-checked', 'false');
    if (!el.querySelector('.knob')) el.appendChild(h('<span class="knob"></span>'));
    let sx = 0, start = false, dragged = false, down = false;
    const set = (v, emit = true) => {
      const was = el.getAttribute('aria-checked') === 'true';
      el.setAttribute('aria-checked', v ? 'true' : 'false');
      if (emit && was !== v) el.dispatchEvent(new CustomEvent('change', { detail: v, bubbles: true }));
    };
    el.lgSet = set;
    el.addEventListener('pointerdown', (e) => {
      down = true; dragged = false; sx = e.clientX; start = el.getAttribute('aria-checked') === 'true';
      el.classList.add('pressing'); el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => {
      if (!down) return; const dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { dragged = true; set(start ? dx > -12 : dx > 12, false); }
    });
    const end = () => {
      if (!down) return; down = false; el.classList.remove('pressing');
      const now = el.getAttribute('aria-checked') === 'true';
      el._ptr = true;
      if (!dragged) set(!start);
      else if (now !== start) el.dispatchEvent(new CustomEvent('change', { detail: now, bubbles: true }));
    };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('click', (e) => { if (el._ptr) { el._ptr = false; return; } set(el.getAttribute('aria-checked') !== 'true'); });
  }

  /* ---------------- Slider -------------------------------------------- */
  function bindSlider(el) {
    if (!once(el, 'lgInit')) return;
    const min = +(el.dataset.min || 0), max = +(el.dataset.max || 1), step = +(el.dataset.step || 0);
    let v = +(el.dataset.value ?? (min + max) / 2);
    const vertical = el.classList.contains('vertical'), bar = el.classList.contains('bar');
    if (!el.querySelector('.track')) {
      el.insertAdjacentHTML('afterbegin', '<div class="track"><div class="fill"></div></div>' + (vertical ? '' : '<div class="thumb"></div>'));
      if (el.dataset.ticks) {
        const n = +el.dataset.ticks; el.insertAdjacentHTML('beforeend', '<div class="ticks">' + '<i></i>'.repeat(n) + '</div>');
      }
    }
    el.setAttribute('role', 'slider'); el.tabIndex = 0;
    el.setAttribute('aria-valuemin', min); el.setAttribute('aria-valuemax', max);
    if (vertical) el.setAttribute('aria-orientation', 'vertical');
    const set = (nv, emit = true) => {
      if (step) nv = Math.round((nv - min) / step) * step + min;
      v = clamp(nv, min, max);
      el.style.setProperty('--p', (v - min) / (max - min || 1));
      el.setAttribute('aria-valuenow', +v.toFixed(3)); el.dataset.value = v;
      if (emit) el.dispatchEvent(new CustomEvent('input', { detail: v, bubbles: true }));
    };
    el.lgSet = set; el.lgGet = () => v;
    set(v, false);
    const fromEvent = (e) => {
      const r = el.getBoundingClientRect();
      let p;
      if (vertical) p = 1 - (e.clientY - r.top) / r.height;
      else if (bar) p = (e.clientX - r.left) / r.width;
      else p = (e.clientX - r.left - 19) / (r.width - 38);
      set(min + clamp(p, 0, 1) * (max - min));
    };
    let down = false;
    el.addEventListener('pointerdown', (e) => { down = true; el.classList.add('dragging'); el.setPointerCapture(e.pointerId); fromEvent(e); });
    el.addEventListener('pointermove', (e) => down && fromEvent(e));
    const end = () => { if (!down) return; down = false; el.classList.remove('dragging'); el.dispatchEvent(new CustomEvent('change', { detail: v, bubbles: true })); };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('keydown', (e) => {
      const k = step || (max - min) / 20;
      if (['ArrowRight', 'ArrowUp'].includes(e.key)) { set(v + k); e.preventDefault(); }
      if (['ArrowLeft', 'ArrowDown'].includes(e.key)) { set(v - k); e.preventDefault(); }
    });
  }

  /* ---------------- Stepper ------------------------------------------- */
  function bindStepper(el) {
    if (!once(el, 'lgInit')) return;
    const min = +(el.dataset.min ?? 0), max = +(el.dataset.max ?? 10), step = +(el.dataset.step || 1);
    let v = +(el.dataset.value ?? min);
    el.innerHTML = `<button type="button" aria-label="Decrement">${icon('minus')}</button><span class="sep"></span><button type="button" aria-label="Increment">${icon('plus')}</button>`;
    const [dec, , inc] = el.children;
    const set = (nv) => {
      v = clamp(nv, min, max); el.dataset.value = v; dec.disabled = v <= min; inc.disabled = v >= max;
      el.dispatchEvent(new CustomEvent('change', { detail: v, bubbles: true }));
    };
    dec.onclick = () => set(v - step); inc.onclick = () => set(v + step);
    set(v);
  }

  /* -------- shared draggable selection lens (segmented + tab bar) ------- */
  function selectionLens(el, itemSel, thumbCls, onSelect) {
    const items = () => [...el.querySelectorAll(itemSel)];
    let thumb = el.querySelector('.' + thumbCls);
    if (!thumb) { thumb = h(`<span class="${thumbCls}" aria-hidden="true"></span>`); el.prepend(thumb); }
    let idx = Math.max(0, items().findIndex((b) => b.getAttribute('aria-selected') === 'true'));
    const place = (i, x) => {
      const b = items()[i]; if (!b) return;
      thumb.style.width = b.offsetWidth + 'px';
      thumb.style.transform = `translateX(${x ?? b.offsetLeft}px)`;
    };
    const select = (i, emit = true) => {
      idx = i; items().forEach((b, j) => b.setAttribute('aria-selected', j === i ? 'true' : 'false'));
      place(i); if (emit) onSelect && onSelect(i, items()[i]);
    };
    el.lgSelect = select;
    requestAnimationFrame(() => { thumb.style.transition = 'none'; place(idx); thumb.offsetWidth; thumb.style.transition = ''; });
    'ResizeObserver' in window && new ResizeObserver(() => place(idx)).observe(el);
    let down = false, sx = 0, dragging = false, startTarget = null;
    el.addEventListener('pointerdown', (e) => { down = true; dragging = false; sx = e.clientX; startTarget = e.target.closest(itemSel); });
    el.addEventListener('pointermove', (e) => {
      if (!down) return;
      if (!dragging && Math.abs(e.clientX - sx) > 6) { dragging = true; el.classList.add('dragging'); el.setPointerCapture(e.pointerId); }
      if (dragging) {
        const r = el.getBoundingClientRect(); const w = thumb.offsetWidth;
        const x = clamp(e.clientX - r.left - w / 2, 2, r.width - w - 2);
        thumb.style.transform = `translateX(${x}px)`;
        const c = x + w / 2; let best = 0, bd = 1e9;
        items().forEach((b, j) => { const d = Math.abs(b.offsetLeft + b.offsetWidth / 2 - c); if (d < bd) { bd = d; best = j; } });
        items().forEach((b, j) => b.classList.toggle('hover', j === best));
        el._best = best;
      }
    });
    const end = () => {
      if (!down) return; down = false;
      if (dragging) { el.classList.remove('dragging'); items().forEach((b) => b.classList.remove('hover')); select(el._best ?? idx); }
      else if (startTarget) select(items().indexOf(startTarget));
    };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') select(Math.min(items().length - 1, idx + 1));
      if (e.key === 'ArrowLeft') select(Math.max(0, idx - 1));
    });
    return { select, place: () => place(idx) };
  }
  function bindSegmented(el) {
    if (!once(el, 'lgInit')) return;
    el.setAttribute('role', 'tablist');
    [...el.querySelectorAll('button')].forEach((b) => { b.type = 'button'; b.setAttribute('role', 'tab'); });
    selectionLens(el, 'button', 'thumb', (i, b) => el.dispatchEvent(new CustomEvent('change', { detail: { index: i, value: b.dataset.value ?? b.textContent.trim() }, bubbles: true })));
  }
  function bindTabbar(el) {
    if (!once(el, 'lgInit')) return;
    el.setAttribute('role', 'tablist');
    el.lgLens = selectionLens(el, '.tab', 'lens', (i, b) => el.dispatchEvent(new CustomEvent('change', { detail: { index: i, value: b.dataset.tab }, bubbles: true })));
  }

  /* ---------------- Morph container ------------------------------------ */
  function bindMorph(el) {
    if (!once(el, 'lgInit')) return;
    const main = el.querySelector('.m-main'); const n = el.querySelectorAll('.m-item').length;
    main.addEventListener('click', () => {
      const open = el.classList.toggle('open');
      el.style.setProperty('--w', open ? 52 + n * 46 + 8 + 'px' : '52px');
      main.setAttribute('aria-expanded', open);
    });
  }

  /* ---------------- Disclosure ---------------------------------------- */
  function bindDisclosure(el) {
    if (!once(el, 'lgInit')) return;
    const row = el.querySelector('.lg-row');
    row.setAttribute('role', 'button'); row.tabIndex = 0;
    const t = () => { const o = el.classList.toggle('open'); row.setAttribute('aria-expanded', o); };
    row.addEventListener('click', t);
    row.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), t()));
  }

  /* ---------------- Swipe actions ------------------------------------- */
  function bindSwipe(el) {
    if (!once(el, 'lgInit')) return;
    const row = el.querySelector('.lg-row'), acts = el.querySelector('.actions');
    let sx = 0, sy = 0, base = 0, x = 0, down = false, horiz = null;
    const W = () => acts.offsetWidth;
    const setX = (v) => { x = v; row.style.transform = `translateX(${v}px)`; };
    el.addEventListener('pointerdown', (e) => { if (e.target.closest('.actions')) return; down = true; horiz = null; sx = e.clientX; sy = e.clientY; base = x; });
    el.addEventListener('pointermove', (e) => {
      if (!down) return; const dx = e.clientX - sx, dy = e.clientY - sy;
      if (horiz === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) { horiz = Math.abs(dx) > Math.abs(dy); if (horiz) { el.classList.add('dragging'); el.setPointerCapture(e.pointerId); } }
      if (!horiz) return;
      let nx = base + dx; if (nx > 0) nx = nx * 0.2;
      setX(nx);
    });
    const end = () => {
      if (!down) return; down = false; el.classList.remove('dragging');
      if (!horiz) { if (x) setX(0); return; }
      if (-x > el.offsetWidth * 0.62) { acts.querySelector('button')?.click(); return; }
      setX(-x > W() / 2 ? -W() : 0);
    };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.lgClose = () => setX(0);
  }
  LG.removeRow = (el) => {
    el.style.transition = 'height .4s var(--spring), opacity .3s'; el.style.height = el.offsetHeight + 'px';
    requestAnimationFrame(() => { el.style.height = '0px'; el.style.opacity = '0'; });
    setTimeout(() => el.remove(), 420);
  };

  /* ---------------- Spinner / Gauge / Pages --------------------------- */
  function bindSpinner(el) {
    if (!once(el, 'lgInit')) return;
    el.setAttribute('role', 'progressbar');
    el.innerHTML = Array.from({ length: 8 }, (_, i) => `<i style="transform:rotate(${i * 45}deg);animation-delay:${(i - 8) / 8}s"></i>`).join('');
  }
  let gid = 0;
  function bindGauge(el) {
    if (!once(el, 'lgInit')) return;
    const v = clamp(+(el.dataset.value || 0), 0, 1), size = +(el.dataset.size || 64), sw = +(el.dataset.stroke || 6);
    const r = size / 2 - sw / 2, C = 2 * Math.PI * r, arc = C * 0.75; const id = 'lgg' + ++gid;
    const c1 = el.dataset.from || 'var(--green)', c2 = el.dataset.to || 'var(--blue)';
    el.style.width = el.style.height = size + 'px';
    el.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 ${size} ${size}"><defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <circle class="g-track" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${arc} ${C}" transform="rotate(135 ${size / 2} ${size / 2})"/>
      <circle class="g-val" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${arc} ${C}" stroke-dashoffset="${arc}" transform="rotate(135 ${size / 2} ${size / 2})"/></svg>`);
    const val = el.querySelector('.g-val');
    el.lgSet = (nv) => { val.style.strokeDashoffset = arc * (1 - clamp(nv, 0, 1)); };
    requestAnimationFrame(() => requestAnimationFrame(() => el.lgSet(v)));
  }
  function bindPages(el) {
    if (!once(el, 'lgInit')) return;
    const n = +(el.dataset.count || 5); let i = +(el.dataset.index || 0);
    el.innerHTML = '<i></i>'.repeat(n);
    const set = (k) => { i = (k + n) % n; [...el.children].forEach((d, j) => d.classList.toggle('on', j === i)); el.dispatchEvent(new CustomEvent('change', { detail: i, bubbles: true })); };
    [...el.children].forEach((d, j) => d.addEventListener('click', () => set(j)));
    el.lgSet = set; set(i);
  }

  /* ---------------- Overlays ------------------------------------------ */
  function hostFor(origin) {
    const hst = origin && origin.closest && origin.closest('[data-overlay-host]');
    if (hst) return hst;
    let f = document.querySelector('.lg-host-fixed');
    if (!f) { f = h('<div class="lg-host-fixed"></div>'); document.body.appendChild(f); }
    return f;
  }
  LG.hostFor = hostFor;
  function dismiss(nodes, ms = 260) { nodes.forEach((n) => n && n.classList.add('out')); setTimeout(() => nodes.forEach((n) => n && n.remove()), ms); }
  const btnClass = (style) => ({ cancel: 'lg-btn gray', destructive: 'lg-btn filled destructive', primary: 'lg-btn filled', default: 'lg-btn gray' }[style || 'default']);

  LG.alert = function ({ title, message = '', actions = [{ label: 'OK', style: 'primary' }], origin } = {}) {
    return new Promise((res) => {
      const host = hostFor(origin);
      const scrim = h('<div class="lg-scrim"></div>');
      const a = h(`<div class="lg-alert lg-glass" role="alertdialog" aria-modal="true"><h3></h3><p></p><div class="acts ${actions.length > 2 ? 'stack' : ''}"></div></div>`);
      a.querySelector('h3').textContent = title; a.querySelector('p').textContent = message;
      if (!message) a.querySelector('p').remove();
      actions.forEach((act) => {
        const b = h(`<button type="button" class="${btnClass(act.style)}"></button>`); b.textContent = act.label;
        b.onclick = () => { dismiss([scrim, a], 220); res(act.label); act.action && act.action(); };
        a.querySelector('.acts').appendChild(b);
      });
      host.append(scrim, a); a.querySelector('button:last-child').focus({ preventScroll: true });
    });
  };

  LG.dialog = function ({ title, message, actions = [], origin } = {}) {
    return new Promise((res) => {
      const host = hostFor(origin);
      const scrim = h('<div class="lg-scrim"></div>');
      const d = h('<div class="lg-dialog lg-glass" role="dialog" aria-modal="true"><div class="d-title"><b></b><span></span></div></div>');
      d.querySelector('b').textContent = title || ''; d.querySelector('span').textContent = message || '';
      const close = (v) => { dismiss([scrim, d], 260); res(v); };
      actions.forEach((act) => {
        const b = h(`<button type="button" class="${act.style === 'cancel' ? 'lg-btn gray' : act.style === 'destructive' ? 'lg-btn gray' : 'lg-btn gray'}"></button>`);
        b.textContent = act.label;
        if (act.style === 'destructive') b.style.color = 'var(--red)';
        if (act.style === 'cancel') b.style.fontWeight = '600';
        b.onclick = () => { close(act.label); act.action && act.action(); };
        d.appendChild(b);
      });
      scrim.onclick = () => close(null);
      host.append(scrim, d);
    });
  };

  LG.sheet = function ({ title = '', content = '', detent = 'medium', origin, onClose, toolbar = true } = {}) {
    const host = hostFor(origin);
    const scrim = h('<div class="lg-scrim"></div>');
    const s = h(`<div class="lg-sheet lg-glass" role="dialog" aria-modal="true"><div class="grabber"></div>
      ${toolbar ? `<div class="s-head"><button type="button" class="lg-btn icon lg-glass interactive" aria-label="Close" data-close>${icon('xmark')}</button><h3></h3><button type="button" class="lg-btn icon lg-glass tinted interactive" aria-label="Done" data-close>${icon('check')}</button></div>` : ''}
      <div class="s-body"></div></div>`);
    if (toolbar) s.querySelector('h3').textContent = title;
    const body = s.querySelector('.s-body');
    if (typeof content === 'string') body.innerHTML = content; else body.appendChild(content);
    const H = { medium: '52%', large: 'calc(100% - 54px)' };
    const setDetent = (dt) => { s.style.removeProperty('height'); s.style.setProperty('--h', H[dt]); s.classList.toggle('large', dt === 'large'); s.dataset.detent = dt; };
    setDetent(detent);
    const close = () => { dismiss([scrim, s], 300); onClose && onClose(); };
    scrim.onclick = close;
    s.querySelectorAll('[data-close]').forEach((b) => (b.onclick = close));
    // drag between detents
    let sy = 0, sh = 0, down = false;
    s.querySelectorAll('.grabber, .s-head').forEach((g) => {
      g.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; down = true; sy = e.clientY; sh = s.offsetHeight; s.classList.add('dragging'); g.setPointerCapture(e.pointerId); });
      g.addEventListener('pointermove', (e) => { if (!down) return; const nh = sh - (e.clientY - sy); s.style.height = Math.max(80, nh) + 'px'; });
      const end = (e) => {
        if (!down) return; down = false; s.classList.remove('dragging');
        const hh = host.clientHeight, nh = s.offsetHeight;
        if (nh < hh * 0.3) close(); else setDetent(nh > hh * 0.7 ? 'large' : 'medium');
      };
      g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
    });
    s.querySelector('.grabber').addEventListener('dblclick', () => setDetent(s.dataset.detent === 'large' ? 'medium' : 'large'));
    host.append(scrim, s);
    LG.init(s);
    return { el: s, body, close, setDetent };
  };

  LG.menu = function (trigger, items, { align = 'end' } = {}) {
    const host = hostFor(trigger);
    document.querySelectorAll('.lg-menu').forEach((m) => m._close && m._close());
    const scrim = h('<div class="lg-scrim clear"></div>');
    const m = h('<div class="lg-menu lg-glass" role="menu"></div>');
    items.forEach((it) => {
      if (it === '-') return m.appendChild(h('<hr>'));
      if (it.header) { const x = h('<div class="mh"></div>'); x.textContent = it.header; return m.appendChild(x); }
      const b = h(`<button type="button" class="mi ${it.style === 'destructive' ? 'destructive' : ''}" role="menuitem"><span></span>${it.icon ? icon(it.icon) : ''}</button>`);
      b.querySelector('span').textContent = it.label;
      b.onclick = () => { close(); it.action && it.action(); };
      m.appendChild(b);
    });
    host.append(scrim, m);
    const hr = host.getBoundingClientRect(), tr = trigger.getBoundingClientRect();
    const isFixed = host.classList.contains('lg-host-fixed');
    const ox = isFixed ? 0 : hr.left, oy = isFixed ? 0 : hr.top;
    const W = m.offsetWidth, Hh = m.offsetHeight, hostW = isFixed ? innerWidth : hr.width, hostH = isFixed ? innerHeight : hr.height;
    let left = align === 'start' ? tr.left - ox : tr.right - ox - W;
    left = clamp(left, 8, hostW - W - 8);
    let top = tr.bottom - oy + 8; let up = false;
    if (top + Hh > hostH - 8) { top = tr.top - oy - Hh - 8; up = true; }
    top = clamp(top, 8, hostH - Hh - 8);
    m.style.left = left + 'px'; m.style.top = top + 'px';
    m.style.setProperty('--ox', tr.left + tr.width / 2 - ox - left + 'px');
    m.style.setProperty('--oy', up ? '100%' : '0%');
    const onScroll = (e) => { if (!m.contains(e.target)) close(); };
    const sT = setTimeout(() => addEventListener('scroll', onScroll, { capture: true, passive: true }), 120);
    function close() { clearTimeout(sT); removeEventListener('scroll', onScroll, { capture: true }); document.removeEventListener('keydown', esc); dismiss([scrim, m], 220); }
    const esc = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', esc);
    scrim.addEventListener('pointerdown', close);
    m._close = close;
    m.querySelector('.mi')?.focus({ preventScroll: true });
    return { close };
  };

  LG.toast = function ({ text, iconName = 'check', tint = 'var(--green)', origin, duration = 2200 } = {}) {
    const host = hostFor(origin);
    host.querySelectorAll('.lg-toast').forEach((t) => t.remove());
    const t = h(`<div class="lg-toast lg-glass" role="status"><span class="lg-sq round" style="--c:${tint}">${icon(iconName)}</span><span></span></div>`);
    t.lastElementChild.textContent = text; host.appendChild(t);
    setTimeout(() => dismiss([t], 300), duration);
  };

  LG.longPress = function (el, cb, ms = 420) {
    let t, sx, sy, fired = false;
    el.addEventListener('pointerdown', (e) => { fired = false; sx = e.clientX; sy = e.clientY; t = setTimeout(() => { fired = true; el.classList.add('lg-lifted'); cb(e); setTimeout(() => el.classList.remove('lg-lifted'), 400); }, ms); });
    el.addEventListener('pointermove', (e) => { if (Math.hypot(e.clientX - sx, e.clientY - sy) > 8) clearTimeout(t); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((n) => el.addEventListener(n, () => clearTimeout(t)));
    el.addEventListener('click', (e) => { if (fired) { e.stopPropagation(); e.preventDefault(); fired = false; } }, true);
    el.addEventListener('contextmenu', (e) => { e.preventDefault(); if (!fired) cb(e); });
  };

  /* ---------------- init ---------------------------------------------- */
  LG.init = function (root = document) {
    renderIcons(root);
    const q = (s) => (root.matches && root.matches(s) ? [root] : []).concat([...root.querySelectorAll(s)]);
    q('.lg-glass.interactive').forEach(bindGlass);
    q('.lg-toggle').forEach(bindToggle);
    q('.lg-slider').forEach(bindSlider);
    q('.lg-stepper').forEach(bindStepper);
    q('.lg-seg').forEach(bindSegmented);
    q('.lg-tabbar').forEach(bindTabbar);
    q('.lg-morph').forEach(bindMorph);
    q('.lg-disclosure').forEach(bindDisclosure);
    q('.lg-swipe').forEach(bindSwipe);
    q('.lg-spinner').forEach(bindSpinner);
    q('.lg-gauge').forEach(bindGauge);
    q('.lg-pages').forEach(bindPages);
    if (LG.lensOn) q('[data-lens]').forEach((el) => { buildLens(el); lensRO && lensRO.observe(el); });
  };
})();
