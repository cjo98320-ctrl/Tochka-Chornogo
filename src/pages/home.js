/**
 * Страница "Главная"
 */

export function renderHome(container) {
    container.innerHTML = `
        <section class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title split-type">Кофе как искусство<br><span class="gold-text">в каждой капле</span></h1>
                <p class="hero-subtitle">Погрузитесь в мир премиального кофе и уникальной атмосферы</p>
                <div class="hero-buttons">
                    <a href="/menu" class="btn btn-primary magnetic-btn" data-link>Смотреть меню</a>
                    <a href="/about" class="btn btn-secondary magnetic-btn" data-link>Наша история</a>
                </div>
            </div>
            <div class="singularity-container">
                <div class="singularity-point"></div>
            </div>
        </section>

        <section class="features-section">
            <div class="container">
                <div class="features-grid">
                    <div class="feature-card glass-card">
                        <div class="feature-icon">☕</div>
                        <h3>100% Арабика</h3>
                        <p>Только лучшие зерна из Эфиопии, Колумбии и Бразилии</p>
                    </div>
                    <div class="feature-card glass-card">
                        <div class="feature-icon">🎨</div>
                        <h3>Авторский подход</h3>
                        <p>Уникальные рецепты от наших бариста-художников</p>
                    </div>
                    <div class="feature-card glass-card">
                        <div class="feature-icon">⭐</div>
                        <h3>Система лояльности</h3>
                        <p>Каждая 6-я чашка кофе в подарок</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="preview-menu-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Популярное</h2>
                    <a href="/menu" class="view-all-link" data-link>Все меню →</a>
                </div>
                <div class="preview-grid" id="preview-menu-grid">
                </div>
            </div>
        </section>
    `;

    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.from('.hero-title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
            gsap.from('.hero-subtitle', { y: 30, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
            gsap.from('.hero-buttons .btn', { y: 20, opacity: 0, stagger: 0.15, duration: 0.8, delay: 0.4 });
            
            gsap.from('.feature-card', {
                scrollTrigger: { trigger: '.features-grid', start: 'top 80%' },
                y: 60, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'back.out(1.2)'
            });
        }
        
        loadPreviewMenu();
    }, 100);
}

async function loadPreviewMenu() {
    const grid = document.getElementById('preview-menu-grid');
    if (!grid) return;
    
    try {
        const response = await fetch('./data/menu.json');
        const items = await response.json();
        const previewItems = items.slice(0, 3);
        
        grid.innerHTML = previewItems.map(item => `
            <div class="menu-item-card glass-card">
                <div class="item-icon">${item.icon || '☕'}</div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="item-desc">${item.description || item.desc || ''}</p>
                    <span class="item-price">${item.price} ₽</span>
                </div>
            </div>
        `).join('');
        
        gsap.from('.menu-item-card', {
            scrollTrigger: { trigger: '.preview-grid', start: 'top 85%' },
            y: 40, opacity: 0, stagger: 0.15, duration: 0.7
        });
    } catch (e) {
        grid.innerHTML = '<p>Загрузка меню...</p>';
    }
}
