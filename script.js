// ===================================
// SCROLL INDICATOR & DIVIDER VISIBILITY
// ===================================
const scrollIndicator = document.getElementById('scrollIndicator');
const dualSection = document.getElementById('dualSection');
const divider = document.getElementById('divider');

// Scroll to dual section when clicking the scroll indicator
if (scrollIndicator && dualSection) {
    scrollIndicator.addEventListener('click', () => {
        dualSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// Show/hide divider based on scroll position
function updateDividerVisibility() {
    if (!divider || !dualSection) return;
    
    const dualSectionTop = dualSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    // Show divider when dual section is mostly in view
    if (dualSectionTop < windowHeight * 0.5) {
        divider.classList.add('visible');
    } else {
        divider.classList.remove('visible');
    }
}

window.addEventListener('scroll', updateDividerVisibility);
updateDividerVisibility();

// ===================================
// DUAL IDENTITY SECTION FUNCTIONALITY
// ===================================
const techSide = document.getElementById('techSide');
const artSide = document.getElementById('artSide');
const blendOverlay = document.getElementById('blendOverlay');

// Global drag state variable
let isDraggingDivider = false;

// Scroll synchronization between sides
let isSyncing = false;

function syncScroll(source, target) {
    if (isSyncing || !source || !target) return;
    isSyncing = true;

    const sourceScrollPercentage = source.scrollTop / (source.scrollHeight - source.clientHeight);
    target.scrollTop = sourceScrollPercentage * (target.scrollHeight - target.clientHeight);

    setTimeout(() => {
        isSyncing = false;
    }, 50);
}

// Add scroll event listeners for synchronized scrolling
if (techSide && artSide) {
    techSide.addEventListener('scroll', () => syncScroll(techSide, artSide));
    artSide.addEventListener('scroll', () => syncScroll(artSide, techSide));
}

// Scroll-based blend effect
function updateBlendEffect() {
    if (!techSide || !artSide || !blendOverlay) return;
    
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

if (techSide && artSide) {
    techSide.addEventListener('scroll', updateBlendEffect);
    artSide.addEventListener('scroll', updateBlendEffect);
}

// Interactive divider drag functionality
let currentX = 0;

if (divider) {
    divider.addEventListener('mousedown', (e) => {
        isDraggingDivider = true;
        currentX = e.clientX;
        document.body.style.cursor = 'ew-resize';
        e.preventDefault();
    });
}

document.addEventListener('mousemove', (e) => {
    if (!isDraggingDivider || !techSide || !artSide || !divider) return;

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
        if (blendOverlay) {
            const splitDifference = Math.abs(50 - newTechWidth) / 20;
            blendOverlay.style.opacity = Math.min(splitDifference * 0.2, 0.4);
        }
    }
});

document.addEventListener('mouseup', (e) => {
    if (isDraggingDivider) {
        isDraggingDivider = false;
        document.body.style.cursor = 'default';
        e.stopPropagation();
    }
});

// ===================================
// SKILL POPUPS
// ===================================
const skillItems = document.querySelectorAll('.skill-item');
const skillPopups = document.querySelectorAll('.skill-popup');
const popupCloseButtons = document.querySelectorAll('.popup-close');

// Function to open popup next to clicked item
function openSkillPopup(skillType, clickedElement) {
    closeAllPopups();

    const popup = document.getElementById(`popup-${skillType}`);
    if (popup) {
        const rect = clickedElement.getBoundingClientRect();
        const leftPosition = rect.right + 20;
        const popupWidth = 400;
        const viewportWidth = window.innerWidth;

        let finalLeft = leftPosition;

        if (leftPosition + popupWidth > viewportWidth) {
            finalLeft = rect.left - popupWidth - 20;
        }

        if (finalLeft < 0) {
            finalLeft = Math.max(10, (viewportWidth - popupWidth) / 2);
        }

        popup.style.top = `${rect.top}px`;
        popup.style.left = `${finalLeft}px`;
        popup.classList.add('active');
    }
}

function closeAllPopups() {
    skillPopups.forEach(popup => popup.classList.remove('active'));
}

skillItems.forEach(item => {
    item.addEventListener('click', () => {
        const skillType = item.getAttribute('data-skill');
        openSkillPopup(skillType, item);
    });

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

popupCloseButtons.forEach(button => {
    button.addEventListener('click', closeAllPopups);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllPopups();
        closeLightbox();
    }
});

document.addEventListener('click', (e) => {
    const isSkillItem = e.target.closest('.skill-item');
    const isPopup = e.target.closest('.skill-popup');

    if (!isSkillItem && !isPopup) {
        closeAllPopups();
    }
});

if (techSide) techSide.addEventListener('scroll', closeAllPopups);
if (artSide) artSide.addEventListener('scroll', closeAllPopups);

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

// ===================================
// IMAGE LIGHTBOX
// ===================================
function openLightbox(imageSrc) {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImage');
    
    if (modal && modalImg) {
        modal.classList.add('active');
        modalImg.src = imageSrc;
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

const lightboxModal = document.getElementById('lightboxModal');
if (lightboxModal) {
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-close')) {
            closeLightbox();
        }
    });
}

// ===================================
// CHAT FUNCTIONALITY
// ===================================
const chatToggle = document.getElementById('chatToggle');
const chatContainer = document.getElementById('chatContainer');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

if (chatToggle && chatContainer && chatClose && chatInput && chatSend && chatMessages) {
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            chatInput.focus();
            const notification = document.querySelector('.chat-notification');
            if (notification) {
                notification.style.display = 'none';
            }
        }
    });

    chatClose.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user-message';
        userMessage.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(userMessage);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const responses = [
            "I appreciate the effort, but I'm literally just CSS and JavaScript 😅",
            "Bold of you to assume I can read! Try <a href='mailto:kiaraplds@hotmail.com'>email</a> instead ✉️",
            "I'm flattered, but I'm not that kind of chatbot. Real talk? <a href='https://www.linkedin.com/in/kiara-polychroniadi' target='_blank'>LinkedIn</a> me!",
            "Still here? Okay fine, send it to <a href='mailto:kiaraplds@hotmail.com'>kiaraplds@hotmail.com</a> 📧",
            "Look, I'm beautiful AND useless. <a href='https://www.linkedin.com/in/kiara-polychroniadi' target='_blank'>LinkedIn</a> is where the magic happens ✨"
        ];

        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot-message';
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            botMessage.innerHTML = `<p>${randomResponse}</p>`;
            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// ===================================
// 3D GLOBE VISUALIZATION
// ===================================
const canvas = document.getElementById('globeCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    const size = 220;
    canvas.width = size;
    canvas.height = size;

    const visitedLocations = [
        { name: 'Japan', lat: 35.6762, lon: 139.6503, country: true },
        { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: true },
        { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: true },
        { name: 'New York', lat: 40.7128, lon: -74.0060, country: true },
        { name: 'California', lat: 36.7783, lon: -119.4179, country: true },
        { name: 'Mexico', lat: 19.4326, lon: -99.1332, country: true },
        { name: 'Costa Rica', lat: 9.7489, lon: -83.7534, country: true },
        { name: 'Morocco', lat: 33.9716, lon: -6.8498, country: true },
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

    let rotationX = 0;
    let rotationY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;
    let hoveredLocation = null;
    let mouseCanvasX = 0;
    let mouseCanvasY = 0;

    const stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * size,
            y: Math.random() * size,
            radius: Math.random() * 1.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    let worldGeometry = [];
    let isLoadingMap = true;

    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(response => response.json())
        .then(data => {
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
        })
        .catch(error => {
            console.error('Failed to load map data:', error);
            isLoadingMap = false;
        });

    function drawGlobe() {
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.4;

        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, size, size);

        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });

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

        if (!isLoadingMap && worldGeometry && worldGeometry.length > 0) {
            worldGeometry.forEach(path => {
                if (!path || path.length < 2) return;

                ctx.beginPath();
                let firstPoint = true;

                for (let i = 0; i < path.length; i++) {
                    const [lon, lat] = path[i];
                    const phi = (90 - lat) * (Math.PI / 180);
                    const theta = (lon + 180) * (Math.PI / 180);

                    let x = -radius * Math.sin(phi) * Math.cos(theta - rotationX);
                    let y = -radius * Math.cos(phi);
                    let z = radius * Math.sin(phi) * Math.sin(theta - rotationX);

                    const tempY = y * Math.cos(rotationY) - z * Math.sin(rotationY);
                    z = y * Math.sin(rotationY) + z * Math.cos(rotationY);
                    y = tempY;

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
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '14px DM Sans';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Loading map...', centerX, centerY);
        }

        let tempHoveredLocation = null;
        visitedLocations.forEach(location => {
            const phi = (90 - location.lat) * (Math.PI / 180);
            const theta = (location.lon + 180) * (Math.PI / 180);

            let x = -radius * Math.sin(phi) * Math.cos(theta - rotationX);
            let y = -radius * Math.cos(phi);
            let z = radius * Math.sin(phi) * Math.sin(theta - rotationX);

            const tempY = y * Math.cos(rotationY) - z * Math.sin(rotationY);
            z = y * Math.sin(rotationY) + z * Math.cos(rotationY);
            y = tempY;

            if (z > -radius * 0.1) {
                const screenX = centerX + x;
                const screenY = centerY + y;
                const depth = Math.max(0, (z + radius * 0.1) / (radius * 1.1));
                const pinSize = 4 + depth * 3;

                if (!isDragging) {
                    const dx = mouseCanvasX - screenX;
                    const dy = mouseCanvasY - screenY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < pinSize + 5) {
                        tempHoveredLocation = location;
                        location.screenX = screenX;
                        location.screenY = screenY;
                        location.size = pinSize;
                    }
                }

                ctx.shadowBlur = 20;
                ctx.shadowColor = `rgba(255, 200, 100, ${0.6 + depth * 0.4})`;

                ctx.beginPath();
                ctx.arc(screenX, screenY, pinSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 200, 100, ${0.7 + depth * 0.3})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(screenX, screenY, pinSize * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 240, 180, ${0.8 + depth * 0.2})`;
                ctx.fill();

                ctx.shadowBlur = 0;
                location.visible = true;
            } else {
                location.visible = false;
            }
        });

        hoveredLocation = tempHoveredLocation;

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

            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(255, 200, 100, 0.4)';

            ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
            ctx.beginPath();
            ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, borderRadius);
            ctx.fill();

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

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function animate() {
        rotationX += 0.003 + dragVelocityX;
        dragVelocityX *= 0.95;
        drawGlobe();
        requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousedown', (e) => {
        if (!isDraggingDivider) {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            dragVelocityX = 0;
            dragVelocityY = 0;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseCanvasX = e.clientX - rect.left;
        mouseCanvasY = e.clientY - rect.top;

        if (isDragging) {
            const deltaX = e.clientX - lastX;
            dragVelocityX = -deltaX * 0.005;
            rotationX += dragVelocityX;
            lastX = e.clientX;
            canvas.style.cursor = 'grabbing';
        } else {
            if (hoveredLocation) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'grab';
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && !isDraggingDivider) {
            const deltaX = e.clientX - lastX;
            dragVelocityX = -deltaX * 0.005;
            rotationX += dragVelocityX;
            lastX = e.clientX;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging && !isDraggingDivider) {
            isDragging = false;
        }
    });

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
            dragVelocityX = -deltaX * 0.005;
            rotationX += dragVelocityX;
            lastX = e.touches[0].clientX;
        }
        e.preventDefault();
    });

    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });

    animate();
}

// ===================================
// RESPONSIVE CHECK
// ===================================
function checkResponsive() {
    if (!divider || !techSide || !artSide) return;
    
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

// ===================================
// INITIAL LOAD
// ===================================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Console easter egg
console.log('%c👨‍💻 + 🎨 = ✨', 'font-size: 24px; font-weight: bold; background: linear-gradient(to right, #a8c9d1, #c9a961); -webkit-background-clip: text; color: transparent;');
console.log('%cWelcome to the intersection of code and creativity!', 'font-size: 14px; color: #a8c9d1;');
console.log('%cData by day, canvas by night.', 'font-size: 14px; color: #c9a961; font-style: italic;');
