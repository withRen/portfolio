// Note: Imports are handled via CDN in index.html
// gsap, ScrollTrigger are available globally

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// Check if mobile
const isMobile = () => window.innerWidth < 768;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector(".horizontal-container");
    const sections = gsap.utils.toArray(".section");

    // Calculate the total scroll width
    const getScrollAmount = () => {
        let containerWidth = container.scrollWidth;
        return -(containerWidth - window.innerWidth);
    };

    // Update active navigation link and dots
    function updateActiveNavLink(activeIndex) {
        // Update nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            if (index === activeIndex) {
                link.classList.add('bg-white/[0.08]', 'text-white');
                link.classList.remove('text-white/50');
            } else {
                link.classList.remove('bg-white/[0.08]', 'text-white');
                link.classList.add('text-white/50');
            }
        });

        // Update section dots
        const sectionDots = document.querySelectorAll('.section-dot');
        sectionDots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('bg-white', 'scale-110');
                dot.classList.remove('bg-white/20');
            } else {
                dot.classList.remove('bg-white', 'scale-110');
                dot.classList.add('bg-white/20');
            }
        });
    }

    // Only create horizontal scroll on desktop
    let horizontalScroll;

    function initDesktopScroll() {
        if (isMobile()) return;

        horizontalScroll = gsap.to(container, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-container",
                start: "top top",
                end: () => `+=${container.scrollWidth - window.innerWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const currentSection = Math.round(self.progress * (sections.length - 1));
                    updateActiveNavLink(currentSection);

                    // Update vertical progress bar
                    const progressBar = document.getElementById('scrollProgressBar');
                    if (progressBar) {
                        progressBar.style.setProperty('--scroll-progress', `${self.progress * 100}%`);
                    }
                }
            }
        });
    }

    // Initialize desktop scroll
    initDesktopScroll();

    // Initialize first link as active
    updateActiveNavLink(0);

    // Mobile: Update active section based on scroll position
    if (isMobile()) {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = sections.indexOf(entry.target);
                    if (sectionIndex !== -1) {
                        updateActiveNavLink(sectionIndex);
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // Handle both mouse wheel (vertical scroll) and trackpad (horizontal swipe)
    // Only on desktop
    if (!isMobile()) {
        const scrollableSections = document.querySelectorAll('.section-scrollable');
        let isInsideScrollableSection = false;
        let currentScrollableContainer = null;
        let currentScrollableSection = null;

        // Scroll lock: prevents horizontal nav while user is still scrolling inside a section
        let scrollLockActive = false;
        let scrollLockTimeout = null;

        function activateScrollLock() {
            scrollLockActive = true;
            clearTimeout(scrollLockTimeout);
            scrollLockTimeout = setTimeout(() => {
                scrollLockActive = false;
            }, 300);
        }

        // Check if section is fully visible (at least 95% visible horizontally)
        function isSectionFullyVisible(section) {
            const rect = section.getBoundingClientRect();
            const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
            const visibilityRatio = visibleWidth / rect.width;
            return visibilityRatio > 0.95;
        }

        // Track if mouse is over a scrollable section
        scrollableSections.forEach(section => {
            const scrollContainer = section.querySelector('.photos-scroll-container');
            if (scrollContainer) {
                scrollContainer.addEventListener('mouseenter', () => {
                    currentScrollableContainer = scrollContainer;
                    currentScrollableSection = section;
                    isInsideScrollableSection = true;
                });
                scrollContainer.addEventListener('mouseleave', () => {
                    isInsideScrollableSection = false;
                    currentScrollableContainer = null;
                    currentScrollableSection = null;
                });
            }
        });

        window.addEventListener('wheel', (e) => {
            // Detect if this is a trackpad horizontal swipe (has dominant deltaX component)
            const isTrackpadHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);

            // If inside a scrollable section AND section is fully visible, handle vertical scroll
            const sectionIsVisible = currentScrollableSection && isSectionFullyVisible(currentScrollableSection);

            if (isInsideScrollableSection && currentScrollableContainer && sectionIsVisible) {
                const scrollContainer = currentScrollableContainer;
                const canScrollUp = scrollContainer.scrollTop > 0;
                // Use a 2px tolerance to avoid floating point issues
                const canScrollDown = scrollContainer.scrollTop < (scrollContainer.scrollHeight - scrollContainer.clientHeight - 2);

                // Trackpad horizontal swipe - always scroll page horizontally
                if (isTrackpadHorizontal) {
                    e.preventDefault();
                    window.scrollBy({
                        top: e.deltaX,
                        behavior: 'auto'
                    });
                    return;
                }

                // Vertical scroll - check if container can still scroll internally
                if ((e.deltaY < 0 && canScrollUp) || (e.deltaY > 0 && canScrollDown)) {
                    // Section not fully scrolled yet - block horizontal navigation
                    activateScrollLock();
                    // Let the container handle the scroll naturally
                    return;
                }

                // Container has reached its scroll boundary
                // Block horizontal scroll briefly to avoid accidental section skip
                if (scrollLockActive) {
                    e.preventDefault();
                    return;
                }

                // At the edge of scrollable container, scroll the page horizontally
                e.preventDefault();
                window.scrollBy({
                    top: e.deltaY,
                    behavior: 'auto'
                });
                return;
            }

            // Outside of scrollable sections: always redirect scroll to horizontal navigation
            // Prevent any default vertical scroll (which would break the horizontal layout)
            e.preventDefault();

            if (isTrackpadHorizontal) {
                // Trackpad horizontal swipe
                window.scrollBy({
                    top: e.deltaX,
                    behavior: 'auto'
                });
            } else {
                // Mouse wheel or trackpad vertical scroll → convert to horizontal
                window.scrollBy({
                    top: e.deltaY,
                    behavior: 'auto'
                });
            }
        }, { passive: false });
    } // End of desktop-only code

    // Helper function for navigation links
    window.scrollToSection = (index) => {
        if (isMobile()) {
            // On mobile, scroll to section vertically
            const section = sections[index];
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // On desktop, use horizontal scroll
            const targetScroll = (index / (sections.length - 1)) * (container.scrollWidth - window.innerWidth);
            gsap.to(window, {
                scrollTo: targetScroll,
                duration: 1.5,
                ease: "power2.inOut"
            });
        }

        // Update active nav link
        updateActiveNavLink(index);
    };

    // Animations for individual elements (desktop only)
    if (!isMobile()) {
        sections.forEach((section) => {
            // Parallax for images inside glass cards
            const images = section.querySelectorAll('img');

            images.forEach(img => {
                gsap.to(img, {
                    scale: 1.1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        containerAnimation: horizontalScroll,
                        start: "left right",
                        end: "right left",
                        scrub: true
                    }
                });
            });

            // Fade in text
            const texts = section.querySelectorAll('h1, h2, h3, p');
            texts.forEach(text => {
                gsap.from(text, {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: section,
                        containerAnimation: horizontalScroll,
                        start: "left 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            });
        });
    }

    // Refresh ScrollTrigger on resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

    console.log("Portfolio Loaded.");
});
