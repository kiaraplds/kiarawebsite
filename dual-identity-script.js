// Get elements
const techSide = document.getElementById('techSide');
const artSide = document.getElementById('artSide');
const divider = document.getElementById('divider');
const blendOverlay = document.getElementById('blendOverlay');

// Scroll synchronization between sides
let isSyncing = false;

function syncScroll(source, target) {
    if (isSyncing) return;
    isSyncing = true;

    const sourceScrollPercentage = source.scrollTop / (source.scrollHeight - source.clientHeight);
    target.scrollTop = sourceScrollPercentage * (target.scrollHeight - target.clientHeight);

    setTimeout(() => {
        isSyncing = false;
    }, 50);
}

// Add scroll event listeners for synchronized scrolling
techSide.addEventListener('scroll', () => syncScroll(techSide, artSide));
artSide.addEventListener('scroll', () => syncScroll(artSide, techSide));

// Scroll-based blend effect
function updateBlendEffect() {
    const techScrollPercentage = techSide.scrollTop / (techSide.scrollHeight - techSide.clientHeight);
    const artScrollPercentage = artSide.scrollTop / (artSide.scrollHeight - artSide.clientHeight);

    const blendAmount = (techScrollPercentage + artScrollPercentage) / 2;

    // Activate blend overlay when scrolling
    if (blendAmount > 0.1) {
        blendOverlay.classList.add('active');
        blendOverlay.style.opacity = Math.min(blendAmount * 0.5, 0.3);
    } else {
        blendOverlay.classList.remove('active');
    }
}

techSide.addEventListener('scroll', updateBlendEffect);
artSide.addEventListener('scroll', updateBlendEffect);

// Interactive divider drag functionality
let isDragging = false;
let startX = 0;

divider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const containerWidth = window.innerWidth;
    const newTechWidth = (50 + (deltaX / containerWidth) * 100);

    // Limit the width between 30% and 70%
    if (newTechWidth >= 30 && newTechWidth <= 70) {
        techSide.style.flex = `0 0 ${newTechWidth}%`;
        artSide.style.flex = `0 0 ${100 - newTechWidth}%`;

        // Update blend overlay intensity based on split ratio
        const splitDifference = Math.abs(50 - newTechWidth) / 20;
        blendOverlay.style.opacity = Math.min(splitDifference * 0.2, 0.4);
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';

        // Smooth transition back to 50/50 after a delay
        setTimeout(() => {
            techSide.style.transition = 'flex 0.5s ease';
            artSide.style.transition = 'flex 0.5s ease';
            techSide.style.flex = '1';
            artSide.style.flex = '1';

            setTimeout(() => {
                techSide.style.transition = '';
                artSide.style.transition = '';
            }, 500);
        }, 1000);
    }
});

// Skill item hover effects with code morph
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'rgba(168, 201, 209, 0.4)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleExpand 0.6s ease-out';

        item.style.position = 'relative';
        item.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to document
if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
        @keyframes rippleExpand {
            from {
                transform: scale(1);
                opacity: 1;
            }
            to {
                transform: scale(10);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Parallax effect on scroll
function parallaxEffect() {
    const scrollY = techSide.scrollTop;
    const sections = document.querySelectorAll('.section');

    sections.forEach((section, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrollY * speed * 0.1);
        section.style.transform = `translateY(${yPos}px)`;
    });
}

techSide.addEventListener('scroll', parallaxEffect);
artSide.addEventListener('scroll', parallaxEffect);

// Code block typing effect on first view
const codeBlock = document.querySelector('.code-block');
if (codeBlock) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                codeBlock.style.animation = 'fadeIn 0.8s ease-out';
                observer.unobserve(codeBlock);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(codeBlock);
}

// Timeline animation on scroll
const timelineItems = document.querySelectorAll('.timeline-item');
if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInLeft 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        timelineObserver.observe(item);
    });
}

// Paint splatter animation
const paintSplatter = document.querySelector('.paint-splatter');
if (paintSplatter) {
    let splatterInterval = setInterval(() => {
        const randomX = Math.random() * 80 + 10;
        const randomY = Math.random() * 80 + 10;
        paintSplatter.style.left = randomX + '%';
        paintSplatter.style.top = randomY + '%';
    }, 3000);
}

// Inspiration cards stagger animation
const inspirationCards = document.querySelectorAll('.inspiration-card');
if (inspirationCards.length > 0) {
    const inspirationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }, index * 100);
                inspirationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    inspirationCards.forEach(card => {
        card.style.opacity = '0';
        inspirationObserver.observe(card);
    });
}

