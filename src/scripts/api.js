/**
 * API модуль для работы с данными меню
 * В будущем будет заменен на реальные запросы к базе данных
 */

// Имитация задержки сети для демонстрации скелетных загрузчиков
const simulateNetworkDelay = (ms = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Получение данных меню из JSON файла
 * @returns {Promise<Array>} Массив товаров меню
 */
export async function fetchMenuData() {
  try {
    await simulateNetworkDelay(300); // Имитация задержки
    
    const response = await fetch('data/menu.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка загрузки меню:', error);
    
    // Fallback данные на случай ошибки
    return getFallbackMenuData();
  }
}

/**
 * Резервные данные меню (на случай ошибки загрузки)
 */
function getFallbackMenuData() {
  return [
    {
      id: 1,
      name: "Эспрессо",
      price: 150,
      category: "classic",
      icon: "☕",
      description: "Классический эспрессо из 100% арабики, насыщенный вкус с плотной кремой."
    },
    {
      id: 2,
      name: "Капучино",
      price: 220,
      category: "classic",
      icon: "🥛",
      description: "Эспрессо с добавлением вспененного молока, идеальный баланс вкуса."
    },
    {
      id: 3,
      name: "Латте",
      price: 240,
      category: "classic",
      icon: "🫖",
      description: "Мягкий кофейный напиток с большим количеством молока и легкой пенкой."
    },
    {
      id: 4,
      name: "Американо",
      price: 180,
      category: "classic",
      icon: "☕",
      description: "Эспрессо с горячей водой, классический черный кофе."
    },
    {
      id: 5,
      name: "Флэт Уайт",
      price: 230,
      category: "classic",
      icon: "🤎",
      description: "Двойной эспрессо с небольшим количеством вспененного молока."
    },
    {
      id: 6,
      name: "Раф Цитрус",
      price: 280,
      category: "author",
      icon: "🍊",
      description: "Сливочный кофе с цитрусовыми нотками и легким послевкусием апельсина."
    },
    {
      id: 7,
      name: "Лавандовый Раф",
      price: 290,
      category: "author",
      icon: "🌸",
      description: "Нежный сливочный кофе с ароматом французской лаванды."
    },
    {
      id: 8,
      name: "Соленая Карамель",
      price: 300,
      category: "author",
      icon: "🍮",
      description: "Авторский кофе с домашней соленой карамелью и сливками."
    },
    {
      id: 9,
      name: "Тирамису Латте",
      price: 310,
      category: "author",
      icon: "🍰",
      description: "Кофе в стиле знаменитого десерта с маскарпоне и какао."
    },
    {
      id: 10,
      name: "Чизкейк Нью-Йорк",
      price: 350,
      category: "dessert",
      icon: "🧀",
      description: "Классический чизкейк с нежным сливочным вкусом."
    },
    {
      id: 11,
      name: "Шоколадный Брауни",
      price: 280,
      category: "dessert",
      icon: "🍫",
      description: "Плотный шоколадный десерт с жидкой начинкой."
    },
    {
      id: 12,
      name: "Круассан с миндалем",
      price: 220,
      category: "dessert",
      icon: "🥐",
      description: "Свежий французский круассан с миндальным кремом."
    }
  ];
}

/**
 * Фильтрация меню по категории
 * @param {Array} items - Массив товаров
 * @param {string} category - Категория для фильтрации
 * @returns {Array} Отфильтрованный массив
 */
export function filterByCategory(items, category) {
  if (!category || category === 'all') {
    return items;
  }
  return items.filter(item => item.category === category);
}

/**
 * Поиск товара по ID
 * @param {Array} items - Массив товаров
 * @param {number} id - ID товара
 * @returns {Object|null} Найденный товар или null
 */
export function findItemById(items, id) {
  return items.find(item => item.id === id) || null;
}

/**
 * Группировка товаров по категориям
 * @param {Array} items - Массив товаров
 * @returns {Object} Объект с категориями как ключами
 */
export function groupByCategory(items) {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
}
