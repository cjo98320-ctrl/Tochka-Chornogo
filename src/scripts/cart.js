/**
 * Модуль корзины - управление товарами, localStorage, оформление заказа
 */

// Ключ для localStorage
const CART_STORAGE_KEY = 'tochka_chernogo_cart';
const LOYALTY_STORAGE_KEY = 'tochka_chernogo_loyalty';

// Состояние корзины
let cart = [];
let loyaltyPoints = 0;

/**
 * Инициализация корзины
 */
export function initCart() {
  loadCartFromStorage();
  loadLoyaltyFromStorage();
  updateCartCount();
  setupCartListeners();
  renderLoyaltyProgress();
}

/**
 * Загрузка корзины из localStorage
 */
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    cart = saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Ошибка загрузки корзины:', error);
    cart = [];
  }
}

/**
 * Сохранение корзины в localStorage
 */
function saveCartToStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Ошибка сохранения корзины:', error);
  }
}

/**
 * Загрузка баллов лояльности
 */
function loadLoyaltyFromStorage() {
  try {
    const saved = localStorage.getItem(LOYALTY_STORAGE_KEY);
    loyaltyPoints = saved ? parseInt(saved) : 0;
  } catch (error) {
    console.error('Ошибка загрузки баллов лояльности:', error);
    loyaltyPoints = 0;
  }
}

/**
 * Сохранение баллов лояльности
 */
function saveLoyaltyToStorage() {
  try {
    localStorage.setItem(LOYALTY_STORAGE_KEY, loyaltyPoints.toString());
  } catch (error) {
    console.error('Ошибка сохранения баллов лояльности:', error);
  }
}

/**
 * Добавление товара в корзину
 * @param {number} itemId - ID товара
 */
export function addToCart(itemId) {
  const existingItem = cart.find(item => item.id === itemId);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: itemId,
      quantity: 1
    });
  }
  
  saveCartToStorage();
  updateCartCount();
  showToast('Товар добавлен в корзину', 'success');
  
  // Генерируем событие обновления корзины
  document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
}

/**
 * Удаление товара из корзины
 * @param {number} itemId - ID товара
 */
export function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCartToStorage();
  updateCartCount();
  
  document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
}

/**
 * Изменение количества товара
 * @param {number} itemId - ID товара
 * @param {number} change - Изменение количества (+1 или -1)
 */
export function changeQuantity(itemId, change) {
  const item = cart.find(item => item.id === itemId);
  
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(itemId);
    return;
  }
  
  saveCartToStorage();
  updateCartCount();
  
  document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
}

/**
 * Обновление счетчика корзины в хедере
 */
export function updateCartCount() {
  const countElement = document.querySelector('.cart-count');
  
  if (!countElement) return;
  
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  countElement.textContent = totalCount;
  
  // Анимация при изменении
  countElement.style.transform = 'scale(1.3)';
  setTimeout(() => {
    countElement.style.transform = 'scale(1)';
  }, 200);
}

/**
 * Получение общей суммы корзины
 * @param {Array} menuItems - Массив товаров меню
 * @returns {number} Общая сумма
 */
export function getCartTotal(menuItems) {
  return cart.reduce((total, cartItem) => {
    const menuItem = menuItems.find(item => item.id === cartItem.id);
    return total + (menuItem ? menuItem.price * cartItem.quantity : 0);
  }, 0);
}

/**
 * Оформление заказа
 * @param {Object} orderData - Данные заказа
 * @returns {Promise<boolean>} Успешность оформления
 */
export async function checkout(orderData) {
  if (cart.length === 0) {
    showToast('Корзина пуста', 'error');
    return false;
  }
  
  // Имитация отправки заказа
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Начисляем баллы лояльности (1 балл за каждые 100₽)
  const total = getCartTotalFromCart();
  const pointsEarned = Math.floor(total / 100);
  loyaltyPoints += pointsEarned;
  saveLoyaltyToStorage();
  
  // Очищаем корзину
  cart = [];
  saveCartToStorage();
  updateCartCount();
  
  // Показываем уведомление
  showToast(`Заказ оформлен! Вы получили ${pointsEarned} бонусных баллов`, 'success');
  
  // Генерируем событие успешного заказа
  document.dispatchEvent(new CustomEvent('orderSuccess', { 
    detail: { orderData, pointsEarned } 
  }));
  
  renderLoyaltyProgress();
  
  return true;
}

/**
 * Получение общей суммы из текущей корзины (без menuItems)
 */
function getCartTotalFromCart() {
  // Для упрощения считаем среднюю цену 250₽
  return cart.reduce((sum, item) => sum + 250 * item.quantity, 0);
}

/**
 * Рендеринг прогресса лояльности
 */
