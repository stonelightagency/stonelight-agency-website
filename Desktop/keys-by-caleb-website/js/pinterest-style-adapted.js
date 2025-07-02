/**
 * JavaScript for Keys by Caleb Pinterest-Style Layout
 * V2.7.7 - Conditional Loading Text
 * - Hides loading text via CSS and uses JS to show it along with the piano on slow loads.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- NEW GLOBAL SCROLL FIX ---
    if (!document.body.classList.contains('pinterest-layout')) {
        const html = document.documentElement;
        const body = document.body;

        html.style.height = 'auto';
        html.style.overflow = 'auto';
        body.style.height = 'auto';
        body.style.overflow = 'visible';
        
        console.log("Standard page detected. JS forcing default scroll behavior.");
    }
    // --- END OF FIX ---

    console.log("Keys by Caleb - JS Initialized (V2.7.7 - Conditional Loading Text)");

    // --- Master Switch ---
    const isPinterestLayout = document.body.classList.contains('pinterest-layout');

    // --- Configuration (Global) ---
    const MENU_ANIMATION_DURATION = 350; 
    const HERO_TEXT_INTERVAL = 3500;
    const FADE_OUT_DURATION = 400;
    const FADE_IN_DURATION = 400;
    const TEXT_CHANGE_DELAY = 300;
    const PARTICLE_HERO_ID = 'tsparticles-hero';
    const PARTICLE_TESTIMONIALS_ID = 'tsparticles-testimonials';
    const PARTICLE_HEADER_ID = 'tsparticles-header';
    const PARTICLE_FOOTER_ID = 'tsparticles-footer';
    const SCROLL_DEBOUNCE_MS = 50;
    const MOBILE_BREAKPOINT = 1023; // Used for JS logic
    const KEYBOARD_SCROLL_TIMEOUT_DURATION = 700;
    const FOOTER_SCROLL_DURATION_ESTIMATE = 700;
    const FOOTER_FLASH_ANIMATION_DURATION = 1000;
    const ARROW_GLOW_ANIMATION_CLASS = 'submenu-chevron-glow';
    const ARROW_GLOW_DURATION = 1500;
    const PIANO_KEY_PRESS_DURATION = 150;
    const PIANO_KEY_INTERVAL = 100;
    const LOADER_DELAY_MS = 1000; // 1 second

    // --- Element Cache (Global & Conditional) ---
    const bodyElement = document.body;
    const htmlElement = document.documentElement;
    const loadingScreen = document.getElementById('loading-screen');
    const pianoLoader = loadingScreen ? loadingScreen.querySelector('.piano-loader') : null;
    const loadingText = loadingScreen ? loadingScreen.querySelector('.loading-text') : null;
    const pianoLoaderKeys = loadingScreen ? Array.from(loadingScreen.querySelectorAll('.piano-loader-key')) : [];
    const scrollToTopButton = document.getElementById('scroll-to-top');
    const currentYearSpan = document.getElementById('current-year');
    const header = document.getElementById('main-header');

    const mobileMenuToggleSimplified = document.getElementById('mobile-menu-toggle-simplified');
    const mobileMenuPanelSimplified = document.getElementById('mobile-menu-panel-simplified');
    const desktopMoreDropdownTrigger = document.querySelector('#desktop-nav-elements .nav-item-dropdown.more-nav-item > .nav-link.more-dropdown-trigger');
    const desktopMoreDropdownContainer = desktopMoreDropdownTrigger?.closest('.nav-item-dropdown.more-nav-item');

    // Cache homepage-only elements conditionally
    const scrollContainer = isPinterestLayout ? document.getElementById('scroll-container') : null;
    const dynamicTextElement = isPinterestLayout ? document.querySelector('.dynamic-idea') : null;
    const scrollArrow = isPinterestLayout ? document.querySelector('.scroll-arrow') : null;
    const heroVideo = isPinterestLayout ? document.getElementById('hero-background-video') : null;
    const allSections = isPinterestLayout && scrollContainer ? Array.from(scrollContainer.querySelectorAll(':scope > .scroll-section, :scope > footer.scroll-section, :scope > section.scroll-section')) : [];
    const animatedElements = document.querySelectorAll('[data-animate]');

    // Particle containers
    const heroParticleContainer = document.getElementById(PARTICLE_HERO_ID);
    const testimonialsParticleContainer = document.getElementById(PARTICLE_TESTIMONIALS_ID);
    const headerParticleContainer = document.getElementById(PARTICLE_HEADER_ID);
    const footerParticleContainer = document.getElementById(PARTICLE_FOOTER_ID);


    // --- State (Global & Conditional) ---
    let isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    let pianoAnimationIntervalId = null;
    let loaderTimeoutId = null;
    let currentPianoKeyIndex = 0;
    let activePianoScaleOrder;
    const fullPianoScaleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
    const mobilePianoScaleOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 
    
    // Homepage-only state
    let isKeyboardScrolling = false;
    let currentIdeaIndex = 0;
    const ideas = [ 'Elegant Wedding Music', 'Sophisticated Soundtracks', 'Live Piano Ambiance', 'Creating Lasting Memories', 'Riverside\'s Premier Pianist', 'Expert Keyboard Artistry' ];
    let currentlyPlayingAudio = null;

    // --- Helper Functions (Global) ---
    function setActivePianoScale() {
        isMobile = window.innerWidth <= MOBILE_BREAKPOINT; 
        if (isMobile) {
            activePianoScaleOrder = mobilePianoScaleOrder;
        } else {
            activePianoScaleOrder = fullPianoScaleOrder;
        }
        currentPianoKeyIndex = 0; 
    }
    setActivePianoScale(); 

    const getHeaderHeight = () => { if (!header) return 0; const mobileHeightValue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height-mobile')) || 60; const desktopHeightValue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 70; return isMobile ? mobileHeightValue : desktopHeightValue; };
    const debounce = (func, wait) => { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func.apply(this, args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; };
    
    const getScrollTarget = () => {
        if (isPinterestLayout && !isMobile && scrollContainer) {
            return scrollContainer;
        }
        return window;
    };
    
    const scrollToSection = (targetId) => {
        if (!targetId) return;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const headerOffset = getHeaderHeight();
            const scrollTarget = getScrollTarget(); 
            let targetScrollY;

            if (scrollTarget !== window && scrollContainer) {
                targetScrollY = targetElement.offsetTop - headerOffset;
            } else {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                targetScrollY = offsetPosition;
            }
            
            scrollTarget.scrollTo({ top: targetScrollY, behavior: 'smooth' });

            if (targetId === 'main-footer') {
                setTimeout(() => {
                    const footerIcons = document.querySelectorAll('#main-footer .footer-social-icon');
                    if (footerIcons.length > 0) {
                        footerIcons.forEach(icon => icon.classList.add('flash-effect'));
                        setTimeout(() => footerIcons.forEach(icon => icon.classList.remove('flash-effect')), FOOTER_FLASH_ANIMATION_DURATION);
                    }
                }, isMobile ? 450 : FOOTER_SCROLL_DURATION_ESTIMATE); 
            }
        }
    };
    
    // --- Initialization Functions ---

    const initLoadingScreenPiano = () => { 
        if (!loadingScreen || pianoLoaderKeys.length === 0) { 
            return; 
        } 
        
        const playNextPianoKey = () => {
            if (!activePianoScaleOrder || activePianoScaleOrder.length === 0) return; 
            const keyIdToPlay = activePianoScaleOrder[currentPianoKeyIndex];
            const keyToPlay = pianoLoaderKeys.find(key => parseInt(key.dataset.keyId, 10) === keyIdToPlay); 
            
            if (keyToPlay && keyToPlay.offsetParent !== null) { 
                keyToPlay.classList.add('key-pressed'); 
                setTimeout(() => { 
                    keyToPlay.classList.remove('key-pressed'); 
                }, PIANO_KEY_PRESS_DURATION); 
            } 
            currentPianoKeyIndex = (currentPianoKeyIndex + 1) % activePianoScaleOrder.length; 
        }; 
        
        pianoAnimationIntervalId = setInterval(playNextPianoKey, PIANO_KEY_INTERVAL); 
    };
    
    const setupConditionalLoader = () => {
        if (!loadingScreen) return;

        loaderTimeoutId = setTimeout(() => {
            if (!loadingScreen.classList.contains('hidden')) {
                if (pianoLoader) {
                    pianoLoader.classList.add('visible');
                }
                if (loadingText) {
                    loadingText.classList.add('visible');
                }
                initLoadingScreenPiano();
            }
        }, LOADER_DELAY_MS);
    };

    const onPageLoaded = () => {
        if (loaderTimeoutId) {
            clearTimeout(loaderTimeoutId);
        }
        if (pianoAnimationIntervalId) {
            clearInterval(pianoAnimationIntervalId);
        }
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => { loadingScreen.remove(); }, 500);
        }
        bodyElement.classList.add('loaded');
        if (scrollContainer) scrollContainer.classList.add('loaded');
        handleScroll();

        if (window.location.hash) {
            setTimeout(() => {
                const hashId = window.location.hash.substring(1);
                scrollToSection(hashId);
            }, 150);
        }
    };

    const initParticles = () => {
        if (typeof tsParticles === 'undefined') {
            console.error("tsParticles library not loaded.");
            return;
        }
        const commonParticleOptions = {
            detectRetina: true,
            fullScreen: {
                enable: false
            },
            smooth: true
        };
        const heroMoveSpeed = window.innerWidth <= MOBILE_BREAKPOINT ? 5 : 2.5;
        const heroParticlesConfig = { ...commonParticleOptions,
            particles: {
                number: {
                    value: 60,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#FFF8DC"
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.9,
                    random: true
                },
                size: {
                    value: {
                        min: 1,
                        max: 4
                    },
                    random: true
                },
                links: {
                    enable: false
                },
                move: {
                    enable: true,
                    speed: heroMoveSpeed,
                    direction: "none",
                    random: true,
                    straight: true,
                    out_mode: "out"
                }
            },
            interactivity: {
                events: {
                    onhover: {
                        enable: false
                    },
                    onclick: {
                        enable: false
                    },
                    resize: true
                }
            }
        };
        const testimonialsParticlesConfig = { ...commonParticleOptions,
            particles: { ...heroParticlesConfig.particles,
                number: {
                    value: 25
                },
                opacity: {
                    value: 0.15
                },
                size: {
                    value: {
                        min: 1,
                        max: 2
                    }
                }
            }
        };
        const headerFooterParticlesConfig = { ...commonParticleOptions,
            particles: { ...heroParticlesConfig.particles,
                number: {
                    value: 15
                },
                color: {
                    value: "rgba(255, 248, 220, 0.5)"
                },
                opacity: {
                    value: 0.2
                },
                size: {
                    value: {
                        min: 0.5,
                        max: 1.5
                    }
                },
                move: { ...heroParticlesConfig.particles.move,
                    speed: 0.8
                }
            }
        };
        if (heroParticleContainer) tsParticles.load({
            id: PARTICLE_HERO_ID,
            options: heroParticlesConfig
        }).catch(e => console.error("Hero particles error:", e));
        if (testimonialsParticleContainer) tsParticles.load({
            id: PARTICLE_TESTIMONIALS_ID,
            options: testimonialsParticlesConfig
        }).catch(e => console.error("Testimonials particles error:", e));
        if (headerParticleContainer) tsParticles.load({
            id: PARTICLE_HEADER_ID,
            options: headerFooterParticlesConfig
        }).catch(e => console.error("Header particles error:", e));
        if (footerParticleContainer) tsParticles.load({
            id: PARTICLE_FOOTER_ID,
            options: headerFooterParticlesConfig
        }).catch(e => console.error("Footer particles error:", e));
    };
    
    // --- Global Handlers & Setup ---

    const handleScrollToTopVisibility = debounce(() => { if (!scrollToTopButton) return; const currentScrollTarget = getScrollTarget(); const scrollY = (currentScrollTarget === window) ? window.pageYOffset : currentScrollTarget.scrollTop; if (scrollY > 300) { if (!scrollToTopButton.classList.contains('visible')) { scrollToTopButton.classList.remove('hidden'); requestAnimationFrame(() => scrollToTopButton.classList.add('visible')); } } else { if (scrollToTopButton.classList.contains('visible')) { scrollToTopButton.classList.remove('visible'); setTimeout(() => { const currentScrollYCheck = (getScrollTarget() === window) ? window.pageYOffset : getScrollTarget()?.scrollTop ?? 0; if (currentScrollYCheck <= 300) scrollToTopButton.classList.add('hidden'); }, 300); } else { scrollToTopButton.classList.add('hidden'); } } }, SCROLL_DEBOUNCE_MS);
    const scrollToTopHandler = () => { getScrollTarget()?.scrollTo({ top: 0, behavior: 'smooth' }); };
    
    const closeMobileMenu = () => {
        if (mobileMenuPanelSimplified && mobileMenuPanelSimplified.classList.contains('active')) {
            mobileMenuPanelSimplified.classList.remove('active'); 
            if (mobileMenuToggleSimplified) mobileMenuToggleSimplified.setAttribute('aria-expanded', 'false');
            mobileMenuPanelSimplified.setAttribute('aria-hidden', 'true');
            bodyElement.classList.remove('mobile-menu-simplified-open');
            htmlElement.style.overflowY = ''; 
            bodyElement.style.overflowY = '';
            const icon = mobileMenuToggleSimplified?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    };

    const smoothScrollHandlerSimplified = function (e) {
        const link = e.currentTarget;
        const hrefAttribute = link.getAttribute('href');
        const isCurrentlyOnIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
        
        if (hrefAttribute.startsWith('index.html#')) {
            if (isCurrentlyOnIndexPage && isPinterestLayout) {
                e.preventDefault();
                const targetId = hrefAttribute.substring(hrefAttribute.indexOf('#') + 1);
                scrollToSection(targetId);
                if (isMobile) {
                    closeMobileMenu();
                }
            }
        }
    };
    
    // --- Homepage-Only Functions ---

    const handleActiveNavHighlight = debounce(() => {
        // This function is now only called if isPinterestLayout is true.
        const desktopNavLinks = document.querySelectorAll('#desktop-nav-elements .main-nav-links.desktop-only-nav > a.nav-link.internal-link');
        if (isMobile || desktopNavLinks.length === 0 || !scrollContainer) {
            desktopNavLinks.forEach(link => link.classList.remove('active'));
            return;
        }

        let scrollPosition = scrollContainer.scrollTop;
        let currentSectionId = null;
        const offset = getHeaderHeight() + 50;
        
        allSections.forEach(section => {
            if (section && typeof section.offsetTop === 'number' && section.id) {
                if (scrollPosition >= section.offsetTop - offset) {
                    currentSectionId = section.id;
                }
            }
        });

        desktopNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `index.html#${currentSectionId}`);
        });
    }, 100);

    const handleKeyboardScroll = (event) => {
        if (isMobile || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') || isKeyboardScrolling) return;
        
        const currentScrollTarget = getScrollTarget();
        if (currentScrollTarget === window) return; // Guard for non-pinterest pages
        
        event.preventDefault();
        const currentScrollTop = currentScrollTarget.scrollTop;
        let currentIndex = -1;
        let minDiff = Infinity;
        allSections.forEach((section, index) => {
            if(section && section.id) {
                const sectionTopInContainer = section.offsetTop - getHeaderHeight();
                const diff = Math.abs(sectionTopInContainer - currentScrollTop);
                if (diff < minDiff) {
                    minDiff = diff;
                    currentIndex = index;
                }
            }
        });
        if (currentIndex === -1) return;
        let targetIndex = currentIndex;
        if (event.key === 'ArrowDown') targetIndex = Math.min(currentIndex + 1, allSections.length - 1);
        else if (event.key === 'ArrowUp') targetIndex = Math.max(currentIndex - 1, 0);
        if (targetIndex !== currentIndex || minDiff > 10) {
            const targetSection = allSections[targetIndex];
            if (targetSection && targetSection.id) {
                isKeyboardScrolling = true;
                scrollToSection(targetSection.id);
                setTimeout(() => { isKeyboardScrolling = false; }, KEYBOARD_SCROLL_TIMEOUT_DURATION);
            }
        } else {
            isKeyboardScrolling = false;
        }
    };

    const handleScroll = () => {
        handleScrollToTopVisibility();
        if (isPinterestLayout) {
            handleActiveNavHighlight();
        }
    };
    
    // --- Attaching Event Listeners ---

    // Global listeners that are safe for all pages
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    if (scrollToTopButton) scrollToTopButton.addEventListener('click', scrollToTopHandler);
    
    document.querySelectorAll('a.internal-link').forEach(anchor => {
        anchor.addEventListener('click', smoothScrollHandlerSimplified);
    });
    
    // Global Menu Logic (safe for all pages)
    if (mobileMenuToggleSimplified && mobileMenuPanelSimplified) {
        mobileMenuToggleSimplified.addEventListener('click', () => {
            const isOpen = mobileMenuPanelSimplified.classList.toggle('active');
            mobileMenuToggleSimplified.setAttribute('aria-expanded', isOpen.toString());
            mobileMenuPanelSimplified.setAttribute('aria-hidden', (!isOpen).toString());
            bodyElement.classList.toggle('mobile-menu-simplified-open', isOpen);
            if (!isOpen) { 
                htmlElement.style.overflowY = ''; 
                bodyElement.style.overflowY = '';
            }
            const icon = mobileMenuToggleSimplified.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !isOpen);
                icon.classList.toggle('fa-times', isOpen);
            }
        });

        mobileMenuPanelSimplified.querySelectorAll('.mobile-nav-list-item, .mobile-nav-icon-link').forEach(link => { 
            link.addEventListener('click', (e) => {
                const isInternalScrollLink = link.classList.contains('internal-link-simplified');
                const isCurrentlyOnIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
                if (isInternalScrollLink && isCurrentlyOnIndexPage && isPinterestLayout) {
                    closeMobileMenu();
                } else if (!isInternalScrollLink) {
                    closeMobileMenu();
                }
            });
        });
    }
    
    if (desktopMoreDropdownTrigger && desktopMoreDropdownContainer) {
        desktopMoreDropdownTrigger.addEventListener('click', (e) => {
            if (isMobile) return; e.stopPropagation();
            const isOpen = desktopMoreDropdownContainer.classList.toggle('dropdown-open');
            desktopMoreDropdownTrigger.setAttribute('aria-expanded', isOpen.toString());
            if (isOpen) {
                const chevronsToAnimate = desktopMoreDropdownContainer.querySelectorAll('.submenu-expand-button .submenu-chevron');
                chevronsToAnimate.forEach(chevron => { chevron.classList.add(ARROW_GLOW_ANIMATION_CLASS); setTimeout(() => chevron.classList.remove(ARROW_GLOW_ANIMATION_CLASS), ARROW_GLOW_DURATION); });
            }
        });
        const desktopL2ExpandButtons = desktopMoreDropdownContainer.querySelectorAll('.main-dropdown-item > .submenu-expand-button');
        desktopL2ExpandButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (isMobile) return; e.preventDefault(); e.stopPropagation();
                const parentL2Item = button.closest('.main-dropdown-item'); if (!parentL2Item) return;
                const targetL3Id = parentL2Item.getAttribute('aria-controls'); const targetL3Submenu = document.getElementById(targetL3Id); if (!targetL3Submenu) return;
                const isOpening = !parentL2Item.classList.contains('is-open');
                if (isOpening) { const grandParentDropdown = parentL2Item.closest('.nav-dropdown.more-dropdown-menu'); if (grandParentDropdown) { grandParentDropdown.querySelectorAll('.main-dropdown-item.is-open').forEach(otherL2Item => { if (otherL2Item !== parentL2Item) { otherL2Item.classList.remove('is-open'); otherL2Item.setAttribute('aria-expanded', 'false'); const otherL3Id = otherL2Item.getAttribute('aria-controls'); if (otherL3Id) document.getElementById(otherL3Id)?.classList.remove('is-open'); } }); } }
                parentL2Item.classList.toggle('is-open', isOpening); parentL2Item.setAttribute('aria-expanded', isOpening.toString()); targetL3Submenu.classList.toggle('is-open', isOpening);
            });
        });
    }

    document.addEventListener('click', (e) => {
        if (!isMobile && desktopMoreDropdownTrigger && desktopMoreDropdownContainer?.classList.contains('dropdown-open')) {
            if (!desktopMoreDropdownContainer.contains(e.target) && !desktopMoreDropdownTrigger.contains(e.target)) {
                desktopMoreDropdownContainer.classList.remove('dropdown-open');
                desktopMoreDropdownTrigger.setAttribute('aria-expanded', 'false');
            }
        }
        if (isMobile && mobileMenuPanelSimplified?.classList.contains('active')) {
            if (!mobileMenuPanelSimplified.contains(e.target) && e.target !== mobileMenuToggleSimplified && !mobileMenuToggleSimplified.contains(e.target) ) {
                closeMobileMenu();
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!isMobile && desktopMoreDropdownContainer?.classList.contains('dropdown-open')) {
                desktopMoreDropdownContainer.classList.remove('dropdown-open');
                desktopMoreDropdownTrigger?.setAttribute('aria-expanded', 'false');
                desktopMoreDropdownTrigger?.focus();
            } else if (isMobile && mobileMenuPanelSimplified?.classList.contains('active')) {
                closeMobileMenu();
                mobileMenuToggleSimplified?.focus();
            }
        }
    });
    
    // Global scroll listener for all pages
    getScrollTarget().addEventListener('scroll', handleScroll, { passive: true });
    
    // Intersection Observer for animations (safe for all pages)
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: isPinterestLayout && !isMobile ? scrollContainer : null, threshold: 0.15 });
        animatedElements.forEach(element => observer.observe(element));
    } else {
        animatedElements.forEach(el => el.classList.add('active'));
    }

    // --- HOMEPAGE-ONLY LOGIC WRAPPER ---
    if (isPinterestLayout) {
        
        function onAnimationEnd() { if (dynamicTextElement) dynamicTextElement.classList.remove('is-animating'); }
        function updateDynamicText() { if (!dynamicTextElement || dynamicTextElement.classList.contains('is-animating')) return; dynamicTextElement.classList.add('is-animating'); dynamicTextElement.style.animation = `fadeOutUp ${FADE_OUT_DURATION / 1000}s ease-out forwards`; setTimeout(() => { if (!dynamicTextElement) { if (dynamicTextElement) dynamicTextElement.classList.remove('is-animating'); return; } currentIdeaIndex = (currentIdeaIndex + 1) % ideas.length; dynamicTextElement.textContent = ideas[currentIdeaIndex]; dynamicTextElement.style.animation = `fadeInDown ${FADE_IN_DURATION / 1000}s ease-out forwards`; dynamicTextElement.removeEventListener('animationend', onAnimationEnd); dynamicTextElement.addEventListener('animationend', onAnimationEnd, { once: true }); }, TEXT_CHANGE_DELAY); }
        
        function initCarousel(containerSelector) {
            const carouselContainer = document.querySelector(containerSelector);
            if (!carouselContainer) return;
        
            const track = carouselContainer.querySelector('.carousel-track');
            if (!track) return;
        
            const items = track ? Array.from(track.children) : [];
            const nextButton = carouselContainer.querySelector('.next-btn');
            const prevButton = carouselContainer.querySelector('.prev-btn');
        
            if (!items.length) {
                if (prevButton) prevButton.style.display = 'none';
                if (nextButton) nextButton.style.display = 'none';
                return;
            }
        
            if (isMobile) {
                if (prevButton) prevButton.style.display = 'none';
                if (nextButton) nextButton.style.display = 'none';
                track.style.scrollSnapType = 'x mandatory';
                track.style.overflowX = 'auto';
            } else {
                if (prevButton) prevButton.style.display = 'flex';
                if (nextButton) nextButton.style.display = 'flex';
        
                const firstItem = items[0];
                const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
                const scrollAmount = firstItem.offsetWidth + gap;
        
                if (prevButton) {
                    prevButton.addEventListener('click', () => {
                        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    });
                }
                if (nextButton) {
                    nextButton.addEventListener('click', () => {
                        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    });
                }
            }
        }
        
        function setupAudioPlayers() {
            const allPlayers = document.querySelectorAll('.audio-player');
        
            allPlayers.forEach(player => {
                const audioSrc = player.dataset.audioSrc;
                const displayTitle = player.dataset.displayTitle;
                if (!audioSrc || !displayTitle) return;

                player.innerHTML = `
                    <button class="play-pause-btn" aria-label="Play ${displayTitle}">
                        <i class="fas fa-play"></i>
                        <i class="fas fa-pause"></i>
                    </button>
                    <div class="track-info">
                        <div class="track-title">${displayTitle}</div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-seek"></div>
                        </div>
                    </div>
                    <div class="time-container">
                        <span class="current-time">0:00</span> / <span class="duration-time">0:00</span>
                    </div>
                    <audio class="audio-element" src="${audioSrc}" preload="metadata"></audio>
                `;

                const playPauseBtn = player.querySelector('.play-pause-btn');
                const audio = player.querySelector('.audio-element');
                const progressBar = player.querySelector('.progress-bar-seek');
                const progressBarContainer = player.querySelector('.progress-bar-container');
                const currentTimeEl = player.querySelector('.current-time');
                const durationEl = player.querySelector('.duration-time');
                
                const formatTime = (seconds) => {
                    const minutes = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
                };

                audio.addEventListener('loadedmetadata', () => {
                    durationEl.textContent = formatTime(audio.duration);
                });

                playPauseBtn.addEventListener('click', () => {
                    const isPlaying = player.classList.contains('is-playing');
                    if (isPlaying) {
                        audio.pause();
                    } else {
                        if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
                            currentlyPlayingAudio.pause();
                        }
                        currentlyPlayingAudio = audio;
                        audio.play();
                    }
                });

                audio.addEventListener('play', () => {
                    player.classList.add('is-playing');
                    playPauseBtn.setAttribute('aria-label', `Pause ${displayTitle}`);
                });

                audio.addEventListener('pause', () => {
                    player.classList.remove('is-playing');
                     playPauseBtn.setAttribute('aria-label', `Play ${displayTitle}`);
                    if (currentlyPlayingAudio === audio) {
                        currentlyPlayingAudio = null;
                    }
                });
                
                audio.addEventListener('timeupdate', () => {
                    const { currentTime, duration } = audio;
                    const progressPercent = (currentTime / duration) * 100;
                    progressBar.style.width = `${progressPercent}%`;
                    currentTimeEl.textContent = formatTime(currentTime);
                });

                progressBarContainer.addEventListener('click', (e) => {
                    const width = progressBarContainer.clientWidth;
                    const clickX = e.offsetX;
                    const duration = audio.duration;
                    audio.currentTime = (clickX / width) * duration;
                });
            });
        }
        
        // Homepage-specific initializations
        if (dynamicTextElement) {
            const initialText = dynamicTextElement.textContent.trim();
            const initialIndex = ideas.indexOf(initialText);
            currentIdeaIndex = initialIndex !== -1 ? initialIndex : 0;
            dynamicTextElement.textContent = ideas[currentIdeaIndex];
            setInterval(updateDynamicText, HERO_TEXT_INTERVAL);
        }

        if (heroVideo) {
            heroVideo.autoplay = true; heroVideo.loop = true; heroVideo.muted = true; heroVideo.playsInline = true;
            const ensureVideoPlaying = (context) => { if (heroVideo.paused) { const playPromise = heroVideo.play(); if (playPromise !== undefined) { playPromise.catch(error => console.warn(`Hero video: play() from ${context} was prevented.`, error)); } } };
            heroVideo.addEventListener('loadedmetadata', () => ensureVideoPlaying('loadedmetadata'));
            heroVideo.addEventListener('canplay', () => ensureVideoPlaying('canplay'));
            heroVideo.addEventListener('ended', () => { heroVideo.currentTime = 0; ensureVideoPlaying('ended'); });
            setTimeout(() => ensureVideoPlaying('initial setTimeout'), 100);
        }
        
        if (scrollArrow) {
            scrollArrow.addEventListener('click', () => scrollToSection('experience'));
        }

        window.addEventListener('keydown', handleKeyboardScroll);
        initCarousel('#services-carousel');
        initCarousel('#testimonials-carousel');
        setupAudioPlayers();

    } // --- END OF HOMEPAGE-ONLY LOGIC ---

    // Initial global setup calls
    setupConditionalLoader();
    initParticles();
    handleScroll();
    
    // Final load handler
    // Switch from 'load' to 'DOMContentLoaded' to hide the loading screen sooner.
    // This stops waiting for heavy resources like the video to finish downloading.
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        onPageLoaded();
    } else {
        document.addEventListener('DOMContentLoaded', onPageLoaded);
    }
    
    setTimeout(() => { if (loadingScreen && !loadingScreen.classList.contains('hidden')) { console.warn("window.onload fallback. Forcing loading screen removal."); onPageLoaded(); } }, 7000);
});