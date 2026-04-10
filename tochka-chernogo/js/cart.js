/**
 * Cart module - Handles shopping cart functionality
 */

import { formatPrice } from './utils.js';

// Cart state
let cart = [];
const CART_STORAGE_KEY = 'tochka_chernogo_cart';
const LOYALTY_STORAGE_KEY = 'tochka_chernogo_loyalty';

/**
 * Load cart from localStorage
 */
function loadCart() {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        cart = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}

/**
 * Load loyalty points from localStorage
 */
function loadLoyalty() {
    try {
        const savedLoyalty = localStorage.getItem(LOYALTY_STORAGE_KEY);
        return savedLoyalty ? JSON.parse(savedLoyalty) : { points: 0, visits: 0 };
    } catch (error) {
        console.error('Error loading loyalty:', error);
        return { points: 0, visits: 0 };
    }
}

/**
 * Save loyalty points to localStorage
 */
function saveLoyalty(loyalty) {
    localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(loyalty));
}

/**
 * Add item to cart
 * @param {Object} item - Item to add
 */
export function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(`"${item.title}" добавлен в корзину`);
    updateCartDisplay();
}

/**
 * Remove item from cart
 * @param {number} itemId - Item ID to remove
 */
export function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
}

/**
 * Update item quantity in cart
 * @param {number} itemId - Item ID
 * @param {number} quantity - New quantity
 */
export function updateQuantity(itemId, quantity) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartDisplay();
        }
    }
}

/**
 * Clear entire cart
 */
export function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
}

/**
 * Get cart total
 * @returns {number} Total price
 */
export function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Get cart items count
 * @returns {number} Total items count
 */
export function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Update cart count display
 */
function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        const count = getCartCount();
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }
}

/**
 * Update cart display (modal)
 */
export function updateCartDisplay() {
    updateCartCount();
    
    const cartItemsEl = document.querySelector('.cart-items');
    const cartTotalEl = document.querySelector('.cart-total');
    const cartEmptyEl = document.querySelector('.cart-empty');
    const cartContentEl = document.querySelector('.cart-content');
    
    if (!cartItemsEl) return;
    
    if (cart.length === 0) {
        if (cartEmptyEl) cartEmptyEl.style.display = 'block';
        if (cartContentEl) cartContentEl.style.display = 'none';
        cartItemsEl.innerHTML = '';
        if (cartTotalEl) cartTotalEl.textContent = '0₽';
    } else {
        if (cartEmptyEl) cartEmptyEl.style.display = 'none';
        if (cartContentEl) cartContentEl.style.display = 'block';
        
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <span class="cart-item-icon">${item.icon}</span>
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>${formatPrice(item.price)}</p>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="qty-btn minus" data-id="${item.id}">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">🗑️</button>
                </div>
            </div>
        `).join('');
        
        if (cartTotalEl) {
            cartTotalEl.textContent = formatPrice(getCartTotal());
        }
        
        // Add event listeners for quantity controls
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                const item = cart.find(i => i.id === itemId);
                if (item) updateQuantity(itemId, item.quantity - 1);
            });
        });
        
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                const item = cart.find(i => i.id === itemId);
                if (item) updateQuantity(itemId, item.quantity + 1);
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                removeFromCart(itemId);
            });
        });
    }
}

/**
 * Show notification
 * @param {string} message - Notification message
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

/**
 * Initialize cart functionality
 */
export function initCart() {
    loadCart();
    updateCartCount();
    
    // Cart button
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartClose = document.querySelector('.cart-close');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            updateCartDisplay();
            cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (cartClose && cartModal) {
        cartClose.addEventListener('click', () => {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Корзина пуста');
                return;
            }
            openCheckoutModal();
        });
    }
    
    // Clear cart button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите очистить корзину?')) {
                clearCart();
                showNotification('Корзина очищена');
            }
        });
    }
    
    // Add to cart buttons (delegated event)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const itemId = parseInt(e.target.dataset.id);
            
            // Fetch menu data to find the item
            import('./menu.js').then(({ fetchMenuData }) => {
                fetchMenuData().then(menuItems => {
                    const item = menuItems.find(i => i.id === itemId);
                    if (item) {
                        addToCart(item);
                    }
                });
            });
        }
    });
    
    // Update loyalty display
    updateLoyaltyDisplay();
}

/**
 * Update loyalty display
 */
function updateLoyaltyDisplay() {
    const loyalty = loadLoyalty();
    const loyaltyPointsEl = document.querySelector('.loyalty-points');
    const loyaltyVisitsEl = document.querySelector('.loyalty-visits');
    const nextRewardEl = document.querySelector('.next-reward');
    
    if (loyaltyPointsEl) {
        loyaltyPointsEl.textContent = loyalty.points;
    }
    if (loyaltyVisitsEl) {
        loyaltyVisitsEl.textContent = loyalty.visits;
    }
    if (nextRewardEl) {
        const pointsToNext = 10 - (loyalty.points % 10);
        nextRewardEl.textContent = pointsToNext < 10 ? `${pointsToNext} до бесплатного кофе` : 'Доступен бесплатный кофе!';
    }
}

/**
 * Add loyalty points
 * @param {number} points - Points to add
 */
export function addLoyaltyPoints(points) {
    const loyalty = loadLoyalty();
    loyalty.points += points;
    loyalty.visits += 1;
    saveLoyalty(loyalty);
    updateLoyaltyDisplay();
}

/**
 * Open checkout modal
 */
function openCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Process checkout
 * @param {Object} orderData - Order data
 */
export async function processCheckout(orderData) {
    const total = getCartTotal();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add loyalty points (1 point per 100 rubles)
    const pointsEarned = Math.floor(total / 100);
    addLoyaltyPoints(pointsEarned);
    
    // Clear cart
    clearCart();
    
    // Close modal
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Show success message
    showNotification(`Заказ оформлен! Вы получили ${pointsEarned} бонусов.`);
    
    return true;
}

/**
 * Initialize checkout form
 */
export function initCheckout() {
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutClose = document.querySelector('.checkout-close');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(checkoutForm);
            const orderData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                pickupTime: formData.get('pickup-time'),
                items: [...cart],
                total: getCartTotal()
            };
            
            // Validate
            if (!orderData.name || !orderData.phone) {
                alert('Пожалуйста, заполните имя и телефон');
                return;
            }
            
            // Process order
            const success = await processCheckout(orderData);
            
            if (success) {
                checkoutForm.reset();
            }
        });
    }
    
    if (checkoutClose && checkoutModal) {
        checkoutClose.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                checkoutModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}
