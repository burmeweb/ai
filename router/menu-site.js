// Site navigation and menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize menu toggle
    initMenuToggle();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize language toggle
    initLanguageToggle();
    
    // Initialize navigation
    initNavigation();
});

function initMenuToggle() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    
    if (mobileMenuBtn && closeMenuBtn && sideMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            sideMenu.classList.add('open');
        });
        
        closeMenuBtn.addEventListener('click', function() {
            sideMenu.classList.remove('open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!sideMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                sideMenu.classList.remove('open');
            }
        });
    }
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        });
    }
    
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    }
}

function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            // In a real implementation, you would use the language manager
            // For now, we'll just show a notification
            showNotification('Language toggle functionality would be implemented here');
        });
    }
}

function initNavigation() {
    // Handle navigation links
    const navLinks = document.querySelectorAll('a[href^="pages/"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            
            // In a real implementation, you might use a router
            // For now, we'll just navigate to the page
            window.location.href = href;
        });
    });
    
    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('bg-indigo-100', 'dark:bg-indigo-800');
        }
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
} 
