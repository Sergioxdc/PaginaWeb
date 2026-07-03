/* ============================================================
   SERGIO LÓPEZ HERRERO — PORTFOLIO
   JavaScript: Particles, Translations, Custom Case Modals, Tabs
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initScrollReveal();
    initDemoReelTabs();
    initPortfolioFilters();
    initSmoothScroll();
    initLanguageSwitcher();
    initHeroRoleCycler();
    initHeroVideoBackground();
    initFeaturedCarousel();
});

/* ==================== FEATURED VIDEO CAROUSEL ==================== */
function initFeaturedCarousel() {
    const tabs = document.querySelectorAll('.feat-carousel-tab');
    const player = document.getElementById('featuredVideoPlayer');
    if (!tabs.length || !player) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const videoId = tab.getAttribute('data-video-id');
            // Update active class
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Swap YouTube iframe source with autoplay enabled
            player.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`;
        });
    });
}

/* ==================== HERO YOUTUBE BACKGROUND ==================== */
let ytBackgroundPlayer;

function initHeroVideoBackground() {
    if (!document.getElementById('hero-yt-player')) return;

    // Load the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Globally-accessible callback for YouTube API
window.onYouTubeIframeAPIReady = function() {
    const playerEl = document.getElementById('hero-yt-player');
    if (!playerEl) return;

    ytBackgroundPlayer = new YT.Player('hero-yt-player', {
        videoId: 'f2AFb51xiaI',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'mute': 1,
            'loop': 1,
            'playlist': 'f2AFb51xiaI', // Required for looping
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'playsinline': 1,
            'iv_load_policy': 3,
            'disablekb': 1,
            'fs': 0,
            'autohide': 1
        },
        events: {
            'onReady': (event) => {
                event.target.mute();
                event.target.playVideo();
                // Smooth fade-in once video is loaded and playing
                const iframe = document.getElementById('hero-yt-player');
                if (iframe) {
                    iframe.style.opacity = '1';
                }
            },
            'onStateChange': (event) => {
                // Keep the loop stable across all browsers
                if (event.data === YT.PlayerState.ENDED) {
                    ytBackgroundPlayer.playVideo();
                }
            }
        }
    });
};

/* ==================== HERO ROLE CYCLER ==================== */
function initHeroRoleCycler() {
    const roles = document.querySelectorAll('.hero-role');
    if (!roles.length) return;
    let current = 0;

    setInterval(() => {
        // Exit current
        roles[current].classList.remove('active');
        roles[current].classList.add('exit');
        const exiting = current;
        setTimeout(() => roles[exiting].classList.remove('exit'), 600);

        // Move to next
        current = (current + 1) % roles.length;
        roles[current].classList.add('active');
    }, 2500);
}

/* ==================== PARTICLE SYSTEM ==================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 180 };
    let animationId;

    // Premium tech colors
    const COLORS = [
        { r: 59, g: 130, b: 246 },   // Unreal Blue
        { r: 0, g: 240, b: 255 },    // Niagara Cyan
        { r: 255, g: 255, b: 255 },  // White highlights
    ];

    function resize() {
        const rect = canvas.parentNode.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
    }

    function createParticles() {
        particles = [];
        const density = 14000; // Particle density factor
        const count = Math.min(Math.floor((width * height) / density), 90);
        for (let i = 0; i < count; i++) {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1, // Elegant small particles
                color: color,
                alpha: Math.random() * 0.35 + 0.25,
                pulseSpeed: Math.random() * 0.02 + 0.005,
                pulseOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    function drawParticle(p, time) {
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.2 + 0.8;
        const alpha = p.alpha * pulse;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.fill();
    }

    function drawConnections() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.08; // Subtle connections
                    const p = particles[i];
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
                    ctx.lineWidth = 0.3;
                    ctx.stroke();
                }
            }
        }
    }

    function updateParticles() {
        for (const p of particles) {
            // Smooth mouse repulsion
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force * 0.2;
                    p.vy += Math.sin(angle) * force * 0.2;
                }
            }

            // Dampening for professional control
            p.vx *= 0.95;
            p.vy *= 0.95;

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap edges
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

    // Move tracking
    const parentHero = canvas.closest('.hero');
    if (parentHero) {
        parentHero.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        parentHero.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

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

    function onScroll() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active link
        const sections = document.querySelectorAll('section');
        let currentSection = 'hero';
        sections.forEach((section) => {
            const top = section.offsetTop - 150;
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

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });
    }

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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const parent = entry.target.closest('.project-grid, .bts-gallery, .skills-grid, .contact-links-grid, .timeline-container');
                if (parent) {
                    const siblings = parent.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
                    const idx = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${idx * 0.06}s`;
                }
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });

    revealElements.forEach((el) => observer.observe(el));
}

