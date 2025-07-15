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
            // In a real application, this would fetch from an API or load static markdown files
            // For now, using the existing article data
            this.articles = [
                {
                    title: "Instafel Updater Guide",
                    description: "An article on how to install and use Instafel Updater",
                    date: "2025-01-04",
                    formattedDate: "4 Jan 2025",
                    tags: ["instafel", "instafel-updater", "android", "guide"],
                    image: "/pbanners/instafel-updater.png",
                    slug: "instafel-updater-guide",
                    author: "mamiiblt",
                    readTime: "5 min read",
                    featured: true,
                    excerpt: "Learn how to install and configure Instafel Updater for automatic updates with Shizuku support.",
                    category: "tutorial"
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
        const articleUrl = `/articles/${article.slug}.html`;

        articleEl.innerHTML = `
            <a href="${articleUrl}" class="article-link">
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                    ${article.featured ? '<div class="article-badge">Featured</div>' : ''}
                    <div class="article-category">${this.getCategoryText(article.category)}</div>
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        <time datetime="${article.date}" class="article-date">${article.formattedDate}</time>
                        <span class="article-read-time">${article.readTime}</span>
                        <span class="article-author">${article.author}</span>
                    </div>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt || article.description}</p>
                    <div class="article-tags">
                        ${article.tags.slice(0, 3).map(tag => `<span class="article-tag">${tag}</span>`).join('')}
                        ${article.tags.length > 3 ? `<span class="article-tag-more">+${article.tags.length - 3}</span>` : ''}
                    </div>
                    <div class="article-footer">
                        <span class="read-more">Read Article</span>
                        <svg class="read-more-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            </a>
        `;

        return articleEl;
    }

    getCategoryText(category) {
        const categoryTexts = {
            tutorial: 'Tutorial',
            guide: 'Guide',
            article: 'Article',
            news: 'News',
            review: 'Review',
            opinion: 'Opinion'
        };

        return categoryTexts[category] || 'Article';
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