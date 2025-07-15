// Language Management System
class LanguageManager {
    constructor() {
        this.languages = {
            'en': 'English',
            'tr': 'Türkçe'
        };
        this.currentLanguage = 'en';
        this.translations = {};
        this.languageToggle = null;
        this.currentLangDisplay = null;
    }

    async init() {
        try {
            // Get DOM elements
            this.languageToggle = document.getElementById('language-toggle');
            this.currentLangDisplay = document.getElementById('current-lang');
            
            // Load saved language
            this.loadLanguage();
            
            // Load translations
            await this.loadTranslations();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Apply initial language
            this.applyLanguage();
            
            console.log('LanguageManager initialized');
        } catch (error) {
            console.error('Failed to initialize LanguageManager:', error);
        }
    }

    setupEventListeners() {
        // Language toggle button
        if (this.languageToggle) {
            this.languageToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Listen for storage changes (for cross-tab synchronization)
        window.addEventListener('storage', (e) => {
            if (e.key === 'language') {
                this.currentLanguage = e.newValue || 'en';
                this.applyLanguage();
            }
        });
    }

    loadLanguage() {
        // Try to load from localStorage
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && this.languages[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        } else {
            // Try to detect from browser
            const browserLang = navigator.language.split('-')[0];
            if (this.languages[browserLang]) {
                this.currentLanguage = browserLang;
            } else {
                this.currentLanguage = 'en'; // fallback
            }
        }
    }

    saveLanguage() {
        try {
            localStorage.setItem('language', this.currentLanguage);
        } catch (error) {
            console.warn('Could not save language to localStorage:', error);
        }
    }

    async loadTranslations() {
        try {
            // Load translations for all supported languages
            for (const lang of Object.keys(this.languages)) {
                const translations = await this.fetchTranslations(lang);
                this.translations[lang] = translations;
            }
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Use fallback translations
            this.translations = this.getFallbackTranslations();
        }
    }

    async fetchTranslations(language) {
        try {
            const response = await fetch(`/data/translations/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${language} translations`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`Failed to load ${language} translations, using fallback`);
            return this.getFallbackTranslations()[language] || {};
        }
    }

    getFallbackTranslations() {
        // Fallback translations embedded in JS
        return {
            en: {
                'navbar.items.articles': 'Articles',
                'navbar.items.projects': 'Projects',
                'navbar.items.about': 'About',
                'hero.1': 'Welcome to',
                'hero.2': "devcagdas' site",
                'desc': 'You can find blogs, projects and everything about me!',
                'heroButtons.viewProjects': 'View Projects',
                'heroButtons.aboutMe': 'About Me',
                'recentPosts': 'Recent Posts',
                'viewAllPosts': 'View All Posts',
                'footer.copyright': '© 2025 devcagdas. All rights reserved.'
            },
            tr: {
                'navbar.items.articles': 'Yazılar',
                'navbar.items.projects': 'Projeler',
                'navbar.items.about': 'Hakkımda',
                'hero.1': "devcagdas'ın",
                'hero.2': 'sitesine hoş geldin',
                'desc': 'Bu sitede yazılarımı, projelerimi ve benimle ilgili her şeyi bulabilirsiniz!',
                'heroButtons.viewProjects': 'Projelerim',
                'heroButtons.aboutMe': 'Hakkımda',
                'recentPosts': 'Son Gönderiler',
                'viewAllPosts': 'Tüm Gönderileri Gör',
                'footer.copyright': '© 2025 devcagdas. Tüm hakları saklıdır.'
            }
        };
    }

    toggleLanguage() {
        const languages = Object.keys(this.languages);
        const currentIndex = languages.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % languages.length;
        this.setLanguage(languages[nextIndex]);
    }

    setLanguage(language) {
        if (!this.languages[language]) {
            console.warn(`Invalid language: ${language}`);
            return;
        }

        this.currentLanguage = language;
        this.saveLanguage();
        this.applyLanguage();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    applyLanguage() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Update current language display
        if (this.currentLangDisplay) {
            this.currentLangDisplay.textContent = this.currentLanguage.toUpperCase();
        }
        
        // Update all translatable elements
        this.updateTranslatableElements();
        
        console.log(`Applied language: ${this.currentLanguage}`);
    }

    updateTranslatableElements() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (translation) {
                // Check if element has specific attribute to update
                const attr = element.getAttribute('data-i18n-attr');
                if (attr) {
                    element.setAttribute(attr, translation);
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update page title
        this.updatePageTitle();
    }

    updatePageTitle() {
        const currentTitle = document.title;
        const titleKey = document.querySelector('meta[name="title-key"]')?.getAttribute('content');
        
        if (titleKey) {
            const translation = this.translate(titleKey);
            if (translation) {
                document.title = translation;
            }
        }
    }

    translate(key, defaultValue = null) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                // Try fallback language (English)
                if (this.currentLanguage !== 'en') {
                    let fallback = this.translations['en'];
                    for (const fallbackKey of keys) {
                        if (fallback && typeof fallback === 'object' && fallbackKey in fallback) {
                            fallback = fallback[fallbackKey];
                        } else {
                            fallback = null;
                            break;
                        }
                    }
                    return fallback || defaultValue || key;
                }
                return defaultValue || key;
            }
        }
        
        return translation || defaultValue || key;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return this.languages;
    }

    // Format numbers based on current locale
    formatNumber(number, options = {}) {
        return new Intl.NumberFormat(this.currentLanguage, options).format(number);
    }

    // Format dates based on current locale
    formatDate(date, options = {}) {
        return new Intl.DateTimeFormat(this.currentLanguage, options).format(date);
    }

    // Format relative time (e.g., "2 days ago")
    formatRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        const rtf = new Intl.RelativeTimeFormat(this.currentLanguage, { numeric: 'auto' });
        
        const intervals = [
            { unit: 'year', seconds: 31536000 },
            { unit: 'month', seconds: 2628000 },
            { unit: 'week', seconds: 604800 },
            { unit: 'day', seconds: 86400 },
            { unit: 'hour', seconds: 3600 },
            { unit: 'minute', seconds: 60 },
            { unit: 'second', seconds: 1 }
        ];
        
        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count !== 0) {
                return rtf.format(-count, interval.unit);
            }
        }
        
        return rtf.format(0, 'second');
    }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    window.LanguageManager = LanguageManager;
}