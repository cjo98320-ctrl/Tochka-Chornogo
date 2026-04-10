/**
 * Модуль утилит - вспомогательные функции
 */

/**
 * Динамическое вычисление высоты хедера для скролла
 * @returns {number} Высота хедера в пикселях
 */
export function getHeaderOffset() {
  const header = document.querySelector('.header');
  return header ? header.offsetHeight : 80;
}

/**
 * Плавный скролл к элементу с учетом высоты хедера
 * @param {string} selector - CSS селектор элемента
 */
export function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (!element) return;

  const headerOffset = getHeaderOffset();
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

/**
 * Debounce функция для ограничения частоты вызовов
 * @param {Function} func - Функция для вызова
 * @param {number} wait - Время ожидания в мс
 * @returns {Function} Обернутая функция
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle функция для ограничения частоты вызовов
 * @param {Function} func - Функция для вызова
 * @param {number} limit - Интервал в мс
 * @returns {Function} Обернутая функция
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Проверка видимости элемента в viewport
 * @param {HTMLElement} element - Проверяемый элемент
 * @param {number} threshold - Порог видимости (0-1)
 * @returns {boolean} Видим ли элемент
 */
export function isElementInViewport(element, threshold = 0.2) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const visibleArea = Math.max(0, 
    Math.min(rect.bottom, window.innerHeight) - 
    Math.max(rect.top, 0)
  );
  const elementHeight = rect.height;
  
  return visibleArea >= elementHeight * threshold;
}

/**
 * Инициализация Intersection Observer для анимаций появления
 */
export function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // После появления можно отключить наблюдение
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Наблюдаем за элементами с классом fade-in
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  return observer;
}

/**
 * Добавление класса скролла хедеру
 */
export function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = throttle(() => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Проверка при загрузке
}

/**
 * Инициализация мобильного меню
 */
export function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navList) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navList.classList.toggle('active');
    document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
  });

  // Закрытие меню при клике на ссылку
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navList.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Закрытие меню при клике вне области
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
      hamburger.classList.remove('active');
      navList.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Инициализация плавного скролла для якорных ссылок
 */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Пропускаем если это просто "#"
      if (href === '#') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        scrollToElement(href);
      }
    });
  });
}

/**
 * Магнитный эффект для кнопок
 * @param {HTMLElement} button - Кнопка
 */
export function initMagneticButton(button) {
  if (!button) return;

  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
  });
}

/**
 * Инициализация магнитных кнопок на странице
 */
export function initAllMagneticButtons() {
  document.querySelectorAll('.hero-btn, .menu-tab').forEach(button => {
    initMagneticButton(button);
  });
}

/**
 * Форматирование даты
 * @param {Date} date - Дата
 * @param {string} locale - Локаль
 * @returns {string} Отформатированная дата
 */
export function formatDate(date, locale = 'ru-RU') {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Генерация уникального ID
 * @returns {string} Уникальный ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Проверка поддержки localStorage
 * @returns {boolean} Поддерживается ли localStorage
 */
export function isLocalStorageSupported() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
