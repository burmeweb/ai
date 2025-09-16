// Main entry point for the application
import { auth } from './firebaseConfig.js';
import languageManager from './language.js';
import { storage } from '../js/utils.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language manager
    languageManager.initLanguageSwitcher();
    
    // Check if user is logged in
    checkAuthState();
    
    // Initialize theme
    initTheme();
    
    // Initialize animations
    initAnimations();
});

function checkAuthState() {
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user);
            
            // Store user data in local storage
            storage.set('user', {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });
            
            // If on index page, redirect to chat
            if (window.location.pathname.endsWith('index.html') || 
                window.location.pathname === '/' ||
                window.location.pathname.endsWith('/')) {
                window.location.href = 'pages/mainchat.html';
            }
        } else {
            // User is signed out
            console.log('User is signed out');
            
            // Clear user data from local storage
            storage.remove('user');
            
            // If not on index or auth page, redirect to auth
            if (!window.location.pathname.endsWith('index.html') && 
                !window.location.pathname.endsWith('auth.html') &&
                window.location.pathname !== '/' &&
                !window.location.pathname.endsWith('/')) {
                window.location.href = 'pages/auth.html';
            }
        }
    });
}

function initTheme() {
    const html = document.documentElement;
    
    // Check for saved theme preference
    if (storage.get('theme') === 'dark' || 
        (!storage.get('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    }
}

function initAnimations() {
    // Add fade-in animation to elements with the 'animate-fade-in' class
    const fadeElements = document.querySelectorAll('.animate-fade-in');
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 100);
    });
}

// Export functions for use in other modules
export { checkAuthState, initTheme, initAnimations };
