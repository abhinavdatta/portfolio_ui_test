// ==========================================
// 1. TERMINAL BOOT SEQUENCE (PRELOADER)
// ==========================================
const bootText = document.getElementById('boot-text');
const preloader = document.getElementById('preloader');

const terminalLogs = [
    "> Starting the boot sequence...",
    "> Loaded:  \\User\\ori\\style.css",
    "> Loaded:  \\User\\ori\\script.js",
    "> Loaded:  \\User\\ori\\bunny.png",
    "> Loaded:  \\User\\certif\\certif.css",
    "> Loaded:  \\User\\certif\\certif.js",
    "> Loaded:  \\User\\certif.html",
    "> Loaded:  \\User\\privacy.html",
    "> Loaded:  \\User\\robots.txt",
    "> Loaded:  \\User\\index.html",
    "> Checking for updates...",
    "> Already on latest version",
    "> System ready. Welcome, User."
];
let logIndex = 0;

function simulateBoot() {
    if (logIndex < terminalLogs.length) {
        bootText.innerHTML += terminalLogs[logIndex] + "<br>";
        logIndex++;
        
        // Auto-scroll to the bottom of the terminal text
        bootText.scrollTop = bootText.scrollHeight;

        // Generate a random delay for a realistic loading feel
        let delay = Math.floor(Math.random() * 150) + 50; 
        
        // Make the final "Welcome" pause a little longer before fading out
        if (logIndex === terminalLogs.length - 1) delay = 600;

        setTimeout(simulateBoot, delay);
    } else {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    }
}

window.addEventListener('load', simulateBoot);

// ==========================================
// 2. TYPING ANIMATION
// ==========================================
const typed = document.getElementById('typed');
const phrases = [
    'ECE Student',
    'Web Developer',
    'Tech Enthusiast',
    'Problem Solver',
    'Embedded Systems Learner'
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
    const current = phrases[phraseIdx];
    typed.textContent = current.substring(0, deleting ? --charIdx : ++charIdx);
    let delay = deleting ? 40 : 80;

    if (!deleting && charIdx === current.length) {
        delay = 2000;
        deleting = true;
    } else if (deleting && charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 400;
    }
    setTimeout(type, delay);
}
type();

// ==========================================
// 3. MOBILE MENU
// ==========================================
const mobileMenu = document.getElementById('mobile-menu');
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const focusableSelector = 'a[href], button:not([disabled]), iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])';
let activeFocusTrap = null;

function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(focusableSelector))
        .filter(el => el.getClientRects().length > 0 || el === document.activeElement);
}

function activateFocusTrap(container, returnTarget, initialTarget) {
    activeFocusTrap = { container, returnTarget };
    requestAnimationFrame(() => {
        const firstTarget = initialTarget || getFocusableElements(container)[0] || container;
        firstTarget.focus();
    });
}

function releaseFocusTrap(container) {
    if (!activeFocusTrap || activeFocusTrap.container !== container) return;
    const { returnTarget } = activeFocusTrap;
    activeFocusTrap = null;
    if (returnTarget && typeof returnTarget.focus === 'function') {
        returnTarget.focus();
    }
}

function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    activateFocusTrap(mobileMenu, menuToggle, menuClose);
}

function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    releaseFocusTrap(mobileMenu);
}

menuToggle.setAttribute('aria-expanded', 'false');
menuToggle.setAttribute('aria-controls', 'mobile-menu');
mobileMenu.setAttribute('aria-hidden', 'true');

menuToggle.addEventListener('click', openMobileMenu);
menuClose.addEventListener('click', closeMobileMenu);
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('keydown', (e) => {
    if (!activeFocusTrap) return;

    const { container } = activeFocusTrap;

    if (e.key === 'Escape') {
        e.preventDefault();
        if (container === mobileMenu) closeMobileMenu();
        if (container === resumeModal) closeResumeModal();
        return;
    }

    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements(container);
    if (!focusable.length) {
        e.preventDefault();
        container.focus();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// ==========================================
// 4. SMOOTH SCROLL OFFSET
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#") return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ==========================================
// 5. RESUME MODAL VIEWER (FIXED FOR MOBILE)
// ==========================================
const resumeModal = document.getElementById('resume-modal');
const resumeIframe = document.getElementById('resume-iframe');
const resumeBtn = document.getElementById('resume-btn');
const modalClose = document.getElementById('modal-close');

// Reliable mobile/touch detection
const isMobile = () => window.matchMedia("(pointer: coarse)").matches || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents parent link/form interference

    if (isMobile()) {
        // Mobile: Open directly in a new tab to prevent iframe reload bugs
        window.open('ori/resume.pdf', '_blank');
    } else {
        // Desktop: Use your existing modal
        openResumeModal();
    }
});

function openResumeModal() {
    resumeIframe.src = 'ori/resume.pdf';
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    activateFocusTrap(resumeModal, resumeBtn, modalClose);
}

function closeResumeModal() {
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Delay clearing src to prevent flash/reload glitches on some browsers
    setTimeout(() => { resumeIframe.src = ''; }, 300);
    releaseFocusTrap(resumeModal);
}

resumeModal.setAttribute('aria-hidden', 'true');
resumeModal.setAttribute('role', 'dialog');
resumeModal.setAttribute('aria-modal', 'true');
modalClose.addEventListener('click', closeResumeModal);

// Close modal when clicking outside the content box
resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
        closeResumeModal();
    }
});
// ==========================================
// 6. SCROLL REVEAL ANIMATION
// ==========================================
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealOnScroll.observe(el));

