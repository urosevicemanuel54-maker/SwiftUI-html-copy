/* =========================================================================
   Liquid Glass Kit · plugin layer
   Auto-init, declarative data-attributes, theme + refraction switches.
   ========================================================================= */
(function () {
  const LG = window.LG;
  if (!LG) return;
  LG.version = '1.0.0';
  const root = document.documentElement;

  /* ---- data-lg-actions="Cancel:cancel|Delete:destructive" -> action list */
  const parseActions = (s, fallback) => (s ? s.split('|').map((p) => {
    const [label, style = 'default'] = p.split(':').map((x) => x.trim());
    return { label, style };
  }) : fallback);
  const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  const resolve = (sel) => { try { return sel ? document.querySelector(sel) : null; } catch { return null; } };
  const cloneContent = (src) => {
    if (!src) return document.createElement('div');
    const wrap = document.createElement('div');
    if (src.tagName === 'TEMPLATE') wrap.appendChild(src.content.cloneNode(true));
    else { const c = src.cloneNode(true); c.hidden = false; c.removeAttribute('id'); wrap.appendChild(c); }
    return wrap;
  };

  /* ---- declarative triggers (event delegation) ------------------------ */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-lg-alert],[data-lg-dialog],[data-lg-sheet],[data-lg-menu],[data-lg-toast]');
    if (!t || t.disabled) return;
    const d = t.dataset;

    if ('lgAlert' in d) {
      e.preventDefault();
      LG.alert({ origin: t, title: d.title || d.lgAlert || 'Alert', message: d.message || '', actions: parseActions(d.actions, [{ label: 'OK', style: 'primary' }]) })
        .then((r) => emit(t, 'lg:result', r));
    } else if ('lgDialog' in d) {
      e.preventDefault();
      LG.dialog({ origin: t, title: d.title || d.lgDialog || '', message: d.message || '', actions: parseActions(d.actions, [{ label: 'OK' }, { label: 'Cancel', style: 'cancel' }]) })
        .then((r) => emit(t, 'lg:result', r));
    } else if ('lgSheet' in d) {
      e.preventDefault();
      const s = LG.sheet({ origin: t, title: d.title || '', detent: d.detent || 'medium', toolbar: d.toolbar !== 'false', content: cloneContent(resolve(d.lgSheet)), onClose: () => emit(t, 'lg:close') });
      emit(t, 'lg:open', s);
    } else if ('lgMenu' in d) {
      e.preventDefault();
      const src = resolve(d.lgMenu); if (!src) return;
      const nodes = src.tagName === 'TEMPLATE' ? [...src.content.children] : [...src.children];
      const items = nodes.map((n) => {
        if (n.tagName === 'HR') return '-';
        if (n.tagName === 'HEADER') return { header: n.textContent.trim() };
        const label = n.textContent.trim(), value = n.getAttribute('value') ?? label;
        return { label, icon: n.dataset.lgIcon, style: n.dataset.role, action: () => emit(t, 'lg:select', { value, label }) };
      });
      LG.menu(t, items, { align: d.align || 'end' });
    } else if ('lgToast' in d) {
      LG.toast({ origin: t, text: d.lgToast || 'Done', iconName: d.toastIcon || 'check', tint: d.toastTint || 'var(--green)' });
    }
  });

  /* ---- theme: <html data-theme="light | dark | auto"> ------------------ */
  LG.setTheme = (mode) => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => (root.dataset.theme = mq.matches ? 'dark' : 'light');
    if (LG._themeMQ) LG._themeMQ.removeEventListener('change', apply), (LG._themeMQ = null);
    if (mode === 'auto') { apply(); mq.addEventListener('change', apply); LG._themeMQ = mq; }
    else root.dataset.theme = mode;
  };
  if (!root.dataset.theme || root.dataset.theme === 'auto') LG.setTheme('auto');

  /* ---- auto-init + watch for new markup -------------------------------- */
  const start = () => {
    if (root.hasAttribute('data-lg-manual')) return;
    LG.init(document);
    if (root.hasAttribute('data-lg-refraction')) LG.setLens(true);
    const pending = new Set(); let raf = 0;
    new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && n.tagName !== 'svg' && pending.add(n)));
      if (pending.size && !raf) raf = requestAnimationFrame(() => { raf = 0; pending.forEach((n) => n.isConnected && LG.init(n)); pending.clear(); });
    }).observe(document.body, { childList: true, subtree: true });
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
