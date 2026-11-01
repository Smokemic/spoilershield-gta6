(() => {
  'use strict';
  const T = (k, v) => window.SS_I18N.t(k, v);

  const DEFAULTS = {
    enabled: true, mode: 'leaks', display: 'blur', coverSearch: true, lang: 'auto',
    keywords: ["GTA 6", "GTA6", "GTA-6", "GTA VI", "Grand Theft Auto 6", "Grand Theft Auto VI", "Leonida"],
    whitelist: []
  };
  const CONTAINER = [
    'article', '[role="article"]', 'li',
    'ytd-rich-item-renderer', 'ytd-video-renderer', 'ytd-compact-video-renderer',
    'ytd-grid-video-renderer', 'ytd-comment-thread-renderer',
    'shreddit-post', 'shreddit-comment', 'div.g'
  ].join(',');
  const HEADINGS = 'h1,h2,h3';
  const MAX_TEXT = 4000;

  let settings = { ...DEFAULTS };
  const pending = new Set();
  let timer = null;

  // ---------- Hilfsfunktionen ----------
  function isWhitelisted() {
    const host = location.hostname;
    return (settings.whitelist || []).some(p => {
      p = String(p).trim();
      if (!p) return false;
      if (host === p || host.endsWith('.' + p)) return true;
      try { return new RegExp(p, 'i').test(host); } catch (_) { return false; }
    });
  }
  const active = () => settings.enabled && !isWhitelisted();

  function textOf(el) {
    const t = el.textContent || '';
    if (t.length > MAX_TEXT) return null;
    let alts = '';
    el.querySelectorAll('img[alt]').forEach(i => { alts += ' ' + i.alt; });
    return t + alts;
  }

  function resolveHeading(h) {
    const c = h.closest(CONTAINER);
    return (c && (c.textContent || '').length <= MAX_TEXT) ? c : h;
  }

  // ---------- Element-Abdeckung ----------
  function stripMark(el) {
    el.classList.remove('ss-blurred', 'ss-hidden', 'ss-rel');
    el.querySelectorAll(':scope > .ss-overlay').forEach(o => o.remove());
    el.removeAttribute('data-ss-state');
  }

  function reveal(el) {
    stripMark(el);
    el.setAttribute('data-ss-state', 'revealed');
  }

  function mark(el) {
    if (settings.display === 'hide') {
      el.setAttribute('data-ss-state', 'hide');
      el.classList.add('ss-hidden');
      return;
    }
    el.setAttribute('data-ss-state', 'blur');
    if (getComputedStyle(el).position === 'static') el.classList.add('ss-rel');
    el.classList.add('ss-blurred');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ss-overlay';
    b.dataset.label = T('overlay');
    b.setAttribute('aria-label', T('overlay'));
    b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); reveal(el); });
    el.appendChild(b);
  }

  function clearAll() {
    document.querySelectorAll('[data-ss-state]').forEach(stripMark);
  }

  function process(el) {
    if (el.hasAttribute('data-ss-state')) return;
    const anc = el.parentElement && el.parentElement.closest('[data-ss-state]');
    if (anc) return;
    const text = textOf(el);
    if (text && matchText(text, settings)) mark(el);
  }

  function recheckMarked() {
    document.querySelectorAll('[data-ss-state="blur"],[data-ss-state="hide"]').forEach(el => {
      const text = textOf(el);
      if (!text || !matchText(text, settings)) stripMark(el);
    });
  }

  function scan(root) {
    const set = new Set();
    if (root.closest) {
      const up = root.closest(CONTAINER); if (up) set.add(up);
      const h = root.closest(HEADINGS);   if (h) set.add(resolveHeading(h));
      if (root.matches(CONTAINER)) set.add(root);
      if (root.matches(HEADINGS)) set.add(resolveHeading(root));
    }
    root.querySelectorAll(CONTAINER).forEach(e => set.add(e));
    root.querySelectorAll(HEADINGS).forEach(h => set.add(resolveHeading(h)));
    [...set]
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1)
      .forEach(process);
  }

  // ---------- Ganzseiten-Abdeckung (Adresse enthält GTA-6-Begriff) ----------
  let coverEl = null;
  let revealedHref = null;
  let lastHref = location.href;

  function urlHit() {
    try {
      const u = new URL(location.href);
      const parts = [];
      try { parts.push(decodeURIComponent(u.pathname)); } catch (_) { parts.push(u.pathname); }
      u.searchParams.forEach(v => parts.push(v));
      const text = parts.join(' | ').replace(/[_+/]/g, ' ');
      return [text, text.replace(/-/g, ' ')].some(v => matchText(v, settings));
    } catch (_) { return false; }
  }

  function pauseMedia() {
    document.querySelectorAll('video,audio').forEach(m => { try { m.pause(); } catch (_) {} });
  }

  function showCover() {
    if (coverEl) return;
    coverEl = document.createElement('div');
    coverEl.className = 'ss-cover';
    coverEl.setAttribute('role', 'dialog');
    coverEl.setAttribute('aria-label', T('cover_title'));
    const h = document.createElement('h2'); h.textContent = T('cover_title');
    const p = document.createElement('p');  p.textContent = T('cover_text');
    const b = document.createElement('button'); b.type = 'button'; b.textContent = T('cover_show');
    b.addEventListener('click', () => { revealedHref = location.href; hideCover(); });
    coverEl.append(h, p, b);
    document.documentElement.appendChild(coverEl);
    document.documentElement.classList.add('ss-lock');
    pauseMedia();
    b.focus();
  }

  function hideCover() {
    if (coverEl) { coverEl.remove(); coverEl = null; }
    document.documentElement.classList.remove('ss-lock');
  }

  function updateCover() {
    const need = active() && settings.coverSearch && revealedHref !== location.href && urlHit();
    if (need) showCover(); else hideCover();
  }

  // ---------- Observer ----------
  function flush() {
    timer = null;
    if (!active()) { pending.clear(); return; }
    recheckMarked();
    const roots = [...pending]; pending.clear();
    roots.forEach(r => { if (r.isConnected) scan(r); });
    if (coverEl) pauseMedia();
  }
  function schedule() {
    if (timer) return;
    timer = setTimeout(() => {
      if (window.requestIdleCallback) requestIdleCallback(flush, { timeout: 1000 });
      else flush();
    }, 250);
  }

  const observer = new MutationObserver(muts => {
    if (!active()) return;
    for (const m of muts) {
      if (m.type === 'characterData') {
        if (m.target.parentElement) pending.add(m.target.parentElement);
        continue;
      }
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1) {
          if (!n.classList.contains('ss-overlay') && !n.classList.contains('ss-cover')) pending.add(n);
        } else if (n.nodeType === 3 && m.target.nodeType === 1) pending.add(m.target);
      });
    }
    if (pending.size) schedule();
  });

  function fullScan() {
    clearAll();
    if (active() && document.body) scan(document.body);
  }

  // ---------- Start ----------
  async function init() {
    try {
      const res = await browser.storage.local.get('settings');
      settings = { ...DEFAULTS, ...(res.settings || {}) };
    } catch (_) {}
    window.SS_I18N.set(settings.lang);
    updateCover();

    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (active() && document.body) scan(document.body);
      });
    } else fullScan();

    // Medien bei aktiver Abdeckung stoppen
    document.addEventListener('play', e => {
      if (coverEl && e.target && e.target.pause) e.target.pause();
    }, true);

    // SPA-Navigation (Reddit, YouTube ...): Adresse beobachten
    setInterval(() => {
      if (location.href !== lastHref) { lastHref = location.href; updateCover(); }
    }, 500);
  }

  browser.storage.onChanged.addListener(changes => {
    if (changes.settings) {
      settings = { ...DEFAULTS, ...(changes.settings.newValue || {}) };
      window.SS_I18N.set(settings.lang);
      hideCover();
      updateCover();
      fullScan();
    }
  });

  browser.runtime.onMessage.addListener(msg => {
    if (msg && msg.action === 'getSpoilerCount') {
      const n = document.querySelectorAll('[data-ss-state="blur"],[data-ss-state="hide"]').length;
      return Promise.resolve({ count: n });
    }
  });

  init();
})();