/* ==================== DEMO REEL TABS ==================== */
function initDemoReelTabs() {
    const tabs = document.querySelectorAll('.demoreel-tab');
    const player = document.getElementById('demoreelPlayer');
    const desc = document.getElementById('demoreelDesc');

    if (!player || tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const videoId = tab.getAttribute('data-video-id');
            player.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;

            // Update tab descriptions
            if (videoId === '7GYlLNVob9Q') {
                desc.setAttribute('data-i18n', 'reel_vfx_desc');
                desc.innerHTML = currentLang === 'es' ? 
                    'Trabajo de efectos visuales que incluye sistemas Niagara en tiempo real, simulación, optimización, composición y arte técnico en Unreal Engine 5.' : 
                    'Visual effects work including real-time Niagara systems, simulation, optimization, composition and technical art in Unreal Engine 5.';
            } else {
                desc.setAttribute('data-i18n', 'reel_3d_desc');
                desc.innerHTML = currentLang === 'es' ? 
                    'Muestra de proyectos de modelado 3D, texturizado y renderizado creados con herramientas estándar de la industria para pipelines profesionales.' : 
                    'A showcase of 3D modeling, texturing, and rendering projects created with industry-standard tools for professional pipelines.';
            }
        });
    });
}

/* ==================== PORTFOLIO FILTERS ==================== */
function initPortfolioFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

            const cat = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                
                if (cat === 'all' || cardCat === cat) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 400);
                }
            });
        });
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
                window.scrollTo({
                    top: target.offsetTop - navHeight + 10,
                    behavior: 'smooth',
                });
            }
        });
    });
}

