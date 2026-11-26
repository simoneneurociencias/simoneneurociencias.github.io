// Os 3 Segredos do Terapeuta de Alto Valor · botões e entrada suave das seções (mesmo script do DESTRAVA)

// Checkout da Eduzz: o mesmo produto do webinário (797ZYA480E)
var CHECKOUT_URL = 'https://chk.eduzz.com/797ZYA480E';

(function () {
  // Origem do link (?origem= ou ?utm_source=) segue para o checkout como utm_source
  var origem = '';
  try {
    var q = new URLSearchParams(location.search);
    origem = (q.get('origem') || q.get('utm_source') || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  } catch (e) {}

  if (CHECKOUT_URL) {
    var destino = CHECKOUT_URL;
    if (origem) destino += (destino.indexOf('?') > -1 ? '&' : '?') + 'utm_source=' + encodeURIComponent(origem);
    document.querySelectorAll('.js-cta').forEach(function (a) { a.href = destino; });
  }

  // Seções entram ao rolar
  var alvos = document.querySelectorAll('.card-just, .lado, .etapa, .virada, .video-slot, .ingresso, .card-simone, .simone-vidro, .livro, .manifesto-caixa, .capa, .bonus-capa, .bonus-txt, .faq details, .metodo-logo, .metodo-def, .metodo-principio, .metodo-etapas li, .ganhos-3 li, .caixa-garantia, .fecho, .frase-reset, .cta-linha');
  if (!('IntersectionObserver' in window)) return;
  alvos.forEach(function (el) {
    el.classList.add('revela');
    // caixas lado a lado entram uma depois da outra (cascata), não todas juntas
    var irmaos = el.parentElement ? [].filter.call(el.parentElement.children, function (x) { return x.matches && x.matches(el.tagName); }) : [];
    var i = irmaos.indexOf(el);
    if (i > 0) el.style.transitionDelay = Math.min(i, 5) * 0.14 + 's';
  });
  // dentro de cada caixa o conteúdo também entra em cascata: título, depois cada item, um por vez
  var caixas = document.querySelectorAll('.lado, .etapa, .metodo-etapas li, .caixa-garantia, .ingresso, .manifesto-caixa, .simone-vidro, .livro');
  caixas.forEach(function (cx) {
    var pecas = [];
    [].forEach.call(cx.children, function (f) {
      if (f.matches('a.btn')) return;
      if (f.tagName === 'UL' || f.tagName === 'OL') pecas = pecas.concat([].slice.call(f.children));
      else pecas.push(f);
    });
    cx._pecas = pecas;
    var base = (parseFloat(cx.style.transitionDelay) || 0) + 0.25;
    pecas.forEach(function (p, i) {
      p.classList.add('cq');
      p.style.transitionDelay = (base + i * 0.12).toFixed(2) + 's';
    });
  });

  var obs = new IntersectionObserver(function (itens) {
    itens.forEach(function (it) {
      if (it.isIntersecting) {
        it.target.classList.add('visivel');
        (it.target._pecas || []).forEach(function (p) { p.classList.add('cq-on'); });
        obs.unobserve(it.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  alvos.forEach(function (el) { obs.observe(el); });
})();

// 25/11: efeitos da vitrine /efeitos-lp
(function () {
  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // E10: antes é riscado, depois acende
  if ('IntersectionObserver' in window) {
    [['[data-ad-antes]', 'riscado', 0], ['[data-ad-depois]', 'aceso', 900]].forEach(function (c) {
      var el = document.querySelector(c[0]);
      if (!el) return;
      var o = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) {
          setTimeout(function () {
            el.classList.add(c[1]);
            if (c[1] !== 'aceso') return;
            // E05: linha se desenha e os números acendem um a um
            el.classList.add('linha-on');
            [].forEach.call(el.children, function (li, i) { setTimeout(function () { li.classList.add('on'); }, calmo ? 0 : 150 + i * 650); });
          }, calmo ? 0 : c[2]);
          o.disconnect();
        }
      }, { threshold: 0.35 });
      o.observe(el);
    });
  }

  // E09: partículas douradas no hero
  var cv = document.querySelector('.hero-particulas');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), pts = [], visivel = true, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var qtd = window.innerWidth < 640 ? 70 : 120;
  function medir() { cv.width = cv.offsetWidth * dpr; cv.height = cv.offsetHeight * dpr; }
  medir(); window.addEventListener('resize', medir);
  for (var i = 0; i < qtd; i++) { var bk = Math.random() < 0.16; pts.push({ x: Math.random(), y: Math.random(), r: bk ? Math.random() * 5 + 5 : Math.random() * 2.4 + 1, v: bk ? Math.random() * 0.0007 + 0.0004 : Math.random() * 0.0022 + 0.0009, a: bk ? Math.random() * 0.14 + 0.12 : Math.random() * 0.5 + 0.5, f: Math.random() * 6.28, bk: bk }); }
  function desenhar() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    pts.forEach(function (p) {
      if (!calmo) { p.y -= p.v; p.f += 0.02; if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); } }
      ctx.beginPath(); ctx.arc((p.x + Math.sin(p.f) * 0.004) * cv.width, p.y * cv.height, p.r * dpr, 0, 6.28);
      ctx.fillStyle = 'rgba(236,204,150,' + (p.a * (0.7 + 0.3 * Math.sin(p.f * 1.3))) + ')';
      ctx.shadowColor = 'rgba(232,196,138,.95)'; ctx.shadowBlur = (p.bk ? 18 : 10) * dpr; ctx.fill();
    });
    if (visivel && !calmo) requestAnimationFrame(desenhar);
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { var antes = visivel; visivel = e[0].isIntersecting; if (visivel && !antes) desenhar(); }).observe(cv);
  desenhar();
})();

// 25/11: efeito 05 nas 4 etapas do método: começa apagado; ao chegar na tela, a linha se desenha e os números acendem um a um.
// Ao sair da tela, apaga de novo, para repetir na próxima vez.
(function () {
  var box = document.querySelector('.metodo-etapas');
  if (!box || !('IntersectionObserver' in window)) return;
  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timers = [];
  function apagar() { timers.forEach(clearTimeout); timers = []; box.classList.remove('linha-on'); [].forEach.call(box.children, function (li) { li.classList.remove('on'); }); }
  function acender() {
    apagar();
    timers.push(setTimeout(function () { box.classList.add('linha-on'); }, calmo ? 0 : 350));
    [].forEach.call(box.children, function (li, i) { timers.push(setTimeout(function () { li.classList.add('on'); }, calmo ? 0 : 450 + i * 900)); });
  }
  new IntersectionObserver(function (e) { if (e[0].isIntersecting) acender(); else apagar(); }, { threshold: 0.6 }).observe(box);
})();
