/*
document.addEventListener('DOMContentLoaded', function() {
    // Находим все элементы с классом ripple
    const rippleElements = document.querySelectorAll('.ripple');

    rippleElements.forEach(el => {
        // Убираем CSS :active эффект, так как JS будет управлять этим
        el.classList.remove('ripple'); // Временно удаляем, чтобы не мешал

        el.addEventListener('click', function(e) {
            // Создаем span для волны
            const circle = document.createElement('span');
            circle.classList.add('ripple-circle');

            // Получаем размеры и позицию элемента
            const rect = el.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            // Вычисляем позицию клика относительно элемента
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Применяем стили к волне
            circle.style.width = circle.style.height = `${size}px`;
            circle.style.left = `${x - size / 2}px`;
            circle.style.top = `${y - size / 2}px`;

            // Добавляем волну в элемент
            el.appendChild(circle);

            // Удаляем волну после завершения анимации
            setTimeout(() => {
                circle.remove();
            }, 600); // Должно совпадать с длительностью transition в CSS
        });
    });
});
*/