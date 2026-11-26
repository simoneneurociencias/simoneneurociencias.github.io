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
  var alvos = document.querySelectorAll('.card-just, .lado, .etapa, .virada, .video-slot, .ingresso, .card-simone, .simone-vidro, .livro, .manifesto-caixa, .capa, .bonus-capa, .bonus-txt, .faq details, .metodo-logo, .metodo-def, .metodo-principio, .caixa-garantia, .fecho, .frase-reset, .cta-linha');
  if (!('IntersectionObserver' in window)) return;
  alvos.forEach(function (el) {
    el.classList.add('revela');
    // caixas lado a lado entram uma depois da outra (cascata), não todas juntas
    var irmaos = el.parentElement ? [].filter.call(el.parentElement.children, function (x) { return x.matches && x.matches(el.tagName); }) : [];
    var i = irmaos.indexOf(el);
    if (i > 0) el.style.transitionDelay = Math.min(i, 5) * 0.14 + 's';
  });
  // dentro de cada caixa o conteúdo também entra em cascata: título, depois cada item, um por vez
  var caixas = document.querySelectorAll('.lado, .etapa, .caixa-garantia, .ingresso, .manifesto-caixa, .simone-vidro, .livro');
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

// 26/11: encruzilhada da decisão: ao chegar na tela, o fio do Caminho 2 se desenha e a caixa acende; ao sair, apaga para repetir
(function () {
  var t = document.querySelector('.decisao-t1');
  if (!t || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (e) { t.classList.toggle('on', e[0].isIntersecting); }, { threshold: 0.6 }).observe(t);
})();

