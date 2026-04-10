/**
 * Menu module - Handles menu rendering and filtering
 */

import { formatPrice } from './utils.js';

/**
 * Create HTML for a single menu item
 * @param {Object} item - Menu item data
 * @returns {string} HTML string for the menu item
 */
export function createMenuItemHTML(item) {
    return `
        <div class="menu-item scroll-element" data-category="${item.category}">
            <span class="menu-item-icon">${item.icon}</span>
            <div class="menu-item-header">
                <h3>${item.title}</h3>
                <span class="price">${formatPrice(item.price)}</span>
            </div>
            <p>${item.description}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">В корзину</button>
        </div>
    `;
}

/**
 * Render menu items to the grid
 * @param {Array} items - Array of menu items
 * @param {HTMLElement} container - Container element to render into
 */
export function renderMenu(items, container) {
    if (!container) {
        console.error('Menu container not found');
        return;
    }
    
    container.innerHTML = items.map(item => createMenuItemHTML(item)).join('');
}

/**
 * Filter menu items by category
 * @param {Array} items - Array of all menu items
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered array of menu items
 */
export function filterByCategory(items, category) {
    if (category === 'all') {
        return items;
    }
    return items.filter(item => item.category === category);
}

/**
 * Initialize menu tabs functionality
 * @param {Array} menuItems - Array of all menu items
 * @param {HTMLElement} menuGrid - Menu grid container
 */
export function initMenuTabs(menuItems, menuGrid) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            const filteredItems = filterByCategory(menuItems, category);
            
            // Re-render with filtered items
            renderMenu(filteredItems, menuGrid);
            
            // Re-initialize scroll observer for new elements
            initScrollObserver();
        });
    });
}

/**
 * Initialize Intersection Observer for scroll animations
 */
export function initScrollObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Observe menu items and about sections
    document.querySelectorAll('.menu-item, .about-text, .about-image').forEach(el => {
        el.classList.add('scroll-element');
        observer.observe(el);
    });
}

/**
 * Fetch menu data from JSON file
 * @returns {Promise<Array>} Promise resolving to menu items array
 */
export async function fetchMenuData() {
    try {
        const response = await fetch('data/menu.json');
        if (!response.ok) {
            throw new Error('Failed to fetch menu data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading menu:', error);
        return [];
    }
}
