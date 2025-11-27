// ========================================
// MAIN GSAP ANIMATIONS - CONFLICT FREE
// Author: Shah Alam
// ========================================

(function() {
    'use strict';
    
    // Register GSAP plugins once
    gsap.registerPlugin(ScrollTrigger);
    
    // Storage for cleanup
    const animationInstances = {
        scrollTriggers: [],
        timelines: [],
        eventListeners: []
    };
    
    // ========================================
    // INITIALIZATION
    // ========================================
    function initAllAnimations() {
        console.log('🚀 Starting GSAP Animations...');
        
        // Initialize all modules
        initScrollColorChange();
        initButtonAnimations();
        initGridAnimation();
        initBannerAnimations();
        initLoadMoreCircle();
        initVideoScrollAnimation();
        initBrandAnimations();
        initMobileBrandScroll();
        initReviewSection();
        initPortfolioParallax();
        initPortfolioSection();
        initPortfolioBackgroundChange();
        initTextColorAnimation();
        initCounterSection();
        initShapeVideoSection();
        initMenuHoverEffect();
        initFAQAccordion();
        initFeaturedWork();
        initCursorFollower();
        initNavigation();
        initStickyNavbar();
        initAboutSection();
        initSmoothScroll();
        initPixelReveal();
        initConfidenceScrollAnimation();
        tabinitFeaturedWork(); 
        
        console.log('✅ All animations initialized successfully');
    }
    
    // ========================================
    // 1. SCROLL COLOR CHANGE
    // ========================================
    function initScrollColorChange() {
        const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
        if (!scrollColorElems.length) return;
        
        scrollColorElems.forEach((colorSection, i) => {
            const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;
            const prevText = i === 0 ? "" : scrollColorElems[i - 1].dataset.textcolor;

            const trigger = ScrollTrigger.create({
                id: `scroll-color-${i}`,
                trigger: colorSection,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => gsap.to("body", {
                    backgroundColor: colorSection.dataset.bgcolor,
                    color: colorSection.dataset.textcolor,
                    duration: 0.3
                }),
                onLeaveBack: () => gsap.to("body", {
                    backgroundColor: prevBg,
                    color: prevText,
                    duration: 0.3
                })
            });
            
            animationInstances.scrollTriggers.push(trigger);
        });
        
        console.log('✅ Scroll color change initialized');
    }
    
    // ========================================
    // 2. BUTTON ANIMATIONS
    // ========================================
    function initButtonAnimations() {
        class Button {
            constructor(buttonElement) {
                this.block = buttonElement;
                this.init();
                this.initEvents();
            }

            init() {
                const el = gsap.utils.selector(this.block);
                this.DOM = {
                    button: this.block,
                    flair: el(".button__flair")
                };
                this.xSet = gsap.quickSetter(this.DOM.flair, "xPercent");
                this.ySet = gsap.quickSetter(this.DOM.flair, "yPercent");
            }

            getXY(e) {
                const { left, top, width, height } = this.DOM.button.getBoundingClientRect();
                const xTransformer = gsap.utils.pipe(
                    gsap.utils.mapRange(0, width, 0, 100),
                    gsap.utils.clamp(0, 100)
                );
                const yTransformer = gsap.utils.pipe(
                    gsap.utils.mapRange(0, height, 0, 100),
                    gsap.utils.clamp(0, 100)
                );
                return {
                    x: xTransformer(e.clientX - left),
                    y: yTransformer(e.clientY - top)
                };
            }

            initEvents() {
                this.DOM.button.addEventListener("mouseenter", (e) => {
                    const { x, y } = this.getXY(e);
                    this.xSet(x);
                    this.ySet(y);
                    gsap.to(this.DOM.flair, {
                        scale: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });

                this.DOM.button.addEventListener("mouseleave", (e) => {
                    const { x, y } = this.getXY(e);
                    gsap.killTweensOf(this.DOM.flair);
                    gsap.to(this.DOM.flair, {
                        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
                        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
                        scale: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });

                this.DOM.button.addEventListener("mousemove", (e) => {
                    const { x, y } = this.getXY(e);
                    gsap.to(this.DOM.flair, {
                        xPercent: x,
                        yPercent: y,
                        duration: 0.4,
                        ease: "power2"
                    });
                });
            }
        }

        const buttonElements = document.querySelectorAll('[data-block="button"]');
        buttonElements.forEach((buttonElement) => {
            new Button(buttonElement);
        });
        
        console.log('✅ Button animations initialized');
    }
    
    // ========================================
    // 3. GRID CURSOR ANIMATION
    // ========================================
    function initGridAnimation() {
        const svg = document.getElementById('grid-animation');
        if (!svg) return;
        
        const CELL_SIZE = 40;
        const PROB_OF_NEIGHBOR = 0.5;
        const FADE_TIME_MS = 500;
        
        let NUM_ROWS;
        let NUM_COLS;
        let currentRow = -1;
        let currentCol = -1;
        let cells = [];

        function setupGrid() {
            NUM_ROWS = Math.ceil(window.innerHeight / CELL_SIZE);
            NUM_COLS = Math.ceil(window.innerWidth / CELL_SIZE);
            
            svg.innerHTML = '';
            svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
            svg.setAttribute('width', window.innerWidth);
            svg.setAttribute('height', window.innerHeight);

            cells = [];
            for (let r = 0; r < NUM_ROWS; r++) {
                cells[r] = [];
                for (let c = 0; c < NUM_COLS; c++) {
                    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    rect.setAttribute('x', c * CELL_SIZE);
                    rect.setAttribute('y', r * CELL_SIZE);
                    rect.setAttribute('width', CELL_SIZE);
                    rect.setAttribute('height', CELL_SIZE);
                    rect.classList.add('grid-cell');
                    
                    cells[r][c] = rect;
                    svg.appendChild(rect);
                }
            }
        }

        function activateNeighbors(row, col) {
            const cellsToActivate = [];

            if (cells[row] && cells[row][col]) {
                cellsToActivate.push(cells[row][col]);
            }

            for (let dRow = -1; dRow <= 1; dRow++) {
                for (let dCol = -1; dCol <= 1; dCol++) {
                    const neighborRow = row + dRow;
                    const neighborCol = col + dCol; 

                    let isCurrentCell = dRow === 0 && dCol === 0;
                    let isInBounds = cells[neighborRow] && cells[neighborRow][neighborCol];

                    if (!isCurrentCell && isInBounds && Math.random() < PROB_OF_NEIGHBOR) {
                        cellsToActivate.push(cells[neighborRow][neighborCol]);
                    }
                }
            }
            
            cellsToActivate.forEach(rect => {
                rect.classList.remove('active');
                requestAnimationFrame(() => {
                    rect.classList.add('active');
                });
               
                setTimeout(() => {
                    rect.classList.remove('active');
                }, FADE_TIME_MS); 
            });
        }

        function handleMouseMove(event) {
            const row = Math.floor(event.clientY / CELL_SIZE);
            const col = Math.floor(event.clientX / CELL_SIZE);

            if (row < 0 || row >= NUM_ROWS || col < 0 || col >= NUM_COLS) {
                return;
            }

            if (row !== currentRow || col !== currentCol) {
                currentRow = row;
                currentCol = col;
                activateNeighbors(row, col);
            }
        }

        function handleResize() {
            setupGrid(); 
            currentRow = -1;
            currentCol = -1;
        }

        setupGrid();
        document.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        
        console.log('✅ Grid animation initialized');
    }
    
    // ========================================
    // 4. BANNER ANIMATIONS
    // ========================================
    function initBannerAnimations() {
        var initParticleSlider = function() {
            var init = function() {
                var ps = new ParticleSlider({
                    ptlGap: 0,
                    ptlSize: 1,
                    width: 1e9,
                    height: 1e9,
                    color: '#ACE625',
                    monochrome: true
                });
                
                ps.restless = true;
                
                (window.addEventListener
                    ? window.addEventListener('click', function(){ps.init(true)}, false)
                    : window.onclick = function(){ps.init(true)});
            };
            
            var psScript = document.createElement('script');
            (psScript.addEventListener
                ? psScript.addEventListener('load', init, false)
                : psScript.onload = init);
            psScript.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/23500/ps-0.9.js';
            psScript.setAttribute('type', 'text/javascript');
            document.body.appendChild(psScript);
        };
        
        if (document.readyState === 'complete') {
            initParticleSlider();
        } else {
            window.addEventListener('load', initParticleSlider, false);
        }
        
        console.log('✅ Banner animations initialized');
    }
    
    // ========================================
    // 5. LOAD MORE CIRCLE TEXT
    // ========================================
    function initLoadMoreCircle() {
        const text = document.querySelector(".loadmoretext");
        if (!text) return;
        
        text.innerHTML = text.innerText
            .split("")
            .map((char, i) => `<span style="transform:rotate(${i * 14}deg)">${char}</span>`)
            .join("");
        
        console.log('✅ Load more circle initialized');
    }
    
    // ========================================
    // 6. VIDEO SCROLL ANIMATION
    // ========================================
    function initVideoScrollAnimation() {
        const MOBILE_BREAKPOINT = 640;
        let currentVideoAnimation = null;
        
        function killVideoAnimations() {
            if (currentVideoAnimation) {
                currentVideoAnimation.scrollTrigger.kill();
                currentVideoAnimation.kill();
                currentVideoAnimation = null;
            }
            
            const videoElement = document.querySelector('.sticky-circle_element');
            if (videoElement) {
                gsap.set(videoElement, { clearProps: 'all' });
            }
        }

        function initVideo() {
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                console.log('⛔ Video animation disabled on mobile');
                killVideoAnimations();
                return;
            }
            
            const videoElement = document.querySelector('.sticky-circle_element');
            const videoWrap = document.querySelector('.sticky-circle_wrap');
            const spacer = document.querySelector('.video-expansion-spacer');
            const anotherSection = document.querySelector('.partner-section');
           
            if (!videoElement || !spacer || !videoWrap || !anotherSection) {
                console.error('❌ Video elements not found');
                return;
            }
         
            console.log('✅ Video animation enabled - Screen:', window.innerWidth);
         
            function calculatePositions() {
                const videoRect = videoElement.getBoundingClientRect();
                const width = window.innerWidth;
               
                let centerX, centerY;
                
                if (width <= 1200) {
                    const viewportCenterX = window.innerWidth / 2;
                    const elementCenterX = videoRect.left + (videoRect.width / 2);
                    centerX = viewportCenterX - elementCenterX;
                    
                    if (width <= 768) {
                        centerX += 0; 
                    } else if (width <= 991) {
                        centerX += 10; 
                    } else {
                        centerX += 5;
                    }
                } else {
                    centerX = (window.innerWidth / 2) - (videoRect.left + videoRect.width / 2);
                }
                
                centerY = (window.innerHeight / 2) - (videoRect.top + videoRect.height / 2);
               
                const scaleX = window.innerWidth / videoRect.width;
                const scaleY = window.innerHeight / videoRect.height;
                const fullScale = Math.max(scaleX, scaleY) * 1.05;
               
                return { centerX, centerY, fullScale };
            }

            function getResponsiveValues() {
                const width = window.innerWidth;
                
                if (width > 1200) {
                    return { initialY: 200, scaleY: -30 };
                } else if (width > 991) {
                    return { initialY: 250, scaleY: -40 };
                } else if (width > 768) {
                    return { initialY: 300, scaleY: -50 };
                } else {
                    return { initialY: 300, scaleY: -50 };
                }
            }
         
            const { centerX, centerY, fullScale } = calculatePositions();
            const responsive = getResponsiveValues();
         
            const videoTimeline = gsap.timeline({
                scrollTrigger: {
                    id: 'video-scroll-main',
                    trigger: spacer,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    pin: videoWrap,
                    pinSpacing: false,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });
         
            videoTimeline
                .to(videoElement, {
                    x: centerX,
                    y: centerY + responsive.initialY,
                    duration: 0.30,
                    ease: 'power2.out'
                })
                .to(videoElement, {
                    scale: 1.8,
                    borderRadius: 0,
                    x: centerX,
                    y: centerY + responsive.scaleY,
                    duration: 0.20,
                    ease: 'power1.inOut'
                })
                .to(videoElement, {
                    scale: fullScale,
                    borderRadius: 0,
                    x: centerX,
                    y: centerY,
                    duration: 0.10,
                    ease: 'power1.inOut'
                })
                .to(videoElement, {
                    duration: 0.10
                })
                .to(videoElement, {
                    y: centerY - window.innerHeight,
                    duration: 0.30,
                    ease: 'power1.inOut'
                });
            
            currentVideoAnimation = videoTimeline;
            animationInstances.timelines.push(videoTimeline);
            console.log('✅ Video scroll animation initialized');
        }
        
        initVideo();
        
        let videoResizeTimer;
        const resizeHandler = () => {
            clearTimeout(videoResizeTimer);
            videoResizeTimer = setTimeout(() => {
                console.log('🔄 Video animation resize');
                killVideoAnimations();
                initVideo();
            }, 250);
        };
        
        window.addEventListener('resize', resizeHandler);
        animationInstances.eventListeners.push({ type: 'resize', handler: resizeHandler });
    }
    
    // ========================================
    // 7. BRAND FLIP ANIMATIONS
    // ========================================
    function initBrandAnimations() {
        const brandItems = document.querySelectorAll('.brand-item');
        if (!brandItems.length) return;
        
        const flippedStates = new Map();
        
        brandItems.forEach((item, index) => {
            flippedStates.set(index, false);
        });
        
        function flipRandomBrand() {
            const randomIndex = Math.floor(Math.random() * brandItems.length);
            const brandItem = brandItems[randomIndex];
            const brandInner = brandItem.querySelector('.brand-inner');
            const isCurrentlyFlipped = flippedStates.get(randomIndex);
            
            if (!isCurrentlyFlipped) {
                gsap.to(brandInner, {
                    rotationX: -180,
                    duration: .6,
                    ease: "power1.inOut",
                    onComplete: () => {
                        flippedStates.set(randomIndex, true);
                        
                        const backDelay = 3000 + Math.random() * 2000;
                        setTimeout(() => {
                            gsap.to(brandInner, {
                                rotationX: 0,
                                duration: .8,
                                ease: "power1.inOut",
                                onComplete: () => {
                                    flippedStates.set(randomIndex, false);
                                }
                            });
                        }, backDelay);
                    }
                });
            }
        }
        
        function startRandomFlipping() {
            flipRandomBrand();
            const nextFlipDelay = 2000 + Math.random() * 3000;
            setTimeout(startRandomFlipping, nextFlipDelay);
        }
        
        gsap.from('.brand-item', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            onComplete: () => {
                setTimeout(startRandomFlipping, 1500);
            }
        });
        
        brandItems.forEach((item, index) => {
            const brandInner = item.querySelector('.brand-inner');
            
            item.addEventListener('mouseenter', () => {
                if (!flippedStates.get(index)) {
                    gsap.to(brandInner, {
                        rotationX: -180,
                        duration: 1.2,
                        ease: "power1.inOut"
                    });
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (!flippedStates.get(index)) {
                    gsap.to(brandInner, {
                        rotationX: 0,
                        duration: 1.2,
                        ease: "power1.inOut"
                    });
                }
            });
        });
        
        console.log('✅ Brand animations initialized');
    }
    
    // ========================================
    // 8. MOBILE BRAND SCROLL
    // ========================================
    function initMobileBrandScroll() {
        let brandScrollAnimations = [];
        
        function cleanup() {
            brandScrollAnimations.forEach(anim => {
                if (anim) anim.kill();
            });
            brandScrollAnimations = [];
        }
        
        function init() {
            if (window.innerWidth > 767) {
                cleanup();
                return;
            }
            
            const topRow = document.getElementById('brandRowTop');
            const bottomRow = document.getElementById('brandRowBottom');
            
            if (!topRow || !bottomRow) return;
            
            const topItems = topRow.querySelectorAll('.mobile-brand-item');
            const bottomItems = bottomRow.querySelectorAll('.mobile-brand-item');
            
            if (!topItems.length || !bottomItems.length) return;
            
            const topItemWidth = topItems[0].offsetWidth;
            const bottomItemWidth = bottomItems[0].offsetWidth;
            
            const computedStyle = window.getComputedStyle(topRow);
            const gap = parseFloat(computedStyle.gap) || 40;
            
            const topTotalWidth = (topItemWidth + gap) * (topItems.length / 2);
            const bottomTotalWidth = (bottomItemWidth + gap) * (bottomItems.length / 2);

            const topAnim = gsap.fromTo(topRow, 
                { x: 0 },
                {
                    x: -topTotalWidth,
                    duration: 25,
                    ease: "none",
                    repeat: -1,
                }
            );

            const bottomAnim = gsap.fromTo(bottomRow,
                { x: -bottomTotalWidth },
                {
                    x: 0,
                    duration: 25,
                    ease: "none",
                    repeat: -1,
                }
            );
            
            brandScrollAnimations.push(topAnim, bottomAnim);
            console.log('✅ Mobile brand scroll initialized');
        }

        init();

        let brandResizeTimeout;
        const resizeHandler = () => {
            clearTimeout(brandResizeTimeout);
            brandResizeTimeout = setTimeout(() => {
                cleanup();
                init();
            }, 250);
        };
        
        window.addEventListener('resize', resizeHandler);
        animationInstances.eventListeners.push({ type: 'resize', handler: resizeHandler });
    }
    
    // ========================================
    // 9. REVIEW SECTION
    // ========================================
    function initReviewSection() {
        const reviewSection = document.querySelector(".review-main");
        if (!reviewSection || window.innerWidth <= 768) return;

        const reviewTimeline = gsap.timeline({
            scrollTrigger: {
                id: 'review-cards',
                trigger: reviewSection,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                // markers:true,
            },
        });

        reviewTimeline
            .to(".card-1", { y: "-180vh", rotation: -30, duration: 1, ease: "power2.in" })
            .to(".card-2", { y: "-180vh", rotation: 60, duration: 1, ease: "power2.in" })
            .to(".card-3", { y: "-180vh", rotation: -30, duration: 1, ease: "power2.in" })
            .to(".card-4", { y: "-180vh", rotation: 60, duration: 1, ease: "power2.in" });
        
        animationInstances.timelines.push(reviewTimeline);
        console.log('✅ Review section initialized');
    }
    
    // ========================================
    // 10. TEXT COLOR ANIMATION
    // ========================================
    function initTextColorAnimation() {
        const textMultipleElements = document.querySelectorAll(".text-animate");
        if (!textMultipleElements.length) return;

        const textTimeline = gsap.timeline({
            scrollTrigger: {
                id: 'text-color-animation',
                trigger: textMultipleElements[0],
                start: "top 50%",
                end: "bottom 20%",
                scrub: true,
            }
        });

        textMultipleElements.forEach(textElement => {
            let combinedText = "";

            textElement.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    combinedText += child.textContent.trim();
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    combinedText += child.textContent.trim();
                }
            });

            const splitText = combinedText.split("").map(char => `<span>${char}</span>`).join("");
            textElement.innerHTML = splitText;
            const chars = textElement.querySelectorAll("span");

            textTimeline.from(chars, {
                color: "#6A7282",
                stagger: 1,
                duration: 1,
            }, "+=0.5");
        });
        
        animationInstances.timelines.push(textTimeline);
        console.log('✅ Text color animation initialized');
    }
    
    // ========================================
    // 11. PORTFOLIO PARALLAX
    // ========================================
    function initPortfolioParallax() {
        const portfolioSection = document.querySelector(".portfolio");
        if (!portfolioSection) return;
        
        const parallaxTimeline = gsap.timeline({
            scrollTrigger: {
                id: 'portfolio-parallax',
                trigger: ".portfolio",
                start: "top 60%",
                end: "top 0%",
                scrub: 1,
            }
        });

        parallaxTimeline
            .to(".portfolio-title", {
                y: -50,
                opacity: .6,
                ease: "none"
            }, 0)
            .to(".parallax-logo", {
                y: -600,
                scale: 1,
                opacity: 1,
                ease: "none"
            }, 0)
            .to(".portfolio", {
                paddingTop: "50px",
                ease: "none"
            }, 0);
        
        animationInstances.timelines.push(parallaxTimeline);
        console.log('✅ Portfolio parallax initialized');
    }
    
    // ========================================
    // 12. PORTFOLIO SECTION
    // ========================================
    function initPortfolioSection() {
        const trigger = ScrollTrigger.create({
            id: 'portfolio-section-init',
            trigger: '.portfolio',
            start: 'top bottom',
            once: true,
            onEnter: () => {
                console.log('🎨 Initializing portfolio section...');
                setupPortfolioAnimation();
            }
        });
        
        animationInstances.scrollTriggers.push(trigger);
    }

    function setupPortfolioAnimation() {
        const sections = [
            { content: '.content-1', image: '.image-container-1', label: 'Discover', num: '.num-1' },
            { content: '.content-2', image: '.image-container-2', label: 'Design', num: '.num-2' },
            { content: '.content-3', image: '.image-container-3', label: 'Build', num: '.num-3' },
            { content: '.content-4', image: '.image-container-4', label: 'Launch', num: '.num-4' }
        ];

        const stickyContainer = document.querySelector('.sticky-container');
        if (!stickyContainer) {
            console.error('❌ Portfolio sticky-container not found');
            return;
        }

        // Initial setup
        gsap.set('.image-container-1', { y: 0 });
        gsap.set('.content-1', { opacity: 1 });
        gsap.set('.num-1', { opacity: 1 });
        gsap.set(['.image-container-2', '.image-container-3', '.image-container-4'], { y: '100%' });
        gsap.set(['.content-2', '.content-3', '.content-4'], { opacity: 0 });
        gsap.set(['.num-2', '.num-3', '.num-4'], { opacity: 0.3 });

        const portfolioTimeline = gsap.timeline({
            scrollTrigger: {
                id: 'portfolio-main-animation',
                trigger: '.sticky-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.8,
                pin: '.sticky-wrapper',
                pinSpacing: true,
                anticipatePin: 1,
                markers: false
            }
        });

        sections.forEach((section, index) => {
            if (index === 0) return;

            const prev = sections[index - 1];
            const position = (index - 1) * 1;

            portfolioTimeline
                .to(prev.content, { opacity: 0, duration: 0.3, ease: 'power2.in' }, position)
                .to(prev.num, { opacity: 0.3, duration: 0.2 }, position)
                .to(section.image, { y: 0, duration: 0.7, ease: 'power3.out' }, position + 0.1)
                .to(section.content, { opacity: 1, duration: 0.4, ease: 'power2.out' }, position + 0.3)
                .to(section.num, { opacity: 1, duration: 0.2 }, position + 0.3);
        });

        // Active states
        ScrollTrigger.create({
            id: 'portfolio-active-states',
            trigger: '.sticky-container',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                const progress = self.progress;
                const totalSections = sections.length;
                const currentIndex = Math.min(
                    Math.floor(progress * totalSections),
                    totalSections - 1
                );

                const navLabel = document.querySelector('.current-section');
                if (navLabel) {
                    navLabel.textContent = sections[currentIndex].label;
                }

                sections.forEach((sec, idx) => {
                    const numElement = document.querySelector(sec.num);
                    const contentElement = document.querySelector(sec.content);
                    const imageElement = document.querySelector(sec.image);

                    if (idx === currentIndex) {
                        numElement?.classList.add('active');
                        contentElement?.classList.add('active');
                        imageElement?.classList.add('active');
                    } else {
                        numElement?.classList.remove('active');
                        contentElement?.classList.remove('active');
                        imageElement?.classList.remove('active');
                    }
                });
            }
        });

        // Entrance animation
        gsap.from('.content-1', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });

        gsap.from('.image-container-1', {
            y: 50,
            duration: 0.9,
            delay: 0.3,
            ease: 'power3.out'
        });

        animationInstances.timelines.push(portfolioTimeline);
        console.log('✅ Portfolio section initialized');
    }
    
    // ========================================
    // 13. PORTFOLIO BACKGROUND CHANGE
    // ========================================
    function initPortfolioBackgroundChange() {
        const trigger = ScrollTrigger.create({
            id: 'portfolio-bg-change',
            trigger: '.review',
            start: 'bottom 80%',
            onEnter: () => {
                gsap.to('.review-bottom', {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.inOut'
                });
                gsap.to('.review-title', {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.inOut'
                });
            },
            onLeaveBack: () => {
                gsap.to('.review-bottom', {
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.inOut'
                });
                gsap.to('.review-title', {
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.inOut'
                });
            }
        });
        
        animationInstances.scrollTriggers.push(trigger);
        console.log('✅ Portfolio background change initialized');
    }
    
    // ========================================
    // 14. COUNTER SECTION
    // ========================================
    function initCounterSection() {
        const counterSection = document.querySelector(".counter-section");
        if (!counterSection) return;
        
        function animateCounter(element) {
            const target = parseInt(element.dataset.target);
            const prefix = element.dataset.prefix || '';
            const suffix = element.dataset.suffix || '';
            
            const counter = { value: 0 };
            
            gsap.to(counter, {
                value: target,
                duration: 2.5,
                ease: "power2.out",
                onUpdate: function() {
                    const value = Math.floor(counter.value);
                    element.textContent = prefix + value + suffix;
                }
            });
        }

        gsap.from(".heading", {
            scrollTrigger: {
                id: 'counter-heading',
                trigger: ".counter-section",
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.out"
        });

        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach((card, index) => {
            const delay = parseFloat(card.dataset.delay) || 0;
            const numberElement = card.querySelector('.number');
            
            gsap.to(card, {
                scrollTrigger: {
                    id: `counter-card-${index}`,
                    trigger: ".counter-section",
                    start: "top 70%",
                    end: "top 40%",
                    toggleActions: "play none none none",
                    onEnter: () => {
                        setTimeout(() => {
                            animateCounter(numberElement);
                        }, delay * 1000);
                    }
                },
                opacity: 1,
                y: 0,
                duration: 1,
                delay: delay,
                ease: "power3.out"
            });
        });

        gsap.to(".stats-grid", {
            scrollTrigger: {
                id: 'counter-parallax',
                trigger: ".counter-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -50,
            ease: "none"
        });
        
        console.log('✅ Counter section initialized');
    }
    
    // ========================================
    // 15. SHAPE VIDEO SECTION
    // ========================================
    function initShapeVideoSection() {
        const shapeSection = document.querySelector(".shape-video-sticky-section");
        if (!shapeSection) return;
        
        const shapeTimeline = gsap.timeline({
            scrollTrigger: {
                id: 'shape-video-zoom',
                trigger: ".shape-video-sticky-section",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });
        
        shapeTimeline
            .to(".shape-background-content-wrapper", {
                scale: 3,
                ease: "power2.inOut"
            })
            .to(".top-text, .bottom-text", {
                opacity: 0,
                ease: "power2.inOut"
            }, 0)
            .to(".svg-mask", {
                scale: 2.0,
                rotation: 60,
                opacity: 0,
                ease: "power2.inOut"
            }, 0)
            .to(".svg-mask", {
                opacity: 0
            });

        gsap.to(".shape-background-video", {
            scale: 1.2,
            scrollTrigger: {
                id: 'shape-video-scale',
                trigger: ".shape-video-sticky-section",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });
        
        animationInstances.timelines.push(shapeTimeline);
        console.log('✅ Shape video section initialized');
    }
    
    // ========================================
    // 16. MENU HOVER EFFECT
    // ========================================
    function initMenuHoverEffect() {
        let menuItem = document.querySelectorAll(".menu__item-text");
        let menuImage = document.querySelectorAll(".menu__item-image");
        
        if (!menuItem.length || !menuImage.length) return;

        for (let i = 0; i < Math.min(menuItem.length, menuImage.length); i++) {
            const animation = gsap.to(menuImage[i], {
                opacity: 1,
                duration: 0.2,
                scale: 1,
                ease: "power2.out"
            });

            menuItem[i].addEventListener("mouseenter", () => animation.play());
            menuItem[i].addEventListener("mouseleave", () => animation.reverse());

            animation.reverse();
        }

        function moveText(e) {
            gsap.to([...menuImage], {
                css: {
                    left: e.pageX + 50,
                    top: e.pageY,
                },
                duration: 0.2,
                ease: "power2.out",
            });
        }

        menuItem.forEach((el) => {
            el.addEventListener("mousemove", moveText);
        });
        
        console.log('✅ Menu hover effect initialized');
    }
    
    // ========================================
    // 17. FAQ ACCORDION
    // ========================================
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll(".faq-item");
        if (!faqItems.length) return;

        function closeItem(item) {
            const button = item.querySelector(".faq-header");
            const body = item.querySelector(".faq-body");
            const icon = button.querySelector(".faq-icon");

            item.classList.remove("is-open");
            button.setAttribute("aria-expanded", "false");
            
            gsap.to(body, {
                maxHeight: 0,
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => {
                    body.style.overflow = "hidden";
                }
            });

            if (icon) {
                gsap.to(icon, {
                    rotation: 0,
                    duration: 0.4,
                    ease: "power2.inOut"
                });
            }
        }

        function openItem(item) {
            const button = item.querySelector(".faq-header");
            const body = item.querySelector(".faq-body");
            const icon = button.querySelector(".faq-icon");

            item.classList.add("is-open");
            button.setAttribute("aria-expanded", "true");
            
            gsap.to(body, {
                maxHeight: body.scrollHeight,
                duration: 0.4,
                ease: "power2.out",
                onStart: () => {
                    body.style.overflow = "hidden";
                },
                onComplete: () => {
                    body.style.overflow = "visible";
                }
            });
        }

        faqItems.forEach((item) => {
            const body = item.querySelector(".faq-body");
            if (item.classList.contains("is-open")) {
                gsap.set(body, { maxHeight: body.scrollHeight });
            } else {
                gsap.set(body, { maxHeight: 0 });
            }
        });

        faqItems.forEach((item) => {
            const button = item.querySelector(".faq-header");

            button.addEventListener("click", () => {
                const isOpen = item.classList.contains("is-open");

                faqItems.forEach((faq, index) => {
                    if (faq !== item && faq.classList.contains("is-open")) {
                        gsap.delayedCall(index * 0.05, () => closeItem(faq));
                    }
                });

                if (!isOpen) {
                    setTimeout(() => openItem(item), 50);
                } else {
                    closeItem(item);
                }
            });
        });
        
        console.log('✅ FAQ accordion initialized');
    }
    
    // ========================================
    // 18. FEATURED WORK GRID
    // ========================================
    function initFeaturedWork() {
        const featuredWork = document.querySelector(".featured-work");
        if (!featuredWork) {
            console.log("⛔ No .featured-work found");
            return;
        }

        const gridItems = featuredWork.querySelectorAll(".grid-item");

        gridItems.forEach((item, index) => {
            const previousElementSibling = item.previousElementSibling;
            let isLeftSide = false;

            if (previousElementSibling) {
                const currentItemRightEdge = item.offsetLeft + item.offsetWidth;
                const previousItemLeftEdge = previousElementSibling.offsetLeft + 1;

                if (currentItemRightEdge <= previousItemLeftEdge) {
                    isLeftSide = true;
                }
            }

            const originX = isLeftSide ? 100 : 0;

            gsap.timeline({
                defaults: {
                    ease: "power4.out",
                },
                scrollTrigger: {
                    id: `featured-work-item-${index}`,
                    trigger: item,
                    start: "top bottom-=10%",
                    end: "+=100%",
                    scrub: 1,
                },
            })
            .fromTo(
                item.querySelector(".image-wrap"),
                {
                    scale: 0,
                    transformOrigin: `${originX}% 0%`,
                },
                {
                    scale: 1,
                }
            )
            .fromTo(
                item.querySelector(".image"),
                {
                    scale: 5,
                    transformOrigin: `${originX}% 0%`,
                },
                {
                    scale: 1,
                },
                0
            )
            .fromTo(
                item.querySelector(".caption"),
                {
                    xPercent: isLeftSide ? -100 : 100,
                    opacity: 0,
                },
                {
                    ease: "power2.out",
                    xPercent: 0,
                    opacity: 1,
                },
                0
            );
        });

        console.log(`✅ Featured work initialized for ${gridItems.length} items`);
    }
    
    // ========================================
    // 19. CURSOR FOLLOWER
    // ========================================
    function initCursorFollower() {
        if (window.innerWidth <= 768) return;
        
        class AdvancedCursorFollower {
            constructor() {
                this.cursor = document.querySelector('.cursor-follower');
                if (!this.cursor) return;
                
                this.cursorBtn = this.cursor.querySelector('.cursor-btn');
                this.cursorText = this.cursorBtn.querySelector('.cursor-text');
                this.cursorArrow = this.cursorBtn.querySelector('svg');
                
                this.mouse = { x: 0, y: 0 };
                this.cursorPos = { x: 0, y: 0 };
                this.currentSection = null;
                
                this.init();
            }

            init() {
                document.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.clientX;
                    this.mouse.y = e.clientY;
                });

                const sections = document.querySelectorAll('[data-cursor-hover="true"]');
                sections.forEach(section => {
                    section.addEventListener('mouseenter', () => this.showCursor(section));
                    section.addEventListener('mouseleave', () => this.hideCursor());
                });

                this.animate();
            }

            showCursor(section) {
                this.currentSection = section;
                
                const text = section.dataset.cursorText || 'View More Work';
                const style = section.dataset.cursorStyle || 'default';
                
                this.cursorText.textContent = text;
                
                this.cursorBtn.className = 'cursor-btn';
                if (style !== 'default') this.cursorBtn.classList.add(`style-${style}`);
                
                gsap.to(this.cursor, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
                
                gsap.to(this.cursorArrow, {
                    x: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            hideCursor() {
                this.currentSection = null;
                
                gsap.to(this.cursor, {
                    opacity: 0,
                    scale: 0,
                    duration: 0.3,
                    ease: 'back.in(1.7)'
                });
                
                gsap.to(this.cursorArrow, {
                    x: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            animate() {
                const lerp = 0.15;
                this.cursorPos.x += (this.mouse.x - this.cursorPos.x) * lerp;
                this.cursorPos.y += (this.mouse.y - this.cursorPos.y) * lerp;

                gsap.set(this.cursor, {
                    x: this.cursorPos.x,
                    y: this.cursorPos.y
                });

                requestAnimationFrame(() => this.animate());
            }
        }

        new AdvancedCursorFollower();
        console.log('✅ Cursor follower initialized');
    }
    
    // ========================================
    // 20. NAVIGATION
    // ========================================
    function initNavigation() {
        if (typeof jQuery === 'undefined') {
            console.log('⛔ jQuery not found - navigation skipped');
            return;
        }
        
        const navigation = gsap.timeline({
            paused: true,
            reversed: true
        });

        navigation
            .to("#navigationWrap", {
                opacity: 1,
                display: "block",
                duration: 0.5,
                ease: "power2.inOut"
            })
            .to(".menu-open", {
                opacity: 0,
                display: "none",
                duration: 0.2
            }, "-=0.3")
            .to(".menu-close", {
                opacity: 1,
                display: "flex",
                duration: 0.3
            }, "-=0.2")
            .from(".fullscreen-menu nav ul li", {
                opacity: 0,
                y: 80,
                stagger: 0.1,
                duration: 0.6,
                ease: "power3.out"
            })
            .from(".social-links a", {
                opacity: 0,
                scale: 0,
                stagger: 0.1,
                duration: 0.4,
                ease: "back.out(1.7)"
            }, "-=0.3");

        $(".menu-open").click(function(e) {
            e.preventDefault();
            navigation.play();
        });

        $(".menu-close").click(function(e) {
            e.preventDefault();
            navigation.reverse();
        });

        $(".fullscreen-menu nav a").click(function() {
            navigation.reverse();
        });

        navigation.eventCallback("onStart", function() {
            if (!navigation.reversed()) {
                $("body").css("overflow", "hidden");
            }
        });

        navigation.eventCallback("onReverseComplete", function() {
            $("body").css("overflow", "auto");
        });
        
        console.log('✅ Navigation initialized');
    }
    
    // ========================================
    // 21. STICKY NAVBAR
    // ========================================
    function initStickyNavbar() {
        const desktopNav = document.querySelector(".sticky-navbar-bottom");
        const mobileNav = document.querySelector(".sticky-navbar-bottom-mobile");
        
        if (desktopNav) {
            gsap.to(".sticky-navbar-bottom", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.4)",
                scrollTrigger: {
                    id: 'sticky-navbar-desktop',
                    trigger: "body",
                    start: "500vh top",
                    toggleActions: "play none none reverse",
                }
            });

            gsap.from(".sticky-nav-link", {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    id: 'sticky-navbar-links',
                    trigger: "body",
                    start: "500vh top",
                    toggleActions: "play none none reverse",
                }
            });
        }

        if (mobileNav) {
            gsap.to(".sticky-navbar-bottom-mobile", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.4)",
                scrollTrigger: {
                    id: 'sticky-navbar-mobile',
                    trigger: "body",
                    start: "500vh top",
                    toggleActions: "play none none reverse",
                }
            });

            gsap.from(".sticky-nav-link-mobile", {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    id: 'sticky-navbar-mobile-links',
                    trigger: "body",
                    start: "500vh top",
                    toggleActions: "play none none reverse",
                }
            });
        }
        
        console.log('✅ Sticky navbar initialized');
    }
    
    // ========================================
    // 22. ABOUT SECTION banner image animation
    // ========================================
function initAboutSection() {
    // Screen size check - only run on screens wider than 991px
    const minWidth = 776;
    
    if (window.innerWidth <= minWidth) {
        console.log('❌ Screen too small - About animation disabled');
        return; // Exit early if screen is too small
    }

    const wrapper = document.querySelector('.about-section-wrapper');
    const about = document.querySelector('#about-banners');
    
    if (!about || !wrapper) {
        console.log('❌ About section not found');
        return;
    }
    
    const inner = document.querySelector('#aboutInner');
    const images = gsap.utils.toArray('.float-image');
    const title = document.querySelector('#mainTitle');

    if (!inner || !images.length || !title) {
        console.log('❌ About elements missing');
        return;
    }

    // Kill existing
    ScrollTrigger.getAll().forEach(st => {
        if (st.vars.id === 'about-section-animation') {
            st.kill();
        }
    });

    // Reset to initial state
    gsap.set(images, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1
    });
    
    gsap.set(title, {
        scale: 1
    });

    // Get center position
    function getCenter() {
        const rect = inner.getBoundingClientRect();
        const parentRect = about.getBoundingClientRect();
        return {
            x: rect.left - parentRect.left + rect.width / 2,
            y: rect.top - parentRect.top + rect.height / 2
        };
    }

    const aboutTimeline = gsap.timeline({
        scrollTrigger: {
            id: 'about-section-animation',
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom", 
            scrub: 1,
            pin: about,
            anticipatePin: 1,
            pinSpacing: false, 
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progress = Math.round(self.progress * 100);
                if (progress % 10 === 0) {
                    console.log(`About: ${progress}%`);
                }
            },
            onEnter: () => {
                console.log('✅ About entered');
            },
            onLeave: () => {
                console.log('✅ About complete');
                requestAnimationFrame(() => {
                    const reviewST = ScrollTrigger.getById('review-cards');
                    if (reviewST) {
                        reviewST.refresh();
                        console.log('✅ Review refreshed');
                    }
                });
            },
            onRefresh: (self) => {
                console.log('✅ About metrics:', {
                    start: Math.round(self.start),
                    end: Math.round(self.end),
                    distance: Math.round(self.end - self.start)
                });
            }
        }
    });

    // Phase 1: Wobble
    aboutTimeline.to(images, {
        y: (i) => (i % 2 === 0 ? -15 : 15),
        x: (i) => (i % 3 === 0 ? -10 : 10),
        duration: 0.6,
        ease: "sine.inOut",
        stagger: {
            amount: 0.1,
            from: "random"
        }
    }, 0);

    // Phase 2: Move to center
    images.forEach((img, i) => {
        const imgRect = img.getBoundingClientRect();
        const aboutRect = about.getBoundingClientRect();
        const center = getCenter();
        
        const currentX = imgRect.left - aboutRect.left + imgRect.width / 2;
        const currentY = imgRect.top - aboutRect.top + imgRect.height / 2;
        
        const moveX = center.x - currentX;
        const moveY = center.y - currentY;

        aboutTimeline.to(img, {
            x: moveX,
            y: moveY,
            rotation: (i % 2 === 0 ? 360 : -360),
            scale: 0,
            opacity: 0,
            duration: 1,
            ease: "power2.in"
        }, 0.3 + (i * 0.06));
    });

    // Store timeline
    animationInstances.timelines.push(aboutTimeline);

    console.log('✅ About initialized for desktop');
    console.log('Timeline duration:', aboutTimeline.duration().toFixed(2));
    
    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });
}
    
    // ========================================
    // 23. SMOOTH SCROLL
    // ========================================
    function initSmoothScroll() {
        if (typeof Lenis === 'undefined') {
            console.log(' Lenis not found - smooth scroll skipped');
            return;
        }
        
        const lenis = new Lenis({
            duration: 1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            mouseMultiplier: 1,
            touchMultiplier: 1.5,
            lerp: 0.1,
            normalizeWheel: true,
            smoothTouch: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                lenis.scrollTo(this.getAttribute('href'), {
                    offset: 0,
                    duration: 1.5,
                    easing: (t) => 1 - Math.pow(1 - t, 3),
                });
            });
        });

        const scrollToTop = document.querySelector('.scroll-to-top');
        if (scrollToTop) {
            scrollToTop.addEventListener('click', () => {
                lenis.scrollTo(0, {
                    duration: 1.2,
                    easing: (t) => 1 - Math.pow(1 - t, 3),
                });
            });
        }
        
        console.log(' Smooth scroll initialized');
    }
    
    // ========================================
    // GLOBAL RESIZE HANDLER
    // ========================================
    let globalResizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(globalResizeTimer);
        globalResizeTimer = setTimeout(() => {
            console.log('Global ScrollTrigger refresh');
            ScrollTrigger.refresh();
        }, 250);
    });
    
    // ========================================
    // ORIENTATION & VISIBILITY HANDLERS
    // ========================================
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            gsap.globalTimeline.pause();
        } else {
            gsap.globalTimeline.resume();
        }
    });
    
    // ========================================
    // START EVERYTHING
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllAnimations);
    } else {
        initAllAnimations();
    }
    
    // Make cleanup available globally if needed
    window.cleanupAnimations = function() {
        animationInstances.scrollTriggers.forEach(trigger => trigger.kill());
        animationInstances.timelines.forEach(timeline => timeline.kill());
        console.log('🧹 All animations cleaned up');
    };




    //about us full picture pixel animation
