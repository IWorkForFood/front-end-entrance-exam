// Функция для сохранения содержимого
function saveContent(elementId) {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      localStorage.setItem(elementId, element.innerHTML);
    }
  } catch (e) {
    console.error('Ошибка при сохранении в localStorage:', e);
  }
}

// Функция для загрузки содержимого
function loadContent(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const savedContent = localStorage.getItem(elementId);
    if (savedContent !== null) {
      element.innerHTML = savedContent;
    }
  }
}

// Функция для загрузки всего сохраненного содержимого
function loadAllSavedContent() {
  const editableElements = document.querySelectorAll('[id*="editable"][contenteditable="true"]');
  editableElements.forEach(element => loadContent(element.id));
  // Загружаем содержимое interests-block__hobbies отдельно
  loadContent('interests-block__hobbies');
}

// Функция для сохранения всех редактируемых элементов
function saveAllEditableContent() {
  const editableElements = document.querySelectorAll('[id*="editable"][contenteditable="true"]');
  editableElements.forEach(element => saveContent(element.id));
  // Сохраняем interests-block__hobbies отдельно
  saveContent('interests-block__hobbies');
}

// Функция для сброса содержимого
function resetContent() {
  if (confirm('Вы уверены, что хотите отменить все локальные изменения?')) {
    const editableElements = document.querySelectorAll('[id*="editable"][contenteditable="true"]');
    editableElements.forEach(element => localStorage.removeItem(element.id));
    localStorage.removeItem('interests-block__hobbies');
    document.querySelectorAll('.slider').forEach((slider, index) => {
      localStorage.removeItem(`slider-${index}`);
    });
    location.reload();
  }
}

// Debounce для ограничения частоты вызовов
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Обработчик для создания новых элементов и удаления пустых
function handleKeyDown(event, elementId, tagName, className, innerTagName, innerClassName) {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (event.key === 'Enter') {
    event.preventDefault(); // Предотвращаем стандартное поведение

    // Создаем новый элемент (например, <div> или <li>)
    const newElement = document.createElement(tagName);
    newElement.className = className;

    // Создаем вложенный элемент (например, <span>)
    if (innerTagName && innerClassName) {
      const innerElement = document.createElement(innerTagName);
      innerElement.className = innerClassName;
      innerElement.setAttribute('contenteditable', 'true');
      innerElement.textContent = '';
      newElement.appendChild(innerElement);
      element.appendChild(newElement);
      innerElement.focus();

      // Перемещаем курсор в начало нового внутреннего элемента
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(innerElement, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      newElement.setAttribute('contenteditable', 'true');
      newElement.textContent = '';
      element.appendChild(newElement);
      newElement.focus();

      // Перемещаем курсор в начало нового элемента
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(newElement, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Сохраняем обновленное содержимое
    saveContent(elementId);
  } else if (event.key === 'Backspace') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const currentElement = range.startContainer.parentElement.closest(innerTagName || tagName);
    if (currentElement && currentElement.textContent.trim() === '' && element.children.length > 1) {
      currentElement.parentElement.remove(); // Удаляем родительский элемент (например, hobby-block)
      saveContent(elementId); // Сохраняем изменения
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const editableElements = document.querySelectorAll('[id*="editable"][contenteditable="true"]');
  loadAllSavedContent();

  // Обработка редактируемых элементов
  editableElements.forEach(element => {
    element.addEventListener('input', debounce(() => {
      saveContent(element.id);
      console.log(`Содержимое ${element.id} сохранено по input`);
    }, 500));
    element.addEventListener('blur', () => {
      saveContent(element.id);
      console.log(`Содержимое ${element.id} сохранено по blur`);
      // Удаляем пустые элементы при потере фокуса
      const childElements = element.querySelectorAll('li, p');
      childElements.forEach(child => {
        if (child.textContent.trim() === '' && element.children.length > 1) {
          child.remove();
        }
      });
      saveContent(element.id);
    });

    // Обработчик для списков (например, editable-job-list-points)
    if (element.id === 'editable-job-list-points') {
      element.addEventListener('keydown', (event) => handleKeyDown(event, element.id, 'li', 'jobs-list__point'));
    }
  });

  // Отдельная обработка для interests-block__hobbies
  const interestsContainer = document.getElementById('interests-block__hobbies');
  if (interestsContainer) {
    // Обновляем обработчики для существующих и новых <span>
    const updateHobbyHandlers = () => {
      const hobbySpans = interestsContainer.querySelectorAll('.interests-block__separated-hobby');
      hobbySpans.forEach(span => {
        // Удаляем старые обработчики, чтобы избежать дублирования
        span.removeEventListener('keydown', span._keydownHandler);
        span.removeEventListener('input', span._inputHandler);
        span.removeEventListener('blur', span._blurHandler);

        // Добавляем новые обработчики
        span._keydownHandler = (event) =>
          handleKeyDown(event, 'interests-block__hobbies', 'div', 'interests-block__hobby-block', 'span', 'interests-block__separated-hobby');
        span._inputHandler = debounce(() => {
          saveContent('interests-block__hobbies');
          console.log('Содержимое interests-block__hobbies сохранено по input');
        }, 500);
        span._blurHandler = () => {
          saveContent('interests-block__hobbies');
          console.log('Содержимое interests-block__hobbies сохранено по blur');
          // Удаляем пустые элементы при потере фокуса
          const hobbyBlocks = interestsContainer.querySelectorAll('.interests-block__hobby-block');
          hobbyBlocks.forEach(block => {
            const innerSpan = block.querySelector('.interests-block__separated-hobby');
            if (innerSpan.textContent.trim() === '' && hobbyBlocks.length > 1) {
              block.remove();
            }
          });
          saveContent('interests-block__hobbies');
        };

        span.addEventListener('keydown', span._keydownHandler);
        span.addEventListener('input', span._inputHandler);
        span.addEventListener('blur', span._blurHandler);
      });
    };

    // Инициализация обработчиков для существующих <span>
    updateHobbyHandlers();

    // Обработчик клика на interests-block__hobbies
    interestsContainer.addEventListener('click', (event) => {
      // Проверяем, что клик был на самом контейнере, а не на его дочерних элементах
      if (event.target === interestsContainer) {
        const newDivBlock = document.createElement('div');
        newDivBlock.className = 'interests-block__hobby-block';
        const newDivHobby = document.createElement('span');
        newDivHobby.className = 'interests-block__separated-hobby';
        newDivHobby.setAttribute('contenteditable', 'true');
        newDivHobby.textContent = '';
        newDivBlock.appendChild(newDivHobby);
        interestsContainer.appendChild(newDivBlock);
        newDivHobby.focus();
        saveContent('interests-block__hobbies');
        updateHobbyHandlers(); // Обновляем обработчики для нового <span>
      }
    });
  }

  // Обработка ползунков
  const sliders = document.querySelectorAll('.slider');
  sliders.forEach((slider, index) => {
    const sliderId = `slider-${index}`;
    const savedValue = localStorage.getItem(sliderId);
    if (savedValue !== null) {
      slider.value = savedValue;
    }
    slider.addEventListener('input', () => {
      localStorage.setItem(sliderId, slider.value);
    });
  });

  // Обработчики кнопок
  const saveButton = document.getElementById('save-btn');
  if (saveButton) {
    saveButton.addEventListener('click', saveAllEditableContent);
  }

  const resetButton = document.getElementById('reset-btn');
  if (resetButton) {
    resetButton.addEventListener('click', resetContent);
  }
});