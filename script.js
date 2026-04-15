/* ============================================================
   SERGIO LÓPEZ HERRERO — PORTFOLIO
   JavaScript: Particles, Animations, Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initScrollReveal();
    initSkillBars();
    initPortfolioFilters();
    initContactForm();
    initSmoothScroll();
});

/* ==================== PARTICLE SYSTEM ==================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationId;

    const COLORS = [
        { r: 0, g: 240, b: 255 },    // Cyan
        { r: 255, g: 0, b: 170 },    // Magenta
        { r: 139, g: 92, b: 246 },   // Purple
    ];

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor((width * height) / 12000), 120);
        for (let i = 0; i < count; i++) {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                color: color,
                alpha: Math.random() * 0.5 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.005,
                pulseOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    function drawParticle(p, time) {
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;
        const alpha = p.alpha * pulse;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.1})`;
        ctx.fill();
    }

    function drawConnections() {
        const maxDist = 130;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.12;
                    const p = particles[i];
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function updateParticles() {
        for (const p of particles) {
            // Mouse interaction
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force * 0.3;
                    p.vy += Math.sin(angle) * force * 0.3;
                }
            }

            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;
        }
    }

    let time = 0;
    function animate() {
        time++;
        ctx.clearRect(0, 0, width, height);
        updateParticles();
        drawConnections();
        for (const p of particles) {
            drawParticle(p, time);
        }
        animationId = requestAnimationFrame(animate);
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    // Init
    resize();
    createParticles();
    animate();
}

/* ==================== NAVBAR ==================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Scroll class
    function onScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        const sections = document.querySelectorAll('.section, .hero');
        let currentSection = '';
        sections.forEach((section) => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                currentSection = section.id;
            }
        });

        links.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });
    }

    // Close mobile menu on link click
    links.forEach((link) => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ==================== SCROLL REVEAL ==================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                const parent = entry.target.closest('.project-grid, .education-grid, .demo-reels, .professional-skills');
                if (parent) {
                    const siblings = parent.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
                    const idx = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${idx * 0.1}s`;
                }

                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
}

/* ==================== SKILL BARS ANIMATION ==================== */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width + '%';
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    skillBars.forEach((bar) => observer.observe(bar));
}

/* ==================== PORTFOLIO FILTERS ==================== */
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const demoReelCards = document.querySelectorAll('.demo-reel-card');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Filter project cards
            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.classList.add('hidden');
                }
            });

            // Filter demo reel cards
            demoReelCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==================== CONTACT FORM ==================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        if (!name || !email || !message) return;

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Show success state
        const formParent = form.parentElement;
        form.style.opacity = '0';
        form.style.transform = 'translateY(20px)';

        setTimeout(() => {
            form.innerHTML = `
                <div class="form-success">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <h3>Message Sent!</h3>
                    <p>Thank you, ${name}. I'll get back to you soon.</p>
                </div>
            `;
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 300);
    });
}

/* ==================== SMOOTH SCROLL ==================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const top = target.offsetTop - navHeight;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth',
                });
            }
        });
    });
}

/* ==================== TYPING EFFECT (HERO TAGLINE) ==================== */
(function initTypingEffect() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;

    const fullText = tagline.textContent;
    const decorator = tagline.querySelector('.tagline-decorator');
    const decoratorText = decorator ? decorator.textContent : '';

    // Only run after a small delay to let the page load
    setTimeout(() => {
        const textOnly = fullText.replace(decoratorText, '').trim();
        tagline.innerHTML = `<span class="tagline-decorator">${decoratorText}</span><span class="typed-text"></span><span class="cursor-blink">|</span>`;

        const typedEl = tagline.querySelector('.typed-text');
        const cursorEl = tagline.querySelector('.cursor-blink');

        // Style cursor
        cursorEl.style.color = 'var(--neon-cyan)';
        cursorEl.style.animation = 'cursor-blink 1s step-end infinite';

        // Add cursor blink keyframe
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cursor-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        let charIndex = 0;
        function type() {
            if (charIndex < textOnly.length) {
                typedEl.textContent += textOnly[charIndex];
                charIndex++;
                setTimeout(type, 50 + Math.random() * 40);
            } else {
                // Remove cursor after typing
                setTimeout(() => {
                    cursorEl.style.display = 'none';
                }, 2000);
            }
        }

        type();
    }, 800);
})();
