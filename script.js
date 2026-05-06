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
    initLanguageSwitcher();
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

    // Elegant tech colors: Soft blue, soft cyan, and white
    const COLORS = [
        { r: 59, g: 130, b: 246 },   // Blue
        { r: 6, g: 182, b: 212 },    // Cyan
        { r: 255, g: 255, b: 255 },  // White
    ];

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        // More particles for a livelier background
        const count = Math.min(Math.floor((width * height) / 10000), 120);
        for (let i = 0; i < count; i++) {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8, // Elegant, smooth speed
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 2.5 + 1.2, // Small, sharp particles
                color: color,
                alpha: Math.random() * 0.3 + 0.4, // Balanced opacity
                pulseSpeed: Math.random() * 0.02 + 0.005,
                pulseOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    function drawParticle(p, time) {
        // Very subtle pulsing
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.2 + 0.8;
        const alpha = p.alpha * pulse;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.fill();
    }

    function drawConnections() {
        const maxDist = 150; // Longer distance for more connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.12; // Subtle tech lines
                    const p = particles[i];
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }
        }
    }

    function updateParticles() {
        for (const p of particles) {
            // Mouse interaction (soft repulsion)
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    // Smoother, consistent repulsion
                    p.vx += Math.cos(angle) * force * 0.4;
                    p.vy += Math.sin(angle) * force * 0.4;
                }
            }

            // Damping for smooth slow down
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Soft wrap
            if (p.x < -20) p.x = width + 20;
            if (p.x > width + 20) p.x = -20;
            if (p.y < -20) p.y = height + 20;
            if (p.y > height + 20) p.y = -20;
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
        if (window.scrollY > 20) {
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
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const parent = entry.target.closest('.project-grid, .education-grid, .demo-reels, .professional-skills');
                if (parent) {
                    const siblings = parent.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
                    const idx = Array.from(siblings).indexOf(entry.target);
                    // Shorter delay for cleaner modern feel
                    entry.target.style.transitionDelay = `${idx * 0.08}s`;
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
                    card.style.transform = 'translateY(15px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
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
                    card.style.transform = 'translateY(15px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
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
        form.style.opacity = '0';
        form.style.transform = 'translateY(15px)';

        setTimeout(() => {
            form.innerHTML = `
                <div class="form-success">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <h3>Message Sent!</h3>
                    <p>Thank you, ${name}. I'll get back to you soon.</p>
                </div>
            `;
            form.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
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

/* ==================== LANGUAGE SWITCHER ==================== */
const enTranslations = {
    "nav_about": "About",
    "nav_portfolio": "Portfolio",
    "nav_skills": "Skills",
    "nav_experience": "Experience",
    "nav_education": "Education",
    "nav_contact": "Contact",
    "hero_badge": "Available for projects",
    "hero_title_1": "3D Designer",
    "hero_title_2": "VFX Artist",
    "hero_title_3": "UE5 Developer",
    "hero_tagline": "Creating immersive real-time experiences.",
    "hero_btn_portfolio": "View Portfolio",
    "hero_btn_contact": "Contact Me",
    "hero_scroll": "Scroll to explore",
    "about_tag": "01. PROFILE",
    "about_title": "About Me",
    "about_intro": "I am a <strong>3D Designer and VFX Artist</strong> specialized in real-time applications and immersive experiences using <strong>Unreal Engine 5</strong>.",
    "about_p1": "With strong experience in 3D modeling, visual effects, and interactive environments, I focus on creating high-quality visual and interactive content that pushes the boundaries of real-time rendering. By bridging the gap between creative vision and technical execution, I deliver modern experiences that captivate and inspire.",
    "about_p2": "Currently working as a <strong>Programmer and 3D Modeler</strong> with Unreal Engine 5, I am always exploring new ways to enhance interactive storytelling through advanced environments and logic.",
    "about_location": "Valladolid, Spain",
    "about_card_ue5": "Real-time rendering, blueprints, interactive environments & VR experiences",
    "about_card_3d_title": "3D Modeling",
    "about_card_3d": "High-poly & game-ready models with Maya, 3ds Max, ZBrush & Mudbox",
    "about_card_vfx_title": "Visual Effects",
    "about_card_vfx": "Particle systems, simulations & compositing with Houdini & After Effects",
    "portfolio_tag": "02. WORK",
    "portfolio_title": "Portfolio",
    "filter_all": "All",
    "filter_unreal": "Unreal Engine / VR",
    "filter_3d": "3D Modeling",
    "filter_vfx": "VFX",
    "reel_badge": "Demo Reel",
    "reel_3d_title": "3D Demo Reel",
    "reel_3d_desc": "A showcase of 3D modeling, texturing, and rendering projects created with industry-standard tools for professional pipelines.",
    "reel_badge2": "Demo Reel",
    "reel_vfx_title": "VFX Demo Reel",
    "reel_vfx_desc": "Visual effects work including particle systems, complex simulations, compositing, and performance-optimized real-time VFX.",
    "skills_tag": "03. CAPABILITIES",
    "skills_title": "Skills & Tools",
    "skills_software": "Software Arsenal",
    "skills_pro": "Core Competencies",
    "skill_pro_1": "Teamwork",
    "skill_pro_1_desc": "Collaborative mindset with cross-functional teams in agile environments.",
    "skill_pro_2": "Leadership",
    "skill_pro_2_desc": "Guiding technical and creative projects from concept to final delivery.",
    "skill_pro_3": "Responsibility",
    "skill_pro_3_desc": "Reliable execution with deep attention to detail and optimization.",
    "skill_pro_4": "Communication",
    "skill_pro_4_desc": "Clear articulation of complex technical concepts to non-technical peers.",
    "experience_tag": "04. TIMELINE",
    "experience_title": "Experience",
    "exp_date_1": "Nov 2023 — Present",
    "exp_title_1": "Programmer / 3D Modeler",
    "exp_desc_1": "Developing interactive experiences, 3D models, and real-time visualizations using Unreal Engine 5. Responsible for programming gameplay logic, optimizing high-fidelity 3D assets, and integrating modern visual effects into production pipelines.",
    "exp_date_2": "Apr 2018 — Jun 2019",
    "exp_title_2": "3D Modeler Intern",
    "exp_company_2": "Science Museum of Valladolid",
    "exp_desc_2": "Created 3D models and conceptual visualizations for educational exhibits and museum displays. Collaborated closely with the curation team to transform scientific concepts into engaging, interactive digital content.",
    "edu_tag": "05. ACADEMICS",
    "edu_title": "Education",
    "edu_level_1": "Master's Degree",
    "edu_title_1": "Master in Visual Effects",
    "edu_desc_1": "Advanced VFX techniques, heavy compositing, and digital effects for both film and complex real-time applications.",
    "edu_level_2": "Master's Degree",
    "edu_title_2": "Master in 3D Animation",
    "edu_desc_2": "Comprehensive 3D animation training covering character animation, technical rigging, and cinematic production.",
    "edu_level_3": "Higher Technician",
    "edu_title_3": "3D Animation, Games & Interactive Environments",
    "edu_desc_3": "Professional training in full-cycle game development, 3D art production, and immersive media creation.",
    "edu_level_4": "High School",
    "edu_title_4": "Science and Technology",
    "edu_desc_4": "Foundation in science, math, and technology disciplines, providing a strong analytical approach to problem-solving.",
    "lang_title": "Languages",
    "lang_es": "Spanish",
    "lang_es_lvl": "Native",
    "lang_en": "English",
    "lang_en_lvl": "B2 — Cambridge",
    "contact_tag": "06. CONNECT",
    "contact_title": "Get in Touch",
    "contact_sub": "Interested in collaborating or have a project in mind? Let's build something extraordinary.",
    "contact_email": "Email",
    "contact_phone": "Phone",
    "contact_location": "Location",
    "contact_loc_value": "Valladolid, Spain",
    "form_name": "Name",
    "form_email": "Email",
    "form_message": "Message",
    "form_submit": "Send Message",
    "footer_copy": "&copy; 2025 Sergio López Herrero. All rights reserved.",
    "footer_about": "About",
    "footer_work": "Work",
    "footer_exp": "Experience",
    "proj_activa_title": "ACTIVA",
    "proj_activa_desc": "Development of a virtual reality application for senior residences, focused on cognitive stimulation and fine/gross motor exercises. Participated in full development using Unreal Engine 5, including environment design, 3D UI development, and interactive logic programming via Blueprints.",
    "proj_gestaverso_title": "GESTAVERSO",
    "proj_gestaverso_desc": "Development of an immersive experience for pregnant women, designed for support and interactive activities. Creation of 3D environments and interactive logic using Blueprints in Unreal Engine 5.",
    "proj_unileon_title": "CUENTOS UNILEON",
    "proj_unileon_desc": "Development of an interactive storytelling experience in a virtual environment. Creation of 3D scenarios and programming of events and interactions using Blueprints in Unreal Engine 5.",
    "proj_emasesa_title": "EMASESA DEMO",
    "proj_emasesa_desc": "Digitalization of a WWTP (Wastewater Treatment Plant) through the creation of an interactive 3D environment. Work focused on scenario recreation and visual representation of the environment.",
    "proj_industria_title": "INDUSTRIA DEMO",
    "proj_industria_desc": "Development of an interactive experience oriented towards learning in industrial environments. Creation of scenarios and interactive logic development with Blueprints in Unreal Engine 5, focused on training.",
    "proj_carnica_title": "CÁRNICA (XR2Learn)",
    "proj_carnica_desc": "Development of a training application focused on the meat sector within an immersive environment. Creation of 3D scenarios and interaction development using Blueprints in Unreal Engine 5.",
    "proj_ajedrez_title": "CHESS WITH HEAD",
    "proj_ajedrez_desc": "Development of an application for teaching chess in a digital environment. Integration and adaptation of a specialized plugin within the application to improve its functionality in the environment.",
    "proj_iberdrola_title": "IBERDROLA",
    "proj_iberdrola_desc": "Development of an immersive experience in a 360º environment for station visualization. Content creation oriented towards exploration and interactive visualization.",
    "proj_cajero_title": "ATM SIMULATOR",
    "proj_cajero_desc": "Development of an interactive experience for training in the use of ATMs. Creation of scenarios and interaction logic development via Blueprints in Unreal Engine 5.",
    "proj_odontologia_title": "DENTISTRY DEMO",
    "proj_odontologia_desc": "3D modeling of specialized dental instruments (burs) for medical simulations. Work focused on technical detail and model precision for professional pipelines.",
    "proj_view": "View Project",
    "proj_details": "Explore Details"
};

let currentLang = localStorage.getItem('site_lang') || 'es';
let esTranslations = {};

function initLanguageSwitcher() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;

    // Save initial Spanish translations from the DOM
    document.querySelectorAll('[data-i18n]').forEach(el => {
        esTranslations[el.getAttribute('data-i18n')] = el.innerHTML;
    });

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('site_lang', lang);
        langToggle.textContent = lang === 'es' ? 'EN' : 'ES';
        
        const dict = lang === 'es' ? esTranslations : enTranslations;
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerHTML = dict[key];
            }
        });
        
        // Update placeholders
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const msgInput = document.getElementById('contactMessage');
        if (nameInput) nameInput.placeholder = lang === 'es' ? 'Tu Nombre' : 'John Doe';
        if (emailInput) emailInput.placeholder = lang === 'es' ? 'tu@correo.com' : 'john@example.com';
        if (msgInput) msgInput.placeholder = lang === 'es' ? '¿En qué te puedo ayudar?' : 'How can I help you?';
    }

    langToggle.addEventListener('click', () => {
        setLanguage(currentLang === 'es' ? 'en' : 'es');
    });

    // Apply initial language if not Spanish
    if (currentLang === 'en') {
        setLanguage('en');
    }
}

