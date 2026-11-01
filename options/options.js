(async function () {
  const I = window.SS_I18N;
  const DEFAULTS = {
    enabled: true, display: 'blur', mode: 'leaks', coverSearch: true, lang: 'auto',
    keywords: ["GTA 6", "GTA6", "GTA-6", "GTA VI", "Grand Theft Auto 6", "Grand Theft Auto VI", "Leonida"],
    whitelist: []
  };
  const form = document.getElementById('settingsForm');
  const keywordsEl = document.getElementById('keywords');
  const whitelistEl = document.getElementById('whitelist');
  const coverEl = document.getElementById('coverSearch');
  const lines = el => el.value.split('\n').map(s => s.trim()).filter(Boolean);
  const val = name => {
    const r = form.querySelector(`input[name="${name}"]:checked`);
    return r ? r.value : DEFAULTS[name === 'language' ? 'lang' : name];
  };
  const setRadio = (name, value) => {
    const r = form.querySelector(`input[name="${name}"][value="${value}"]`)
           || form.querySelector(`input[name="${name}"]`);
    r.checked = true;
  };

  async function load() {
    let saved = {};
    try { saved = (await browser.storage.local.get('settings')).settings || {}; } catch (_) {}
    const s = { ...DEFAULTS, ...saved };
    setRadio('language', s.lang);
    setRadio('display', s.display);
    setRadio('mode', s.mode);
    coverEl.checked = !!s.coverSearch;
    keywordsEl.value = (Array.isArray(s.keywords) ? s.keywords : DEFAULTS.keywords).join('\n');
    whitelistEl.value = (Array.isArray(s.whitelist) ? s.whitelist : []).join('\n');
    I.set(s.lang); I.apply(document);
  }

  function current() {
    return {
      lang: val('language'),
      display: val('display'),
      mode: val('mode'),
      coverSearch: coverEl.checked,
      keywords: lines(keywordsEl),
      whitelist: lines(whitelistEl)
    };
  }

  async function save(partial) {
    const old = (await browser.storage.local.get('settings')).settings || {};
    await browser.storage.local.set({ settings: { ...DEFAULTS, ...old, ...partial } });
  }

  // Sprache sofort umschalten
  form.querySelectorAll('input[name="language"]').forEach(r =>
    r.addEventListener('change', () => { I.set(val('language')); I.apply(document); }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    await save(current());
    alert(I.t('msg_saved'));
  });

  document.getElementById('export').onclick = () => {
    const blob = new Blob([JSON.stringify({ settings: current() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'spoilershield-settings.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = document.getElementById('importFile');
  document.getElementById('import').onclick = () => importFile.click();
  importFile.onchange = async () => {
    try {
      const obj = JSON.parse(await importFile.files[0].text());
      await save(obj.settings || {});
      await load();
      alert(I.t('msg_import_ok'));
    } catch (_) { alert(I.t('msg_import_bad')); }
    importFile.value = '';
  };

  await load();
})();
