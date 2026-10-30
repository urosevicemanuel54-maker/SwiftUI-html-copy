/* =========================================================================
   Liquid Glass Kit · demo wiring (showcase page + iPhone "Music" app)
   ========================================================================= */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const { icon, h } = LG;

  /* ---------- content -------------------------------------------------- */
  const ALBUMS = [
    { t: 'Golden Hour', a: 'Sienna Vale', g: 'GH', bg: 'radial-gradient(circle at 70% 25%, #ffe29a 0 14%, transparent 42%), linear-gradient(160deg, #ff9a3c, #ff3d6e 60%, #7b1fa2)', len: 206 },
    { t: 'Blue Static', a: 'The Northern Lines', g: 'BS', bg: 'radial-gradient(circle at 25% 70%, #7cf3ff 0 12%, transparent 45%), linear-gradient(200deg, #1e3cff, #00b4d8 70%)', len: 241 },
    { t: 'Paper Moons', a: 'Juno Park', g: 'PM', bg: 'radial-gradient(circle at 50% 40%, #fff 0 9%, transparent 10%), linear-gradient(180deg, #2b2d6e, #8a4fff 70%, #ff8acb)', len: 188 },
    { t: 'Velvet Engine', a: 'Kairo', g: 'VE', bg: 'conic-gradient(from 210deg at 40% 60%, #ff1f5a, #ffb703, #ff1f5a)', len: 224 },
    { t: 'Evergreen', a: 'Lumen & Ash', g: 'EV', bg: 'radial-gradient(circle at 80% 80%, #d9ff7a 0 12%, transparent 45%), linear-gradient(140deg, #0f5132, #20c997)', len: 199 },
    { t: 'Neon Psalms', a: 'Midnight Choir', g: 'NP', bg: 'repeating-linear-gradient(135deg, #12002e 0 18px, #3a0ca3 18px 36px), linear-gradient(#000,#000)', len: 263 },
    { t: 'Salt & Sun', a: 'Marisol', g: 'SS', bg: 'radial-gradient(circle at 30% 30%, #fff3b0 0 18%, transparent 19%), linear-gradient(180deg, #48cae4, #fdf0d5 75%)', len: 177 },
    { t: 'Afterimage', a: 'Oslo Drift', g: 'AI', bg: 'linear-gradient(90deg, #ff006e 0 33%, #8338ec 33% 66%, #3a86ff 66%)', len: 232 },
  ];
  const art = (al, cls = 'art') => `<span class="${cls}" data-glyph="${al.g}" style="background:${al.bg}"></span>`;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const phone = $('#phone');
  $('#picks').innerHTML = ALBUMS.slice(0, 5).map((al, i) => `
    <div class="pick" data-album="${i}">${art(al)}<span class="kicker">${['Featuring', 'New Release', 'Because you liked Kairo', 'Station', 'Up Next'][i]}</span>
      <div class="meta"><b>${al.t}</b><small>${al.a}</small></div>
      <button class="lg-btn icon small lg-glass interactive play-pill" aria-label="Play ${al.t}" data-play="${i}">${icon('play')}</button></div>`).join('');
  const tile = (al, i) => `<div class="tile" data-album="${i}"><div class="sqr">${art(al)}</div><b>${al.t}</b><small>${al.a}</small></div>`;
  $('#recent').innerHTML = ALBUMS.slice(4, 8).map((al, i) => tile(al, i + 4)).join('');
  $('#made').innerHTML = ALBUMS.slice(0, 4).reverse().map((al) => tile(al, ALBUMS.indexOf(al))).join('');

  const songRow = (al, i, swipe = true) => {
    const row = `<div class="lg-row song link" data-album="${i}"><span class="thumb-art" style="background:${al.bg}"></span><span class="grow"><span class="title">${al.t}</span><span class="sub">${al.a}</span></span><i class="more" data-icon="ellipsis"></i></div>`;
    return swipe ? `<div class="lg-swipe"><div class="actions"><button style="background:var(--orange)" data-pin aria-label="Pin">${icon('star-fill')}</button><button style="background:var(--red)" data-del aria-label="Delete">${icon('trash')}</button></div>${row}</div>` : row;
  };
  $('#songs').innerHTML = ALBUMS.map((al, i) => songRow(al, i)).join('');

  const CATS = [['Pop', '#ff2d55', 'star-fill'], ['Hip-Hop', '#ff8d28', 'flame'], ['Chill', '#00c3d0', 'cloud'], ['Rock', '#6155f5', 'bolt'], ['Focus', '#34c759', 'drop'], ['Workout', '#cb30e0', 'figure'], ['Jazz', '#ac7f5e', 'music'], ['Sleep', '#0088ff', 'moon']];
  $('#cats').innerHTML = CATS.map(([n, c, ic]) => `<div class="cat" style="background:linear-gradient(140deg, ${c}, color-mix(in srgb, ${c} 55%, #000))">${n}${icon(ic)}</div>`).join('');
  $('#ccArt').style.background = ALBUMS[0].bg; $('#ccArt').style.borderRadius = '10px';

  LG.init(document);

  /* ---------- page chrome ----------------------------------------------- */
  const root = document.documentElement;
  const themeBtn = $('#themeBtn');
  const setTheme = (t) => { root.dataset.theme = t; themeBtn.innerHTML = icon(t === 'dark' ? 'sun' : 'moon'); localStorage.setItem('lg-theme', t); };
  setTheme(localStorage.getItem('lg-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');

  const WPS = [['Tahoe', 'wp-tahoe'], ['Sequoia', 'wp-sequoia'], ['Ember', 'wp-ember'], ['Graphite', 'wp-mono']];
  $('#wpBtn').onclick = (e) => LG.menu(e.currentTarget, [{ header: 'Wallpaper' }, ...WPS.map(([n, c]) => ({
    label: n, icon: document.body.classList.contains(c) ? 'check' : null,
    action: () => { WPS.forEach(([, k]) => document.body.classList.remove(k)); document.body.classList.add(c); },
  }))]);

  const lensT = $('#lensToggle');
  if (!LG.lensSupported) { lensT.disabled = true; lensT.title = 'Refraction needs a Chromium browser'; }
  lensT.addEventListener('change', (e) => LG.setLens(e.detail));
  if (LG.lensSupported) { lensT.lgSet(true, false); LG.setLens(true); }

  /* ---------- gallery demos -------------------------------------------- */
  $('#guests').addEventListener('change', (e) => ($('#guestVal').textContent = e.detail));
  $('#scrub').addEventListener('input', (e) => ($('#scrubA').textContent = fmt(e.detail * 206)));
  $$('[data-cc]').forEach((b) => b.addEventListener('click', () => b.classList.toggle('on')));
  let ccPlaying = false;
  $('#ccPlay').onclick = () => { ccPlaying = !ccPlaying; $('#ccPlay').innerHTML = icon(ccPlaying ? 'pause' : 'play'); };
  let p = 0.2; setInterval(() => { p = p >= 1 ? 0 : p + 0.08; $('#prog').style.setProperty('--p', p); }, 900);
  const tick = () => { const d = new Date(); $('#lockTime').textContent = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/i, ''); $('#lockDate').textContent = d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }); };
  tick(); setInterval(tick, 15000);

  $$('.stage .lg-swipe [data-del]').forEach((b) => (b.onclick = () => { LG.toast({ text: 'Deleted', iconName: 'trash', tint: 'var(--red)' }); b.closest('.lg-swipe').lgClose(); }));

  $('#menuBtn').onclick = (e) => LG.menu(e.currentTarget, [
    { label: 'Copy', icon: 'square-stack' }, { label: 'Share…', icon: 'share' }, { label: 'Favorite', icon: 'heart' }, '-',
    { label: 'Delete', icon: 'trash', style: 'destructive', action: () => LG.toast({ text: 'Moved to Trash', iconName: 'trash', tint: 'var(--red)' }) },
  ], { align: 'start' });
  $('#alertBtn').onclick = () => LG.alert({ title: 'Allow “Liquid Glass” to use your location?', message: 'Your location is used to tint the glass with the colour of the sky outside.', actions: [{ label: 'Don’t Allow', style: 'cancel' }, { label: 'Allow', style: 'primary' }] });
  $('#dialogBtn').onclick = () => LG.dialog({ title: 'Delete 3 photos?', message: 'These photos will be deleted from all your devices.', actions: [{ label: 'Delete Photos', style: 'destructive', action: () => LG.toast({ text: '3 photos deleted', iconName: 'trash', tint: 'var(--red)' }) }, { label: 'Cancel', style: 'cancel' }] });
  $('#sheetBtn').onclick = () => LG.sheet({ title: 'New Event', content: eventForm(), detent: 'medium' });
  $('#toastBtn').onclick = () => LG.toast({ text: 'Saved to Library', iconName: 'check' });

  function eventForm() {
    return h(`<div class="lg-form" style="padding-top:6px">
      <div class="lg-section"><div class="lg-group"><div class="lg-row"><input class="lg-field" style="background:transparent;padding:0" placeholder="Title" aria-label="Title"></div><div class="lg-row"><input class="lg-field" style="background:transparent;padding:0" placeholder="Location or Video Call" aria-label="Location"></div></div></div>
      <div class="lg-section"><div class="lg-group">
        <div class="lg-row"><span class="grow">All-day</span><button class="lg-toggle" aria-label="All-day"></button></div>
        <div class="lg-row"><span class="grow">Starts</span><span class="lg-btn mini gray">Oct 30, 2026</span><span class="lg-btn mini gray">6:00 PM</span></div>
        <div class="lg-row"><span class="grow">Ends</span><span class="lg-btn mini gray">7:30 PM</span></div></div></div>
      <div class="lg-section"><div class="lg-group"><div class="lg-row" style="flex-direction:column;align-items:stretch;gap:10px;padding:14px 20px"><span>Alert</span><div class="lg-seg"><button>None</button><button aria-selected="true">15 min</button><button>1 hr</button></div></div></div><footer>Drag the grabber up for the large detent.</footer></div>
    </div>`);
  }

  /* ---------- iPhone app: tabs, scroll, search -------------------------- */
  const bar = $('#bottomBar'), tabbar = $('#tabbar');
  const views = Object.fromEntries($$('.view', phone).map((v) => [v.dataset.view, v]));
  const titles = { home: 'Home', library: 'Library', settings: 'Settings', search: 'Search' };
  let current = 'home', lastTab = 'home';
  function show(name) {
    current = name; Object.entries(views).forEach(([k, v]) => v.classList.toggle('active', k === name));
    $('#inlineTitle').textContent = titles[name];
    phone.classList.toggle('scrolled', views[name].scrollTop > 40);
    bar.classList.remove('min');
  }
  tabbar.addEventListener('change', (e) => {
    const name = e.detail.value;
    if (bar.classList.contains('searching')) exitSearch();
    lastTab = name; show(name);
  });
  const searchTab = $('#searchTab'), input = $('#searchInput');
  function enterSearch() { bar.classList.add('searching'); bar.classList.remove('min'); show('search'); setTimeout(() => input.focus({ preventScroll: true }), 350); }
  function exitSearch() { bar.classList.remove('searching'); input.value = ''; runSearch(''); input.blur(); }
  searchTab.addEventListener('click', () => { if (!bar.classList.contains('searching')) enterSearch(); });
  tabbar.addEventListener('click', (e) => {
    if (bar.classList.contains('searching')) { exitSearch(); show(lastTab); }
    else if (bar.classList.contains('min')) bar.classList.remove('min');
  });
  function runSearch(q) {
    q = q.trim().toLowerCase();
    $('#searchBrowse').hidden = !!q; $('#results').hidden = !q;
    if (!q) return;
    const hits = ALBUMS.map((al, i) => [al, i]).filter(([al]) => (al.t + ' ' + al.a).toLowerCase().includes(q));
    $('#resultList').innerHTML = hits.length ? hits.map(([al, i]) => songRow(al, i, false)).join('') : `<div class="empty">No results for “${q.replace(/[<>&]/g, '')}”</div>`;
    LG.renderIcons($('#resultList'));
  }
  input.addEventListener('input', () => runSearch(input.value));

  Object.values(views).forEach((v) => {
    let last = 0;
    v.addEventListener('scroll', () => {
      const y = v.scrollTop; phone.classList.toggle('scrolled', y > 40);
      if (!bar.classList.contains('searching')) {
        if (y > last + 6 && y > 90) bar.classList.add('min');
        else if (y < last - 6 || y < 40) bar.classList.remove('min');
      }
      last = y;
    }, { passive: true });
  });

  /* ---------- player ---------------------------------------------------- */
  const P = { i: null, playing: false, t: 0 };
  const accPlay = $('#accPlay'), island = $('#island');
  let npEl = null;
  function render() {
    const al = ALBUMS[P.i];
    accPlay.innerHTML = icon(P.playing ? 'pause' : 'play');
    island.classList.toggle('playing', P.playing);
    if (!al) return;
    $('#accArt').style.background = al.bg;
    $('#accTxt').innerHTML = `${al.t}<small>${al.a}</small>`;
    $('#islandArt').style.background = al.bg;
    island.classList.add('live');
    $('#accProg').parentElement.style.setProperty('--p', P.t / al.len);
    if (npEl) {
      npEl.querySelector('[data-pp]').innerHTML = icon(P.playing ? 'pause' : 'play');
      npEl.classList.toggle('paused', !P.playing);
      const s = npEl.querySelector('.lg-slider.bar'); if (!s.classList.contains('dragging')) s.lgSet(P.t / al.len, false);
      npEl.querySelector('[data-ta]').textContent = fmt(P.t); npEl.querySelector('[data-tb]').textContent = '-' + fmt(al.len - P.t);
    }
  }
  function play(i, autoplay = true) {
    if (P.i !== i) { P.i = i; P.t = 0; }
    P.playing = autoplay; render();
  }
  function next(d = 1) { play(((P.i ?? -1) + d + ALBUMS.length) % ALBUMS.length, true); if (npEl) refreshNP(); }
  setInterval(() => { if (!P.playing || P.i == null) return; P.t += 1; if (P.t >= ALBUMS[P.i].len) return next(); render(); }, 1000);

  accPlay.addEventListener('click', (e) => { e.stopPropagation(); if (P.i == null) play(0); else { P.playing = !P.playing; render(); } });
  $('#accNext').addEventListener('click', (e) => { e.stopPropagation(); next(); });
  $('#accessory').addEventListener('click', () => { if (P.i == null) play(0, false); openNP(); });
  $('#heroPlay').onclick = () => { play(0); $('.device').scrollIntoView({ behavior: 'smooth', block: 'center' }); };

  function npMarkup(al) {
    return `<div class="np ${P.playing ? '' : 'paused'}">
      <div class="np-art">${art(al)}</div>
      <div class="np-meta"><span class="t"><b>${al.t}</b><small>${al.a}</small></span>
        <button class="lg-btn icon small lg-glass interactive" data-fav aria-label="Favorite">${icon('star')}</button>
        <button class="lg-btn icon small lg-glass interactive" data-npmore aria-label="More">${icon('ellipsis')}</button></div>
      <div style="margin-top:22px"><div class="lg-slider bar" data-value="0" aria-label="Playback position"></div><div class="times"><span data-ta>0:00</span><span data-tb>-0:00</span></div></div>
      <div class="controls"><button class="sm" data-prev aria-label="Previous">${icon('backward')}</button><button class="big" data-pp aria-label="Play/Pause">${icon('play')}</button><button class="sm" data-next aria-label="Next">${icon('forward')}</button></div>
      <div class="vol">${icon('speaker-low')}<div class="lg-slider bar" data-value=".7" aria-label="Volume"></div>${icon('speaker')}</div>
      <div class="extras">${icon('message')}${icon('mirror')}${icon('list')}</div></div>`;
  }
  function refreshNP() {
    if (!npEl) return; const al = ALBUMS[P.i];
    const wrap = npEl.parentElement; wrap.innerHTML = npMarkup(al); npEl = wrap.firstElementChild;
    wrap.closest('.lg-sheet').style.background = `linear-gradient(180deg, color-mix(in srgb, ${al.bg.match(/#[0-9a-f]{6}/gi).slice(-2)[0]} 85%, #000), #111 85%)`;
    bindNP(); LG.init(npEl); render();
  }
  function bindNP() {
    npEl.querySelector('[data-pp]').onclick = () => { P.playing = !P.playing; render(); };
    npEl.querySelector('[data-next]').onclick = () => next(1);
    npEl.querySelector('[data-prev]').onclick = () => (P.t > 3 ? ((P.t = 0), render()) : next(-1));
    npEl.querySelector('[data-fav]').onclick = (e) => { e.currentTarget.innerHTML = icon('star-fill'); LG.toast({ text: 'Added to Favorites', iconName: 'star-fill', tint: 'var(--pink)', origin: phone }); };
    npEl.querySelector('[data-npmore]').onclick = (e) => LG.menu(e.currentTarget, [{ label: 'Play Next', icon: 'list' }, { label: 'Add to Library', icon: 'plus' }, { label: 'Share Song…', icon: 'share' }, '-', { label: 'Suggest Less', icon: 'minus' }]);
    const scrub = npEl.querySelector('.lg-slider.bar');
    scrub.addEventListener('input', (e) => { P.t = Math.round(e.detail * ALBUMS[P.i].len); npEl.querySelector('[data-ta]').textContent = fmt(P.t); });
  }
  function openNP() {
    const sheet = LG.sheet({ origin: phone, detent: 'large', toolbar: false, content: h('<div style="height:100%"></div>'), onClose: () => (npEl = null) });
    sheet.body.innerHTML = '<div></div>'; npEl = sheet.body.firstElementChild;
    sheet.el.style.color = '#fff';
    refreshNP();
  }

  /* album taps + long press context menu */
  phone.addEventListener('click', (e) => {
    const pp = e.target.closest('[data-play]'); if (pp) { e.stopPropagation(); play(+pp.dataset.play); LG.toast({ text: 'Now playing', iconName: 'play', tint: 'var(--pink)', origin: phone }); return; }
    const a = e.target.closest('[data-album]'); if (!a || e.target.closest('.actions')) return;
    play(+a.dataset.album); openNP();
  });
  $$('.pick, .tile', phone).forEach((el) => LG.longPress(el, () => {
    const al = ALBUMS[+el.dataset.album];
    LG.menu(el, [{ header: `${al.t} · ${al.a}` }, { label: 'Play Next', icon: 'list', action: () => LG.toast({ text: 'Playing next', iconName: 'list', origin: phone }) }, { label: 'Add to Library', icon: 'plus' }, { label: 'Favorite', icon: 'star' }, { label: 'Share Album…', icon: 'share' }, '-', { label: 'Remove', icon: 'trash', style: 'destructive' }], { align: 'start' });
  }));

  /* library swipe actions */
  $('#songs').addEventListener('click', (e) => {
    const del = e.target.closest('[data-del]'), pin = e.target.closest('[data-pin]');
    if (del) { LG.removeRow(del.closest('.lg-swipe')); LG.toast({ text: 'Removed from Library', iconName: 'trash', tint: 'var(--red)', origin: phone }); const b = $('.lg-badge', tabbar); if (b) { const n = +b.textContent - 1; n > 0 ? (b.textContent = n) : b.remove(); } }
    if (pin) { pin.closest('.lg-swipe').lgClose(); LG.toast({ text: 'Pinned', iconName: 'star-fill', tint: 'var(--orange)', origin: phone }); }
  });

  /* toolbar */
  $('#moreBtn').onclick = (e) => LG.menu(e.currentTarget, [{ label: 'Edit Pins', icon: 'compose' }, { label: 'Shuffle All', icon: 'shuffle', action: () => play(Math.floor(Math.random() * ALBUMS.length)) }, { label: 'Repeat', icon: 'repeat' }, '-', { label: root.dataset.theme === 'dark' ? 'Light Appearance' : 'Dark Appearance', icon: root.dataset.theme === 'dark' ? 'sun' : 'moon', action: () => themeBtn.click() }]);
  const account = () => LG.sheet({ origin: phone, title: 'Account', detent: 'medium', content: h(`<div class="lg-form"><div class="lg-section"><div class="lg-group">
      <div class="lg-row"><div class="profile-card grow"><span class="avatar">EU</span><span><span class="title" style="font-weight:600">Emanuel U.</span><span class="sub">urosevicemanuel54@gmail.com</span></span></div></div></div></div>
      <div class="lg-section"><div class="lg-group icons">
        <div class="lg-row link"><span class="lg-sq" style="--c:var(--pink)"><i data-icon="bell"></i></span><span class="grow">Notifications</span><i class="chev" data-icon="chevron-right"></i></div>
        <div class="lg-row"><span class="lg-sq" style="--c:var(--purple)"><i data-icon="sparkles"></i></span><span class="grow">Share Listening</span><button class="lg-toggle" aria-checked="true" style="--tint:var(--purple)" aria-label="Share Listening"></button></div>
        <div class="lg-row link"><span class="lg-sq" style="--c:var(--gray)"><i data-icon="gear"></i></span><span class="grow">Settings</span><i class="chev" data-icon="chevron-right"></i></div></div></div></div>`) });
  $('#avatarBtn').onclick = account; $('#profileRow').onclick = account;
  $('#signOutRow').onclick = () => LG.alert({ origin: phone, title: 'Sign out of Apple Account?', message: 'Downloaded music will be removed from this iPhone.', actions: [{ label: 'Cancel', style: 'cancel' }, { label: 'Sign Out', style: 'destructive' }] });
  $('#resetRow').onclick = () => LG.dialog({ origin: phone, title: 'Reset Library', message: 'This removes all songs, playlists and pins.', actions: [{ label: 'Reset Library', style: 'destructive', action: () => LG.toast({ text: 'Library reset', iconName: 'check', origin: phone }) }, { label: 'Cancel', style: 'cancel' }] });
  $('#xf').addEventListener('change', (e) => ($('#xfVal').textContent = e.detail + ' s'));
  $('#airplane').addEventListener('change', (e) => { $('#wifiVal').textContent = e.detail ? 'Off' : 'Studio 5G'; LG.toast({ origin: phone, text: e.detail ? 'Airplane Mode On' : 'Airplane Mode Off', iconName: 'airplane', tint: 'var(--orange)' }); });

  render();
})();

