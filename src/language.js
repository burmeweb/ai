// Multi-language support
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                // Common
                loading: 'Loading...',
                error: 'An error occurred',
                success: 'Success',
                cancel: 'Cancel',
                save: 'Save',
                delete: 'Delete',
                edit: 'Edit',
                confirm: 'Confirm',
                
                // Authentication
                signIn: 'Sign In',
                signUp: 'Sign Up',
                signOut: 'Sign Out',
                email: 'Email',
                password: 'Password',
                confirmPassword: 'Confirm Password',
                forgotPassword: 'Forgot Password?',
                rememberMe: 'Remember Me',
                
                // Chat
                newChat: 'New Chat',
                sendMessage: 'Send Message',
                typeMessage: 'Type your message here...',
                generatingResponse: 'Generating response...',
                
                // Settings
                settings: 'Settings',
                profile: 'Profile',
                account: 'Account',
                appearance: 'Appearance',
                notifications: 'Notifications',
                privacy: 'Privacy',
                
                // About
                about: 'About',
                contact: 'Contact',
                team: 'Our Team',
                
                // Notifications
                messageSent: 'Message sent successfully',
                settingsSaved: 'Settings saved successfully',
                fileUploaded: 'File uploaded successfully'
            },
            my: {
                // Common
                loading: 'ဆောင်းနေသည်...',
                error: 'အမှားတစ်ခုဖြစ်ပါသည်',
                success: 'အောင်မြင်ပါသည်',
                cancel: 'ဖျက်သိမ်းရန်',
                save: 'သိမ်းဆည်းရန်',
                delete: 'ဖျက်ရန်',
                edit: 'ပြင်ဆင်ရန်',
                confirm: 'အတည်ပြုရန်',
                
                // Authentication
                signIn: 'အကောင့်ဝင်ရန်',
                signUp: 'အကောင့်ဖွင့်ရန်',
                signOut: 'အကောင့်ထွက်ရန်',
                email: 'အီးမေးလ်',
                password: 'စကားဝှက်',
                confirmPassword: 'စကားဝှက်အတည်ပြုပါ',
                forgotPassword: 'စကားဝှက်မေ့နေပါသလား?',
                rememberMe: 'ကျွန်ုပ်ကိုမှတ်ထားပါ',
                
                // Chat
                newChat: 'စကားပြောသစ်ရန်',
                sendMessage: 'မက်ဆေ့ပို့ရန်',
                typeMessage: 'သင့်မက်ဆေ့ကိုရိုက်ထည့်ပါ...',
                generatingResponse: 'တုံ့ပြန်ချက်ဖန်တီးနေသည်...',
                
                // Settings
                settings: 'ဆက်တင်များ',
                profile: 'ပရိုဖိုင်',
                account: 'အကောင့်',
                appearance: 'ပုံစံ',
                notifications: 'အသိပေးချက်များ',
                privacy: 'ကိုယ်ရေးလုံခြုံမှု',
                
                // About
                about: 'အကြောင်း',
                contact: 'ဆက်သွယ်ရန်',
                team: 'ကျွန်ုပ်တို့၏အဖွဲ့',
                
                // Notifications
                messageSent: 'မက်ဆေ့ပို့ခြင်းအောင်မြင်ပါသည်',
                settingsSaved: 'ဆက်တင်များအောင်မြင်စွာသိမ်းဆည်းပြီးပါပြီ',
                fileUploaded: 'ဖိုင်အောင်မြင်စွာတင်ပို့ပြီးပါပြီ'
            }
        };
    }

    // Get the current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Set the current language
    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            this.updatePageLanguage();
        }
    }

    // Get a translation for a key
    translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    // Update the page language
    updatePageLanguage() {
        // Update all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    // Initialize language switcher
    initLanguageSwitcher() {
        const langToggle = document.getElementById('langToggle');
        
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                // Toggle between English and Myanmar
                const newLang = this.currentLanguage === 'en' ? 'my' : 'en';
                this.setLanguage(newLang);
            });
        }
    }
}

// Create and export an instance of LanguageManager
const languageManager = new LanguageManager();
export default languageManager;