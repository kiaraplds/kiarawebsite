// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Function to show a specific section
function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Add active class to corresponding nav link
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Update URL hash without scrolling
    history.pushState(null, null, `#${sectionId}`);
}

// Handle navigation link clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        showSection(sectionId);
    });
});

// Handle CTA buttons that navigate to sections
document.addEventListener('click', (e) => {
    if (e.target.matches('.cta-button[data-section]')) {
        e.preventDefault();
        const sectionId = e.target.getAttribute('data-section');
        showSection(sectionId);
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        showSection(hash);
    } else {
        showSection('home');
    }
});

// Show correct section on page load
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        showSection(hash);
    } else {
        // Start on About section by default instead of Home
        showSection('about');
    }
});

// CV Download functionality
const downloadCVButton = document.getElementById('downloadCV');

downloadCVButton.addEventListener('click', (e) => {
    e.preventDefault();

    // CV file path
    const cvPath = 'KiaraPolychroniadi_CV_2025.pdf';

    // Create temporary link to download
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = 'KiaraPolychroniadi_CV_2025.pdf';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Smooth scroll for anchor links within sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (!anchor.classList.contains('nav-link') && !anchor.hasAttribute('data-section')) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Add subtle parallax effect to background
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('body::before');
            if (parallax) {
                document.body.style.backgroundPositionY = -(scrolled * 0.3) + 'px';
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all major content blocks
document.querySelectorAll('.about-grid, .work-intro, .behance-embed, .contact-grid').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
