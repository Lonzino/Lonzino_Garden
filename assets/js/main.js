// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        // Update icon and save preference
        themeIcon.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
});

// Pixel art hover effect
document.querySelectorAll('.pixel-art').forEach(element => {
    element.addEventListener('mouseover', () => {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.3s';
    });
    
    element.addEventListener('mouseout', () => {
        element.style.transform = 'scale(1)';
    });
});

// Social button click sound
document.querySelectorAll('.social-button').forEach(button => {
    button.addEventListener('click', () => {
        const audio = new Audio('/assets/sounds/click.mp3');
        audio.play().catch(() => {
            // Ignore errors if sound can't be played
        });
    });
});

// Responsive navigation
const createMobileNav = () => {
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.nav-list');
    
    const mobileNavButton = document.createElement('button');
    mobileNavButton.className = 'mobile-nav-button pixel-button';
    mobileNavButton.innerHTML = '☰';
    
    header.insertBefore(mobileNavButton, nav);
    
    mobileNavButton.addEventListener('click', () => {
        nav.classList.toggle('show');
    });
};

// Initialize mobile navigation if needed
if (window.innerWidth <= 768) {
    createMobileNav();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-nav-button')) {
            createMobileNav();
        }
    } else {
        const mobileNavButton = document.querySelector('.mobile-nav-button');
        if (mobileNavButton) {
            mobileNavButton.remove();
        }
        document.querySelector('.nav-list').classList.remove('show');
    }
}); 