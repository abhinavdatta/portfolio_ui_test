/* ============================================
   Aurora Glass v2 — Theme Module
   ============================================ */
(function () {
  'use strict';

  function getStored() {
    try { return localStorage.getItem('portfolio-theme'); } catch (e) { return null; }
  }

  function apply(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    // Update GitHub chart images if they exist
    updateThemeImages(theme);
  }

  function updateThemeImages(theme) {
    var chartColor = theme === 'light' ? '7c3aed' : '8b5cf6';
    var bgTransparent = '00000000';
    document.querySelectorAll('img[data-gh-chart]').forEach(function (img) {
      var src = img.getAttribute('src');
      if (src) {
        src = src.replace(/8b5cf6|7c3aed/g, chartColor);
        img.setAttribute('src', src);
      }
    });
  }

  function toggle() {
    var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', next); } catch (e) {}
    apply(next);
  }

  // Init — apply stored theme immediately
  var stored = getStored();
  if (stored) {
    apply(stored);
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.theme = { toggle: toggle };
})();