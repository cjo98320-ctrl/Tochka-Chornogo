/**
 * Страница "Меню"
 */

export function renderMenu(container) {
    container.innerHTML = `
        <section class="page-header-section">
            <div class="container">
                <h1 class="page-title split-type">Наше Меню</h1>
                <p class="page-subtitle">Выберите свой идеальный напиток</p>
            </div>
        </section>

        <section class="menu-full-section">
            <div class="container">
                <div class="menu-filters">
                    <button class="menu-filter-btn active" data-category="all">Все</button>
                    <button class="menu-filter-btn" data-category="classic">Классика</button>
                    <button class="menu-filter-btn" data-category="authors">Авторские</button>
                    <button class="menu-filter-btn" data-category="desserts">Десерты</button>
                </div>
                
                <div class="menu-grid" id="full-menu-grid">
                    <div class="loading-skeleton">
                        <div class="skeleton-card"></div>
                        <div class="skeleton-card"></div>
                        <div class="skeleton-card"></div>
                        <div class="skeleton-card"></div>
                    </div>
                </div>
            </div>
        </section>
    `;

    setTimeout(() => {
        initMenuFilters();
        loadFullMenu('all');
        
        if (typeof gsap !== 'undefined') {
            gsap.from('.page-title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
            gsap.from('.page-subtitle', { y: 30, opacity: 0, duration: 1, delay: 0.2 });
            gsap.from('.menu-filters', { y: 20, opacity: 0, duration: 0.8, delay: 0.4 });
        }
    }, 100);
}

async function loadFullMenu(category) {
    const grid = document.getElementById('full-menu-grid');
    if (!grid) return;

    try {
        const response = await fetch('./data/menu.json');
        let items = await response.json();
        
        if (category !== 'all') {
            items = items.filter(item => item.category === category);
        }

        if (items.length === 0) {
            grid.innerHTML = '<p class="no-items">В этой категории пока пусто ☕</p>';
            return;
        }

        grid.innerHTML = items.map((item, index) => `
            <div class="menu-item-card glass-card" style="opacity: 0; transform: translateY(30px)">
                <div class="item-icon">${item.icon || '☕'}</div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="item-desc">${item.description || item.desc || ''}</p>
                    <div class="item-footer">
                        <span class="item-price">${item.price} ₽</span>
                        <button class="add-to-cart-btn" data-id="${item.id}">В корзину</button>
                    </div>
                </div>
            </div>
        `).join('');

        if (typeof gsap !== 'undefined') {
            gsap.to('.menu-item-card', {
                opacity: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.6,
                ease: 'back.out(1.2)'
            });
        }

        attachCartListeners();
    } catch (e) {
        grid.innerHTML = '<p>Ошибка загрузки меню</p>';
    }
}

function initMenuFilters() {
    const buttons = document.querySelectorAll('.menu-filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            loadFullMenu(category);
        });
    });
}

function attachCartListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        });
    });
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = { id, quantity: 1 };
    
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Товар добавлен в корзину');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = count;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}
