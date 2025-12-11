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
let currentX = 0;

divider.addEventListener('mousedown', (e) => {
    isDragging = true;
    currentX = e.clientX;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    currentX = e.clientX;
    const containerWidth = window.innerWidth;
    const newTechWidth = (currentX / containerWidth) * 100;

    // Limit the width between 30% and 70%
    if (newTechWidth >= 30 && newTechWidth <= 70) {
        techSide.style.flex = `0 0 ${newTechWidth}%`;
        artSide.style.flex = `0 0 ${100 - newTechWidth}%`;

        // Update divider position to follow
        divider.style.left = `${newTechWidth}%`;

        // Update blend overlay intensity based on split ratio
        const splitDifference = Math.abs(50 - newTechWidth) / 20;
        blendOverlay.style.opacity = Math.min(splitDifference * 0.2, 0.4);
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';

        // Don't automatically reset - stay where the user dragged it
        // User must manually drag back to center if they want 50/50
    }
});

// Skill item click to open popup
const skillItems = document.querySelectorAll('.skill-item');
const popupBackdrop = document.getElementById('popupBackdrop');
const skillPopups = document.querySelectorAll('.skill-popup');
const popupCloseButtons = document.querySelectorAll('.popup-close');

// Function to open popup next to clicked item
function openSkillPopup(skillType, clickedElement) {
    // Close any open popups first
    closeAllPopups();

    const popup = document.getElementById(`popup-${skillType}`);
    if (popup) {
        // Get the position of the clicked element
        const rect = clickedElement.getBoundingClientRect();

        // Calculate position with some padding
        const leftPosition = rect.right + 20;

        // Check if popup would go off screen to the right
        const popupWidth = 400; // max-width from CSS
        const viewportWidth = window.innerWidth;

        let finalLeft = leftPosition;

        // If it goes off screen, position to the left of the button instead
        if (leftPosition + popupWidth > viewportWidth) {
            finalLeft = rect.left - popupWidth - 20;
        }

        // If still off screen (very narrow viewport), center it
        if (finalLeft < 0) {
            finalLeft = Math.max(10, (viewportWidth - popupWidth) / 2);
        }

        // Position popup
        popup.style.top = `${rect.top}px`;
        popup.style.left = `${finalLeft}px`;

        popup.classList.add('active');
    }
}

// Function to close all popups
function closeAllPopups() {
    skillPopups.forEach(popup => popup.classList.remove('active'));
}