// 26/11: os 4 movimentos do encontro: cartões entram alternando os lados, com uma luz que atravessa cada um
(function () {
  var g = document.querySelector('.etapas:not(.tres)');
  if (!g || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  [].forEach.call(g.children, function (c) { var l = document.createElement('span'); l.className = 'mov-luz'; l.setAttribute('aria-hidden', 'true'); c.appendChild(l); });
  g.classList.add('mov-pronto');
  var pedido = false;
  function conferir() {
    pedido = false;
    var r = g.getBoundingClientRect(), vh = window.innerHeight || document.documentElement.clientHeight;
    var dentro = r.top < vh * 0.85 && r.bottom > vh * 0.15;
    if (dentro && !g.classList.contains('mov-on')) g.classList.add('mov-on');
    else if (!dentro && (r.top > vh || r.bottom < 0)) g.classList.remove('mov-on');
  }
  function agendar() { if (!pedido) { pedido = true; setTimeout(conferir, 40); } }
  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', agendar);
  setTimeout(conferir, 60);
})();

// 26/11: "Mesmo assim...": um cadeado por item, que se fecha um a um quando a tela aparece (abre de novo ao sair)
(function () {
  var box = document.querySelector('.justificativas .lado-sim');
  if (!box) return;
  var itens = box.querySelectorAll('li');
  var svg = '<svg class="cadeado" viewBox="0 0 18 22" aria-hidden="true"><path class="arco" d="M4.5 10V7a4.5 4.5 0 0 1 9 0v3"/><rect class="corpo" x="1.5" y="10" width="15" height="11" rx="2.5"/><circle class="furo" cx="9" cy="15.5" r="1.6"/></svg>';
  [].forEach.call(itens, function (li) { li.insertAdjacentHTML('afterbegin', svg); });
  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timers = [], ligado = false, pedido = false;
  function conferir() {
    pedido = false;
    var r = box.getBoundingClientRect(), vh = window.innerHeight || document.documentElement.clientHeight;
    var dentro = r.top < vh * 0.8 && r.bottom > vh * 0.2;
    if (dentro && !ligado) {
      ligado = true;
      [].forEach.call(itens, function (li, i) { timers.push(setTimeout(function () { li.classList.add('trancou'); }, calmo ? 0 : 500 + i * 750)); });
    } else if (!dentro && (r.top > vh || r.bottom < 0) && ligado) {
      ligado = false; timers.forEach(clearTimeout); timers = [];
      [].forEach.call(itens, function (li) { li.classList.remove('trancou'); });
    }
  }
  function agendar() { if (!pedido) { pedido = true; setTimeout(conferir, 40); } }
  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', agendar);
  setTimeout(conferir, 60);
})();

// 26/11: 3 Segredos: os cartões se formam em bolinhas quando a tela aparece (repete ao voltar)
(function () {
  var g = document.querySelector('.etapas.tres');
  if (!g || !(window.CSS && CSS.supports && (CSS.supports('mask', 'none') || CSS.supports('-webkit-mask', 'none')))) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  g.classList.add('px-pronto');
  var pedido = false;
  function conferir() {
    pedido = false;
    var r = g.getBoundingClientRect(), vh = window.innerHeight || document.documentElement.clientHeight;
    var dentro = r.top < vh * 0.85 && r.bottom > vh * 0.15;
    if (dentro) g.classList.add('px-on');
    else if (r.top > vh || r.bottom < 0) g.classList.remove('px-on');
  }
  function agendar() { if (!pedido) { pedido = true; setTimeout(conferir, 40); } }
  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', agendar);
  setTimeout(conferir, 60);
})();

// 26/11: hero: rede de neurônios. Conexões entre pontos próximos e impulsos de luz viajando; reage ao toque ou ao mouse
(function () {
  var cv = document.querySelector('.hero-neural');
  if (!cv || !cv.getContext) return;
  var hero = cv.parentElement, ctx = cv.getContext('2d');
  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, nos = [], pulsos = [], visivel = true, rodando = false;
  var cel = window.innerWidth < 640, QTD = cel ? 58 : 95, DIST = cel ? 118 : 160, toque = null;
  function medir() {
    W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  medir(); window.addEventListener('resize', medir);
  function criar() { nos = []; for (var i = 0; i < QTD; i++) nos.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + 1.4, b: 0 }); }
  function ponto(e) { var r = hero.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; toque = { x: t.clientX - r.left, y: t.clientY - r.top }; }
  hero.addEventListener('pointermove', ponto); hero.addEventListener('touchmove', ponto, { passive: true });
  hero.addEventListener('pointerleave', function () { toque = null; }); hero.addEventListener('touchend', function () { toque = null; });
  function quadro() {
    if (!W || !H) { medir(); }
    if ((!nos.length || nos[0].x === 0 && nos[1].x === 0) && W && H) criar();
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, dx, dy, d, al;
    for (i = 0; i < nos.length; i++) {
      a = nos[i];
      if (!calmo) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; }
      a.b *= .94;
    }
    ctx.lineWidth = 1.2;
    for (i = 0; i < nos.length; i++) for (j = i + 1; j < nos.length; j++) {
      a = nos[i]; b = nos[j]; dx = a.x - b.x; dy = a.y - b.y; d = dx * dx + dy * dy;
      if (d < DIST * DIST) {
        al = (1 - Math.sqrt(d) / DIST) * .75;
        ctx.strokeStyle = 'rgba(217,183,116,' + al + ')';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        if (!calmo && Math.random() < .0022 && pulsos.length < 22) pulsos.push({ a: i, b: j, t: 0 });
      }
    }
    if (toque) for (i = 0; i < nos.length; i++) {
      a = nos[i]; dx = a.x - toque.x; dy = a.y - toque.y; d = Math.sqrt(dx * dx + dy * dy);
      if (d < DIST * 1.3) { ctx.strokeStyle = 'rgba(240,212,154,' + (1 - d / (DIST * 1.3)) * .7 + ')'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(toque.x, toque.y); ctx.stroke(); a.b = Math.max(a.b, .6); }
    }
    for (i = 0; i < nos.length; i++) {
      a = nos[i];
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r + a.b * 2.2, 0, 6.283);
      ctx.fillStyle = 'rgba(240,210,158,' + (.8 + a.b * .2) + ')';
      ctx.shadowColor = 'rgba(236,204,150,.9)'; ctx.shadowBlur = 6 + a.b * 14; ctx.fill(); ctx.shadowBlur = 0;
    }
    for (i = pulsos.length - 1; i >= 0; i--) {
      var p = pulsos[i]; a = nos[p.a]; b = nos[p.b]; p.t += .022;
      if (p.t >= 1) { b.b = 1; pulsos.splice(i, 1); continue; }
      var x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
      ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 6.283); ctx.fillStyle = '#fff4dc'; ctx.shadowColor = '#f0d49a'; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0;
    }
    if (visivel && !calmo) setTimeout(function () { requestAnimationFrame(quadro); }, 0); else rodando = false;
  }
  function ligar() { if (!rodando) { rodando = true; quadro(); } }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visivel = e[0].isIntersecting; if (visivel) ligar(); }).observe(cv);
  ligar();
})();
