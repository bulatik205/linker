function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    const r = getRandomInt(0, 255);
    const g = getRandomInt(0, 255);
    const b = getRandomInt(0, 255);
    return `rgb(${r}, ${g}, ${b})`;
}

function changeLinkerBorders() {
    const linkerElements = document.querySelectorAll('linker');

    console.log(`Найдено ${linkerElements.length} тегов <linker>`);

    linkerElements.forEach((linker, index) => {
        const randomColor = getRandomColor();
        linker.style.borderColor = randomColor;
        console.log(`Тег linker ${index + 1}: ${randomColor}`);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(changeLinkerBorders, 1000);
});