/* ---------- Install block ----------------------------------------------- */
(function () {
  const pre = document.getElementById('installCode'); if (!pre) return;
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const SNIP = {
    cdn: `<!-- Liquid Glass Kit -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR-GITHUB-NAME/liquid-glass-kit@1.0.0/dist/liquid-glass.min.css">
<script src="https://cdn.jsdelivr.net/gh/YOUR-GITHUB-NAME/liquid-glass-kit@1.0.0/dist/liquid-glass.min.js" defer><\/script>

<button class="lg-btn lg-glass interactive">Glass button</button>
<button class="lg-toggle" aria-label="Wi-Fi"></button>
<button class="lg-btn lg-glass tinted interactive" data-lg-sheet="#mySheet">Open sheet</button>`,
    npm: `npm install liquid-glass-kit

// in your app entry
import "liquid-glass-kit/dist/liquid-glass.css";
import "liquid-glass-kit";            // registers window.LG + auto-init

LG.alert({ title: "Saved", actions: [{ label: "OK", style: "primary" }] });`,
  };
  const paint = (k) => {
    pre.dataset.k = k;
    const O = (c) => '\u0001' + c + '\u0002', C = '\u0003';
    let s = esc(SNIP[k])
      .replace(/("[^"\n]*")/g, O('s') + '$1' + C)
      .replace(/ ([\w-]+)=/g, ' ' + O('a') + '$1' + C + '=')
      .replace(/(&lt;\/?)(\w+)/g, '$1' + O('t') + '$2' + C)
      .replace(/(&lt;!--.*?-->)/g, O('c') + '$1' + C)
      .replace(/(^|\s)(\/\/.*$)/gm, '$1' + O('c') + '$2' + C);
    pre.innerHTML = s.replace(/\u0001(\w)\u0002/g, '<span class="$1">').replace(/\u0003/g, '</span>');
  };
  paint('cdn');
  document.querySelector('.install-seg').addEventListener('change', (e) => paint(e.detail.value));
  document.getElementById('copyBtn').addEventListener('click', async () => {
    const text = SNIP[pre.dataset.k];
    try { await navigator.clipboard.writeText(text); }
    catch { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('copy'); s.removeAllRanges(); }
    LG.toast({ text: 'Copied', iconName: 'check' });
  });
  document.querySelector('[data-lg-menu="#installMenu"]').addEventListener('lg:select', (e) => LG.toast({ text: `Picked “${e.detail.label}”`, iconName: 'check' }));
})();
