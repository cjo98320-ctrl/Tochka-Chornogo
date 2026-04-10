/**
 * Модуль меню - отвечает за рендеринг и фильтрацию товаров
 */

import { fetchMenuData, filterByCategory } from './api.js';

// Состояние меню
let menuItems = [];
let currentCategory = 'all';

/**
 * Инициализация меню
 */
export async function initMenu() {
  const menuGrid = document.querySelector('.menu-grid');
  
  if (!menuGrid) return;

  // Показываем скелетные загрузчики
  showSkeletonLoaders(menuGrid);

  // Загружаем данные
  try {
    menuItems = await fetchMenuData();
    renderMenu(menuItems);
    setupTabListeners();
  } catch (error) {
    console.error('Ошибка инициализации меню:', error);
    menuGrid.innerHTML = '<p class="section-subtitle">Ошибка загрузки меню. Попробуйте позже.</p>';
  }
}

/**
 * Отображение скелетных загрузчиков
 */
function showSkeletonLoaders(container) {
  container.innerHTML = '';
  
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'menu-item skeleton-card';
    skeleton.style.opacity = '1';
    skeleton.style.transform = 'translateY(0)';
    
    skeleton.innerHTML = `
      <div class="skeleton" style="height: 48px; border-radius: 50%; margin-bottom: 16px;"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width: 70%;"></div>
      <div class="skeleton" style="height: 44px; margin-top: 20px;"></div>
    `;
    
    container.appendChild(skeleton);
  }
}

/**
 * Рендеринг меню
 * @param {Array} items - Массив товаров для отображения
 */
export function renderMenu(items = menuItems) {
  const menuGrid = document.querySelector('.menu-grid');
  
  if (!menuGrid || !items.length) return;

  menuGrid.innerHTML = '';

  items.forEach((item, index) => {
    const card = createMenuCard(item);
    card.style.transitionDelay = `${index * 50}ms`;
    menuGrid.appendChild(card);

    // Добавляем класс видимости для анимации появления
    setTimeout(() => {
      card.classList.add('is-visible');
    }, 100 + index * 50);
  });

  // Навешиваем обработчики на кнопки "В корзину"
  attachAddToCartHandlers();
}

/**
 * Создание карточки товара
 * @param {Object} item - Данные товара
 * @returns {HTMLElement} Карточка товара
 */
function createMenuCard(item) {
  const card = document.createElement('div');
  card.className = 'menu-item';
  card.dataset.category = item.category;
  card.dataset.id = item.id;

  card.innerHTML = `
    <span class="menu-item-icon">${item.icon}</span>
    <div class="menu-item-header">
      <h3 class="menu-item-title">${item.name}</h3>
      <span class="menu-item-price">${formatPrice(item.price)}</span>
    </div>
    <p class="menu-item-description">${item.description}</p>
    <button class="add-to-cart-btn" data-id="${item.id}">
      В корзину
    </button>
  `;

  return card;
}

/**
 * Форматирование цены
 * @param {number} price - Цена
 * @returns {string} Отформатированная цена
 */
function formatPrice(price) {
  return `${price}₽`;
}

/**
 * Настройка слушателей табов категорий
 */
function setupTabListeners() {
  const tabs = document.querySelectorAll('.menu-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      
      // Обновляем активный таб
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Фильтруем и перерисовываем меню
      filterAndRender(category);
    });
  });
}

/**
 * Фильтрация и перерисовка меню
 * @param {string} category - Категория для фильтрации
 */
function filterAndRender(category) {
  currentCategory = category;
  const filteredItems = filterByCategory(menuItems, category);
  
  const menuGrid = document.querySelector('.menu-grid');
  
  if (!menuGrid) return;

  // Анимация скрытия текущих элементов
  const existingCards = menuGrid.querySelectorAll('.menu-item');
  existingCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
  });

  // После завершения анимации скрываем и рендерим новые
  setTimeout(() => {
    renderMenu(filteredItems);
  }, 300);
}

/**
 * Навешивание обработчиков на кнопки "В корзину"
 */
function attachAddToCartHandlers() {
  const buttons = document.querySelectorAll('.add-to-cart-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = parseInt(e.target.dataset.id);
      
      // Генерируем событие добавления в корзину
      const event = new CustomEvent('addToCart', {
        detail: { itemId }
      });
      document.dispatchEvent(event);
      
      // Анимация кнопки
      e.target.classList.add('cart-added');
      setTimeout(() => {
        e.target.classList.remove('cart-added');
      }, 300);
    });
  });
}

/**
 * Получение текущего состояния меню
 * @returns {Object} Текущее состояние
 */
export function getMenuState() {
  return {
    items: menuItems,
    currentCategory
  };
}

/**
 * Перезагрузка меню (например, после обновления данных)
 */
export async function refreshMenu() {
  menuItems = await fetchMenuData();
  filterAndRender(currentCategory);
}
