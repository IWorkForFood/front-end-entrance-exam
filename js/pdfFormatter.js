document.addEventListener('DOMContentLoaded', function () {
  const element = document.querySelector('.content');
  const button = document.querySelector('#download-btn');

  // Проверка наличия элементов
  if (!element) {
    console.error('Элемент .content не найден');
    return;
  }

  if (!button) {
    console.error('Кнопка #download-btn не найдена');
    return;
  }

  button.addEventListener('click', function () {
    // Отключаем кнопку и показываем индикацию
    button.disabled = true;
    button.textContent = 'Генерация PDF...';

    // Клонируем элемент, чтобы применить стили для PDF
    const clonedElement = element.cloneNode(true);

    // Убираем contenteditable и фокусные рамки в клоне
    clonedElement.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.style.outline = 'none';
      el.style.border = 'none';
    });

    // Скрываем слайдеры в клоне
    clonedElement.querySelectorAll('.slider').forEach(el => {
      el.style.display = 'none';
    });

    // Настройки для html2pdf
    const options = {
      margin: [0, 0, 0, 0], // Отступы: [top, right, bottom, left]
      filename: 'резюме.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 3, // Увеличиваем разрешение для четкости
        useCORS: true, // Для загрузки изображений
        logging: false, // Отключаем логи
        windowWidth: 595, // A4 в пикселях при 96dpi (210mm)
        windowHeight: 850 // A4 в пикселях при 96dpi (297mm)
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    // Генерация PDF
    html2pdf()
      .set(options)
      .from(clonedElement)
      .save()
      .then(() => {
        button.disabled = false;
        button.textContent = 'скачать';
      })
      .catch(error => {
        console.error('Ошибка при генерации PDF:', error);
        button.disabled = false;
        button.textContent = 'скачать';
        alert('Произошла ошибка при генерации PDF. Проверьте консоль для деталей.');
      });
  });
});
