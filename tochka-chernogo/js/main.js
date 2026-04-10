/**
 * Main application entry point
 */

import { initMenuTabs, fetchMenuData, initScrollObserver } from './menu.js';
import { initCart, initCheckout } from './cart.js';
import { smoothScrollTo, debounce } from './utils.js';

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav a');

    if (mobileMenuBtn && navUl) {
        mobileMenuBtn.addEventListener('click', () => {
            navUl.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId);
        });
    });
}

/**
 * Initialize header scroll effect
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        const handleScroll = debounce(() => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
    }
}

/**
 * Initialize menu with data from JSON
 */
async function initMenu() {
    const menuGrid = document.querySelector('.menu-grid');
    
    if (!menuGrid) {
        console.error('Menu grid not found');
        return;
    }
    
    // Fetch menu data and render
    const menuItems = await fetchMenuData();
    
    if (menuItems.length > 0) {
        // Render initial menu (classic category by default)
        const classicItems = menuItems.filter(item => item.category === 'classic');
        
        // We need to import renderMenu - let's do it inline for now
        import('./menu.js').then(({ renderMenu }) => {
            renderMenu(classicItems, menuGrid);
            initMenuTabs(menuItems, menuGrid);
        });
    }
}

/**
 * Initialize loyalty progress bar
 */
function initLoyaltyProgress() {
    const LOYALTY_STORAGE_KEY = 'tochka_chernogo_loyalty';
    
    try {
        const savedLoyalty = localStorage.getItem(LOYALTY_STORAGE_KEY);
        const loyalty = savedLoyalty ? JSON.parse(savedLoyalty) : { points: 0, visits: 0 };
        
        const progressFill = document.getElementById('loyalty-progress');
        const nextReward = document.getElementById('next-reward');
        
        if (progressFill) {
            const progress = (loyalty.points % 10) * 10;
            progressFill.style.width = `${progress}%`;
        }
        
        if (nextReward) {
            const pointsToNext = 10 - (loyalty.points % 10);
            nextReward.textContent = pointsToNext < 10 ? `${pointsToNext} до бесплатного кофе` : 'Доступен бесплатный кофе!';
        }
    } catch (error) {
        console.error('Error loading loyalty:', error);
    }
}

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initMenu();
    initScrollObserver();
    initCart();
    initCheckout();
    initLoyaltyProgress();
});
