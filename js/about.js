// About page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    initContactForm();
    
    // Initialize team member animations
    initTeamAnimations();
    
    // Initialize timeline animations
    initTimelineAnimations();
});

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address');
            return;
        }
        
        // In a real implementation, you would send the form data to a server
        console.log('Contact form submitted:', { name, email, message });
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function initTeamAnimations() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    // Use Intersection Observer to animate team members when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    teamMembers.forEach(member => {
        // Set initial state
        member.style.opacity = '0';
        member.style.transform = 'translateY(20px)';
        member.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Observe the element
        observer.observe(member);
    });
}

function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Use Intersection Observer to animate timeline items when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    timelineItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        
        // Alternate animation direction based on index
        if (index % 2 === 0) {
            item.style.transform = 'translateX(-20px)';
        } else {
            item.style.transform = 'translateX(20px)';
        }
        
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Add delay based on index
        item.style.transitionDelay = `${index * 0.1}s`;
        
        // Observe the element
        observer.observe(item);
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