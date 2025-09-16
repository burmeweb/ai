// Settings page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings tabs
    initSettingsTabs();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize save functionality
    initSaveSettings();
});

function initSettingsTabs() {
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsContents = document.querySelectorAll('.settings-content');
    
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            settingsTabs.forEach(t => {
                t.classList.remove('border-indigo-500', 'text-indigo-600', 'dark:text-indigo-400');
                t.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'dark:text-gray-400', 'dark:hover:text-gray-300');
            });
            
            settingsContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // Add active class to clicked tab and corresponding content
            this.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'dark:text-gray-400', 'dark:hover:text-gray-300');
            this.classList.add('border-indigo-500', 'text-indigo-600', 'dark:text-indigo-400');
            
            document.getElementById(`${tabId}-settings`).classList.remove('hidden');
        });
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    themeToggle.addEventListener('click', function() {
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    }
}

function initFormValidation() {
    const profileForm = document.getElementById('profile-form');
    const accountForm = document.getElementById('account-form');
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            
            if (!firstName || !lastName || !email) {
                showNotification('Please fill in all required fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address');
                return;
            }
            
            // Form is valid, proceed with submission
            showNotification('Profile updated successfully');
        });
    }
    
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (!currentPassword || !newPassword || !confirmPassword) {
                showNotification('Please fill in all password fields');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match');
                return;
            }
            
            if (newPassword.length < 8) {
                showNotification('Password must be at least 8 characters long');
                return;
            }
            
            // Form is valid, proceed with submission
            showNotification('Password updated successfully');
            
            // Clear form
            accountForm.reset();
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function initSaveSettings() {
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    
    saveSettingsBtn.addEventListener('click', function() {
        // Collect all settings data
        const settingsData = {
            profile: {
                firstName: document.getElementById('firstName')?.value || '',
                lastName: document.getElementById('lastName')?.value || '',
                bio: document.getElementById('bio')?.value || '',
                location: document.getElementById('location')?.value || '',
                website: document.getElementById('website')?.value || ''
            },
            appearance: {
                theme: document.querySelector('input[name="theme"]:checked')?.value || 'light',
                fontSize: document.getElementById('fontSize')?.value || 'medium',
                showTimestamps: document.getElementById('showTimestamps')?.checked || false,
                compactView: document.getElementById('compactView')?.checked || false,
                showAvatars: document.getElementById('showAvatars')?.checked || true
            },
            notifications: {
                emailNotifications: document.getElementById('emailNotifications')?.checked || true,
                browserNotifications: document.getElementById('browserNotifications')?.checked || true,
                sound: document.getElementById('sound')?.checked || true,
                quietHours: document.getElementById('quietHours')?.checked || false,
                quietHoursStart: document.getElementById('quietHoursStart')?.value || '22:00',
                quietHoursEnd: document.getElementById('quietHoursEnd')?.value || '08:00'
            },
            privacy: {
                usageAnalytics: document.getElementById('usageAnalytics')?.checked || true,
                crashReports: document.getElementById('crashReports')?.checked || true,
                saveChatHistory: document.getElementById('saveChatHistory')?.checked || true,
                autoDeleteMessages: document.getElementById('autoDeleteMessages')?.value || 'never'
            }
        };
        
        // In a real implementation, you would send this data to a server
        console.log('Saving settings:', settingsData);
        
        // Show success message
        showNotification('Settings saved successfully');
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