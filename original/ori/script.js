// ==========================================
// 1. TERMINAL BOOT SEQUENCE (PRELOADER)
// ==========================================
const bootText = document.getElementById('boot-text');
const preloader = document.getElementById('preloader');

const terminalLogs = [
    "> Starting the boot sequence...",
    "> Initializing kernel...",
    "> Establishing secure connection...",
    "> Loading embedded modules...",
    "> Compiling Necessary Files",
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
document.getElementById('menu-toggle').addEventListener('click', () => {
    mobileMenu.classList.add('open');
});
document.getElementById('menu-close').addEventListener('click', () => {
    mobileMenu.classList.remove('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
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
        resumeIframe.src = 'ori/resume.pdf';
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
});

modalClose.addEventListener('click', () => {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
    // Delay clearing src to prevent flash/reload glitches on some browsers
    setTimeout(() => { resumeIframe.src = ''; }, 300);
});

// Close modal when clicking outside the content box
resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
        modalClose.click();
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

window.addEventListener('scroll', () => {
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
            const langTag = repo.language ? `<span>${repo.language}</span>` : '';

            card.innerHTML = `
                <h3 style="text-transform: capitalize;">${cleanName} <span>→</span></h3>
                <p>${repo.description || 'No description provided.'}</p>
                <p style="font-size: 0.75rem; color: #525252; margin-bottom: 0.75rem;">Updated: ${updateDate}</p>
                <div class="tags small">${langTag}</div>
            `;

            // No need for applyTiltEffect - handled by global mousemove
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to fetch GitHub projects:', error);
        container.innerHTML = '<p style="color: #ef4444; font-size: 0.9rem;">Failed to load recent projects. Check my GitHub profile directly!</p>';
    }
}

fetchRecentProjects();

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
// 10. SKILL BAR ANIMATION ON SCROLL (FIXED)
// ==========================================
const skillBarsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                const targetWidth = bar.dataset.width;
                if (targetWidth) {
                    bar.style.width = targetWidth + '%';
                }
            });
            // Only trigger once
            skillBarsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 }); // Lower threshold for earlier trigger

// Observe all skill bars containers
document.querySelectorAll('.skill-bars').forEach(el => skillBarsObserver.observe(el));

// Fallback: if skill bars are already visible on page load, trigger them manually
// This ensures they load even if the observer doesn't fire immediately.
setTimeout(() => {
    document.querySelectorAll('.skill-bars').forEach(container => {
        const rect = container.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
        if (isVisible) {
            container.querySelectorAll('.skill-bar-fill').forEach(bar => {
                const targetWidth = bar.dataset.width;
                if (targetWidth) {
                    bar.style.width = targetWidth + '%';
                }
            });
            skillBarsObserver.unobserve(container);
        }
    });
}, 500);

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