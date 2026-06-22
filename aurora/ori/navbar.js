/* ============================================
   Aurora Glass v2 — Navbar Module
   ============================================ */
(function () {
  'use strict';

  var navbar, hamburger, mobileOverlay, mobileMenu, navLinks;
  var sections = [];
  var observer;

  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu if open
    closeMobile();
  }

  function handleScroll() {
    // Shrink navbar
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.classList.add('shrunk');
      } else {
        navbar.classList.remove('shrunk');
      }
    }

    // Back to top
    var btt = document.getElementById('back-to-top');
    if (btt) {
      if (window.scrollY > 500) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }
  }

  function setActiveSection(entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        // Update nav links
        document.querySelectorAll('.nav-link').forEach(function (link) {
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        // Update mobile links
        document.querySelectorAll('.mobile-link').forEach(function (link) {
          if (link.getAttribute('data-section') === id) {
            link.style.color = 'var(--accent)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }

  function toggleMobile() {
    if (!hamburger || !mobileMenu || !mobileOverlay) return;
    var isOpen = mobileMenu.classList.contains('active');
    if (isOpen) {
      closeMobile();
    } else {
      hamburger.classList.add('open');
      mobileMenu.classList.add('active');
      mobileOverlay.classList.add('active');
      mobileOverlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobile() {
    if (!hamburger || !mobileMenu || !mobileOverlay) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    setTimeout(function () {
      if (!mobileOverlay.classList.contains('active')) {
        mobileOverlay.style.display = '';
      }
    }, 300);
    document.body.style.overflow = '';
  }

  function init() {
    navbar = document.getElementById('navbar');
    hamburger = document.getElementById('hamburger-btn');
    mobileOverlay = document.getElementById('mobile-overlay');
    mobileMenu = document.getElementById('mobile-menu');

    if (hamburger) {
      hamburger.addEventListener('click', toggleMobile);
    }
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMobile);
    }

    // Nav link click handlers
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var section = this.getAttribute('data-section');
        scrollToSection(section);
      });
    });

    // Mobile link click handlers
    document.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var section = this.getAttribute('data-section');
        scrollToSection(section);
        closeMobile();
      });
    });

    // Scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Intersection observer for active section
    var sectionEls = document.querySelectorAll('section[id]');
    if (sectionEls.length && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(setActiveSection, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      });
      sectionEls.forEach(function (el) {
        observer.observe(el);
      });
    }

    // Expose scrollToSection for inline handlers
    window.scrollToSection = scrollToSection;
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.navbar = { init: init };
})();