// Einfache Übersetzung DE/EN. Sprache wählbar über settings.lang ('auto' | 'de' | 'en').
(function () {
  const STR = {
    de: {
      overlay: 'Mögliche GTA-6-Spoiler – klicken zum Anzeigen',
      cover_title: 'Spoilerschutz aktiv',
      cover_text: 'Diese Seite hat einen GTA-6-Bezug und könnte Leaks oder Spoiler enthalten.',
      cover_show: 'Trotzdem anzeigen',
      popup_on: 'Schutz: EIN', popup_off: 'Schutz: AUS',
      popup_mode: 'Modus', mode_leaks: 'Leaks', mode_all: 'Alles',
      popup_count: '{n} Elemente ausgeblendet', popup_settings: 'Einstellungen',
      opt_title: 'SpoilerShield – Einstellungen',
      opt_display: 'Darstellung', opt_blur: 'Unscharf mit Overlay', opt_hide: 'Komplett ausblenden',
      opt_mode: 'Modus', opt_leaks: 'Nur Leaks und Spoiler', opt_all: 'Alles zu GTA 6',
      opt_keywords: 'Keywords (eins pro Zeile)',
      opt_whitelist: 'Whitelist: Domains ohne Filter (eine pro Zeile)',
      opt_cover: 'Seiten mit GTA-6-Bezug in der Adresse (z. B. Suche, Subreddit) komplett abdecken',
      opt_lang: 'Sprache', lang_auto: 'Automatisch (Browser)',
      opt_save: 'Speichern', opt_export: 'Export JSON', opt_import: 'Import JSON',
      msg_saved: 'Einstellungen gespeichert.', msg_import_ok: 'Import erfolgreich.',
      msg_import_bad: 'Ungültige JSON-Datei.'
    },
    en: {
      overlay: 'Possible GTA 6 spoilers – click to show',
      cover_title: 'Spoiler protection active',
      cover_text: 'This page is related to GTA 6 and may contain leaks or spoilers.',
      cover_show: 'Show anyway',
      popup_on: 'Protection: ON', popup_off: 'Protection: OFF',
      popup_mode: 'Mode', mode_leaks: 'Leaks', mode_all: 'All',
      popup_count: '{n} items hidden', popup_settings: 'Settings',
      opt_title: 'SpoilerShield – Settings',
      opt_display: 'Display', opt_blur: 'Blurred with overlay', opt_hide: 'Hide completely',
      opt_mode: 'Mode', opt_leaks: 'Leaks and spoilers only', opt_all: 'Everything about GTA 6',
      opt_keywords: 'Keywords (one per line)',
      opt_whitelist: 'Whitelist: domains without filtering (one per line)',
      opt_cover: 'Fully cover pages with a GTA 6 term in the address (e.g. search, subreddit)',
      opt_lang: 'Language', lang_auto: 'Automatic (browser)',
      opt_save: 'Save', opt_export: 'Export JSON', opt_import: 'Import JSON',
      msg_saved: 'Settings saved.', msg_import_ok: 'Import successful.',
      msg_import_bad: 'Invalid JSON file.'
    }
  };

  let current = 'en';
  function resolve(lang) {
    if (lang === 'de' || lang === 'en') return lang;
    return String(navigator.language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en';
  }

  window.SS_I18N = {
    set(lang) { current = resolve(lang); },
    get() { return current; },
    t(key, vars) {
      let s = (STR[current] && STR[current][key]) || STR.en[key] || key;
      if (vars) for (const k in vars) s = s.replace('{' + k + '}', vars[k]);
      return s;
    },
    apply(root) {
      (root || document).querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = this.t(el.getAttribute('data-i18n'));
      });
      document.documentElement.lang = current;
    }
  };
})();
