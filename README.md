# SpoilerShield GTA 6

**DE:** Firefox-/Waterfox-Erweiterung, die GTA-6-Leaks und -Spoiler auf Webseiten unscharf macht oder ausblendet. Gedacht für alle, die auf den Release warten und sich nichts spoilern lassen wollen.

**EN:** Firefox/Waterfox extension that blurs or hides GTA 6 leaks and spoilers on web pages. Made for everyone who wants to stay spoiler-free until release.

> Nicht mit Rockstar Games oder Take-Two verbunden. / Not affiliated with Rockstar Games or Take-Two Interactive. "GTA" is a trademark of its respective owner.

## Funktionen / Features

- Erkennt GTA-6-Begriffe (DE + EN) und Leak-Begriffe in Beiträgen, Artikeln, Kommentaren und Suchergebnissen
  / Detects GTA 6 and leak terms in posts, articles, comments and search results
- Zwei Modi: **Leaks** (nur Leaks/Spoiler) und **Alles** (alles zu GTA 6)
  / Two modes: **Leaks** (leaks/spoilers only) and **All** (everything about GTA 6)
- Unscharf mit Overlay ("klicken zum Anzeigen") oder komplett ausblenden
  / Blur with click-to-reveal overlay, or hide completely
- Ganzseiten-Abdeckung, wenn die Adresse einen GTA-6-Begriff enthält (z. B. Suche, Subreddit)
  / Full-page cover when the URL contains a GTA 6 term (e.g. search, subreddit)
- Eigene Keywords, Domain-Whitelist, Export/Import der Einstellungen
  / Custom keywords, domain whitelist, settings export/import
- Oberfläche auf Deutsch und Englisch / UI in German and English
- Datenschutz: alles lokal, keine Netzwerkanfragen, kein Tracking
  / Privacy: everything runs locally, no network requests, no tracking

## Installation (Entwickler / developer)

1. Repository klonen oder als ZIP herunterladen / clone or download the repo
2. Firefox oder Waterfox: `about:debugging` öffnen, "Dieser Firefox", "Temporäres Add-on laden…"
3. `manifest.json` auswählen / select `manifest.json`

Temporäre Add-ons verschwinden beim Neustart. Dauerhaft: signierte `.xpi` über addons.mozilla.org.

## Projektstruktur / Structure

```
manifest.json
common/   i18n.js          Übersetzungen / translations
content/  matcher.js       Erkennungslogik / matching logic
          content.js       Abdeckung, Observer / cover, observer
          style.css
popup/    popup.html/js/css
options/  options.html/js/css
icons/
```

## Bekannte Einschränkungen / Known limitations

- Erkennung nur über Text und Bild-Alt-Texte, nicht über Bild- oder Videoinhalt
  / Detection is text-based (including image alt text), not based on image or video content
- Native Apps (Reddit, YouTube, Instagram usw.) werden nicht gefiltert, nur Webseiten im Browser
  / Native apps are not filtered, only web pages in the browser
- Seiten ändern ihr Layout; Selektoren für einzelne Seiten können nach Updates brechen
  / Sites change their layout; site-specific selectors may break after updates
- Inhalte in abgeschotteten Bereichen (Shadow DOM) sind nicht zugänglich
  / Content inside shadow DOM is not accessible
- Firefox Android: ungetestet / untested

## Lizenz / License

MIT, siehe [LICENSE](LICENSE).
