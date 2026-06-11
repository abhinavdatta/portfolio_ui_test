// --------------------------------------------------------------
// CERTIFICATIONS DATA - Load from embedded JSON in HTML
// --------------------------------------------------------------
const certDataEl = document.getElementById('cert-data');
const certifications = certDataEl ? JSON.parse(certDataEl.textContent) : [];

// Helper: escape HTML to prevent XSS and broken attributes
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return map[m] || m;
    });
}

function getFallbackSVG() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
        <path d="M8 7H16" stroke-linecap="round"/>
        <path d="M8 11H14" stroke-linecap="round"/>
        <path d="M8 15H12" stroke-linecap="round"/>
        <circle cx="17.5" cy="15.5" r="2.5"/>
        <path d="M19 17L21 19" stroke-linecap="round"/>
    </svg>`;
}

// Render all certificates in YouTube style layout
function renderCertificates() {
    const container = document.getElementById('certs-container');
    if (!container) return;
    container.innerHTML = '';

    const fallbackIcon = getFallbackSVG();

    certifications.forEach(cert => {
        const tile = document.createElement('div');
        tile.className = 'cert-tile';

        const credHtml = cert.credentialId 
            ? `<span>ID: ${escapeHtml(cert.credentialId)}</span>` 
            : `<span>No ID Available</span>`;

        let thumbHtml = '';
        
        if (cert.thumbnail) {
            const safeSrc = escapeHtml(cert.thumbnail);
            const safeAlt = escapeHtml(cert.title);
            thumbHtml = `
                <img class="cert-img" src="${safeSrc}" alt="${safeAlt}" 
                     onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="fallback-icon" style="display:none;">
                    ${fallbackIcon}
                </div>
            `;
        } else {
            thumbHtml = `
                <div class="fallback-icon" style="display:flex;">
                    ${fallbackIcon}
                </div>
            `;
        }

        tile.innerHTML = `
            <div class="cert-thumb">
                ${thumbHtml}
                <div class="cert-date-overlay">${escapeHtml(cert.date)}</div>
            </div>
            <div class="cert-info">
                <div class="cert-title">${escapeHtml(cert.title)}</div>
                <div class="cert-issuer">${escapeHtml(cert.issuer)}</div>
                <div class="cert-credential">${credHtml}</div>
            </div>
        `;

        tile.addEventListener('click', () => {
            openModal(cert, thumbHtml, credHtml);
        });

        container.appendChild(tile);
    });

    // Intersection Observer for scroll reveal animations
    const tiles = document.querySelectorAll('.cert-tile');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    tiles.forEach(tile => observer.observe(tile));
}

// --------------------------------------------------------------
// MODAL LOGIC
// --------------------------------------------------------------
function openModal(cert, thumbHtml, credHtml) {
    const modal = document.getElementById('cert-modal');
    const modalBody = document.getElementById('modal-body-content');
    
    // The external link icon
    const linkIconSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;

    // Check if URL exists and create the button HTML
    const linkButtonHtml = cert.url 
        ? `<a href="${escapeHtml(cert.url)}" target="_blank" rel="noopener noreferrer" class="modal-link-btn">
            View Credential ${linkIconSVG}
           </a>`
        : '';
        
    // 🔴 NEW: Check if a custom description exists in the JSON, otherwise use the fallback text
    const descriptionText = cert.description 
        ? escapeHtml(cert.description) 
        : "This certification verifies the successful completion of the required curriculum, demonstrating foundational proficiency and practical skills in this subject area.";
    
    // Inject data into the modal
    modalBody.innerHTML = `
        <div class="modal-img-container">
            ${thumbHtml}
        </div>
        <div class="modal-info">
            <h3>${escapeHtml(cert.title)}</h3>
            <div class="cert-issuer modal-cert-issuer">
                ${escapeHtml(cert.issuer)} • Issued ${escapeHtml(cert.date)}
            </div>
            <div class="cert-credential modal-cert-credential">${credHtml}</div>
            
            ${linkButtonHtml}
            
            <p class="modal-desc">
                ${descriptionText}
            </p>
        </div>
    `;

    // Show modal and lock background scrolling
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('cert-modal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll
}

// Close Modal when clicking the 'X' or outside the box
const closeBtn = document.getElementById('modal-close');
const modalOverlay = document.getElementById('cert-modal');

if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Theme toggle logic
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const sun = document.getElementById('theme-icon-sun');
    const moon = document.getElementById('theme-icon-moon');
    if (!toggle) return;

    function updateIcon(theme) {
        if (theme === 'light') {
            sun.style.display = 'none';
            moon.style.display = 'block';
        } else {
            sun.style.display = 'block';
            moon.style.display = 'none';
        }
    }

    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateIcon(saved);

    toggle.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcon(next);
    });
}

// Mobile menu logic
function initMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const openBtn = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('menu-close');
    if (!menu || !openBtn || !closeBtn) return;
    openBtn.addEventListener('click', () => menu.classList.add('open'));
    closeBtn.addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => menu.classList.remove('open'));
    });
}

// Scroll progress and back to top logic
function initScroll() {
    const progress = document.getElementById('scroll-progress');
    const backBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        const total = document.body.scrollHeight - window.innerHeight;
        const percent = (window.scrollY / total) * 100;
        if (progress) progress.style.width = percent + '%';
        if (backBtn) {
            if (window.scrollY > 500) backBtn.classList.add('visible');
            else backBtn.classList.remove('visible');
        }
    });
    if (backBtn) {
        backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

// Run everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderCertificates();
        initTheme();
        initMobileMenu();
        initScroll();
    });
} else {
    renderCertificates();
    initTheme();
    initMobileMenu();
    initScroll();
}
