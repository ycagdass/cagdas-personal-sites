// Main application initialization
class App {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Initialize core modules
            await this.initializeModules();
            
            // Load content
            await this.loadContent();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.handleError(error);
        }
    }

    async initializeModules() {
        // Wait for other modules to be available
        await this.waitForModules(['ThemeManager', 'LanguageManager', 'NavigationManager']);
        
        // Initialize modules
        window.themeManager = new ThemeManager();
        window.languageManager = new LanguageManager();
        window.navigationManager = new NavigationManager();
        
        // Initialize modules
        await window.themeManager.init();
        await window.languageManager.init();
        window.navigationManager.init();
    }

    async waitForModules(modules) {
        const maxWait = 5000; // 5 seconds
        const interval = 100; // 100ms
        let waited = 0;

        return new Promise((resolve, reject) => {
            const check = () => {
                const allLoaded = modules.every(module => window[module]);
                
                if (allLoaded) {
                    resolve();
                } else if (waited >= maxWait) {
                    reject(new Error(`Modules not loaded: ${modules.filter(m => !window[m]).join(', ')}`));
                } else {
                    waited += interval;
                    setTimeout(check, interval);
                }
            };
            
            check();
        });
    }

    async loadContent() {
        // Load recent posts
        await this.loadRecentPosts();
    }

    async loadRecentPosts() {
        try {
            const postsContainer = document.getElementById('recent-posts');
            if (!postsContainer) return;

            // Simulate loading posts - in a real app, this would fetch from an API or load static data
            const posts = await this.fetchRecentPosts();
            
            // Clear skeleton loaders
            postsContainer.innerHTML = '';
            
            // Render posts
            posts.forEach((post, index) => {
                const postElement = this.createPostElement(post, index);
                postsContainer.appendChild(postElement);
            });

            // Animate posts
            this.animateElements(postsContainer.children);
            
        } catch (error) {
            console.error('Failed to load recent posts:', error);
        }
    }

    async fetchRecentPosts() {
        // For now, return mock data
        // In a real implementation, this would fetch from /data/posts/ or an API
        return [
            {
                title: "Instafel Updater Guide",
                description: "An article on how to install and use Instafel Updater",
                date: "4 Jan 2025",
                tags: ["instafel", "instafel-updater"],
                image: "/pbanners/instafel-updater.png",
                slug: "instafel-updater-guide",
                author: "mamiiblt"
            }
        ];
    }

    createPostElement(post, index) {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.style.animationDelay = `${index * 0.1}s`;
        
        const currentLang = window.languageManager?.getCurrentLanguage() || 'en';
        const postUrl = `/articles/${post.slug}.html`;
        
        article.innerHTML = `
            <a href="${postUrl}" class="post-link">
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <time datetime="${post.date}" class="post-date">${post.date}</time>
                        <span class="post-author">${post.author}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-description">${post.description}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        `;
        
        return article;
    }

    setupEventListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.onPageVisible();
            }
        });

        // Handle resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.onResize();
            }, 150);
        });

        // Handle scroll events for navbar
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.onScroll();
            }, 10);
        });
    }

    onPageVisible() {
        // Refresh any time-sensitive content
        console.log('Page became visible');
    }

    onResize() {
        // Handle responsive adjustments
        console.log('Window resized');
    }

    onScroll() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }

    animateElements(elements) {
        Array.from(elements).forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleError(error) {
        console.error('App error:', error);
        
        // Show error message to user
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.innerHTML = `
            <div class="error-content">
                <h3>Something went wrong</h3>
                <p>Please refresh the page to try again.</p>
                <button onclick="window.location.reload()" class="btn btn-primary">Refresh Page</button>
            </div>
        `;
        
        document.body.appendChild(errorContainer);
        
        // Hide loading screen
        this.hideLoadingScreen();
    }
}

// Utility functions
window.utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString(window.languageManager?.getCurrentLanguage() || 'en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Animate element on scroll
    animateOnScroll(element, options = {}) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px'
        });

        observer.observe(element);
    },

    // Smooth scroll to element
    scrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
};

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new App();
    });
} else {
    window.app = new App();
}