//about us full picture pixel animation

function initPixelReveal() {
    const img = document.getElementById('originalImage');
    const overlay = document.getElementById('pixelOverlay');
    if (!img || !overlay) return;
    
    const cfg = { size: 23, dur: 0.4, scale: 1.1, ease: "power2.out" };
    let anims = [];
    let resizeTimer = null;
    
    function create() {
        const w = img.offsetWidth, h = img.offsetHeight;
        const cols = Math.ceil(w / cfg.size), rows = Math.ceil(h / cfg.size);
        
        overlay.style.gridTemplateColumns = `repeat(${cols}, ${cfg.size}px)`;
        overlay.style.gridTemplateRows = `repeat(${rows}, ${cfg.size}px)`;
        
        const frag = document.createDocumentFragment();
        for (let i = 0; i < cols * rows; i++) {
            const px = document.createElement('div');
            px.className = 'pixel';
            px.addEventListener('mouseenter', function() {
                if (this.classList.contains('revealed')) return;
                this.classList.add('revealed');
                const id = `px-${Date.now()}-${Math.random()}`;
                gsap.to(this, {
                    id, opacity: 0, scale: cfg.scale, duration: cfg.dur, ease: cfg.ease,
                    onComplete: () => {
                        gsap.set(this, { scale: 1 });
                        anims = anims.filter(a => a !== id);
                    }
                });
                anims.push(id);
            });
            frag.appendChild(px);
        }
        overlay.appendChild(frag);
        
        
        setTimeout(() => {
            ScrollTrigger.refresh();
            console.log('✅ ScrollTrigger refreshed after pixel creation');
        }, 100);
    }
    
    function cleanup() {
        anims.forEach(id => gsap.getById(id)?.kill());
        anims = [];
        overlay.innerHTML = '';
    }
    
    function resize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { 
            cleanup(); 
            create(); 
            ScrollTrigger.refresh();
        }, 250);
    }
    
    img.addEventListener('load', create);
    if (img.complete) create();
    window.addEventListener('resize', resize);
    
    animationInstances.eventListeners.push(
        { element: img, event: 'load', handler: create },
        { element: window, event: 'resize', handler: resize }
    );
}





  // Image rotation animation
        const teamimage = document.getElementById('make-defferent-teamimage');

        gsap.fromTo(
            teamimage,
            {
                rotation: -15,
                transformOrigin: 'center center'
            },
            {
                rotation: 0,
                scrollTrigger: {
                    trigger: teamimage,
                    start: 'top 50%',  
                    end: 'top 20%',    
                    scrub: 1,          
                    markers: false      
                }
            }
        );


        //border color remove in brand section about page
 ScrollTrigger.create({
  trigger: '.aboutbrand',
  start: 'bottom 60%',
  onEnter: () => {
    gsap.to('.aboutbrand', {
      opacity: 0,
      duration: 0.6, 
      ease: 'power2.inOut' 
    });
  },
  onLeaveBack: () => {
    

    gsap.to('.aboutbrand', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    });
  },
  
});







   function initConfidenceScrollAnimation() {
    // Screen size check - only run on screens wider than 576px
    const minWidth = 576;
    
    if (window.innerWidth <= minWidth) {
        console.log('❌ Screen too small - Confidence animation disabled');
        return; // Exit early if screen is 576px or smaller
    }

    // Define the pinned section and elements using the provided selectors
    const pinSection = document.querySelector(".confident-main-pin-section");
    const mainTitle = document.querySelector(".confident-main-title");
    const bgBox = document.querySelector(".bg-expansion-box");
    const itemWrapper = document.querySelector(".confident-item-wrapper");
    const contentItems = gsap.utils.toArray(".confident-content-item");
    const videoScreen = document.querySelector(".confident-video-connect-screen");
    const connectOverlay = document.querySelector(".confident-connect-overlay");
    const videoElement = document.querySelector(".confident-full-video-bg");

    // Check if the main trigger element exists before creating the timeline
    if (!pinSection) {
        console.warn("GSAP: .confident-main-pin-section not found. Animation skipped.");
        return;
    }

    // Create a main timeline for the entire sequence
    let masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: pinSection,
            start: "top 40px",
            end: "+=5000",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            // markers: true, // Uncomment for debugging
        }
    });

    // --- Phase 1: Title Reveal & Background Expansion ---
    masterTl
        // Title appears with smooth fade
        .fromTo(mainTitle, 
            { opacity: 0, scale: 0.9, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" },
            0
        )

        // Pause to show title
        .to({}, { duration: 0.5 }, 1)

        // Step 1: Center Box Emerge
        .to(bgBox, { 
            duration: 1.5, 
            width: "50vh", 
            height: "50vh", 
            opacity: 1,
            borderRadius: "24px",
            ease: "power2.inOut"
        }, 1.5)

        // Step 2: Box Expands to Full Screen
        .to(bgBox, { 
            duration: 1.5, 
            width: "100%", 
            height: "100%", 
            borderRadius: "24px",
            ease: "power2.inOut"
        }, 3) 
        
        // --- Phase 2: Title Movement and Content Slides ---
        
        // Step 3: Title moves to the top
        .to(mainTitle, {
            duration: 1,
            y: "-35vh",
            scale: 0.85,
            ease: "power2.inOut",
        }, 4.5)

        // Item Wrapper appears
        .to(itemWrapper, { 
            opacity: 1, 
            duration: 1, 
            pointerEvents: "auto",
            ease: "power2.out"
        }, 5)

        // Step 4: Item 1 appears from bottom
        .fromTo(contentItems[0],
            { opacity: 0, y: 150, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
            5.5
        )

        // Keep Item 1 visible
        .to({}, { duration: 1 }, 6.5)

        // Step 5: Transition Item 1 → Item 2 (vertical slide)
        .to(contentItems[0], { 
            y: -150, 
            opacity: 0, 
            scale: 0.95,
            duration: 0.8, 
            ease: "power2.inOut" 
        }, 7.5)
        .fromTo(contentItems[1], 
            { y: 150, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.inOut" }, 
            7.5
        )

        // Keep Item 2 visible
        .to({}, { duration: 1 }, 8.3)
        
        // Step 6: Transition Item 2 → Item 3 (vertical slide)
        .to(contentItems[1], { 
            y: -150, 
            opacity: 0, 
            scale: 0.95,
            duration: 0.8, 
            ease: "power2.inOut" 
        }, 9.3)
        .fromTo(contentItems[2], 
            { y: 150, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.inOut" }, 
            9.3
        )

        // Keep Item 3 visible
        .to({}, { duration: 1 }, 10.1)

        // --- Phase 3: Video/Connect Screen & Final Collapse ---

        // Step 7: Fade Item 3 and show video in background
        .to(contentItems[2], { 
            opacity: 0.3, 
            duration: 0.8,
            ease: "power2.inOut"
        }, 11.1)
        .to(videoScreen, { 
            opacity: 0.5, 
            duration: 0.8,
            ease: "power2.out"
        }, 11.1)

        // Step 8: Transition to Video Screen completely
        .to([mainTitle, itemWrapper, contentItems[2]], { 
            opacity: 0, 
            duration: 1,
            ease: "power2.inOut"
        }, 12)
        .to(bgBox, { 
            opacity: 0, 
            scale: 1.05,
            duration: 1,
            ease: "power2.inOut"
        }, 12)
        .to(videoScreen, { 
            opacity: 1, 
            duration: 1,
            ease: "power2.out"
        }, 12)

        // Step 9: Connect text appears
        .fromTo(connectOverlay, 
            { opacity: 0, scale: 0.9, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.2)" },
            13
        )

        // Keep video visible
        .to({}, { duration: 1 }, 14)

        // Step 10: Video Shrink/Collapse
        .to(videoElement, {
            duration: 1.5,
            scale: 0.4,
            borderRadius: "60px",
            ease: "power2.inOut",
        }, 15)
        .to(connectOverlay, {
            scale: 0.2,
            duration: 1.5,
            ease: "power2.inOut",
        }, 15);

    console.log('✅ Confidence animation initialized (tablet/desktop)');
}

    




//  services page sticky items animation

gsap.registerPlugin(ScrollTrigger);

    const sections = gsap.utils.toArray('.sticky-service-item');

    sections.forEach((section, index) => {
      const content = section.querySelector('.sticky-service-item-content');
      
      // Pin each section when it reaches the top
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => {
          if (index === sections.length - 1) {
            return 'bottom bottom';
          }
          return 'bottom top';
        },
        pin: true,
        pinSpacing: false
      });

      // Content fade in animation
      gsap.fromTo(content,
        {
          scale: 0.9,
          opacity: 0,
          y: 50
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top center',
            scrub: 1
          }
        }
      );

      // Blur effect when next section comes - pore start hobe
      if (index < sections.length - 1) {
        gsap.to(section, {
          filter: 'blur(10px)',
          opacity: 0,
          scale: 0.95,
          scrollTrigger: {
            trigger: sections[index + 1],
            start: 'top 50%',  // Eita change korlam - 50vh te start hobe
            end: 'top top',
            scrub: 1
          }
        });
      }
    });
    


  // blur item p on hover

