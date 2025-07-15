// Projects Page Management
class ProjectsManager {
    constructor() {
        this.projects = [];
        this.projectsGrid = null;
    }

    async init() {
        try {
            // Get DOM elements
            this.projectsGrid = document.getElementById('projects-grid');
            
            if (!this.projectsGrid) {
                console.warn('Projects grid not found - not on projects page');
                return;
            }

            // Load projects data
            await this.loadProjects();
            
            // Render projects
            this.renderProjects();
            
            console.log('ProjectsManager initialized');
        } catch (error) {
            console.error('Failed to initialize ProjectsManager:', error);
        }
    }

    async loadProjects() {
        try {
            // In a real application, this would fetch from an API or static data file
            // For now, using mock data
            this.projects = [
                {
                    id: 'instafel',
                    title: 'Instafel',
                    description: 'A comprehensive Instagram automation tool with advanced features for content management and engagement.',
                    technologies: ['Android', 'Kotlin', 'Jetpack Compose'],
                    image: '/pbanners/instafel.png',
                    github: 'https://github.com/mamiiblt/instafel',
                    demo: null,
                    featured: true,
                    category: 'mobile',
                    status: 'active'
                },
                {
                    id: 'instafel-updater',
                    title: 'Instafel Updater',
                    description: 'Automatic update manager for Instafel with background checking and silent installation.',
                    technologies: ['Android', 'Kotlin', 'WorkManager'],
                    image: '/pbanners/instafel-updater.png',
                    github: 'https://github.com/mamiiblt/instafel-updater',
                    demo: null,
                    featured: false,
                    category: 'mobile',
                    status: 'active'
                },
                {
                    id: 'personal-website',
                    title: 'Personal Website',
                    description: 'This very website! A static HTML/CSS/JS implementation converted from Next.js with full feature parity.',
                    technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
                    image: null,
                    github: 'https://github.com/mamiiblt/personal-website',
                    demo: 'https://mamiiblt.dev',
                    featured: true,
                    category: 'web',
                    status: 'active'
                }
            ];
            
            console.log(`Loaded ${this.projects.length} projects`);
        } catch (error) {
            console.error('Failed to load projects:', error);
            this.projects = [];
        }
    }

    renderProjects() {
        if (!this.projectsGrid) return;

        // Clear loading skeletons
        this.projectsGrid.innerHTML = '';

        // Sort projects - featured first, then by status
        const sortedProjects = [...this.projects].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        });

        // Render each project
        sortedProjects.forEach((project, index) => {
            const projectElement = this.createProjectElement(project, index);
            this.projectsGrid.appendChild(projectElement);
        });

        // Animate projects
        this.animateProjects();
    }

    createProjectElement(project, index) {
        const article = document.createElement('article');
        article.className = `project-card ${project.featured ? 'featured' : ''}`;
        article.style.animationDelay = `${index * 0.1}s`;

        const currentLang = window.languageManager?.getCurrentLanguage() || 'en';
        const imageUrl = project.image || this.getPlaceholderImage(project.category);

        article.innerHTML = `
            <div class="project-image">
                <img src="${imageUrl}" alt="${project.title}" loading="lazy" 
                     onerror="this.src='${this.getPlaceholderImage(project.category)}'">
                ${project.featured ? '<div class="project-badge">Featured</div>' : ''}
                <div class="project-status project-status-${project.status}">
                    ${this.getStatusText(project.status)}
                </div>
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-category">${this.getCategoryText(project.category)}</div>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-actions">
                    ${project.github ? `
                        <a href="${project.github}" target="_blank" rel="noopener noreferrer" 
                           class="project-link github-link" aria-label="View ${project.title} on GitHub">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span>Code</span>
                        </a>
                    ` : ''}
                    ${project.demo ? `
                        <a href="${project.demo}" target="_blank" rel="noopener noreferrer" 
                           class="project-link demo-link" aria-label="View ${project.title} demo">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15,3 21,3 21,9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                            <span>Demo</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        return article;
    }

    getPlaceholderImage(category) {
        // Return a placeholder based on category
        const placeholders = {
            mobile: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="%23f0f0f0"><rect width="400" height="300" fill="%23e0e0e0"/><text x="200" y="150" text-anchor="middle" fill="%23666" font-family="Arial" font-size="16">Mobile App</text></svg>',
            web: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="%23f0f0f0"><rect width="400" height="300" fill="%23e0e0e0"/><text x="200" y="150" text-anchor="middle" fill="%23666" font-family="Arial" font-size="16">Web Project</text></svg>',
            tool: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="%23f0f0f0"><rect width="400" height="300" fill="%23e0e0e0"/><text x="200" y="150" text-anchor="middle" fill="%23666" font-family="Arial" font-size="16">Tool</text></svg>',
            default: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="%23f0f0f0"><rect width="400" height="300" fill="%23e0e0e0"/><text x="200" y="150" text-anchor="middle" fill="%23666" font-family="Arial" font-size="16">Project</text></svg>'
        };

        return placeholders[category] || placeholders.default;
    }

    getStatusText(status) {
        const statusTexts = {
            active: 'Active',
            archived: 'Archived',
            wip: 'In Progress',
            planned: 'Planned'
        };

        return statusTexts[status] || status;
    }

    getCategoryText(category) {
        const categoryTexts = {
            mobile: 'Mobile App',
            web: 'Web Project',
            tool: 'Tool',
            library: 'Library',
            game: 'Game'
        };

        return categoryTexts[category] || category;
    }

    animateProjects() {
        const projectCards = this.projectsGrid.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Method to filter projects by category
    filterByCategory(category) {
        const filteredProjects = category === 'all' 
            ? this.projects 
            : this.projects.filter(project => project.category === category);

        this.renderFilteredProjects(filteredProjects);
    }

    renderFilteredProjects(projects) {
        if (!this.projectsGrid) return;

        this.projectsGrid.innerHTML = '';

        projects.forEach((project, index) => {
            const projectElement = this.createProjectElement(project, index);
            this.projectsGrid.appendChild(projectElement);
        });

        this.animateProjects();
    }
}

// Initialize projects manager if we're on the projects page
if (typeof window !== 'undefined') {
    window.ProjectsManager = ProjectsManager;
    
    // Auto-initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('projects-grid')) {
            window.projectsManager = new ProjectsManager();
            window.projectsManager.init();
        }
    });
}