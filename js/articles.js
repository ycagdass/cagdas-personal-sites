// Articles Page Management
class ArticlesManager {
    constructor() {
        this.articles = [];
        this.articlesGrid = null;
    }

    async init() {
        try {
            // Get DOM elements
            this.articlesGrid = document.getElementById('articles-grid');
            
            if (!this.articlesGrid) {
                console.warn('Articles grid not found - not on articles page');
                return;
            }

            // Load articles data
            await this.loadArticles();
            
            // Render articles
            this.renderArticles();
            
            console.log('ArticlesManager initialized');
        } catch (error) {
            console.error('Failed to initialize ArticlesManager:', error);
        }
    }

    async loadArticles() {
        try {
            // Featured projects from my GitHub - showcasing my best work
            this.articles = [
                {
                    title: "Hotel Management System",
                    description: "C# ile geliştirdiğim otel yönetim sistemi - En gururla paylaştığım proje",
                    date: "2024-12-01",
                    formattedDate: "1 Ara 2024",
                    tags: ["csharp", "database", "management", "windows-forms"],
                    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop&auto=format",
                    slug: "hotel-management-system",
                    author: "devcagdas",
                    readTime: "C# Project",
                    featured: true,
                    excerpt: "Otel işletmeleri için geliştirdiğim kapsamlı yönetim sistemi. Müşteri kaydı, oda yönetimi ve rezervasyon işlemleri içeriyor. ⭐ 2 GitHub Stars",
                    category: "project",
                    githubUrl: "https://github.com/ycagdass/Hotel-Management-System",
                    language: "C#",
                    stars: 2
                },
                {
                    title: "User Management Panel",
                    description: "SQL Server ile entegre kullanıcı yönetim sistemi",
                    date: "2024-06-06",
                    formattedDate: "6 Haz 2024",
                    tags: ["csharp", "sql-server", "crud", "database"],
                    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&auto=format",
                    slug: "user-management-panel",
                    author: "devcagdas",
                    readTime: "C# Project",
                    featured: true,
                    excerpt: "Resim desteği olan kullanıcı kayıt ve yönetim paneli. CRUD işlemleri ve veritabanı entegrasyonu var. ⭐ 3 GitHub Stars",
                    category: "project",
                    githubUrl: "https://github.com/ycagdass/UserManagementPanel",
                    language: "C#",
                    stars: 3
                },
                {
                    title: "Patient Bed Control (IoT)",
                    description: "ESP32 kartı ile hasta yatağı kontrol sistemi",
                    date: "2024-02-14",
                    formattedDate: "14 Şub 2024",
                    tags: ["esp32", "iot", "cpp", "healthcare"],
                    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&auto=format",
                    slug: "patient-bed-control",
                    author: "devcagdas",
                    readTime: "IoT Project",
                    featured: false,
                    excerpt: "ESP32 mikrocontroller ile hasta yatağı kontrol sistemi. Web arayüzü ile uzaktan kontrol imkanı sağlıyor.",
                    category: "project",
                    githubUrl: "https://github.com/ycagdass/Web-based-Patient-Bed-Control-Software",
                    language: "C++",
                    stars: 1
                }
            ];
            
            console.log(`Loaded ${this.articles.length} articles`);
        } catch (error) {
            console.error('Failed to load articles:', error);
            this.articles = [];
        }
    }

    renderArticles() {
        if (!this.articlesGrid) return;

        // Clear loading skeletons
        this.articlesGrid.innerHTML = '';

        // Sort articles by date (newest first)
        const sortedArticles = [...this.articles].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        // Render each article
        sortedArticles.forEach((article, index) => {
            const articleElement = this.createArticleElement(article, index);
            this.articlesGrid.appendChild(articleElement);
        });

        // Animate articles
        this.animateArticles();
    }