$(".service-sticky-item-point p").each(function(index, element){
  var animation = TweenMax.to(this, 0.2, {
    className: '+= superShadow',
    marginTop: '-2px',
    marginBottom: '2px',
    ease: Power1.easeIn,
    paused: true,
    onComplete: function() {
      element.isAnimated = true;
    }
  });
  element.animation = animation;
  element.isAnimated = false;
})

$('.service-sticky-item-point p').hover(function(){
  if(!this.isAnimated) {
    this.animation.play();
  } else {
    // Second time hover hole class remove koro
    $(this).removeClass('superShadow');
  }
}, function(){
  // Hover out e kichui hobe na
})




//header logo animation

const brandIcon = document.getElementById('brandIcon');
    const xGreen = document.getElementById('xGreen');
    const xWhite = document.getElementById('xWhite');   
    const logoWrapper = document.getElementById('logoWrapper');

    // Clean initial state
    gsap.set([brandIcon, xGreen, xWhite], { opacity: 1 });

    // HOVER START
    logoWrapper.addEventListener("mouseenter", () => {

 

        // ✔ FIXED: XX SIDE-TO-SIDE ONLY (NO ROTATION)
        gsap.to(xGreen, {
            x: 30,     // RIGHT
            rotation: 0,
            duration: 0.55,
            ease: "power2.out"
        });

        gsap.to(xWhite, {
            x: -30,    // LEFT
            rotation: 0,
            duration: 0.45,
            ease: "power2.out"
        });
    });

    // RESET
    logoWrapper.addEventListener("mouseleave", () => {

        gsap.to(xGreen, {
            x: 0,
            rotation: 0,
            duration: 0.4,
            ease: "power3.out"
        });

        gsap.to(xWhite, {
            x: 0,
            rotation: 0,
            duration: 0.4,
            ease: "power3.out"
        });
    });


