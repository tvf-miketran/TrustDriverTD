// fit-page.js — the homepage is a fixed 1440px Figma canvas. Mobile/tablet
// browsers fit it via <meta viewport width=1440>; on desktop this zooms the
// canvas to fill the window width — down on narrow windows (no horizontal
// scrollbar) and up on wide monitors (no white gutters beside the 1440 frame).
// The sticky header/footer live outside .page and stay 1:1 like the subpages.
//
// Desktop browser zoom (Ctrl +/-) inflates clientWidth, which would make the
// refit cancel the zoom (canvas keeps its on-screen size while header/footer
// shrink). outerWidth is measured in OS pixels and ignores page zoom, so
// outerWidth / innerWidth ≈ the current zoom factor — at any moment, not
// just at load, so it also survives reloads (Chrome restores a site's saved
// zoom before scripts run). Multiplying it back anchors the fit to the
// physical window: zooming out shrinks the whole page like any normal site.
// Clamped to the live viewport so the canvas can never be wider than the
// window — no horizontal scrollbar; zooming in past the fit just keeps the
// canvas filling the screen.
(function () {
  var DESIGN = 1440;
  var DESKTOP = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function fit() {
    var cw = document.documentElement.clientWidth;
    var scale = cw / DESIGN;
    if (DESKTOP && window.outerWidth && window.innerWidth) {
      var zoom = window.outerWidth / window.innerWidth;
      scale = Math.min(cw * zoom, cw) / DESIGN;
    }
    document.documentElement.style.setProperty('--page-scale', String(scale));
  }
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  fit();
})();
