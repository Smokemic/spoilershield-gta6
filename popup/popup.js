(function () {
  const I = window.SS_I18N;

  async function getSpoilerCount() {
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      const res = await browser.tabs.sendMessage(tab.id, { action: 'getSpoilerCount' });
      return res && res.count ? res.count : 0;
    } catch (_) { return 0; }
  }

  async function render() {
    const res = await browser.storage.local.get('settings');
    const s = res.settings || {};
    I.set(s.lang || 'auto');
    I.apply(document);
    document.getElementById('toggle').textContent = (s.enabled ?? true) ? I.t('popup_on') : I.t('popup_off');
    document.getElementById('mode').textContent =
      I.t('popup_mode') + ': ' + (s.mode === 'alles' ? I.t('mode_all') : I.t('mode_leaks'));
    const count = await getSpoilerCount();
    document.getElementById('counter').textContent = I.t('popup_count', { n: count });
  }

  function renderLater() { render(); setTimeout(render, 500); }

  document.getElementById('toggle').onclick = async () => {
    const s = await browser.storage.local.get('settings');
    const enabled = !(s.settings?.enabled ?? true);
    await browser.storage.local.set({ settings: { ...(s.settings || {}), enabled } });
    renderLater();
  };

  document.getElementById('mode').onclick = async () => {
    const s = await browser.storage.local.get('settings');
    const mode = (s.settings?.mode ?? 'leaks') === 'leaks' ? 'alles' : 'leaks';
    await browser.storage.local.set({ settings: { ...(s.settings || {}), mode } });
    renderLater();
  };

  document.getElementById('options').onclick = () => browser.runtime.openOptionsPage();

  render();
})();
