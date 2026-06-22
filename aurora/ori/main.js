/* ============================================
   Aurora Glass v2 — Main Orchestrator
   ============================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // --- Preloader ---
    var preloader = document.getElementById('preloader');
    var mainContent = document.getElementById('main-content');
    var resumeBtn = document.getElementById('resume-btn');

    // Show content after preloader
    setTimeout(function () {
      if (preloader) preloader.classList.add('hidden');
      if (mainContent) mainContent.classList.add('visible');

      // Show resume button with delay
      setTimeout(function () {
        if (resumeBtn) resumeBtn.classList.add('visible');
      }, 600);

      // Init all modules
      if (window.Portfolio && window.Portfolio.typing) window.Portfolio.typing.init();
      if (window.Portfolio && window.Portfolio.scroll) window.Portfolio.scroll.init();
      if (window.Portfolio && window.Portfolio.github) window.Portfolio.github.init();
      if (window.Portfolio && window.Portfolio.navbar) window.Portfolio.navbar.init();
    }, 1500);

    // --- Back to Top ---
    var backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // --- Resume Button ---
    var resumeIframe = document.getElementById('resume-iframe');
    var resumeFallback = document.getElementById('resume-fallback');
    var isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    if (resumeBtn) {
      resumeBtn.addEventListener('click', function () {
        // On mobile: open PDF in a new tab (mobile browsers lack inline PDF viewers)
        if (isMobile) {
          window.open('ori/resume.pdf', '_blank');
          return;
        }

        // On desktop: use the iframe modal
        var modal = document.getElementById('resume-modal');
        if (!modal) return;

        if (resumeIframe) {
          resumeIframe.style.display = 'block';
          if (resumeFallback) resumeFallback.style.display = 'none';
          resumeIframe.src = 'ori/resume.pdf';

          resumeIframe.onerror = function () {
            resumeIframe.style.display = 'none';
            if (resumeFallback) resumeFallback.style.display = 'flex';
          };

          setTimeout(function () {
            try {
              var doc = resumeIframe.contentDocument || resumeIframe.contentWindow.document;
              if (!doc || doc.URL === 'about:blank') {
                resumeIframe.style.display = 'none';
                if (resumeFallback) resumeFallback.style.display = 'flex';
              }
            } catch (e) {
              // Cross-origin means PDF loaded successfully
            }
          }, 3000);
        }

        modal.classList.add('active');
      });
    }

    // --- Resume Modal Close ---
    var resumeModal = document.getElementById('resume-modal');
    if (resumeModal) {
      resumeModal.addEventListener('click', function (e) {
        if (e.target === resumeModal) {
          resumeModal.classList.remove('active');
          if (resumeIframe) setTimeout(function () { resumeIframe.src = ''; }, 300);
        }
      });
      var resumeClose = resumeModal.querySelector('.modal-close-btn');
      if (resumeClose) {
        resumeClose.addEventListener('click', function () {
          resumeModal.classList.remove('active');
          if (resumeIframe) setTimeout(function () { resumeIframe.src = ''; }, 300);
        });
      }
    }

    // --- Cert Modal ---
    var certModal = document.getElementById('cert-modal');
    if (certModal) {
      certModal.addEventListener('click', function (e) {
        if (e.target === certModal) {
          certModal.classList.remove('active');
        }
      });
      var certClose = certModal.querySelector('.modal-close-btn');
      if (certClose) {
        certClose.addEventListener('click', function () {
          certModal.classList.remove('active');
        });
      }
    }

    // --- Cert View Buttons (data attributes) ---
    document.querySelectorAll('.cert-view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var title = this.getAttribute('data-title') || '';
        var issuer = this.getAttribute('data-issuer') || '';
        var date = this.getAttribute('data-date') || '';
        var desc = this.getAttribute('data-desc') || '';

        // Generate issuer initials for image placeholder
        var initials = issuer.split(/\s+/).map(function(w) { return w.charAt(0).toUpperCase(); }).slice(0, 2).join('');
        // Generate a consistent hue from the title
        var hue = 0;
        for (var i = 0; i < title.length; i++) { hue = (hue + title.charCodeAt(i)) % 360; }

        var imageHtml =
          '<div class="modal-cert-image">' +
            '<div class="modal-cert-placeholder" style="background: linear-gradient(135deg, hsl(' + hue + ', 50%, 18%), hsl(' + ((hue + 60) % 360) + ', 50%, 14%));">' +
              '<div class="modal-cert-badge">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:2.5rem;height:2.5rem;opacity:0.5;"><path d="M12 15l-3-3h2V8h2v4h2l-3 3z"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>' +
                '<div class="modal-cert-initials">' + initials + '</div>' +
              '</div>' +
              '<div class="modal-cert-label">Certificate</div>' +
            '</div>' +
          '</div>';

        var content = document.getElementById('cert-modal-content');
        if (content && certModal) {
          content.innerHTML =
            imageHtml +
            '<div class="modal-title">' + title + '</div>' +
            '<div class="modal-meta">' + issuer + ' &middot; ' + date + '</div>' +
            (desc ? '<div class="modal-body">' + desc + '</div>' : '<div class="modal-body">No additional details available.</div>');
          certModal.classList.add('active');
        }
      });
    });

    // --- Theme Toggle ---
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        if (window.Portfolio && window.Portfolio.theme) {
          window.Portfolio.theme.toggle();
        }
      });
    }

    // --- Escape key closes modals ---
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (resumeModal) resumeModal.classList.remove('active');
        if (certModal) certModal.classList.remove('active');
      }
    });
  });
})();