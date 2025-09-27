let currentLinker = null;
let longPressTimer = null;

// ГЛОБАЛЬНЫЙ ЗАПРЕТ БРАУЗЕРНОГО КОНТЕКСТНОГО МЕНЮ
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// Обработчики для мобильных (тач)
function setupTouchEvents() {
    document.querySelectorAll('linker').forEach(linker => {
        linker.addEventListener('touchstart', handleTouchStart);
        linker.addEventListener('touchend', handleTouchEnd);
        linker.addEventListener('touchmove', handleTouchMove);
    });
}

function handleTouchStart(e) {
    const linker = e.currentTarget;
    const id = linker.getAttribute('data-id'); // меняем index на id

    // Запускаем таймер долгого нажатия (500ms)
    longPressTimer = setTimeout(() => {
        showCustomMenu(e, id);
    }, 500);

    currentLinker = {
        id: id, // меняем index на id
        element: linker,
        title: linker.getAttribute('data-title'),
        url: linker.getAttribute('data-url')
    };
}

function handleTouchEnd(e) {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
}

function handleTouchMove(e) {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
}

// Обработчик для ПК (правый клик)
function showContextMenu(event, id) { // меняем index на id
    event.preventDefault();
    showCustomMenu(event, id);
}

// ОБЩАЯ функция показа меню
function showCustomMenu(event, id) { // меняем index на id
    let clientX, clientY;

    if (event.type.includes('touch')) {
        const touch = event.touches[0] || event.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    // Обновляем currentLinker для mouse событий
    if (event.type === 'contextmenu') {
        currentLinker = {
            id: id, // меняем index на id
            element: event.currentTarget,
            title: event.currentTarget.getAttribute('data-title'),
            url: event.currentTarget.getAttribute('data-url')
        };
    }

    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = clientX + 'px';
    contextMenu.style.top = clientY + 'px';

    setTimeout(() => {
        const menuRect = contextMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (menuRect.right > viewportWidth) {
            contextMenu.style.left = (clientX - menuRect.width) + 'px';
        }

        if (menuRect.bottom > viewportHeight) {
            contextMenu.style.top = (clientY - menuRect.height) + 'px';
        }
    }, 0);
}

// Скрытие меню
document.addEventListener('click', function (e) {
    const contextMenu = document.getElementById('contextMenu');
    if (contextMenu && !contextMenu.contains(e.target)) {
        contextMenu.style.display = 'none';
    }
});

document.addEventListener('touchstart', function (e) {
    const contextMenu = document.getElementById('contextMenu');
    if (contextMenu && !contextMenu.contains(e.target)) {
        contextMenu.style.display = 'none';
    }
});

document.addEventListener('scroll', function () {
    const contextMenu = document.getElementById('contextMenu');
    if (contextMenu) {
        contextMenu.style.display = 'none';
    }
});

// ФУНКЦИЯ УДАЛЕНИЯ С ПЕРЕДАЧЕЙ ID
async function deleteLinker() {
    if (!currentLinker || !currentLinker.id) {
        console.error('ID ссылки не найден');
        return;
    }

    console.log('Удаляем:', currentLinker);
    if (confirm(`Удалить "${currentLinker.title}"?`)) {
        try {
            const response = await fetch('delete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: currentLinker.id
                })
            });

            const result = await response.json();
            
            if (result.success) {
                alert(result.message);
                if (currentLinker.element) {
                    currentLinker.element.remove();
                }
            } else {
                alert('Ошибка: ' + result.message);
            }
        } catch (error) {
            alert('Ошибка сети: ' + error.message);
        }
    }

    document.getElementById('contextMenu').style.display = 'none';
}

// Закрытие меню при ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const contextMenu = document.getElementById('contextMenu');
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    }
});

// Инициализация
document.addEventListener('DOMContentLoaded', function () {
    setupTouchEvents();
});

function reinitializeContextMenu() {
    setupTouchEvents();
}