// Divider handle pulse on page load
setTimeout(() => {
    const dividerHandle = document.querySelector('.divider-handle');
    if (dividerHandle) {
        dividerHandle.style.animation = 'pulseGlow 3s ease-in-out infinite';
    }
}, 1000);

// Mouse move parallax for background elements
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const techBg = techSide.querySelector('::before');
    const artBg = artSide.querySelector('::before');

    // Subtle parallax movement
    const moveX = (mouseX - 0.5) * 20;
    const moveY = (mouseY - 0.5) * 20;

    document.documentElement.style.setProperty('--mouse-x', `${moveX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${moveY}px`);
});

// Smooth scroll behavior for language cards
const languageCards = document.querySelectorAll('.language-card');
languageCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Add interactive hover effect to portfolio button
const portfolioBtn = document.querySelector('.view-portfolio-btn');
if (portfolioBtn) {
    portfolioBtn.addEventListener('mouseenter', () => {
        const canvas = document.querySelector('.canvas-placeholder');
        canvas.style.transform = 'scale(1.02)';
        canvas.style.transition = 'transform 0.3s ease';
    });

    portfolioBtn.addEventListener('mouseleave', () => {
        const canvas = document.querySelector('.canvas-placeholder');
        canvas.style.transform = 'scale(1)';
    });
}

// Cross-side interaction - clicking on tech elements affects art side
skillItems.forEach(item => {
    item.addEventListener('click', () => {
        // Create a temporary visual bridge between sides
        const bridge = document.createElement('div');
        bridge.style.position = 'fixed';
        bridge.style.top = '50%';
        bridge.style.left = '0';
        bridge.style.width = '100%';
        bridge.style.height = '2px';
        bridge.style.background = 'linear-gradient(to right, rgba(168, 201, 209, 0.6), rgba(201, 169, 97, 0.6))';
        bridge.style.zIndex = '1000';
        bridge.style.pointerEvents = 'none';
        bridge.style.animation = 'bridgeExpand 0.8s ease-out forwards';

        document.body.appendChild(bridge);

        // Pulse the blend overlay
        blendOverlay.style.opacity = '0.5';
        setTimeout(() => {
            blendOverlay.style.opacity = '0.1';
        }, 300);

        setTimeout(() => bridge.remove(), 800);
    });
});

// Add bridge animation
if (!document.querySelector('#bridge-styles')) {
    const bridgeStyle = document.createElement('style');
    bridgeStyle.id = 'bridge-styles';
    bridgeStyle.textContent = `
        @keyframes bridgeExpand {
            0% {
                transform: scaleX(0);
                opacity: 0;
            }
            50% {
                transform: scaleX(1);
                opacity: 1;
            }
            100% {
                transform: scaleX(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(bridgeStyle);
}

// Balance statement reveal animation
const balanceStatement = document.querySelector('.balance-statement');
if (balanceStatement) {
    const balanceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 1s ease-out, pulseGlow 2s ease-in-out infinite';
                balanceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    balanceObserver.observe(balanceStatement);
}

// Responsive check - disable divider drag on mobile
function checkResponsive() {
    if (window.innerWidth <= 1024) {
        divider.style.display = 'none';
        techSide.style.flex = '';
        artSide.style.flex = '';
    } else {
        divider.style.display = 'flex';
    }
}

window.addEventListener('resize', checkResponsive);
checkResponsive();

// Initial load animations
window.addEventListener('load', () => {
    document.body.style.opacity = '1';

    // Stagger section animations
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${0.2 + index * 0.2}s`;
    });
});

// Smooth scroll to top on back to portal click
const backPortal = document.querySelector('.back-portal');
if (backPortal) {
    backPortal.addEventListener('click', (e) => {
        // Smooth fade out before navigation
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0';
    });
}

// Console easter egg
console.log('%c👨‍💻 + 🎨 = ✨', 'font-size: 24px; font-weight: bold; background: linear-gradient(to right, #a8c9d1, #c9a961); -webkit-background-clip: text; color: transparent;');
console.log('%cWelcome to the intersection of code and creativity!', 'font-size: 14px; color: #a8c9d1;');
console.log('%cData by day, canvas by night.', 'font-size: 14px; color: #c9a961; font-style: italic;');

// Image Lightbox functionality
function openLightbox(imageSrc) {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImage');
    
    modal.classList.add('active');
    modalImg.src = imageSrc;
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('active');
    
    // Re-enable body scroll
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside the image
const lightboxModal = document.getElementById('lightboxModal');
if (lightboxModal) {
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-close')) {
            closeLightbox();
        }
    });
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