/* ==================== LANGUAGE SYSTEM ==================== */
const enTranslations = {
    // Nav
    "nav_demoreel": "Demo Reel",
    "nav_featured": "Featured Project",
    "nav_portfolio": "Portfolio",
    "nav_skills": "Skills",
    "nav_behind": "Behind Scenes",
    "nav_timeline": "Trajectory",
    "nav_contact": "Contact",

    // Hero
    "hero_badge": "Available for Senior Roles",
    "hero_tagline": "Pioneering the future of real-time environments, virtual reality pipelines, and advanced interactive systems.",
    "hero_btn_portfolio": "View Projects",
    "hero_btn_cv": "Download Resume",
    "hero_btn_contact": "Get in Touch",
    "hero_scroll": "Scroll to explore",

    // Showcase
    "demoreel_tag": "01. SHOWCASE",
    "demoreel_title": "Demo Reel",
    "reel_vfx_tab": "VFX & Real-Time",
    "reel_3d_tab": "3D Modeling & Rendering",
    "reel_vfx_desc": "Visual effects work including real-time Niagara systems, simulation, optimization, composition and technical art in Unreal Engine 5.",
    "reel_3d_desc": "A showcase of 3D modeling, texturing, and rendering projects created with industry-standard tools for professional pipelines.",

    // Featured
    "featured_tag": "02. FLAGSHIP PROJECT",
    "featured_title": "ACTIVA VR Case Study",
    "featured_overview": "Overview",
    "featured_role": "My Role & Responsibilities",
    "featured_role_desc": "Technical Artist and Core Developer. Programmed all interactive Blueprint logic, integrated VR mechanics, designed 3D user interfaces, and optimized lighting and static meshes for smooth VR performance.",
    "featured_challenges": "Challenges & Solutions",
    "featured_challenges_desc": "<strong>Challenge:</strong> Maintaining a stable 90 FPS on target headsets while showing high-detail rural and indoor environments. <br><strong>Solution:</strong> Implemented aggressive LOD management, baked static lighting maps, optimized transparent textures on vegetation, and reduced drawing calls by merging meshes.",

    // About
    "about_tag": "03. PROFILE",
    "about_title": "About Me",
    "about_intro": "I am a <strong>Unreal Engine 5 Developer & Technical Artist</strong> dedicated to engineering next-generation real-time 3D pipelines and immersive virtual environments.",
    "about_p_short": "Specializing in Blueprints scripting, real-time lighting, high-fidelity optimization, and Niagara visual effects. I construct high-performance interactive experiences for industry simulations, XR applications, and digital media.",
    "about_location": "Valladolid, Spain",

    // Skills
    "skills_tag": "04. EXPERTISE",
    "skills_title": "Technical Skills & Software",

    // Behind
    "behind_tag": "05. WORKFLOW",
    "behind_title": "Behind the Scenes",
    "behind_desc": "A look inside the Unreal Editor, displaying real Blueprint systems, shader configurations, and wireframe meshes.",
    "bts_1_title": "Cinematic Sequencer",
    "bts_1_desc": "Camera sequence settings and keyframe tracks inside the Unreal Engine Level Sequencer.",
    "bts_2_title": "Lighting & Atmosphere",
    "bts_2_desc": "Baked static lighting design, volumetric fog integration, and mesh optimization inside the editor.",
    "bts_3_title": "Weather Particle Systems",
    "bts_3_desc": "Sky dome, cloud particles, and weather Niagara graph configuration.",
    "bts_4_title": "PBR Material Verification",
    "bts_4_desc": "Testing roughness, normals, and metallic specular parameters under production lighting.",

    // Portfolio
    "portfolio_tag": "06. ARCHIVE",
    "portfolio_title": "Interactive Projects",
    "filter_all": "All Projects",
    "filter_unreal": "Unreal Engine & VR",
    "filter_3d": "3D Modeling",
    "filter_vfx": "VFX Simulations",

    // Projs
    "proj_activa_title": "ACTIVA VR",
    "proj_activa_desc": "Development of a virtual reality application for senior residences, focused on cognitive stimulation and fine/gross motor exercises. Participated in full development using Unreal Engine 5, including environment design, 3D UI development, and interactive logic programming via Blueprints.",
    "proj_gestaverso_title": "GESTAVERSO",
    "proj_gestaverso_desc": "Development of an immersive experience for pregnant women, designed for support and interactive activities. Creation of 3D environments and interactive logic using Blueprints in Unreal Engine 5.",
    "proj_unileon_title": "CUENTOS UNILEON",
    "proj_unileon_desc": "Development of an interactive storytelling experience in a virtual environment. Creation of 3D scenarios and programming of events and interactions using Blueprints in Unreal Engine 5.",
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
    "proj_details": "Explore Details",

    // Timeline
    "experience_tag": "07. TRAJECTORY",
    "experience_title": "Career Timeline",
    "exp_date_1": "Nov 2023 — Present",
    "exp_title_1": "Programmer / 3D Modeler",
    "exp_desc_1": "Developing interactive experiences, 3D models, and real-time visualizations using Unreal Engine 5. Responsible for programming gameplay logic, optimizing high-fidelity 3D assets, and integrating modern visual effects into production pipelines.",
    "exp_date_2": "Apr 2018 — Jun 2019",
    "exp_title_2": "3D Modeler Intern",
    "exp_company_2": "Science Museum of Valladolid",
    "exp_desc_2": "Created 3D models and conceptual visualizations for educational exhibits and museum displays. Collaborated closely with the curation team to transform scientific concepts into engaging, interactive digital content.",
    
    "edu_level_1": "Master's Degree",
    "edu_title_1": "Master in Visual Effects (VFX)",
    "edu_desc_1": "Advanced VFX techniques, heavy compositing, and digital effects for both film and complex real-time applications.",
    "edu_level_2": "Master's Degree",
    "edu_title_2": "Master in 3D Animation",
    "edu_desc_2": "Comprehensive 3D animation training covering character animation, rigging technical scripts, and production cinematics.",
    "edu_level_3": "Higher Technician",
    "edu_title_3": "3D Animation, Games & Interactive Environments",
    "edu_desc_3": "Professional training in full-cycle game development, 3D art production, and immersive media creation.",
    
    "lang_title": "Languages",
    "lang_es": "Spanish",
    "lang_es_lvl": "Native Speaker",
    "lang_en": "English",
    "lang_en_lvl": "B2 Upper-Intermediate — Cambridge",

    // Contact
    "contact_tag": "08. CONNECT",
    "contact_title": "Get in Touch",
    "contact_sub": "Interested in senior Technical Art or Unreal Engine development opportunities? Let's construct something extraordinary.",
    "contact_linkedin": "Connect Professionally",
    "contact_artstation": "View 3D Portfolios",
    "contact_github": "Browse Blueprint & C++ Code",
    "contact_cv": "Download Resume (PDF)",
    "footer_copy": "&copy; 2026 Sergio López Herrero. All rights reserved."
};

