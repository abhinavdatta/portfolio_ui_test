/* ============================================
   Aurora Glass v2 — Scroll Reveal & Bars Module
   ============================================ */
(function () {
  'use strict';

  var revealObserver, barObserver;

  function revealHandler(entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }

  function barHandler(entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var fill = entry.target.querySelector('.prof-fill');
        if (fill) {
          var w = fill.getAttribute('data-width');
          if (w) {
            fill.style.width = w + '%';
          }
        }
        barObserver.unobserve(entry.target);
      }
    });
  }

  function init() {
    // Reveal observer
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length && 'IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(revealHandler, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });
      reveals.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback: show all
      reveals.forEach(function (el) { el.classList.add('visible'); });
    }

    // Proficiency bar observer
    var bars = document.querySelectorAll('.prof-item');
    if (bars.length && 'IntersectionObserver' in window) {
      barObserver = new IntersectionObserver(barHandler, {
        threshold: 0.3
      });
      bars.forEach(function (el) {
        barObserver.observe(el);
      });
    } else {
      // Fallback: animate all
      bars.forEach(function (el) {
        var fill = el.querySelector('.prof-fill');
        if (fill) {
          var w = fill.getAttribute('data-width');
          if (w) fill.style.width = w + '%';
        }
      });
    }
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.scroll = { init: init };
})();