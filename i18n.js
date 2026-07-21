/* Portafolio bilingüe ES/EN — toggle client-side, offline.
   Cada fragmento traducible lleva data-en (el ES es el contenido original del DOM). */
(function () {
  var KEY = 'site_lang';
  function apply(lang) {
    var els = document.querySelectorAll('[data-en]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.getAttribute('data-es') === null) {
        el.setAttribute('data-es', el.textContent);
      }
      el.textContent = (lang === 'en') ? el.getAttribute('data-en') : el.getAttribute('data-es');
    }
    var vals = document.querySelectorAll('.lang-toggle__val');
    for (var j = 0; j < vals.length; j++) { vals[j].textContent = (lang === 'en' ? 'EN' : 'ES'); }
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }
  function currentLang() {
    var l = 'es';
    try { l = localStorage.getItem(KEY) || 'es'; } catch (e) {}
    return l;
  }
  // reaplica el idioma actual (para elementos generados por JS después del load)
  window.__applyLang = function () { apply(currentLang()); };
  var saved = currentLang();
  function init() {
    apply(saved);
    var btns = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var cur = 'es';
        try { cur = localStorage.getItem(KEY) || 'es'; } catch (e) {}
        apply(cur === 'es' ? 'en' : 'es');
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
