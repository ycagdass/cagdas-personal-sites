// Navigation Management System
class NavigationManager {
    constructor() {
        this.mobileMenuToggle = null;
        this.mobileMenu = null;
        this.navItems = [];
        this.isMobileMenuOpen = false;
        this.currentPath = window.location.pathname;
    }

    init() {
        try {
            // Get DOM elements
            this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Set active navigation item
            this.setActiveNavItem();
            
            console.log('NavigationManager initialized');
        } catch (error) {
            console.error('Failed to initialize NavigationManager:', error);
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen && 
                this.mobileMenu && 
                !this.mobileMenu.contains(e.target) &&
                !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle resize events
        window.addEventListener('resize', () => {
            // Close mobile menu on larger screens
            if (window.innerWidth >= 768 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle navigation clicks
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Close mobile menu when navigating
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
                
                // Handle smooth scrolling for anchor links
                const href = item.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });

        // Listen for popstate events (browser back/forward)
        window.addEventListener('popstate', () => {
            this.currentPath = window.location.pathname;
            this.setActiveNavItem();
        });

        // Listen for custom navigation events
        window.addEventListener('navigation', (e) => {
            this.handleCustomNavigation(e.detail);
        });
    }

    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuToggle) return;

        this.isMobileMenuOpen = true;
        this.mobileMenu.classList.add('open');
        this.mobileMenuToggle.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
        // Animate menu items
        const menuItems = this.mobileMenu.querySelectorAll('.mobile-nav-item');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 50);
        });
        
        console.log('Mobile menu opened');
    }

    closeMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuToggle) return;

        this.isMobileMenuOpen = false;
        this.mobileMenu.classList.remove('open');
        this.mobileMenuToggle.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Focus management
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        console.log('Mobile menu closed');
    }

    setActiveNavItem() {
        this.navItems.forEach(item => {
            const href = item.getAttribute('href');
            const isActive = this.isActiveLink(href);
            
            if (isActive) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            } else {
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            }
        });
    }

    isActiveLink(href) {
        if (!href) return false;
        
        // Handle root path
        if (href === '/' && this.currentPath === '/') {
            return true;
        }
        
        // Handle other paths
        if (href !== '/' && this.currentPath.startsWith(href)) {
            return true;
        }
        
        // Handle index.html equivalents
        if (href === '/index.html' && this.currentPath === '/') {
            return true;
        }
        
        return false;
    }

    scrollToSection(sectionId) {
        const target = document.querySelector(sectionId);
        if (!target) return;

        const navbar = document.getElementById('navbar');
        const offset = navbar ? navbar.offsetHeight : 0;
        
        const targetPosition = target.offsetTop - offset - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update URL without triggering page reload
        if (history.pushState) {
            history.pushState(null, null, sectionId);
        }
    }

    navigateTo(url, options = {}) {
        // Custom navigation method for SPA-like behavior
        if (options.replace) {
            window.location.replace(url);
        } else {
            window.location.href = url;
        }
    }

    handleCustomNavigation(detail) {
        // Handle custom navigation events
        console.log('Custom navigation:', detail);
    }

    // Method to programmatically set active item
    setActiveItem(href) {
        this.navItems.forEach(item => {
            item.classList.remove('active');
            item.removeAttribute('aria-current');
            
            if (item.getAttribute('href') === href) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            }
        });
    }

    // Method to add navigation items dynamically
    addNavItem(item) {
        if (item.element) {
            item.element.addEventListener('click', (e) => {
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
                
                const href = item.element.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
            
            this.navItems = [...this.navItems, item.element];
        }
    }

    // Method to remove navigation items
    removeNavItem(href) {
        this.navItems = this.navItems.filter(item => {
            return item.getAttribute('href') !== href;
        });
    }

    // Get current active item
    getActiveItem() {
        return Array.from(this.navItems).find(item => 
            item.classList.contains('active')
        );
    }

    // Check if mobile menu is supported/needed
    isMobileMenuSupported() {
        return window.innerWidth < 768;
    }

    // Update navigation based on viewport
    updateNavigation() {
        if (!this.isMobileMenuSupported() && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    window.NavigationManager = NavigationManager;
}