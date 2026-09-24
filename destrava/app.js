// DESTRAVA · botões e entrada suave das seções

// Checkout da Eduzz: produto "Webinario Destrava" (mesmo código do antigo webinário, renomeado)
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
  var alvos = document.querySelectorAll('.sec .titulo, .card-just, .lado, .etapa, .virada, .video-slot, .ingresso, .card-simone, .capa, .bonus-txt, .faq details, .metodo-logo, .metodo-etapas li');
  if (!('IntersectionObserver' in window)) return;
  alvos.forEach(function (el) { el.classList.add('revela'); });
  var obs = new IntersectionObserver(function (itens) {
    itens.forEach(function (it) {
      if (it.isIntersecting) { it.target.classList.add('visivel'); obs.unobserve(it.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  alvos.forEach(function (el) { obs.observe(el); });
})();
