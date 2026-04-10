/**
 * Страница "О нас"
 */

export function renderAbout(container) {
    container.innerHTML = `
        <section class="page-header-section">
            <div class="container">
                <h1 class="page-title split-type">Наша История</h1>
                <p class="page-subtitle">Философия Точки Черного</p>
            </div>
        </section>

        <section class="about-story-section">
            <div class="container">
                <div class="about-grid">
                    <div class="about-content">
                        <h2 class="about-heading">Кофе как искусство</h2>
                        <p class="about-text">
                            Мы верим, что кофе — это не просто напиток, а целый ритуал. 
                            Каждое зерно проходит тщательный отбор, каждая чашка готовится 
                            с любовью и вниманием к деталям.
                        </p>
                        <p class="about-text">
                            Наши бариста — настоящие художники, которые превращают процесс 
                            приготовления кофе в перформанс. Мы используем только 100% арабику 
                            из лучших регионов мира: Эфиопии, Колумбии, Бразилии и Кении.
                        </p>
                        
                        <div class="stats-grid">
                            <div class="stat-item glass-card">
                                <span class="stat-number">12+</span>
                                <span class="stat-label">Сортов зерна</span>
                            </div>
                            <div class="stat-item glass-card">
                                <span class="stat-number">5000+</span>
                                <span class="stat-label">Чашек в месяц</span>
                            </div>
                            <div class="stat-item glass-card">
                                <span class="stat-number">100%</span>
                                <span class="stat-label">Арабика</span>
                            </div>
                            <div class="stat-item glass-card">
                                <span class="stat-number">6</span>
                                <span class="stat-label">Лет опыта</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="about-visual">
                        <div class="visual-card glass-card">
                            <div class="visual-icon">☕</div>
                            <div class="visual-text">Атмосфера</div>
                        </div>
                        <div class="visual-card glass-card delay">
                            <div class="visual-icon">🌿</div>
                            <div class="visual-text">Экологичность</div>
                        </div>
                        <div class="visual-card glass-card delay-2">
                            <div class="visual-icon">❤️</div>
                            <div class="visual-text">Забота</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="team-section">
            <div class="container">
                <h2 class="section-title">Наша Команда</h2>
                <div class="team-grid">
                    <div class="team-card glass-card">
                        <div class="team-avatar">👨‍🍳</div>
                        <h3>Алексей</h3>
                        <p class="team-role">Старший бариста</p>
                        <p class="team-desc">Готовит ваш любимый раф с лавандой</p>
                    </div>
                    <div class="team-card glass-card">
                        <div class="team-avatar">👩‍🍳</div>
                        <h3>Мария</h3>
                        <p class="team-role">Бариста-художник</p>
                        <p class="team-desc">Мастер латте-арта</p>
                    </div>
                    <div class="team-card glass-card">
                        <div class="team-avatar">👨‍🔬</div>
                        <h3>Дмитрий</h3>
                        <p class="team-role">Обжарщик</p>
                        <p class="team-desc">Контролирует профиль каждой партии</p>
                    </div>
                </div>
            </div>
        </section>
    `;

    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.from('.page-title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
            gsap.from('.page-subtitle', { y: 30, opacity: 0, duration: 1, delay: 0.2 });
            
            gsap.from('.about-content > *', {
                scrollTrigger: { trigger: '.about-content', start: 'top 80%' },
                y: 40, opacity: 0, stagger: 0.15, duration: 0.8
            });
            
            gsap.from('.visual-card', {
                scrollTrigger: { trigger: '.about-visual', start: 'top 85%' },
                scale: 0.8, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'back.out(1.2)'
            });
            
            gsap.from('.team-card', {
                scrollTrigger: { trigger: '.team-grid', start: 'top 80%' },
                y: 60, opacity: 0, stagger: 0.15, duration: 0.8
            });
        }
    }, 100);
}
