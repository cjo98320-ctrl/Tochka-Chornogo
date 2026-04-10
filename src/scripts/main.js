/**
 * Главный файл инициализации приложения
 * Точка входа для всех модулей
 */

import { initMenu } from './menu.js';
import { initCart, openCartModal } from './cart.js';
import { CoffeeQuiz } from './quiz.js';
import { 
  initScrollAnimations, 
  initHeaderScroll, 
  initMobileMenu, 
  initSmoothScroll,
  initAllMagneticButtons 
} from './utils.js';
import { initBackground } from './background.js';
import { initAnimations } from './animations.js';

/**
 * Инициализация приложения после загрузки DOM
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('☕ Точка Черного - приложение запущено');
  
  // Инициализация WebGL фона (шейдер дыма)
  initBackground();
  
  // Инициализация GSAP анимаций
  initAnimations();
  
  // Инициализация всех модулей
  initMenu();
  initCart();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initAllMagneticButtons();
  
  // Инициализация кофейного квиза
  new CoffeeQuiz();
  
  // Дополнительные улучшения
  setupAccessibility();
  preloadImages();
});

/**
 * Настройка доступности (a11y)
 */
function setupAccessibility() {
  // Управление фокусом для модальных окон
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal-overlay.active');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // Добавление aria-label для кнопок без текста
  document.querySelectorAll('button:not([aria-label])').forEach(button => {
    if (!button.textContent.trim() && button.children.length > 0) {
      button.setAttribute('aria-label', 'Действие');
    }
  });
}

/**
 * Предзагрузка критических изображений
 */
function preloadImages() {
  const imagesToPreload = [
    // Можно добавить URL критических изображений
  ];

  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

/**
 * Обработка ошибок в приложении
 */
window.addEventListener('error', (event) => {
  console.error('Глобальная ошибка:', event.message);
  // В продакшене можно отправлять логи на сервер
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Необработанное Promise отклонение:', event.reason);
});

// Экспорт для отладки в консоли
window.app = {
  initMenu,
  initCart,
  openCartModal
};