const brandIcon1 = document.getElementById('brandIcon1');
    const xGreen1 = document.getElementById('xGreen1');
    const xWhite1 = document.getElementById('xWhite1');   
    const logoWrapper1 = document.getElementById('logoWrapper1');

    // Clean initial state
    gsap.set([brandIcon1, xGreen1, xWhite1], { opacity: 1 });

    // HOVER START
    logoWrapper1.addEventListener("mouseenter", () => {

 

        // ✔ FIXED: XX SIDE-TO-SIDE ONLY (NO ROTATION)
        gsap.to(xGreen1, {
            x: 30,     // RIGHT
            rotation: 0,
            duration: 0.55,
            ease: "power2.out"
        });

        gsap.to(xWhite1, {
            x: -30,    // LEFT
            rotation: 0,
            duration: 0.45,
            ease: "power2.out"
        });
    });

    // RESET
    logoWrapper1.addEventListener("mouseleave", () => {

        gsap.to(xGreen1, {
            x: 0,
            rotation: 0,
            duration: 0.4,
            ease: "power3.out"
        });

        gsap.to(xWhite1, {
            x: 0,
            rotation: 0,
            duration: 0.4,
            ease: "power3.out"
        });
    });






    // case study tab 

       document.addEventListener('DOMContentLoaded', () => {
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabPanels = document.querySelectorAll('.tab-content-panel');
            const tabsContainer = document.querySelector('.tabs-container');
            let isDragging = false;
            let startX;
            let scrollLeft;
            
            // --- 1. Tab Switching Logic ---
            
            // Function to handle the actual tab switch
            const switchTab = (targetId) => {
                // Deactivate all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));

                // Activate the selected button
                const newActiveButton = document.querySelector(`.tab-button[data-target="${targetId}"]`);
                if (newActiveButton) {
                    newActiveButton.classList.add('active');
                }

                // Activate the corresponding panel
                const newActivePanel = document.getElementById(targetId);
                if (newActivePanel) {
                    newActivePanel.classList.add('active');
                }
            };

            // Add click listeners to all tab buttons
            tabButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    // Prevent tab switching if a dragging motion was detected
                    // A small tolerance (e.g., 5 pixels) is usually required to distinguish click from drag
                    if (tabsContainer.dataset.moved === 'true') {
                        // Reset the moved flag after processing the drag
                        tabsContainer.dataset.moved = 'false'; 
                        return;
                    }
                    
                    const targetId = event.currentTarget.getAttribute('data-target');
                    switchTab(targetId);
                });
            });


            // --- 2. Horizontal Drag-to-Scroll Logic ---

            // Mouse Down: Start the dragging process
            tabsContainer.addEventListener('mousedown', (e) => {
                isDragging = true;
                tabsContainer.classList.add('active:cursor-grabbing');
                // Capture the starting mouse X position
                startX = e.pageX - tabsContainer.offsetLeft;
                // Capture the current scroll position
                scrollLeft = tabsContainer.scrollLeft;
                // Initialize the moved flag
                tabsContainer.dataset.moved = 'false';
            });

            // Mouse Leave/Up: End the dragging process
            const stopDragging = () => {
                if (!isDragging) return;
                isDragging = false;
                tabsContainer.classList.remove('active:cursor-grabbing');
            };
            
            tabsContainer.addEventListener('mouseup', stopDragging);
            tabsContainer.addEventListener('mouseleave', stopDragging);

            // Mouse Move: Calculate and apply the scroll
            tabsContainer.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                
                // Calculate how far the mouse has moved
                const x = e.pageX - tabsContainer.offsetLeft;
                const walk = (x - startX) * 1.5; // Multiplier for faster scrolling (adjust as needed)
                
                // Apply the scroll
                tabsContainer.scrollLeft = scrollLeft - walk;

                // If the scroll distance is greater than 5 pixels, treat it as a drag, not a click
                if (Math.abs(walk) > 5) {
                    tabsContainer.dataset.moved = 'true';
                }
            });

            // Note: On touch devices, the CSS 'overflow-x: scroll' handles the scrolling naturally,
            // so we primarily focus the JS dragging logic on mouse interactions.
        });




        //tab all case study items


        

    function tabinitFeaturedWork() {
        const featuredWork = document.querySelector(".all-portfolio-tab-section");
        if (!featuredWork) {
            console.log("⛔ .all-portfolio-tab-section not found. GSAP animation skipped.");
            return; 
        }

        const itemRows = featuredWork.querySelectorAll(".all-portfolio-grid-item-row");

        itemRows.forEach((row, index) => {
            const item = row.querySelector(".grid-item");
            const imageWrap = item.querySelector(".image-wrap");
            const image = item.querySelector(".image");
            const caption = item.querySelector(".caption");
            
            const isFullWidth = index === 0; 
            const isEven = (index + 1) % 2 === 0; 
            
            let originX;
            let captionSlideX;

            if (isFullWidth) {
                originX = 0; 
                captionSlideX = 100; 
            } else {
                originX = isEven ? 100 : 0; 
                captionSlideX = isEven ? -100 : 100;
            }

            gsap.set(caption, { 
                xPercent: captionSlideX, 
                opacity: 0,
                yPercent: 100 
            });

            gsap.timeline({
                defaults: {
                    ease: "power4.out",
                },
                scrollTrigger: {
                    id: `all-portfolio-tab-section-item-${index}`,
                    trigger: row, 
                    start: "top bottom-=10%",
                    end: "bottom top", 
                    scrub: 1, 
                },
            })
            .fromTo(
                imageWrap,
                {
                    scaleX: 0, 
                    transformOrigin: `${originX}% 0%`,
                },
                {
                    scaleX: 1,
                }
            )
            .fromTo(
                image,
                {
                    scale: 5,
                    transformOrigin: `${originX}% 0%`,
                },
                {
                    scale: 1,
                },
                0
            )
            .to(
                caption,
                {
                    ease: "power2.out",
                    xPercent: 0, 
                    opacity: 1,
                    yPercent: 0, 
                },
                0.2 
            );
        });

        console.log(`✅ Featured work initialized for ${itemRows.length} items`);
    }







})();



