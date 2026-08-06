  // URL do Web App do Apps Script que grava os leads na planilha (ver apps-script.gs).
  // Cole aqui a URL que termina em /exec depois de implantar.
  var WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwG_Xm2Ym3hJ5jFOtsCxKALEIeqmRN1pMJ-7-s3x_4HHjkGqop6e7Ety3BF1OycXmk/exec";

  var CHECKOUT_URL = "https://chk.eduzz.com/797ZYA480E";

  var LEAD_KEY = 'tav_lead_ok';

  function leadJaEnviado(){
    try { return localStorage.getItem(LEAD_KEY) === '1'; } catch(_) { return false; }
  }
  function marcarLeadEnviado(){
    try { localStorage.setItem(LEAD_KEY, '1'); } catch(_) {}
  }

  function mostrarToast(){
    var t = document.getElementById('toast-lead');
    if(!t) return;
    t.classList.add('on');
    clearTimeout(t._tm);
    t._tm = setTimeout(function(){ t.classList.remove('on'); }, 4200);
  }

  function levarAoFormulario(){
    var form = document.querySelector('.hero .lead-form');
    if(!form) return;
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    mostrarToast();
    form.classList.add('lead-form--pisca');
    setTimeout(function(){ form.classList.remove('lead-form--pisca'); }, 1800);
    var campo = form.querySelector('input[name="nome"]');
    setTimeout(function(){
      if(campo){ try { campo.focus({ preventScroll: true }); } catch(_) { campo.focus(); } }
    }, 500);
  }

  // captura na fase de captura, para pegar o clique antes de qualquer outro handler
  document.addEventListener('click', function(e){
    var el = e.target;
    var a = null;
    while(el && el !== document){
      if(el.tagName === 'A' && el.href && el.href.indexOf('chk.eduzz.com') !== -1){ a = el; break; }
      el = el.parentNode;
    }
    if(!a) return;              // não é botão de checkout
    if(leadJaEnviado()) return; // já se cadastrou: segue para o checkout
    e.preventDefault();
    e.stopPropagation();
    levarAoFormulario();
  }, true);

  function submeterLead(e){
    e.preventDefault();
    var f = e.target;
    var nome     = (f.nome.value     || '').trim();
    var email    = (f.email.value    || '').trim();
    var whatsapp = (f.whatsapp.value || '').trim();

    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!re.test(email)){
      alert('Por favor, digite um e-mail válido para garantir sua vaga.');
      f.email.focus();
      return false;
    }

    marcarLeadEnviado();   // libera os botoes de checkout do resto da pagina

    var btn = f.querySelector('button[type="submit"]');
    if(btn){ btn.disabled = true; btn.textContent = 'Garantindo sua vaga...'; }

    // envia o lead ao Apps Script. text/plain evita o preflight CORS (OPTIONS);
    // keepalive mantém o request vivo mesmo depois de sair da página (redirect).
    if (WEBHOOK_URL) {
      try {
        fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          keepalive: true,
          body: JSON.stringify({
            nome: nome,
            email: email,
            whatsapp: whatsapp,
            origem: 'lp-tav',
            data: new Date().toISOString()
          })
        });
      } catch(_){}
    }

    // pequeno atraso para o envio sair antes de trocar de página, e segue pro checkout
    setTimeout(function(){ window.location.href = CHECKOUT_URL; }, 350);
    return false;
  }

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
