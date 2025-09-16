// Authentication functionality
import { auth } from '../src/firebaseConfig.js';
import { showNotification, storage } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication
    initAuth();
    
    // Check if user is already logged in
    checkAuthState();
});

function initAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Reset form submission
    if (resetForm) {
        resetForm.addEventListener('submit', handlePasswordReset);
    }
    
    // Social login buttons
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const githubLoginBtn = document.getElementById('githubLoginBtn');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }
    
    if (githubLoginBtn) {
        githubLoginBtn.addEventListener('click', handleGithubLogin);
    }
    
    // Form toggle buttons
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const forgotPasswordBtn = document.getElementById('forgotPassword');
    const backToLoginBtn = document.getElementById('backToLogin');
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', showRegisterForm);
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', showLoginForm);
    }
    
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', showResetForm);
    }
    
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', showLoginForm);
    }
}

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
            
            // Redirect to chat page if on auth page
            if (window.location.pathname.includes('auth.html')) {
                window.location.href = 'pages/mainchat.html';
            }
        } else {
            // User is signed out
            console.log('User is signed out');
            
            // Clear user data from local storage
            storage.remove('user');
            
            // Redirect to auth page if not already there
            if (!window.location.pathname.includes('auth.html') && 
                !window.location.pathname.includes('index.html')) {
                window.location.href = 'pages/auth.html';
            }
        }
    });
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    try {
        // Show loading state
        const loginBtn = document.getElementById('loginBtn');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Signing in...';
        loginBtn.disabled = true;
        
        // Sign in with email and password
        await auth.signInWithEmailAndPassword(email, password);
        
        // Set persistence based on remember me checkbox
        if (rememberMe) {
            await auth.setPersistence(auth.Auth.Persistence.LOCAL);
        } else {
            await auth.setPersistence(auth.Auth.Persistence.SESSION);
        }
        
        showNotification('Login successful!', 'success');
        
        // Redirect to chat page
        window.location.href = 'pages/mainchat.html';
    } catch (error) {
        console.error('Login error:', error);
        
        // Reset button state
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
        
        // Show error message
        let errorMessage = 'Login failed. Please try again.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email address.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed login attempts. Please try again later.';
                break;
        }
        
        showNotification(errorMessage, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms and Privacy Policy.', 'error');
        return;
    }
    
    try {
        // Show loading state
        const registerBtn = document.getElementById('registerBtn');
        const originalText = registerBtn.textContent;
        registerBtn.textContent = 'Creating account...';
        registerBtn.disabled = true;
        
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update user profile with display name
        await user.updateProfile({
            displayName: name
        });
        
        // Send email verification
        await user.sendEmailVerification();
        
        showNotification('Account created successfully! Please check your email for verification.', 'success');
        
        // Show login form
        showLoginForm();
        
        // Reset form
        document.getElementById('registerForm').reset();
    } catch (error) {
        console.error('Registration error:', error);
        
        // Reset button state
        const registerBtn = document.getElementById('registerBtn');
        registerBtn.textContent = originalText;
        registerBtn.disabled = false;
        
        // Show error message
        let errorMessage = 'Registration failed. Please try again.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please choose a stronger password.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password accounts are not enabled.';
                break;
        }
        
        showNotification(errorMessage, 'error');
    }
}

async function handlePasswordReset(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showNotification('Please enter your email address.', 'error');
        return;
    }
    
    try {
        // Show loading state
        const resetBtn = document.getElementById('resetBtn');
        const originalText = resetBtn.textContent;
        resetBtn.textContent = 'Sending...';
        resetBtn.disabled = true;
        
        // Send password reset email
        await auth.sendPasswordResetEmail(email);
        
        showNotification('Password reset email sent! Please check your inbox.', 'success');
        
        // Show login form
        showLoginForm();
        
        // Reset form
        document.getElementById('resetForm').reset();
    } catch (error) {
        console.error('Password reset error:', error);
        
        // Reset button state
        const resetBtn = document.getElementById('resetBtn');
        resetBtn.textContent = originalText;
        resetBtn.disabled = false;
        
        // Show error message
        let errorMessage = 'Failed to send password reset email. Please try again.';
        
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email address.';
                break;
        }
        
        showNotification(errorMessage, 'error');
    }
}

async function handleGoogleLogin() {
    try {
        const provider = new auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        showNotification('Login successful!', 'success');
    } catch (error) {
        console.error('Google login error:', error);
        showNotification('Google login failed. Please try again.', 'error');
    }
}

async function handleGithubLogin() {
    try {
        const provider = new auth.GithubAuthProvider();
        await auth.signInWithPopup(provider);
        showNotification('Login successful!', 'success');
    } catch (error) {
        console.error('GitHub login error:', error);
        showNotification('GitHub login failed. Please try again.', 'error');
    }
}

function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('resetForm').classList.add('hidden');
}

function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('resetForm').classList.add('hidden');
}

function showResetForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('resetForm').classList.remove('hidden');
}

// Logout function
async function logout() {
    try {
        await auth.signOut();
        showNotification('Logged out successfully!', 'success');
        window.location.href = 'pages/auth.html';
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Logout failed. Please try again.', 'error');
    }
}

// Export logout function for use in other scripts
export { logout };
