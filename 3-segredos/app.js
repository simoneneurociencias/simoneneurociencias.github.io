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
  var alvos = document.querySelectorAll('.sec .titulo, .sec .sub-sec, .card-just, .lado, .etapa, .virada, .video-slot, .ingresso, .card-simone, .simone-vidro, .livro, .manifesto-caixa, .capa, .bonus-capa, .bonus-txt, .faq details, .metodo-logo, .metodo-def, .metodo-principio, .metodo-etapas li, .ganhos-3 li, .caixa-garantia, .fecho, .frase-reset, .cta-linha');
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
