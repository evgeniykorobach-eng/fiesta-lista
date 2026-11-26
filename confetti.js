/* FiestaLista — confetti suave en todas las páginas públicas.
   Cae de forma continua (position:fixed), sin capturar clics. */
(function () {
  const css = document.createElement('style');
  css.textContent = [
    '.fl-confetti-layer{position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden}',
    '.fl-confetti-piece{position:absolute;top:-24px;border-radius:3px;opacity:.8;animation:fl-confetti-fall linear infinite}',
    '@keyframes fl-confetti-fall{0%{transform:translateY(-30px) rotate(0deg)}100%{transform:translateY(110vh) rotate(540deg)}}',
    '@media (prefers-reduced-motion:reduce){.fl-confetti-piece{display:none}}'
  ].join('\n');
  document.head.appendChild(css);

  const layer = document.createElement('div');
  layer.className = 'fl-confetti-layer';
  layer.setAttribute('aria-hidden', 'true');

  const colors = ['#FF6B8A', '#FFC94D', '#6BCB77', '#5B8DEF', '#B983FF', '#FF9F6B'];
  const count = window.innerWidth < 720 ? 14 : 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'fl-confetti-piece';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = (11 + Math.random() * 10) + 's';
    p.style.animationDelay = (-Math.random() * 16) + 's';
    p.style.width = (6 + Math.random() * 7) + 'px';
    p.style.height = (8 + Math.random() * 8) + 'px';
    if (Math.random() > .5) p.style.borderRadius = '50%';
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
})();