/* ==================== PROJECT MODAL LOGIC ==================== */
function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body) return;

    let content = '';
    
    if (projectId === 'activa') {
        const isEn = currentLang === 'en';
        content = `
            <div class="modal-header">
                <h2 class="section-title">${isEn ? 'ACTIVA - Immersive Experience' : 'ACTIVA - Experiencia Inmersiva'}</h2>
                <p class="section-subtitle">${isEn ? 'A detailed look at the environments and interactions developed.' : 'Un vistazo detallado a los entornos e interacciones desarrollados.'}</p>
            </div>
            
            <div class="modal-video-main">
                <h3 class="modal-sub-title">${isEn ? 'Corporate Presentation' : 'Presentación Corporativa'}</h3>
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/f2AFb51xiaI" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>

            <div class="modal-grid">
                <div class="modal-section">
                    <h3 class="modal-sub-title">${isEn ? 'The Corral (Corral)' : 'El Corral'}</h3>
                    <p class="modal-section-desc">${isEn ? 'Focus on cognitive stimulation in outdoor environments.' : 'Enfoque en estimulación cognitiva en entornos exteriores.'}</p>
                    <div class="video-sub-grid">
                        <div class="video-container"><iframe src="https://www.youtube.com/embed/R3ycOiE2ACY" frameborder="0" allowfullscreen></iframe></div>
                        <div class="video-container"><iframe src="https://www.youtube.com/embed/1kkbzZIGzn4" frameborder="0" allowfullscreen></iframe></div>
                        <div class="video-container"><iframe src="https://www.youtube.com/embed/_0u_uUOL4YM" frameborder="0" allowfullscreen></iframe></div>
                    </div>
                    <div class="photo-sub-grid">
                        <img src="Media/Activa/Foto/Fotos Corral/Corral_02.jpg" alt="Corral Detail" class="modal-img" onclick="openLightbox(this.src)">
                        <img src="Media/Activa/Foto/Fotos Corral/Alpacas_01.jpg" alt="Alpacas Detail" class="modal-img" onclick="openLightbox(this.src)">
                        <img src="Media/Activa/Foto/Fotos Corral/Cesta_03.jpg" alt="Cesta Detail" class="modal-img" onclick="openLightbox(this.src)">
                        <img src="Media/Activa/Foto/Fotos Corral/Flores_01.jpg" alt="Flores Detail" class="modal-img" onclick="openLightbox(this.src)">
                    </div>
                </div>

                <div class="modal-section">
                    <h3 class="modal-sub-title">${isEn ? 'The House (Casa)' : 'La Casa'}</h3>
                    <p class="modal-section-desc">${isEn ? 'Daily living activities and fine motor exercises.' : 'Actividades de la vida diaria y ejercicios de motricidad fina.'}</p>
                    <div class="video-sub-grid">
                        <div class="video-container"><iframe src="https://www.youtube.com/embed/KT-AzZz5kAs" frameborder="0" allowfullscreen></iframe></div>
                        <div class="video-container"><iframe src="https://www.youtube.com/embed/XIJSSghIIic" frameborder="0" allowfullscreen></iframe></div>
                        <div class="video-container"><iframe src="https://www.youtube.com/embed/Fm6THmivHOU" frameborder="0" allowfullscreen></iframe></div>
                    </div>
                    <div class="photo-sub-grid">
                        <img src="Media/Activa/Foto/Fotos Casa/Casa_F03.jpg" alt="Casa Detail" class="modal-img" onclick="openLightbox(this.src)">
                        <img src="Media/Activa/Foto/Fotos Casa/Libro_F01.jpg" alt="Libro Detail" class="modal-img" onclick="openLightbox(this.src)">
                        <img src="Media/Activa/Foto/Fotos Casa/Sopa_F03.jpg" alt="Sopa Detail" class="modal-img" onclick="openLightbox(this.src)">
                        <img src="Media/Activa/Foto/Fotos Casa/Vajilla_F01.jpg" alt="Vajilla Detail" class="modal-img" onclick="openLightbox(this.src)">
                    </div>
                </div>
            </div>
        `;
    } else if (projectId === 'unileon') {
        const isEn = currentLang === 'en';
        content = `
            <div class="modal-header">
                <h2 class="section-title">${isEn ? 'CUENTOS UNILEON - Narrative Experience' : 'CUENTOS UNILEON - Experiencia Narrativa'}</h2>
                <p class="section-subtitle">${isEn ? 'An interactive storytelling project developed in Unreal Engine 5.' : 'Un proyecto de narrativa interactiva desarrollado en Unreal Engine 5.'}</p>
            </div>
            
            <div class="modal-video-main">
                <h3 class="modal-sub-title">${isEn ? 'Project Showcase' : 'Muestra del Proyecto'}</h3>
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/jbF_Am0VOHg" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>

            <div class="modal-section">
                <h3 class="modal-sub-title">${isEn ? 'Project Details' : 'Detalles del Proyecto'}</h3>
                <p class="modal-section-desc">
                    ${isEn ? 
                        'Interactive storytelling experience set in a virtual environment. The focus was on creating a compelling atmosphere and smooth interactions using Blueprints.' : 
                        'Experiencia de narrativa interactiva ambientada en un entorno virtual. El enfoque estuvo en crear una atmósfera envolvente e interacciones fluidas mediante Blueprints.'}
                </p>
                <div class="photo-sub-grid">
                    <img src="Media/Cuentos_Unileon/NewLevelSequence_0002.png" alt="Unileon Detail 1" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Cuentos_Unileon/NewLevelSequence_0012.png" alt="Unileon Detail 2" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Cuentos_Unileon/NewLevelSequence_0067.png" alt="Unileon Detail 3" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Cuentos_Unileon/NewLevelSequence_0088.png" alt="Unileon Detail 4" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Cuentos_Unileon/NewLevelSequence_0128.png" alt="Unileon Detail 5" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Cuentos_Unileon/NewLevelSequence_0257.png" alt="Unileon Detail 6" class="modal-img" onclick="openLightbox(this.src)">
                </div>
            </div>
        `;
    } else if (projectId === 'odontologia') {
        const isEn = currentLang === 'en';
        content = `
            <div class="modal-header">
                <h2 class="section-title">${isEn ? 'DENTISTRY DEMO - 3D Modeling' : 'ODONTOLOGÍA DEMO - Modelado 3D'}</h2>
                <p class="section-subtitle">${isEn ? 'High-precision technical modeling of dental instruments.' : 'Modelado técnico de alta precisión de instrumental dental.'}</p>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-sub-title">${isEn ? '3D Assets & Detail' : 'Assets 3D y Detalle'}</h3>
                <p class="modal-section-desc">
                    ${isEn ? 
                        'Development of dental burs and instruments with high technical accuracy. Focused on topology and realistic texturing for medical training simulators.' : 
                        'Desarrollo de fresas e instrumental dental con alta precisión técnica. Enfocado en la topología y el texturizado realista para simuladores de formación médica.'}
                </p>
                <div id="odontologiaGallery" class="photo-sub-grid">
                    <!-- Images will be added here -->
                    <p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center; padding: 2rem;">
                        ${isEn ? 'Images coming soon...' : 'Imágenes próximamente...'}
                    </p>
                </div>
            </div>
        `;
    }

    body.innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scroll
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('modalBody').innerHTML = '';
        document.body.style.overflow = ''; // Restore scroll
    }
}

/* ==================== LIGHTBOX LOGIC ==================== */
function openLightbox(src) {
    const lightbox = document.getElementById('imageLightbox');
    const img = document.getElementById('lightboxImg');
    if (lightbox && img) {
        img.src = src;
        lightbox.classList.add('active');
        // If we are inside a modal, don't restore body overflow yet
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) closeProjectModal();
});
