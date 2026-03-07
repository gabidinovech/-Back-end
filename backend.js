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
        setNewDeadline();      
        diff = deadline - now;
    }

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);

    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('mins').innerText = m < 10 ? '0' + m : m;
}

setInterval(updateTimer, 1000);
updateTimer();


window.onclick = function(event) {
    if (event.target === document.getElementById('plantModal')) {
        closeModal();
    }
};


async function fetchPlants() {
    try {
        const response = await fetch('http://localhost:3000/api/plants');
        const plants = await response.json();
        displayPlants(plants);
    } catch (error) {
        console.error("Деректерді алу мүмкін болмады:", error);
    }
}


function displayPlants(plants) {
    const grid = document.querySelector('.product-grid');
    grid.innerHTML = ''; 

    plants.forEach(plant => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openPlant(plant.name, `${plant.price} тг`);
        
        card.innerHTML = `
            <div class="img-container">
                <img src="${plant.image_url}" alt="${plant.name}">
            </div>
            <h3>${plant.name}</h3>
            <p class="price">${plant.price} тг</p>
        `;
        grid.appendChild(card);
    });
}


window.addEventListener('DOMContentLoaded', fetchPlants);