let currentLang = localStorage.getItem('site_lang') || 'en';
let esTranslations = {};

function initLanguageSwitcher() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;

    // Save initial Spanish text from DOM
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
    }

    langToggle.addEventListener('click', () => {
        setLanguage(currentLang === 'es' ? 'en' : 'es');
    });

    // Apply language on page load
    if (currentLang === 'en') {
        setLanguage('en');
    } else {
        // Ensure button text is correct even when Spanish is stored
        langToggle.textContent = 'EN';
    }
}

/* ==================== DYNAMIC CASE STUDY MODAL ==================== */
function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body) return;

    const isEn = currentLang === 'en';
    let content = '';

    if (projectId === 'activa') {
        content = `
            <div class="modal-header">
                <h2 class="section-title">${isEn ? 'ACTIVA VR — Immersive Healthcare' : 'ACTIVA VR — Salud Inmersiva'}</h2>
                <p class="section-subtitle">${isEn ? 'Unreal Engine 5 virtual reality stimulation system for senior care.' : 'Sistema de estimulación en realidad virtual mediante Unreal Engine 5 para residencias de ancianos.'}</p>
            </div>
            
            <div class="modal-video-main">
                <h3 class="modal-sub-title">${isEn ? 'Cinematic Presentation' : 'Presentación Cinematográfica'}</h3>
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/f2AFb51xiaI" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>

            <div class="modal-body-layout" style="display: flex; flex-direction: column; gap: 2rem; margin-top: 1rem;">
                <div class="modal-section">
                    <h3 class="modal-sub-title">${isEn ? 'Environment Case: The Corral' : 'Entorno: El Corral'}</h3>
                    <p class="modal-section-desc">${isEn ? 'Designed to stimulate gross motor skills in virtual nature. Includes dynamic physics and interaction nodes.' : 'Diseñado para estimular la motricidad gruesa en naturaleza virtual. Incluye físicas dinámicas y nodos de interacción.'}</p>
                    <div class="video-sub-grid">
                        <div class="video-container"><iframe src="https://www.youtube.com/embed/R3ycOiE2ACY" frameborder="0" allowfullscreen></iframe></div>
                        <div class="video-container"><iframe src="https://www.youtube.com/embed/1kkbzZIGzn4" frameborder="0" allowfullscreen></iframe></div>
                    </div>
                    <div class="photo-sub-grid">
                        <img src="Media/Activa/Foto/Fotos Corral/Corral_02.jpg" alt="Corral View" class="modal-img" onclick="openLightbox(this.src)">
                        <img src="Media/Activa/Foto/Fotos Corral/Alpacas_01.jpg" alt="Alpacas Model" class="modal-img" onclick="openLightbox(this.src)">
                        <img src="Media/Activa/Foto/Fotos Corral/Flores_01.jpg" alt="Niagara Flowers" class="modal-img" onclick="openLightbox(this.src)">
                    </div>
                </div>

                <div class="modal-section">
                    <h3 class="modal-sub-title">${isEn ? 'Environment Case: The House' : 'Entorno: La Casa'}</h3>
                    <p class="modal-section-desc">${isEn ? 'Replicating everyday home activities for cognitive stimulation and fine motor tasks.' : 'Replicación de actividades del hogar cotidianas para estimulación cognitiva y tareas motoras finas.'}</p>
                    <div class="video-sub-grid">
                        <div class="video-container"><iframe src="https://www.youtube.com/embed/KT-AzZz5kAs" frameborder="0" allowfullscreen></iframe></div>
                        <div class="video-container"><iframe src="https://www.youtube.com/embed/XIJSSghIIic" frameborder="0" allowfullscreen></iframe></div>
                    </div>
                    <div class="photo-sub-grid">
                        <img src="Media/Activa/Foto/Fotos Casa/Casa_F03.jpg" alt="Living Room Detail" class="modal-img" onclick="openLightbox(this.src)">
                        <img src="Media/Activa/Foto/Fotos Casa/Libro_F01.jpg" alt="Interactions Detail" class="modal-img" onclick="openLightbox(this.src)">
                        <img src="Media/Activa/Foto/Fotos Casa/Sopa_F03.jpg" alt="Kitchen setup" class="modal-img" onclick="openLightbox(this.src)">
                    </div>
                </div>
            </div>
        `;
    } else if (projectId === 'gestaverso') {
        content = `
            <div class="modal-header">
                <h2 class="section-title">GESTAVERSO VR</h2>
                <p class="section-subtitle">${isEn ? 'Virtual environments and support sessions for maternal care.' : 'Entornos virtuales y sesiones de acompañamiento para la maternidad.'}</p>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-sub-title">${isEn ? 'Production Captures & Lighting' : 'Capturas de Producción e Iluminación'}</h3>
                <p class="modal-section-desc">${isEn ? 'Developing high-fidelity atmospheric spaces designed for relaxation. Programmed Blueprint event triggers and immersive soundscapes.' : 'Desarrollo de espacios atmosféricos de alta fidelidad diseñados para la relajación. Programación de disparadores de eventos mediante Blueprints y paisajes sonoros inmersivos.'}</p>
                <div class="photo-sub-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <img src="Media/Gestaverso/HighresScreenshot00003.png" alt="Viewport Render 1" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Gestaverso/HighresScreenshot00004.png" alt="Viewport Render 2" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Gestaverso/HighresScreenshot00005.png" alt="Viewport Render 3" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Gestaverso/HighresScreenshot00006.png" alt="Viewport Render 4" class="modal-img" onclick="openLightbox(this.src)">
                </div>
            </div>
        `;
    } else if (projectId === 'unileon') {
        content = `
            <div class="modal-header">
                <h2 class="section-title">CUENTOS UNILEON</h2>
                <p class="section-subtitle">${isEn ? 'Interactive fantasy storytelling experience.' : 'Experiencia interactiva de narrativa de fantasía.'}</p>
            </div>
            
            <div class="modal-video-main">
                <h3 class="modal-sub-title">${isEn ? 'Cinematic Walkthrough' : 'Recorrido Cinematográfico'}</h3>
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/jbF_Am0VOHg" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>

            <div class="modal-section">
                <h3 class="modal-sub-title">${isEn ? 'Scene Composition & Camera Sequences' : 'Composición de Escenas y Secuencias de Cámara'}</h3>
                <p class="modal-section-desc">${isEn ? 'Cinematic camera tracks set up inside Unreal Sequencer, utilizing dynamic lighting maps and Niagara wind simulations.' : 'Pistas de cámara cinematográficas configuradas dentro de Unreal Sequencer, utilizando mapas de iluminación dinámica y simulaciones de viento Niagara.'}</p>
                <div class="photo-sub-grid">
                    <img src="Media/Cuentos_Unileon/NewLevelSequence_0002.png" alt="Sequence frame 1" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Cuentos_Unileon/NewLevelSequence_0012.png" alt="Sequence frame 2" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Cuentos_Unileon/NewLevelSequence_0067.png" alt="Sequence frame 3" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Cuentos_Unileon/NewLevelSequence_0088.png" alt="Sequence frame 4" class="modal-img" onclick="openLightbox(this.src)">
                </div>
            </div>
        `;
    } else if (projectId === 'industria') {
        content = `
            <div class="modal-header">
                <h2 class="section-title">INDUSTRIA DEMO</h2>
                <p class="section-subtitle">${isEn ? 'Interactive industrial simulator for technical training.' : 'Simulador interactivo industrial para formación técnica.'}</p>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-sub-title">${isEn ? 'Interactive Workspaces & Physics' : 'Espacios de Trabajo Interactivos y Físicas'}</h3>
                <p class="modal-section-desc">${isEn ? 'Industrial machinery setup with detailed colliders, physics constraints, and interactive control panels programmed with Blueprints.' : 'Configuración de maquinaria industrial con colisionadores detallados, restricciones físicas y paneles de control interactivos programados con Blueprints.'}</p>
                <div class="photo-sub-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <img src="Media/Industria_Demo/HighresScreenshot00002.png" alt="Industrial workspace" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Industria_Demo/HighresScreenshot00003.png" alt="Control panels" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Industria_Demo/HighresScreenshot00005.png" alt="Pipes detailing" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Industria_Demo/HighresScreenshot00006.png" alt="Editor view" class="modal-img" onclick="openLightbox(this.src)">
                </div>
            </div>
        `;
    } else if (projectId === 'carnica') {
        content = `
            <div class="modal-header">
                <h2 class="section-title">CÁRNICA (XR2Learn)</h2>
                <p class="section-subtitle">${isEn ? 'Immersive simulation for professional industrial training.' : 'Simulación inmersiva para formación industrial profesional.'}</p>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-sub-title">${isEn ? 'Simulated Procedures' : 'Procedimientos Simulados'}</h3>
                <p class="modal-section-desc">${isEn ? 'Step-by-step interactive procedures designed in Unreal Engine 5. Focuses on procedural logic, user interface feedback, and collision checks.' : 'Procedimientos interactivos paso a paso diseñados en Unreal Engine 5. Centrado en lógica procedimental, retroalimentación de interfaz de usuario y comprobaciones de colisiones.'}</p>
                <div class="photo-sub-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <img src="Media/Carnica/Fotos/Image Sequence_017_0000.jpg" alt="Procedure Step 1" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Carnica/Fotos/Image Sequence_018_0000.jpg" alt="Procedure Step 2" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Carnica/Fotos/Image Sequence_019_0000.jpg" alt="Procedure Step 3" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Carnica/Fotos/Image Sequence_020_0000.jpg" alt="Procedure Step 4" class="modal-img" onclick="openLightbox(this.src)">
                </div>
            </div>
        `;
    } else if (projectId === 'cajero') {
        content = `
            <div class="modal-header">
                <h2 class="section-title">${isEn ? 'ATM Interactive Simulator' : 'Simulador de Cajero Automático'}</h2>
                <p class="section-subtitle">${isEn ? 'Interactive educational application developed in Unreal Engine 5.' : 'Aplicación educativa interactiva desarrollada en Unreal Engine 5.'}</p>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-sub-title">${isEn ? 'Technical Details' : 'Detalles Técnicos'}</h3>
                <p class="modal-section-desc">
                    ${isEn ? 
                        'Designed a 3D widget component system allowing detailed interaction with ATM button clusters and touch screens. Built a robust Blueprint state machine to manage user accounts, transaction flows, and dynamic localized interface text.' : 
                        'Diseño de un sistema de widgets 3D interactivos para simular botones y pantalla táctil del cajero. Estructuración de una máquina de estados en Blueprints para gestionar cuentas, flujos de transacciones y textos traducidos.'}
                </p>
                <div class="project-tags">
                    <span>3D Widgets</span>
                    <span>UMG UI</span>
                    <span>State Machine</span>
                    <span>Unreal Engine 5</span>
                </div>
            </div>
        `;
    } else if (projectId === 'ajedrez') {
        content = `
            <div class="modal-header">
                <h2 class="section-title">AJEDREZ CON CABEZA</h2>
                <p class="section-subtitle">${isEn ? 'Chess training platform in digital 3D space.' : 'Plataforma de entrenamiento de ajedrez en entorno digital 3D.'}</p>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-sub-title">${isEn ? 'Plugin Integration & Code Bridge' : 'Integración de Plugins y Conexión de Código'}</h3>
                <p class="modal-section-desc">
                    ${isEn ? 
                        'Integrated custom C++ plugins to evaluate chess state algorithms, coordinate pieces, and bridge communication between Unreal Engine 5 UI and core gameplay databases.' : 
                        'Integración de plugins en C++ para evaluación de algoritmos de ajedrez, movimiento de piezas y comunicación entre la interfaz de Unreal Engine 5 y la base de datos del juego.'}
                </p>
                <div class="project-tags">
                    <span>C++ Plugins</span>
                    <span>Unreal Engine 5</span>
                    <span>Algorithms</span>
                    <span>Blueprint Integration</span>
                </div>
            </div>
        `;
    } else if (projectId === 'iberdrola') {
        content = `
            <div class="modal-header">
                <h2 class="section-title">IBERDROLA VR</h2>
                <p class="section-subtitle">${isEn ? 'Virtual stereoscopic visualization tour.' : 'Tour virtual stereoscópico de visualización.'}</p>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-sub-title">${isEn ? 'High-Performance 360 Rendering' : 'Renderizado 360 de Alto Rendimiento'}</h3>
                <p class="modal-section-desc">
                    ${isEn ? 
                        'Configured stereoscopic 360 camera rigs inside Unreal Engine to capture environments. Designed optimized material shaders to support clean panoramic projection with minimal VR artifacts.' : 
                        'Configuración de cámaras estereoscópicas 360 en Unreal Engine. Diseño de shaders de materiales optimizados para proyección panorámica limpia sin artefactos en visores VR.'}
                </p>
                <div class="project-tags">
                    <span>Stereoscopic 360</span>
                    <span>VR Projection</span>
                    <span>Unreal Engine 5</span>
                    <span>Material Shaders</span>
                </div>
            </div>
        `;
    } else if (projectId === 'odontologia') {
        content = `
            <div class="modal-header">
                <h2 class="section-title">${isEn ? 'DENTISTRY DEMO - 3D Assets' : 'ODONTOLOGÍA DEMO - Assets 3D'}</h2>
                <p class="section-subtitle">${isEn ? 'High-precision modeling of medical tools.' : 'Modelado de alta precisión de instrumental médico.'}</p>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-sub-title">${isEn ? 'High-Poly to Low-Poly Workflow' : 'Flujo de High-Poly a Low-Poly'}</h3>
                <p class="modal-section-desc">
                    ${isEn ? 
                        'High-precision modeling of dental burs. Followed a clean retopology workflow in Autodesk Maya, baked high-detail normal maps, and textured realistic metal/ceramic materials in Substance Painter for interactive viewport displays.' : 
                        'Modelado técnico detallado de fresas quirúrgicas. Retopología limpia en Autodesk Maya, horneado de mapas de normales y texturizado de materiales metálicos y cerámicos en Substance Painter para visualizadores interactivos.'}
                </p>
                <div class="photo-sub-grid">
                    <img src="Media/Odontologia/Fotos/A.jpeg" alt="Burs render A" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Odontologia/Fotos/B.jpeg" alt="Burs render B" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Odontologia/Fotos/I.jpeg" alt="Burs render I" class="modal-img" onclick="openLightbox(this.src)">
                    <img src="Media/Odontologia/Fotos/J.jpeg" alt="Burs render J" class="modal-img" onclick="openLightbox(this.src)">
                </div>
            </div>
        `;
    }

    body.innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('modalBody').innerHTML = '';
        document.body.style.overflow = '';
    }
}

/* ==================== LIGHTBOX SYSTEM ==================== */
function openLightbox(src) {
    const lightbox = document.getElementById('imageLightbox');
    const img = document.getElementById('lightboxImg');
    if (lightbox && img) {
        img.src = src;
        lightbox.classList.add('active');
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
}

// Global modal close on click outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) closeProjectModal();
});
