// Matcher für GTA-6-Spoiler. Keywords kommen aus settings.keywords (Parameter).
const SS_DEFAULT_KEYWORDS = ["GTA 6", "GTA6", "GTA-6", "GTA VI", "Grand Theft Auto 6",
  "Grand Theft Auto VI", "Leonida"];
let ssCoreCache = { key: null, re: null };

function matchText(text, settings = {}) {
  if (!text) return false;
  const mode = settings.mode || 'leaks';
  const keywords = (Array.isArray(settings.keywords) && settings.keywords.length)
    ? settings.keywords : SS_DEFAULT_KEYWORDS;

  const key = keywords.join('\u0001');
  if (ssCoreCache.key !== key) {
    const escaped = keywords.map(k => k.trim()).filter(Boolean)
      .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    ssCoreCache = { key, re: escaped.length ? new RegExp('\\b(' + escaped.join('|') + ')\\b', 'i') : null };
  }

  const gtaContext = /\b(GTA|Rockstar)\b/i;
  const leakTerms  = /\b(leak|leaks|leaked|geleakt|spoiler|datamine|datamined|insider)\b/i;
  const ambiguous  = /\b(Vice\s+City|Lucia|Jason)\b/i;

  const gtaFound = (ssCoreCache.re && ssCoreCache.re.test(text)) ||
                   (ambiguous.test(text) && gtaContext.test(text));
  if (mode === 'alles') return !!gtaFound;
  return !!gtaFound && leakTerms.test(text);
}

window.matchText = matchText;
