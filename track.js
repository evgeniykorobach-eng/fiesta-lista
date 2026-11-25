// FiestaLista — seguimiento de origen del tráfico (UTM + referrer)
// Se incluye en las páginas públicas. Guarda:
//  - fl_utm: {first, last}  (primera y última fuente conocida del visitante)
//  - fl_visits: [{ts, page, source, medium, campaign}]  (solo entradas «externas»)
(function () {
  var SRC_KEY = 'fl_utm', LOG_KEY = 'fl_visits';

  function detectUtm() {
    try {
      var p = new URLSearchParams(location.search);
      var us = p.get('utm_source');
      if (!us) return null;
      return {
        source: us.toLowerCase(),
        medium: p.get('utm_medium') || '',
        campaign: p.get('utm_campaign') || '',
        ts: new Date().toISOString()
      };
    } catch (e) { return null; }
  }

  function refSource() {
    try {
      var r = document.referrer;
      if (!r) return 'direct';
      var h = new URL(r).hostname.replace(/^www\./, '');
      if (h === location.hostname) return null; // navegación interna
      if (h.indexOf('instagram') !== -1) return 'instagram';
      if (h.indexOf('tiktok') !== -1) return 'tiktok';
      if (h.indexOf('facebook') !== -1 || h === 'fb.me') return 'facebook';
      if (h.indexOf('google') !== -1) return 'google';
      if (h.indexOf('whatsapp') !== -1) return 'whatsapp';
      return h;
    } catch (e) { return 'direct'; }
  }

  var stored = null;
  try { stored = JSON.parse(localStorage.getItem(SRC_KEY)); } catch (e) {}

  var utm = detectUtm();
  var ref = refSource();

  if (utm) {
    var first = (stored && stored.first) ? stored.first : utm;
    stored = { first: first, last: utm };
    try { localStorage.setItem(SRC_KEY, JSON.stringify(stored)); } catch (e) {}
  } else if (!stored) {
    stored = { first: { source: ref || 'direct', medium: '', campaign: '', ts: new Date().toISOString() }, last: null };
    try { localStorage.setItem(SRC_KEY, JSON.stringify(stored)); } catch (e) {}
  }

  // Registrar visita solo cuando la entrada es externa (UTM o referrer externo),
  // no en la navegación interna entre páginas del sitio.
  if (utm || ref) {
    var current = (stored.last && stored.last.source) || (stored.first && stored.first.source) || 'direct';
    var log = [];
    try { log = JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch (e) {}
    log.push({
      ts: new Date().toISOString(),
      page: location.pathname.split('/').pop() || 'index.html',
      source: current,
      medium: utm ? utm.medium : '',
      campaign: utm ? utm.campaign : ''
    });
    if (log.length > 500) log = log.slice(-500);
    try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch (e) {}
  }

  // Fuente que se adjuntará a las reservas (última conocida, si no, la primera)
  window.flSource = function () {
    try {
      var s = JSON.parse(localStorage.getItem(SRC_KEY));
      return (s && (s.last || s.first)) || { source: 'direct', medium: '', campaign: '' };
    } catch (e) { return { source: 'direct', medium: '', campaign: '' }; }
  };
})();
