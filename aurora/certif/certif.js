/* ============================================================
   AURORA GLASS v2 — Certifications Page JavaScript
   Self-contained: no external dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Parse cert data from embedded JSON ───────────────── */
  var certDataEl = document.getElementById('cert-data');
  var certifications = certDataEl ? JSON.parse(certDataEl.textContent) : [];

  /* ── 2. Helpers ──────────────────────────────────────────── */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
      return map[m] || m;
    });
  }

  function getFallbackSVG() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">' +
      '<path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>' +
      '<path d="M8 7H16" stroke-linecap="round"/>' +
      '<path d="M8 11H14" stroke-linecap="round"/>' +
      '<path d="M8 15H12" stroke-linecap="round"/>' +
      '<circle cx="17.5" cy="15.5" r="2.5"/>' +
      '<path d="M19 17L21 19" stroke-linecap="round"/>' +
    '</svg>';
  }

  function buildThumbHtml(cert) {
    var fallbackIcon = getFallbackSVG();

    if (cert.thumbnail) {
      return '<img class="cert-img" src="' + escapeHtml(cert.thumbnail) + '" alt="' + escapeHtml(cert.title) + '" ' +
        'onerror="this.onerror=null;this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
        '<div class="fallback-icon" style="display:none;">' + fallbackIcon + '</div>';
    } else {
      return '<div class="fallback-icon" style="display:flex;">' + fallbackIcon + '</div>';
    }
  }

  /* ── 3. Theme toggle ─────────────────────────────────────── */
  var html = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');

  function getStoredTheme() {
    return localStorage.getItem('portfolio-theme');
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    var sunSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    var moonSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    themeBtn.innerHTML = theme === 'light' ? moonSvg : sunSvg;
  }

  function initTheme() {
    var stored = getStoredTheme();
    if (stored) {
      applyTheme(stored);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      applyTheme('light');
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('portfolio-theme', next);
    });
  }

  initTheme();

  /* ── 4. Render Certificates ─────────────────────────────── */
  function renderCerts() {
    var container = document.getElementById('cert-grid');
    if (!container) return;
    container.innerHTML = '';

    certifications.forEach(function (cert, idx) {
      var tile = document.createElement('div');
      tile.className = 'cert-tile';
      tile.setAttribute('data-index', idx);

      var thumbHtml = buildThumbHtml(cert);
      var credHtml = cert.credentialId
        ? '<span>ID: ' + escapeHtml(cert.credentialId) + '</span>'
        : '<span>No ID Available</span>';

      tile.innerHTML =
        '<div class="cert-thumb">' +
          thumbHtml +
          '<div class="cert-date-overlay">' + escapeHtml(cert.date) + '</div>' +
        '</div>' +
        '<div class="cert-info">' +
          '<div class="cert-info-title">' + escapeHtml(cert.title) + '</div>' +
          '<div class="cert-info-issuer">' + escapeHtml(cert.issuer) + '</div>' +
          '<div class="cert-info-credential">' + credHtml + '</div>' +
        '</div>';

      tile.addEventListener('click', function () {
        openCertModal(cert, thumbHtml, credHtml);
      });

      container.appendChild(tile);
    });

    initScrollReveal();
  }

  /* ── 5. Search / Filter ───────────────────────────────────── */
  var searchInput = document.getElementById('cert-search');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      var tiles = document.querySelectorAll('.cert-tile');
      var noResults = document.getElementById('no-results');
      var visibleCount = 0;

      tiles.forEach(function (tile) {
        var idx = parseInt(tile.getAttribute('data-index'), 10);
        var cert = certifications[idx];
        if (!cert) return;

        var title = (cert.title || '').toLowerCase();
        var issuer = (cert.issuer || '').toLowerCase();

        if (!query || title.indexOf(query) !== -1 || issuer.indexOf(query) !== -1) {
          tile.classList.remove('hidden');
          tile.classList.add('visible');
          visibleCount++;
        } else {
          tile.classList.add('hidden');
          tile.classList.remove('visible');
        }
      });

      if (noResults) {
        if (visibleCount === 0 && query.length > 0) {
          noResults.classList.add('visible');
        } else {
          noResults.classList.remove('visible');
        }
      }
    });
  }

  /* ── 6. Modal ────────────────────────────────────────────── */
  function openCertModal(cert, thumbHtml, credHtml) {
    var modal = document.getElementById('cert-modal');
    var modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    var linkIconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

    var linkButtonHtml = cert.url
      ? '<a href="' + escapeHtml(cert.url) + '" target="_blank" rel="noopener noreferrer" class="modal-link-btn">' +
        'View Credential ' + linkIconSvg + '</a>'
      : '';

    var descText = cert.description
      ? escapeHtml(cert.description)
      : 'This certification verifies the successful completion of the required curriculum, demonstrating foundational proficiency and practical skills in this subject area.';

    modalBody.innerHTML =
      '<div class="modal-img-container">' + thumbHtml + '</div>' +
      '<div class="modal-info">' +
        '<h3>' + escapeHtml(cert.title) + '</h3>' +
        '<div class="modal-issuer-line">' + escapeHtml(cert.issuer) + ' &middot; Issued ' + escapeHtml(cert.date) + '</div>' +
        '<div class="modal-credential-line">' + credHtml + '</div>' +
        linkButtonHtml +
        '<p class="modal-description">' + descText + '</p>' +
      '</div>';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    var modal = document.getElementById('cert-modal');
    if (modal) {
      modal.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  /* ── 7. Event listeners: close modal ────────────────────── */
  var modalCloseBtn = document.getElementById('modal-close');
  var modalOverlay = document.getElementById('cert-modal');

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCertModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        closeCertModal();
      }
    });
  }

  /* ── 8. Scroll progress bar ───────────────────────────────── */
  var scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    var totalHeight = document.body.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    var percent = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = percent + '%';
  }

  /* ── 9. Back to top button ──────────────────────────────── */
  var backToTopBtn = document.getElementById('back-to-top');

  function updateBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 10. Unified scroll listener ────────────────────────── */
  window.addEventListener('scroll', function () {
    updateScrollProgress();
    updateBackToTop();
  }, { passive: true });

  /* ── 11. Mobile menu ────────────────────────────────────── */
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileOverlay = document.getElementById('mobile-overlay');
  var menuCloseBtn = document.getElementById('menu-close');

  function openMobileMenu() {
    if (hamburgerBtn) hamburgerBtn.classList.add('open');
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (hamburgerBtn) hamburgerBtn.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  if (mobileMenu) {
    var mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ── 12. Global keyboard handler ────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modalOverlay && modalOverlay.classList.contains('active')) {
        closeCertModal();
      }
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    }
  });

  /* ── 13. IntersectionObserver for scroll reveal ─────────── */
  function initScrollReveal() {
    var tiles = document.querySelectorAll('.cert-tile');
    if (!tiles.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = Array.prototype.indexOf.call(
            entry.target.parentNode.children,
            entry.target
          ) % 9 * 60;
          setTimeout(function () {
            entry.target.classList.add('revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    tiles.forEach(function (tile) {
      observer.observe(tile);
    });
  }

  /* ── 14. Init ───────────────────────────────────────────── */
  window.scrollTo(0, 0);
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function init() {
    renderCerts();
    updateScrollProgress();
    updateBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();