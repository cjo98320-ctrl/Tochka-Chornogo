// Coffee Quiz Module - Интерактивный подбор напитков
export class CoffeeQuiz {
    constructor() {
        this.questions = [
            {
                id: 1,
                question: "Какое у вас сейчас настроение?",
                options: [
                    { text: "Бодрое и энергичное", value: "energy" },
                    { text: "Спокойное и расслабленное", value: "calm" },
                    { text: "Творческое и вдохновенное", value: "creative" },
                    { text: "Ностальгическое", value: "classic" }
                ]
            },
            {
                id: 2,
                question: "Какой вкус вы предпочитаете?",
                options: [
                    { text: "Насыщенный и горьковатый", value: "bold" },
                    { text: "Мягкий и сливочный", value: "creamy" },
                    { text: "Сладкий и ароматный", value: "sweet" },
                    { text: "Кисловатый и фруктовый", value: "fruity" }
                ]
            },
            {
                id: 3,
                question: "Время суток?",
                options: [
                    { text: "Раннее утро", value: "morning" },
                    { text: "Обеденное время", value: "afternoon" },
                    { text: "Вечер", value: "evening" },
                    { text: "Поздняя ночь", value: "night" }
                ]
            }
        ];
        
        this.currentQuestion = 0;
        this.answers = [];
        this.quizContainer = null;
        this.init();
    }

    init() {
        this.quizContainer = document.getElementById('coffee-quiz');
        if (!this.quizContainer) return;
        
        this.renderQuestion();
        this.attachEventListeners();
    }

    renderQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.showResult();
            return;
        }

        const question = this.questions[this.currentQuestion];
        const progress = ((this.currentQuestion) / this.questions.length) * 100;

        this.quizContainer.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-progress">
                    <div class="quiz-progress-bar" style="width: ${progress}%"></div>
                </div>
                <span class="quiz-step">Вопрос ${this.currentQuestion + 1} из ${this.questions.length}</span>
            </div>
            
            <div class="quiz-content fade-in">
                <h3 class="quiz-question">${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" data-value="${option.value}" data-index="${index}">
                            ${option.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Анимация появления
        setTimeout(() => {
            this.quizContainer.querySelector('.quiz-content').classList.add('active');
        }, 100);
    }

    attachEventListeners() {
        this.quizContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quiz-option')) {
                const value = e.target.dataset.value;
                this.answers.push(value);
                this.currentQuestion++;
                setTimeout(() => this.renderQuestion(), 300);
            }
        });
    }

    showResult() {
        const recommendation = this.calculateRecommendation();
        
        this.quizContainer.innerHTML = `
            <div class="quiz-result fade-in active">
                <div class="result-icon">☕</div>
                <h3>Ваш идеальный напиток:</h3>
                <h2 class="result-drink">${recommendation.name}</h2>
                <p class="result-description">${recommendation.description}</p>
                <div class="result-price">${recommendation.price}₽</div>
                <button class="add-to-cart-btn magnetic-btn" data-drink-id="${recommendation.id}">
                    Добавить в корзину
                </button>
                <button class="restart-quiz-btn">Пройти заново</button>
            </div>
        `;

        // Добавляем обработчик для кнопки "В корзину"
        const addToCartBtn = this.quizContainer.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                // Здесь будет логика добавления в корзину
                if (window.cartManager) {
                    window.cartManager.addItem(recommendation);
                    this.showNotification('Напиток добавлен в корзину!');
                }
            });
        }

        // Кнопка перезапуска
        const restartBtn = this.quizContainer.querySelector('.restart-quiz-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.currentQuestion = 0;
                this.answers = [];
                this.renderQuestion();
            });
        }
    }

    calculateRecommendation() {
        // Простая логика подбора на основе ответов
        const mood = this.answers[0];
        const taste = this.answers[1];
        const time = this.answers[2];

        let recommendation;

        // Логика подбора
        if (mood === 'energy' && time === 'morning') {
            recommendation = {
                id: 1,
                name: "Эспрессо Доппио",
                description: "Двойная порция энергии для продуктивного старта дня",
                price: 250
            };
        } else if (taste === 'creamy') {
            recommendation = {
                id: 5,
                name: "Латте Арт",
                description: "Нежный молочный кофе с авторским рисунком",
                price: 320
            };
        } else if (taste === 'sweet') {
            recommendation = {
                id: 8,
                name: "Карамельный Раф",
                description: "Сливочный кофе с домашней карамелью",
                price: 380
            };
        } else if (mood === 'creative') {
            recommendation = {
                id: 12,
                name: "Авторский Бленд",
                description: "Уникальное сочетание от нашего бариста",
                price: 420
            };
        } else {
            recommendation = {
                id: 3,
                name: "Капучино Классик",
                description: "Идеальный баланс эспрессо и взбитого молока",
                price: 280
            };
        }

        return recommendation;
    }

    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'quiz-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}
