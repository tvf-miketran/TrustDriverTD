// fit-page.js — the homepage is a fixed 1440px Figma canvas. Mobile browsers
// fit it via <meta viewport width=1440>; on desktop this zooms the canvas to
// always fill the viewport width — down on narrow windows (no horizontal
// scrollbar) and up on wide monitors (no white gutters beside the 1440 frame).
// The sticky header/footer live outside .page and stay 1:1 like the subpages.
(function () {
  var DESIGN = 1440;
  function fit() {
    var vw = document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--page-scale', String(vw / DESIGN));
  }
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  fit();
})();