    createArticleElement(article, index) {
        const articleEl = document.createElement('article');
        articleEl.className = `article-card ${article.featured ? 'featured' : ''}`;
        articleEl.style.animationDelay = `${index * 0.1}s`;

        const currentLang = window.languageManager?.getCurrentLanguage() || 'en';
        
        // For GitHub projects, use GitHub URL; for articles, use internal URL
        const linkUrl = article.githubUrl || `/articles/${article.slug}.html`;
        const linkTarget = article.githubUrl ? '_blank' : '_self';
        const linkRel = article.githubUrl ? 'noopener noreferrer' : '';

        articleEl.innerHTML = `
            <a href="${linkUrl}" target="${linkTarget}" ${linkRel ? `rel="${linkRel}"` : ''} class="article-link">
                <div class="article-image">
                    ${article.image ? 
                        `<img src="${article.image}" alt="${article.title}" loading="lazy" class="article-img">` : 
                        `<div class="article-placeholder">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="placeholder-icon">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span class="placeholder-text">${article.language}</span>
                        </div>`
                    }
                    <div class="article-language-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor" class="language-icon">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        ${article.language || 'Project'}
                    </div>
                    ${article.featured ? '<div class="article-badge">Featured</div>' : ''}
                    <div class="article-category">${this.getCategoryText(article.category)}</div>
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        <time datetime="${article.date}" class="article-date">${article.formattedDate}</time>
                        <span class="article-read-time">${article.readTime}</span>
                        <span class="article-author">${article.author}</span>
                        ${article.stars > 0 ? `<span class="article-stars">⭐ ${article.stars}</span>` : ''}
                    </div>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt || article.description}</p>
                    <div class="article-tags">
                        ${article.tags.slice(0, 3).map(tag => `<span class="article-tag">${tag}</span>`).join('')}
                        ${article.tags.length > 3 ? `<span class="article-tag-more">+${article.tags.length - 3}</span>` : ''}
                    </div>
                    <div class="article-footer">
                        <span class="read-more">
                            ${article.githubUrl ? 'View on GitHub' : 'Read Article'}
                        </span>
                        <svg class="read-more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${article.githubUrl ? 
                                '<path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>' :
                                '<path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path>'
                            }
                        </svg>
                    </div>
                </div>
            </a>
        `;

        return articleEl;
    }

    getCategoryText(category) {
        const categoryTexts = {
            project: 'Project',
            tutorial: 'Tutorial',
            guide: 'Guide',
            article: 'Article',
            'learning-note': 'Learning',
            news: 'News',
            review: 'Review',
            opinion: 'Opinion'
        };

        return categoryTexts[category] || 'Project';
    }

    animateArticles() {
        const articleCards = this.articlesGrid.querySelectorAll('.article-card');
        
        articleCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Method to filter articles by category
    filterByCategory(category) {
        const filteredArticles = category === 'all' 
            ? this.articles 
            : this.articles.filter(article => article.category === category);

        this.renderFilteredArticles(filteredArticles);
    }

    // Method to filter articles by tag
    filterByTag(tag) {
        const filteredArticles = this.articles.filter(article => 
            article.tags.includes(tag)
        );

        this.renderFilteredArticles(filteredArticles);
    }

    renderFilteredArticles(articles) {
        if (!this.articlesGrid) return;

        this.articlesGrid.innerHTML = '';

        if (articles.length === 0) {
            this.articlesGrid.innerHTML = `
                <div class="no-articles">
                    <div class="no-articles-content">
                        <svg class="no-articles-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                        </svg>
                        <h3>No articles found</h3>
                        <p>Try adjusting your filters or check back later for new content.</p>
                    </div>
                </div>
            `;
            return;
        }

        articles.forEach((article, index) => {
            const articleElement = this.createArticleElement(article, index);
            this.articlesGrid.appendChild(articleElement);
        });

        this.animateArticles();
    }

    // Method to search articles
    searchArticles(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.renderArticles();
            return;
        }

        const filteredArticles = this.articles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) ||
            article.description.toLowerCase().includes(searchTerm) ||
            article.excerpt?.toLowerCase().includes(searchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );

        this.renderFilteredArticles(filteredArticles);
    }
}

// Initialize articles manager if we're on the articles page
if (typeof window !== 'undefined') {
    window.ArticlesManager = ArticlesManager;
    
    // Auto-initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('articles-grid')) {
            window.articlesManager = new ArticlesManager();
            window.articlesManager.init();
        }
    });
}