//counter section about page
        (function() {
           
            const animationInstances = {
                scrollTriggers: [],
                timelines: [],
                eventListeners: []
            };

            function initCounterAnimation() {
                const counters = document.querySelectorAll('.counter-number');
                if (!counters.length) return;

                const cfg = {
                    duration: 2,
                    ease: "power2.out",
                    staggerDelay: 0.2,
                    fadeInDuration: 0.8
                };

                counters.forEach((counter, idx) => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const suffix = counter.getAttribute('data-suffix') || '';
                    const item = counter.closest('.counter-item');
                    
                    if (!item || isNaN(target)) return;

                    const fadeId = `counter-fade-${Date.now()}-${idx}`;
                    const numId = `counter-num-${Date.now()}-${idx}`;

                    function format(val) {
                        return Math.round(val).toLocaleString('en-US');
                    }

                    gsap.to(item, {
                        id: fadeId,
                        opacity: 1,
                        y: 0,
                        duration: cfg.fadeInDuration,
                        delay: idx * cfg.staggerDelay,
                        ease: "power3.out",
                        scrollTrigger: {
                            id: fadeId,
                            trigger: item,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    });

                    gsap.fromTo(counter, 
                        { textContent: 0 },
                        {
                            id: numId,
                            textContent: target,
                            duration: cfg.duration,
                            delay: idx * cfg.staggerDelay + 0.3,
                            ease: cfg.ease,
                            snap: { textContent: 1 },
                            onUpdate: function() {
                                counter.textContent = format(this.targets()[0].textContent) + suffix;
                            },
                            scrollTrigger: {
                                id: numId,
                                trigger: counter,
                                start: "top 85%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );

                    animationInstances.scrollTriggers.push(fadeId, numId);
                });
            }

            function initAllAnimations() {
                initCounterAnimation();
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initAllAnimations);
            } else {
                initAllAnimations();
            }

        })();