// ==========================================
// 7. SCROLL EVENTS (Progress, Active Nav, Back-to-Top)
// ==========================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const backToTopBtn = document.getElementById('back-to-top');
const scrollProgress = document.getElementById('scroll-progress');
const nav = document.getElementById('nav');
let lastScrollY = window.scrollY;
let scrollTicking = false;

function handleScroll() {
    // A. Active Nav Link Highlighting
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // B. Back to Top Button Visibility
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }

    // C. Scroll Progress Bar
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = progress + '%';

    // D. Hide nav on scroll down, show on scroll up
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 120) {
        nav.classList.add('nav-hidden');
    } else {
        nav.classList.remove('nav-hidden');
    }
    lastScrollY = Math.max(currentScrollY, 0);
    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(handleScroll);
        scrollTicking = true;
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================
// 8. 3D TILT EFFECT & DYNAMIC RECENT PROJECTS
// ==========================================
// Optimized 3D Tilt Effect - works for any .project-card or .cert-card-new
document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.project-card, .cert-card-new');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateX = ((y - (rect.height / 2)) / (rect.height / 2)) * -5; 
    const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 5;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
});

// Reset tilt when mouse leaves the card
document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.project-card, .cert-card-new');
    if (card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
});

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function fetchRecentProjects() {
    const container = document.getElementById('recent-projects-grid');
    if (!container) return;

    try {
        const response = await fetch('https://api.github.com/users/abhinavdatta/repos?sort=updated&per_page=3');
        if (!response.ok) throw new Error('Network response was not ok');
        const repos = await response.json();

        container.innerHTML = '';

        repos.forEach(repo => {
            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = '_blank';
            card.rel = 'noopener';
            card.className = 'project-card';

            const cleanName = repo.name.replace(/-/g, ' ');
            const updateDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            });
            const langTag = repo.language ? `<span>${escapeHTML(repo.language)}</span>` : '';

            card.innerHTML = `
                <h3 class="project-card-title">${escapeHTML(cleanName)} <span>→</span></h3>
                <p>${escapeHTML(repo.description || 'No description provided.')}</p>
                <p class="project-updated">Updated: ${escapeHTML(updateDate)}</p>
                <div class="tags small">${langTag}</div>
            `;

            // No need for applyTiltEffect - handled by global mousemove
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to fetch GitHub projects:', error);
        container.innerHTML = '<p class="projects-status error">Failed to load recent projects. Check my GitHub profile directly!</p>';
    }
}

fetchRecentProjects();

// Gracefully hide external GitHub summary card images if the service is blocked.
document.querySelectorAll('.github-summary-card').forEach(img => {
    img.addEventListener('error', () => {
        img.classList.add('is-hidden');
    }, { once: true });
});

// ==========================================
// 9. THEME TOGGLE (Dark / Light Mode)
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const themeSun = document.getElementById('theme-icon-sun');
const themeMoon = document.getElementById('theme-icon-moon');

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
});

function updateThemeIcon(theme) {
    if (theme === 'light') {
        themeSun.style.display = 'none';
        themeMoon.style.display = 'block';
    } else {
        themeSun.style.display = 'block';
        themeMoon.style.display = 'none';
    }
}

// ==========================================
// 10. WINDOWS 7 PROGRESS BAR ANIMATION
// ==========================================
function fillSkillBars(container) {
    container.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const targetWidth = bar.dataset.width;
        if (targetWidth) {
            bar.style.width = targetWidth + '%';
        }
    });
}

const skillBarsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            fillSkillBars(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.25 });

document.querySelectorAll('.skill-bars').forEach(el => skillBarsObserver.observe(el));

window.addEventListener('load', () => {
    document.querySelectorAll('.skill-bars').forEach(container => {
        const rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            fillSkillBars(container);
            skillBarsObserver.unobserve(container);
        }
    });
});

// ==========================================
// 11. FORCE SCROLL TO TOP ON LOAD/REFRESH
// ==========================================
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  // Optional: Disable browser's automatic scroll restoration completely
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
});
