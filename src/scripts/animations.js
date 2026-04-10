/**
 * Анимации скролла с помощью GSAP
 * Создает кинематографичные эффекты при прокрутке
 */
import { gsap } from 'https://cdn.skypack.dev/gsap';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    // 1. Плавное появление заголовка Hero при загрузке
    gsap.from(".hero-content h1", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.2
    });

    gsap.from(".hero-content p", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.4
    });

    gsap.from(".hero-btn", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.6
    });

    // 2. Анимация карточек меню при скролле (эффект "лесенки")
    gsap.utils.toArray('.menu-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: ".menu-grid",
                start: "top 80%",
            },
            y: 60,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.05
        });
    });

    // 3. Параллакс эффект для секции "О нас"
    gsap.to(".about-image", {
        scrollTrigger: {
            trigger: ".about",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        },
        y: -30,
        scale: 1.02
    });

    // 4. Появление элементов "О нас"
    gsap.from(".about-text", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // 5. Анимация футера
    gsap.from(".footer-content", {
        scrollTrigger: {
            trigger: "footer",
            start: "top 90%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    // 6. Анимация элементов квиза
    gsap.from(".quiz-container", {
        scrollTrigger: {
            trigger: ".quiz-section",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // 7. Эффект для заголовков секций
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });
}
