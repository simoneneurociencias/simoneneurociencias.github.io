  // O cadastro saiu da hero em 02/09/2026: os botões levam direto ao checkout.
  // O receptor de leads (apps-script.gs) continua publicado e o /diagnostico/ ainda usa.

  // Ajusta a fonte de TODOS os botões para caberem sempre em 1 linha,
  // aplicando o mesmo tamanho a todos (padrão único).
  function fitButtons(){
    var btns = Array.prototype.slice.call(document.querySelectorAll('.btn'));
    if(!btns.length) return;
    btns.forEach(function(b){ b.style.fontSize = ''; });
    var minSize = Infinity;
    btns.forEach(function(b){
      var maxLine = b.parentElement ? b.parentElement.clientWidth : b.clientWidth;
      var size = parseFloat(getComputedStyle(b).fontSize);
      var guard = 0;
      while(guard++ < 80){
        var overflowLine   = b.scrollWidth > b.clientWidth + 1;                 // texto estoura a caixa (btn--full)
        var overflowParent = b.getBoundingClientRect().width > maxLine + 1;      // botão maior que a linha (inline)
        if(!overflowLine && !overflowParent) break;
        size -= 0.5;
        b.style.fontSize = size + 'px';
        if(size <= 9) break;
      }
      if(size < minSize) minSize = size;
    });
    if(!isFinite(minSize)) return;
    btns.forEach(function(b){ b.style.fontSize = minSize + 'px'; });
  }
  var _fitT;
  window.addEventListener('load', fitButtons);
  window.addEventListener('resize', function(){ clearTimeout(_fitT); _fitT = setTimeout(fitButtons, 120); });

  // Rastreio de origem (16/09/2026): ?origem=bio (ou ?utm_source=) segue para o
  // checkout como utm_source, e a Eduzz mostra a origem em cada venda.
  (function(){
    var p = new URLSearchParams(location.search), o = p.get('origem') || p.get('utm_source');
    try {
      if(o){ o = o.toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,40); sessionStorage.setItem('origem', o); }
      else { o = sessionStorage.getItem('origem'); }
    } catch(e){}
    if(!o) return;
    document.querySelectorAll('a[href*="chk.eduzz.com"]').forEach(function(a){
      var u = new URL(a.href); u.searchParams.set('utm_source', o); a.href = u.toString();
    });
  })();
