/**
 * Анимация перехода "Сингулярность"
 * Эффект расширения черной точки при переходе между страницами
 */

export async function initSingularityTransition() {
    return new Promise((resolve) => {
        let overlay = document.querySelector('.transition-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'transition-overlay';
            overlay.innerHTML = '<div class="singularity-point"></div>';
            document.body.appendChild(overlay);
        }
        
        const point = overlay.querySelector('.singularity-point');
        
        point.style.transition = 'none';
        point.style.transform = 'scale(0)';
        point.style.opacity = '1';
        
        requestAnimationFrame(() => {
            point.style.transition = 'transform 0.6s cubic-bezier(0.7, 0, 0.3, 1)';
            point.style.transform = 'scale(150)';
            
            setTimeout(() => {
                resolve();
            }, 400);
        });
    });
}

export function closeSingularityTransition() {
    const point = document.querySelector('.singularity-point');
    if (point) {
        point.style.transition = 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.8s ease';
        point.style.transform = 'scale(0)';
        point.style.opacity = '0';
    }
}
