function openPlant(name, price) {
    document.getElementById('m-name').innerText = name;
    document.getElementById('m-price').innerText = price;
    document.getElementById('plantModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('plantModal').style.display = 'none';
}

function addToCart() {
    alert("Товар добавлен в корзину! 🌱");
    closeModal();
}

/* ===== ТАЙМЕР НА 3 ЧАСА ===== */

let deadline;

function setNewDeadline() {
    deadline = new Date();
    deadline.setHours(deadline.getHours() + 3);
}

setNewDeadline();

function updateTimer() {
    const now = new Date();
    let diff = deadline - now;

    if (diff <= 0) {
        setNewDeadline();      // заново запускаем на 3 часа
        diff = deadline - now;
    }

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);

    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('mins').innerText = m < 10 ? '0' + m : m;
}

setInterval(updateTimer, 1000);
updateTimer();

/* ===== ЗАКРЫТИЕ МОДАЛКИ ПО КЛИКУ ВНЕ ===== */

window.onclick = function(event) {
    if (event.target === document.getElementById('plantModal')) {
        closeModal();
    }
};