// Add click event to skill items
skillItems.forEach(item => {
    item.addEventListener('click', () => {
        const skillType = item.getAttribute('data-skill');
        openSkillPopup(skillType, item);
    });

    // Keep hover ripple effect
    item.addEventListener('mouseenter', () => {
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

// Close popup when clicking close button
popupCloseButtons.forEach(button => {
    button.addEventListener('click', closeAllPopups);
});

// Close popup with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllPopups();
    }
});

// Close popup when clicking anywhere outside the popup
document.addEventListener('click', (e) => {
    // Check if click is outside any popup and not on a skill item
    const isSkillItem = e.target.closest('.skill-item');
    const isPopup = e.target.closest('.skill-popup');

    if (!isSkillItem && !isPopup) {
        closeAllPopups();
    }
});

// Close popup when scrolling
techSide.addEventListener('scroll', closeAllPopups);
artSide.addEventListener('scroll', closeAllPopups);

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
        techSide.style.width = '';
        artSide.style.width = '';
        divider.style.left = '50%';
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

// 3D Globe Visualization
const canvas = document.getElementById('globeCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const size = 220;
    canvas.width = size;
    canvas.height = size;

    // Countries you've visited with real coordinates (lat, lon)
    const visitedLocations = [
        // Asia
        { name: 'Japan', lat: 35.6762, lon: 139.6503, country: true },
        { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: true },
        { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: true },

        // Americas
        { name: 'New York', lat: 40.7128, lon: -74.0060, country: true },
        { name: 'California', lat: 36.7783, lon: -119.4179, country: true },
        { name: 'Mexico', lat: 19.4326, lon: -99.1332, country: true },
        { name: 'Costa Rica', lat: 9.7489, lon: -83.7534, country: true },

        // Africa
        { name: 'Morocco', lat: 33.9716, lon: -6.8498, country: true },

        // Europe
        { name: 'Greece', lat: 37.9838, lon: 23.7275, country: true },
        { name: 'United Kingdom', lat: 51.5074, lon: -0.1278, country: true },
        { name: 'France', lat: 48.8566, lon: 2.3522, country: true },
        { name: 'Spain', lat: 40.4168, lon: -3.7038, country: true },
        { name: 'Italy', lat: 41.9028, lon: 12.4964, country: true },
        { name: 'Netherlands', lat: 52.3676, lon: 4.9041, country: true },
        { name: 'Germany', lat: 52.5200, lon: 13.4050, country: true },
        { name: 'Switzerland', lat: 46.9480, lon: 7.4474, country: true },
        { name: 'Portugal', lat: 38.7223, lon: -9.1393, country: true }
    ];

    // Populate country tags
    const countriesTagsContainer = document.getElementById('countriesTags');
    if (countriesTagsContainer) {
        visitedLocations.forEach(location => {
            const tag = document.createElement('span');
            tag.className = 'country-tag';
            tag.textContent = location.name;
            countriesTagsContainer.appendChild(tag);
        });
    }

    // Globe parameters
    let rotationX = 0; // Horizontal rotation
    let rotationY = 0; // Vertical rotation
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    // Tooltip state
    let hoveredLocation = null;
    let mouseCanvasX = 0;
    let mouseCanvasY = 0;

    // Convert lat/lon to 3D coordinates
    function latLonToXYZ(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return {
            x: -radius * Math.sin(phi) * Math.cos(theta),
            y: radius * Math.cos(phi),
            z: radius * Math.sin(phi) * Math.sin(theta)
        };
    }

    // Generate background stars
    const stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * size,
            y: Math.random() * size,
            radius: Math.random() * 1.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    // World geometry data - GeoJSON format
    let worldGeometry = [];
    let isLoadingMap = true;

    // Fetch simplified world map GeoJSON
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(response => response.json())
        .then(data => {
            // Extract coordinates from GeoJSON
            if (data.features) {
                data.features.forEach(feature => {
                    if (feature.geometry) {
                        if (feature.geometry.type === 'Polygon') {
                            feature.geometry.coordinates.forEach(ring => {
                                worldGeometry.push(ring);
                            });
                        } else if (feature.geometry.type === 'MultiPolygon') {
                            feature.geometry.coordinates.forEach(polygon => {
                                polygon.forEach(ring => {
                                    worldGeometry.push(ring);
                                });
                            });
                        }
                    }
                });
            }
            isLoadingMap = false;
            console.log('Map loaded with', worldGeometry.length, 'polygons');
        })
        .catch(error => {
            console.error('Failed to load map data:', error);
            isLoadingMap = false;
        });

    // Draw the globe
    function drawGlobe() {
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.4;

        // Draw starry background
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, size, size);

        // Draw stars
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });

        // Draw night Earth sphere
        const earthGradient = ctx.createRadialGradient(
            centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.1,
            centerX, centerY, radius
        );
        earthGradient.addColorStop(0, 'rgba(30, 40, 60, 1)');
        earthGradient.addColorStop(0.7, 'rgba(15, 20, 35, 1)');
        earthGradient.addColorStop(1, 'rgba(5, 10, 20, 1)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = earthGradient;
        ctx.fill();

        // Draw world map if loaded
        if (!isLoadingMap && worldGeometry && worldGeometry.length > 0) {
            worldGeometry.forEach(path => {
                if (!path || path.length < 2) return;

                ctx.beginPath();
                let firstPoint = true;

                for (let i = 0; i < path.length; i++) {
                    const [lon, lat] = path[i];
                    const phi = (90 - lat) * (Math.PI / 180);
                    const theta = (lon + 180) * (Math.PI / 180);

                    // Apply 3D rotation
                    let x = -radius * Math.sin(phi) * Math.cos(theta - rotationX);
                    let y = -radius * Math.cos(phi);  // Negated to flip globe right-side up
                    let z = radius * Math.sin(phi) * Math.sin(theta - rotationX);

                    // Apply vertical rotation (Y-axis)
                    const tempY = y * Math.cos(rotationY) - z * Math.sin(rotationY);
                    z = y * Math.sin(rotationY) + z * Math.cos(rotationY);
                    y = tempY;

                    // Only draw visible parts
                    if (z > -radius * 0.1) {
                        const screenX = centerX + x;
                        const screenY = centerY + y;

                        if (firstPoint) {
                            ctx.moveTo(screenX, screenY);
                            firstPoint = false;
                        } else {
                            ctx.lineTo(screenX, screenY);
                        }
                    } else {
                        firstPoint = true;
                    }
                }

                ctx.closePath();
                ctx.fillStyle = 'rgba(100, 150, 110, 0.85)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(80, 120, 90, 0.4)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            });
        } else if (isLoadingMap) {
            // Show loading text
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '14px DM Sans';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Loading map...', centerX, centerY);
        }

        // Draw visited locations with glowing pins (360° visible)
        let tempHoveredLocation = null;
        visitedLocations.forEach(location => {
            const phi = (90 - location.lat) * (Math.PI / 180);
            const theta = (location.lon + 180) * (Math.PI / 180);

            // Apply 3D rotation
            let x = -radius * Math.sin(phi) * Math.cos(theta - rotationX);
            let y = -radius * Math.cos(phi);  // Negated to flip globe right-side up
            let z = radius * Math.sin(phi) * Math.sin(theta - rotationX);

            // Apply vertical rotation (Y-axis)
            const tempY = y * Math.cos(rotationY) - z * Math.sin(rotationY);
            z = y * Math.sin(rotationY) + z * Math.cos(rotationY);
            y = tempY;

            // Draw points on visible side (allowing some wrap for 360° view)
            if (z > -radius * 0.1) {
                const screenX = centerX + x;
                const screenY = centerY + y;
                const depth = Math.max(0, (z + radius * 0.1) / (radius * 1.1));
                const size = 4 + depth * 3;

                // Check if mouse is hovering over this location
                if (!isDragging) {
                    const dx = mouseCanvasX - screenX;
                    const dy = mouseCanvasY - screenY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < size + 5) {
                        tempHoveredLocation = location;
                        location.screenX = screenX;
                        location.screenY = screenY;
                        location.size = size;
                    }
                }

                // Glow effect
                ctx.shadowBlur = 20;
                ctx.shadowColor = `rgba(255, 200, 100, ${0.6 + depth * 0.4})`;

                // Draw pin
                ctx.beginPath();
                ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 200, 100, ${0.7 + depth * 0.3})`;
                ctx.fill();

                // Inner bright core
                ctx.beginPath();
                ctx.arc(screenX, screenY, size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 240, 180, ${0.8 + depth * 0.2})`;
                ctx.fill();

                ctx.shadowBlur = 0;

                location.visible = true;
            } else {
                location.visible = false;
            }
        });

        hoveredLocation = tempHoveredLocation;

        // Draw tooltip if hovering
        if (hoveredLocation && hoveredLocation.visible) {
            const paddingH = 12;
            const paddingV = 8;
            const fontSize = 13;
            const borderRadius = 6;

            ctx.font = `600 ${fontSize}px 'DM Sans', sans-serif`;
            const textWidth = ctx.measureText(hoveredLocation.name).width;

            const tooltipX = hoveredLocation.screenX - textWidth / 2 - paddingH;
            const tooltipY = hoveredLocation.screenY - hoveredLocation.size - 32;
            const tooltipWidth = textWidth + paddingH * 2;
            const tooltipHeight = fontSize + paddingV * 2;

            // Draw shadow/glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(255, 200, 100, 0.4)';

            // Tooltip background with rounded corners
            ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
            ctx.beginPath();
            ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, borderRadius);
            ctx.fill();

            // Gradient border
            const borderGradient = ctx.createLinearGradient(
                tooltipX, tooltipY,
                tooltipX + tooltipWidth, tooltipY + tooltipHeight
            );
            borderGradient.addColorStop(0, 'rgba(255, 220, 150, 0.8)');
            borderGradient.addColorStop(0.5, 'rgba(255, 200, 100, 1)');
            borderGradient.addColorStop(1, 'rgba(255, 180, 80, 0.8)');

            ctx.strokeStyle = borderGradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, borderRadius);
            ctx.stroke();

            ctx.shadowBlur = 0;

            // Draw small triangle pointer
            const arrowSize = 5;
            const arrowX = hoveredLocation.screenX;
            const arrowY = tooltipY + tooltipHeight;

            ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY + arrowSize);
            ctx.lineTo(arrowX - arrowSize, arrowY);
            ctx.lineTo(arrowX + arrowSize, arrowY);
            ctx.closePath();
            ctx.fill();

            // Tooltip text with gradient
            const textGradient = ctx.createLinearGradient(
                tooltipX, tooltipY,
                tooltipX + tooltipWidth, tooltipY + tooltipHeight
            );
            textGradient.addColorStop(0, 'rgba(255, 230, 150, 1)');
            textGradient.addColorStop(1, 'rgba(255, 200, 100, 1)');

            ctx.fillStyle = textGradient;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                hoveredLocation.name,
                hoveredLocation.screenX,
                tooltipY + tooltipHeight / 2
            );
        }

        // Draw atmosphere glow
        const atmosphereGradient = ctx.createRadialGradient(
            centerX, centerY, radius * 0.95,
            centerX, centerY, radius * 1.15
        );
        atmosphereGradient.addColorStop(0, 'rgba(100, 150, 200, 0.3)');
        atmosphereGradient.addColorStop(0.5, 'rgba(100, 150, 200, 0.15)');
        atmosphereGradient.addColorStop(1, 'rgba(100, 150, 200, 0)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
        ctx.fillStyle = atmosphereGradient;
        ctx.fill();

        // Draw Earth outline
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Animation loop
    function animate() {
        // Apply velocity and auto-rotation (horizontal only)
        rotationX += 0.003 + dragVelocityX;

        // Apply friction
        dragVelocityX *= 0.95;

        drawGlobe();
        requestAnimationFrame(animate);
    }

    // Mouse interaction with full 360° support
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        dragVelocityX = 0;
        dragVelocityY = 0;
    });

    // Track mouse position on canvas
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseCanvasX = e.clientX - rect.left;
        mouseCanvasY = e.clientY - rect.top;

        if (isDragging) {
            const deltaX = e.clientX - lastX;
            dragVelocityX = -deltaX * 0.005;  // Negated for reversed drag
            rotationX += dragVelocityX;
            lastX = e.clientX;
            canvas.style.cursor = 'grabbing';
        } else {
            // Cursor will be set by drawGlobe based on hover state
            if (hoveredLocation) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'grab';
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - lastX;
            dragVelocityX = -deltaX * 0.005;  // Negated for reversed drag
            rotationX += dragVelocityX;
            lastX = e.clientX;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        dragVelocityX = 0;
        dragVelocityY = 0;
        e.preventDefault();
    });

    canvas.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const deltaX = e.touches[0].clientX - lastX;
            dragVelocityX = -deltaX * 0.005;  // Negated for reversed drag
            rotationX += dragVelocityX;
            lastX = e.touches[0].clientX;
        }
        e.preventDefault();
    });

    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Start animation
    animate();
}
