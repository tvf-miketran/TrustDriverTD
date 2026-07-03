/* TrustDriver — Solutions page
   Scales fixed-width design compositions (dashboard mockup, hero art,
   journey ribbon) down to fit narrow viewports. Progressive enhancement:
   desktop layout is untouched (scale = 1). */
(function () {
  'use strict';

  var targets = [];

  function fit(el) {
    var designWidth = parseFloat(el.getAttribute('data-scale-width'));
    var parent = el.parentElement;
    if (!designWidth || !parent) return;
    var available = parent.clientWidth;
    // Skip hidden/zero-width layouts (background tab, display:none ancestor)
    // so we never lock elements at scale(0).
    if (available <= 0) return;
    var scale = Math.min(1, available / designWidth);
    if (scale < 1) {
      el.style.transform = 'scale(' + scale + ')';
      el.style.transformOrigin = 'top left';
      parent.style.height = el.getBoundingClientRect().height + 'px';
    } else {
      el.style.transform = '';
      parent.style.height = '';
    }
  }

  var raf;
  function fitAll() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      targets.forEach(fit);
    });
  }

  function init() {
    targets = Array.prototype.slice.call(document.querySelectorAll('[data-scale-width]'));
    if (!targets.length) return;

    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(fitAll);
      targets.forEach(function (el) {
        if (el.parentElement) ro.observe(el.parentElement);
      });
    }
    window.addEventListener('resize', fitAll);
    window.addEventListener('pageshow', fitAll);
    document.addEventListener('visibilitychange', fitAll);
    window.addEventListener('load', fitAll);
    fitAll();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
