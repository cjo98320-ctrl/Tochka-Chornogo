/**
 * Страница "Контакты"
 */

export function renderContacts(container) {
    container.innerHTML = `
        <section class="page-header-section">
            <div class="container">
                <h1 class="page-title split-type">Контакты</h1>
                <p class="page-subtitle">Ждем вас в гости</p>
            </div>
        </section>

        <section class="contacts-section">
            <div class="container">
                <div class="contacts-grid">
                    <div class="contact-info">
                        <div class="contact-card glass-card">
                            <div class="contact-icon">📍</div>
                            <div class="contact-details">
                                <h3>Адрес</h3>
                                <p>ул. Кофейная, 12<br>Москва, Россия</p>
                            </div>
                        </div>
                        
                        <div class="contact-card glass-card">
                            <div class="contact-icon">⏰</div>
                            <div class="contact-details">
                                <h3>Время работы</h3>
                                <p>Пн-Пт: 08:00 - 22:00<br>Сб-Вс: 10:00 - 23:00</p>
                            </div>
                        </div>
                        
                        <div class="contact-card glass-card">
                            <div class="contact-icon">📞</div>
                            <div class="contact-details">
                                <h3>Телефон</h3>
                                <p>+7 (999) 000-00-00</p>
                                <p>hello@tochka.black</p>
                            </div>
                        </div>
                        
                        <div class="social-links-large">
                            <a href="#" class="social-link glass-card">Instagram</a>
                            <a href="#" class="social-link glass-card">Telegram</a>
                            <a href="#" class="social-link glass-card">VK</a>
                        </div>
                    </div>
                    
                    <div class="contact-map">
                        <div class="map-container glass-card">
                            <div class="map-placeholder">
                                <span class="map-icon">🗺️</span>
                                <span class="map-text">Интерактивная карта</span>
                                <p class="map-hint">Мы находимся в центре города</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="form-section">
            <div class="container">
                <div class="form-container glass-card">
                    <h2 class="form-title">Напишите нам</h2>
                    <form class="contact-form" id="contact-form">
                        <div class="form-group">
                            <input type="text" placeholder="Ваше имя" required class="form-input">
                        </div>
                        <div class="form-group">
                            <input type="email" placeholder="Email" required class="form-input">
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Сообщение" rows="4" required class="form-input"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Отправить</button>
                    </form>
                </div>
            </div>
        </section>
    `;

    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.from('.page-title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
            gsap.from('.page-subtitle', { y: 30, opacity: 0, duration: 1, delay: 0.2 });
            
            gsap.from('.contact-card', {
                scrollTrigger: { trigger: '.contact-info', start: 'top 80%' },
                x: -40, opacity: 0, stagger: 0.15, duration: 0.8
            });
            
            gsap.from('.contact-map', {
                scrollTrigger: { trigger: '.contacts-grid', start: 'top 80%' },
                x: 40, opacity: 0, duration: 0.8, delay: 0.3
            });
            
            gsap.from('.form-container', {
                scrollTrigger: { trigger: '.form-section', start: 'top 85%' },
                y: 40, opacity: 0, duration: 0.8
            });
        }
        
        initFormHandler();
    }, 100);
}

function initFormHandler() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Отправлено! ✓';
        btn.disabled = true;
        
        setTimeout(() => {
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    });
}