export function renderLoyaltyProgress() {
  const progressBar = document.querySelector('.loyalty-bar');
  const currentPointsEl = document.querySelector('.loyalty-current');
  const targetPointsEl = document.querySelector('.loyalty-target');
  const starsContainer = document.querySelector('.loyalty-stars');
  
  if (!progressBar) return;
  
  const pointsForFreeCoffee = 6; // 6 покупок = 1 бесплатный кофе
  const progress = Math.min((loyaltyPoints % pointsForFreeCoffee) / pointsForFreeCoffee * 100, 100);
  const currentStars = Math.floor(loyaltyPoints / pointsForFreeCoffee);
  const nextStarProgress = loyaltyPoints % pointsForFreeCoffee;
  
  progressBar.style.width = `${progress}%`;
  
  if (currentPointsEl) currentPointsEl.textContent = nextStarProgress;
  if (targetPointsEl) targetPointsEl.textContent = pointsForFreeCoffee;
  
  // Рендеринг звезд
  if (starsContainer) {
    starsContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.className = `star ${i < currentStars ? 'active' : ''}`;
      star.textContent = '★';
      starsContainer.appendChild(star);
    }
  }
}

/**
 * Настройка слушателей событий корзины
 */
function setupCartListeners() {
  // Слушаем события добавления в корзину
  document.addEventListener('addToCart', (e) => {
    addToCart(e.detail.itemId);
  });
  
  // Открытие модального окна корзины
  const cartButtons = document.querySelectorAll('[data-cart-open]');
  cartButtons.forEach(button => {
    button.addEventListener('click', openCartModal);
  });
  
  // Закрытие модального окна
  const closeButtons = document.querySelectorAll('[data-cart-close]');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeCartModal);
  });
  
  // Закрытие по клику на overlay
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeCartModal();
      }
    });
  }
  
  // Обработка формы оформления заказа
  const checkoutForm = document.querySelector('.checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }
}

/**
 * Открытие модального окна корзины
 */
export function openCartModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;
  
  renderCartItems();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Закрытие модального окна корзины
 */
export function closeCartModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;
  
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * Рендеринг элементов корзины в модалке
 */
function renderCartItems() {
  const container = document.querySelector('.cart-items');
  const emptyMessage = document.querySelector('.cart-empty');
  const totalContainer = document.querySelector('.cart-total');
  const checkoutBtn = document.querySelector('.checkout-btn');
  
  if (!container) return;
  
  if (cart.length === 0) {
    if (emptyMessage) emptyMessage.style.display = 'block';
    if (totalContainer) totalContainer.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  
  if (emptyMessage) emptyMessage.style.display = 'none';
  if (totalContainer) totalContainer.style.display = 'flex';
  if (checkoutBtn) checkoutBtn.disabled = false;
  
  container.innerHTML = '';
  
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">Товар #${item.id}</div>
        <div class="cart-item-price">${250 * item.quantity}₽</div>
      </div>
      <div class="cart-item-controls">
        <div class="cart-item-quantity">
          <button class="quantity-btn" data-quantity-dec="${item.id}">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn" data-quantity-inc="${item.id}">+</button>
        </div>
        <button class="remove-item-btn" data-remove="${item.id}">🗑️</button>
      </div>
    `;
    
    container.appendChild(cartItem);
  });
  
  // Навешиваем обработчики
  attachCartItemHandlers();
  updateCartTotal();
}

/**
 * Обработчики элементов корзины
 */
function attachCartItemHandlers() {
  // Увеличение количества
  document.querySelectorAll('[data-quantity-inc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = parseInt(btn.dataset.quantityInc);
      changeQuantity(itemId, 1);
      renderCartItems();
    });
  });
  
  // Уменьшение количества
  document.querySelectorAll('[data-quantity-dec]').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = parseInt(btn.dataset.quantityDec);
      changeQuantity(itemId, -1);
      renderCartItems();
    });
  });
  
  // Удаление товара
  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = parseInt(btn.dataset.remove);
      removeFromCart(itemId);
      renderCartItems();
    });
  });
}

/**
 * Обновление итоговой суммы
 */
function updateCartTotal() {
  const totalEl = document.querySelector('.cart-total-amount');
  if (!totalEl) return;
  
  const total = cart.reduce((sum, item) => sum + 250 * item.quantity, 0);
  totalEl.textContent = `${total}₽`;
}

/**
 * Обработка отправки формы заказа
 */
async function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const orderData = Object.fromEntries(formData.entries());
  
  const success = await checkout(orderData);
  
  if (success) {
    closeCartModal();
    e.target.reset();
  }
}

/**
 * Показ уведомления (toast)
 * @param {string} message - Сообщение
 * @param {string} type - Тип (success/error)
 */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Анимация появления
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Автоматическое удаление
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Получение состояния корзины
 * @returns {Object} Текущее состояние
 */
export function getCartState() {
  return {
    cart,
    loyaltyPoints,
    totalItems: cart.reduce((sum, item) => sum + item.quantity, 0)
  };
}
