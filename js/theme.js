// Theme Management System
class ThemeManager {
    constructor() {
        this.themes = ['light', 'dark', 'system'];
        this.currentTheme = 'system';
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.themeToggle = null;
        this.metaThemeColor = null;
    }

    async init() {
        try {
            // Get DOM elements
            this.themeToggle = document.getElementById('theme-toggle');
            this.metaThemeColor = document.querySelector('meta[name="theme-color"]');
            
            // Load saved theme
            this.loadTheme();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Apply initial theme
            this.applyTheme();
            
            console.log('ThemeManager initialized');
        } catch (error) {
            console.error('Failed to initialize ThemeManager:', error);
        }
    }

    setupEventListeners() {
        // Theme toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Listen for system theme changes
        this.mediaQuery.addEventListener('change', (e) => {
            if (this.currentTheme === 'system') {
                this.applyTheme();
            }
        });

        // Listen for storage changes (for cross-tab synchronization)
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                this.currentTheme = e.newValue || 'system';
                this.applyTheme();
            }
        });
    }

    loadTheme() {
        // Try to load from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            // Default to system theme
            this.currentTheme = 'system';
        }
    }

    saveTheme() {
        try {
            localStorage.setItem('theme', this.currentTheme);
        } catch (error) {
            console.warn('Could not save theme to localStorage:', error);
        }
    }

    toggleTheme() {
        // Simple toggle between light and dark
        if (this.currentTheme === 'light') {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }
    }

    setTheme(theme) {
        if (!this.themes.includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }

        this.currentTheme = theme;
        this.saveTheme();
        this.applyTheme();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        }));
    }

    applyTheme() {
        const html = document.documentElement;
        const body = document.body;
        
        // Remove all theme classes
        this.themes.forEach(theme => {
            html.classList.remove(`theme-${theme}`);
        });
        
        // Apply current theme class
        html.classList.add(`theme-${this.currentTheme}`);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor();
        
        // Add transition class temporarily for smooth transitions
        body.classList.add('theme-transitioning');
        setTimeout(() => {
            body.classList.remove('theme-transitioning');
        }, 300);
        
        console.log(`Applied theme: ${this.currentTheme}`);
    }

    updateMetaThemeColor() {
        if (!this.metaThemeColor) return;
        
        let color = '#ffffff'; // default light
        
        if (this.currentTheme === 'dark') {
            color = '#000000';
        } else if (this.currentTheme === 'system') {
            color = this.mediaQuery.matches ? '#000000' : '#ffffff';
        }
        
        this.metaThemeColor.setAttribute('content', color);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getEffectiveTheme() {
        if (this.currentTheme === 'system') {
            return this.mediaQuery.matches ? 'dark' : 'light';
        }
        return this.currentTheme;
    }

    isDarkMode() {
        return this.getEffectiveTheme() === 'dark';
    }

    // Method to preload theme-specific assets
    preloadThemeAssets() {
        const theme = this.getEffectiveTheme();
        
        // Preload theme-specific images or assets
        if (theme === 'dark') {
            // Preload dark theme assets
        } else {
            // Preload light theme assets
        }
    }

    // Method to get theme-aware colors
    getThemeColors() {
        const computedStyle = getComputedStyle(document.documentElement);
        
        return {
            background: computedStyle.getPropertyValue('--background').trim(),
            foreground: computedStyle.getPropertyValue('--foreground').trim(),
            primary: computedStyle.getPropertyValue('--primary').trim(),
            secondary: computedStyle.getPropertyValue('--secondary').trim(),
            muted: computedStyle.getPropertyValue('--muted').trim(),
            accent: computedStyle.getPropertyValue('--accent').trim(),
            border: computedStyle.getPropertyValue('--border').trim(),
        };
    }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
}