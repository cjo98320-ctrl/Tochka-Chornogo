/**
 * Router для SPA приложения "Точка Черного"
 * Реализует навигацию между страницами с анимированными переходами
 */

import { renderHome } from '../pages/home.js';
import { renderMenu } from '../pages/menu.js';
import { renderAbout } from '../pages/about.js';
import { renderContacts } from '../pages/contacts.js';
import { initSingularityTransition } from './transitions.js';

const routes = {
    '/': renderHome,
    '/menu': renderMenu,
    '/about': renderAbout,
    '/contacts': renderContacts
};

let currentPage = '/';

export function initRouter() {
    handleLocation();
    
    window.addEventListener('popstate', handleLocation);
    
    document.addEventListener('click', handleLinks);
}

async function handleLocation() {
    const path = window.location.pathname;
    const route = routes[path] || routes['/'];
    
    if (path !== currentPage) {
        await navigateTo(route, path);
        currentPage = path;
    }
}

async function navigateTo(renderFunction, path) {
    const appRoot = document.getElementById('app-root');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });
    
    await initSingularityTransition();
    
    appRoot.innerHTML = '';
    
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    renderFunction(appRoot);
    
    setTimeout(() => {
        const singularityPoint = document.querySelector('.singularity-point');
        if (singularityPoint) {
            singularityPoint.style.transition = 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.8s ease';
            singularityPoint.style.transform = 'scale(0)';
            singularityPoint.style.opacity = '0';
        }
    }, 100);
}

function handleLinks(e) {
    const link = e.target.closest('a[data-link]');
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        
        if (href !== window.location.pathname) {
            history.pushState(null, '', href);
            handleLocation();
        }
    }
}

export function navigate(path) {
    if (path !== window.location.pathname) {
        history.pushState(null, '', path);
        handleLocation();
    }
}
