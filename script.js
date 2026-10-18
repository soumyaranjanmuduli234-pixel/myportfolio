/* ============================================
   PORTFOLIO INTERACTIVITY (COMPLETE)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // PAGE LOADER
    // ==========================================
    const pageLoader = document.getElementById('pageLoader');
    window.addEventListener('load', function () {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 1800);
    });

    // Fallback
    setTimeout(() => {
        if (pageLoader && !pageLoader.classList.contains('hidden')) {
            pageLoader.classList.add('hidden');
        }
    }, 3000);

    // ==========================================
    // READING PROGRESS BAR
    // ==========================================
    const readingProgress = document.getElementById('readingProgress');
    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        readingProgress.style.width = progress + '%';
    });

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        function animateOutline() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Hover effect on links/buttons
        document.querySelectorAll('a, button, .skill-card, .project-card, .service-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
    }

    // ==========================================
    // PARTICLE BACKGROUND
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                ctx.fillStyle = isDark
                    ? `rgba(88, 238, 158, ${this.opacity})`
                    : `rgba(26, 122, 74, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function connectParticles() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.15;
                        ctx.strokeStyle = isDark
                            ? `rgba(88, 238, 158, ${opacity})`
                            : `rgba(26, 122, 74, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationId = requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================
    // THEME TOGGLE
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', function () {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);

        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', newTheme === 'dark' ? '#0f172a' : '#1a7a4a');
        }
    });

    // ==========================================
    // LIVE CLOCK
    // ==========================================
    const liveClock = document.getElementById('liveClock');
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        liveClock.textContent = `${hours}:${minutes}:${seconds} IST`;
    }
    if (liveClock) {
        updateClock();
        setInterval(updateClock, 1000);
    }

    // ==========================================
    // VISITOR COUNTER (localStorage-based)
    // ==========================================
    const visitorCount = document.getElementById('visitorCount');
    if (visitorCount) {
        let count = localStorage.getItem('portfolio-visits');
        if (!count) {
            count = Math.floor(Math.random() * 500) + 1200;
        } else {
            count = parseInt(count) + 1;
        }
        localStorage.setItem('portfolio-visits', count);
        visitorCount.textContent = count.toLocaleString();
    }

    // ==========================================
    // NAVBAR SCROLL
    // ==========================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        updateActiveNavLink();
    });

    // ==========================================
    // MOBILE HAMBURGER
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ==========================================
    // ACTIVE NAV LINK
    // ==========================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================
    // TYPING ANIMATION
    // ==========================================
    const typedTextElement = document.getElementById('typedText');
    const textsToType = [
        'Full Stack Web Developer',
        'Python Developer',
        'Software Creator',
        'Mechanical Engineering Student'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentText = textsToType[textIndex];

        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textsToType.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    if (typedTextElement) {
        typeText();
    }

    // ==========================================
    // SKILL BARS ANIMATION
    // ==========================================
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillsSection = document.querySelector('.skills');

    function animateSkillBars() {
        skillFills.forEach(fill => {
            const width = fill.getAttribute('data-width');
            fill.style.width = width;
        });
    }

    if ('IntersectionObserver' in window && skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(skillsSection);
    } else {
        animateSkillBars();
    }

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    const statBoxes = document.querySelectorAll('.stat-box h3[data-count]');

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        function update() {
            current += step;
            if (current < target) {
                element.textContent = Math.ceil(current);
                requestAnimationFrame(update);
            } else {
                element.textContent = target + (target === 100 ? '' : '+');
            }
        }
        update();
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statBoxes.forEach(box => counterObserver.observe(box));
    }

    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ==========================================
    // COPY LINK BUTTON
    // ==========================================
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function () {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                const originalHTML = copyLinkBtn.innerHTML;
                copyLinkBtn.innerHTML = '✓';
                copyLinkBtn.style.background = '#10b981';
                setTimeout(() => {
                    copyLinkBtn.innerHTML = originalHTML;
                    copyLinkBtn.style.background = '';
                }, 2000);
            });
        });
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================================
    // IMAGE LOADING (SAFE)
    // ==========================================
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function () {
                img.classList.add('loaded');
            });
            img.addEventListener('error', function () {
                img.classList.add('loaded');
                console.warn('Image failed to load:', img.src);
            });
        }
    });

    // ==========================================
    // KEYBOARD SHORTCUTS
    // ==========================================
    document.addEventListener('keydown', function (e) {
        // Ctrl+Shift+D = Toggle theme
        if (e.key === 'd' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
            e.preventDefault();
            themeToggle.click();
        }

        // Ctrl+H = Home
        if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

});

/* ============================================
   LIGHTBOX
   ============================================ */
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

//right click disable code //

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  logSecurityIntegrityEvent(
    "WARNING: Unauthorized Right-Click context menu request intercepted.",
    "warn-log"
  );
  triggerPremiumGlassToast(
    "Security Policy: Inspect options restricted.",
    "error-type"
  );
});

document.addEventListener("keydown", (e) => {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
    (e.ctrlKey && e.key === "U")
  ) {
    e.preventDefault();

    logSecurityIntegrityEvent(
      `CRITICAL: Hotkey combo '${e.key}' block activation triggered.`,
      "danger-log"
    );

    activateSecurityDefenseBlur();
  }
});

setInterval(() => {
  const startTime = performance.now();

  debugger;

  if (performance.now() - startTime > 100) {
    logSecurityIntegrityEvent(
      "CRITICAL: Console injection debugger trap activated.",
      "danger-log"
    );

    activateSecurityDefenseBlur();
  }
}, 600);

function activateSecurityDefenseBlur() {
  document.body.classList.add("security-blur");

  triggerPremiumGlassToast(
    "Security Matrix Infringement Detected! Controls Intercepted.",
    "error-type"
  );

  setTimeout(() => {
    document.body.classList.remove("security-blur");
  }, 3500);
}

