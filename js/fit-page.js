// fit-page.js — the homepage is a fixed 1440px Figma canvas. Mobile browsers
// fit it via <meta viewport width=1440>, but desktop windows narrower than
// 1440 (e.g. a split-screen or preview pane) would show a horizontal
// scrollbar. This scales the canvas down to fit instead — same idea as the
// dashboard scale-fit on the subpages.
(function () {
  var DESIGN = 1440;
  function fit() {
    var vw = document.documentElement.clientWidth;
    var s = Math.min(1, vw / DESIGN);
    document.documentElement.style.setProperty('--page-scale', s >= 1 ? '1' : String(s));
  }
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  fit();
})();
