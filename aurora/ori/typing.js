/* ============================================
   Aurora Glass v2 — Typing Module
   ============================================ */
(function () {
  'use strict';

  var words = ['ECE Student', 'Web Developer', 'Tech Enthusiast', 'Problem Solver', 'Embedded Systems Learner'];
  var typeSpeed = 80;
  var deleteSpeed = 40;
  var pauseTime = 2000;

  var el, wordIndex, charIndex, isDeleting, timeout;

  function type() {
    var current = words[wordIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    var delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === current.length) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }

    timeout = setTimeout(type, delay);
  }

  function init() {
    el = document.getElementById('typed-text');
    if (!el) return;
    wordIndex = 0;
    charIndex = 0;
    isDeleting = false;
    type();
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.typing = { init: init };
})();