class Product {
    constructor(id, name, price, image, category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
    }
}

const products = [
    new Product(1, "Vilily Pink Beauty Sunscreen", 99.00, "images/vilily-sunscreen.jpg", "Beauty"),
    new Product(2, "Matte Face Pressed Powder", 63.00, "images/matte-powder.jpg", "Beauty"),
    new Product(3, "Sneakers for Men and Women", 338.99, "images/sneakers.jpg", "Shoes"),
    new Product(4, "Running Shoes", 250.00, "images/running-shoes.jpg", "Shoes"),
    new Product(5, "Unisex Printed T-Shirt", 174.00, "images/t-shirt.jpg", "Clothing"),
    new Product(6, "Matte Lipstick", 107.99, "images/matte-lipstick.jpg", "Beauty"),
    new Product(7, "Discounted Running Shoes", 212.50, "images/running-shoes-discounted.jpg", "Shoes"),
    new Product(8, "Casual V-Neck Top", 152.09, "images/v-neck-top.jpg", "Clothing"),
    new Product(9, "Moisturizing Cream", 115.00, "images/cream.jpg", "Beauty"),
    new Product(10, "Denim Jacket", 499.00, "images/jacket.jpg", "Clothing")
];

let cart = JSON.parse(localStorage.getItem('myCart')) || [];

function renderProductGrids() {
    const grid = document.querySelector('.products');
    if (!grid) return;

    grid.innerHTML = '';
    products.forEach(product => {
        const article = document.createElement('article');
        article.className = 'product';
        article.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">₱${product.price.toFixed(2)}</p>
            <button class="view-btn" data-id="${product.id}">Add to Cart</button>
        `;
        grid.appendChild(article);
    });
}


document.body.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.hasAttribute('data-id')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === id);

        if (product) {
            addToCart(product);
            
            const productCard = e.target.closest('.product');
            if (productCard) {
                productCard.classList.add('fade-in');
               
                setTimeout(() => productCard.classList.remove('fade-in'), 500);
            }
        }
    }
});

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    existing ? existing.quantity++ : cart.push({ ...product, quantity: 1 });
    saveCart();
    if (document.querySelector('.cart-list')) renderCartPage();
}

function saveCart() {
    localStorage.setItem('myCart', JSON.stringify(cart));
}

function renderCartPage() {
    const cartList = document.querySelector('.cart-list');
    if (!cartList) return;

    cartList.innerHTML = '';
   
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>Price: ₱${item.price.toFixed(2)}</p>
                <label>Qty:</label>
                <input type="number" value="${item.quantity}" min="0" data-index="${index}" class="qty-input">
            </div>
        `;
        cartList.appendChild(li);
    });

    const summaryTotal = document.querySelector('aside strong');
    if (summaryTotal) summaryTotal.textContent = `Total: ₱${total.toFixed(2)}`;
}

const allForms = document.querySelectorAll('form');
allForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        
        e.preventDefault(); 
        
        const inputs = form.querySelectorAll('input[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            
            if (input.value.trim() === "") {
                isFormValid = false;
                input.classList.add('error'); 
            } else {
                input.classList.remove('error');
            }
        });

        if (isFormValid) {
            console.log("Form submitted successfully!");
        
            window.location.href = 'index.html'; 
        } else {
            alert("Please check your entries.");
        }
    });
});

const currentUser = {
    name: "Juan Dela Cruz",
    orderHistory: [
        { date: "2026-03-20", total: 450.00, items: ["Denim Jacket"] },
        { date: "2026-03-25", total: 162.00, items: ["Sunscreen", "Lipstick"] }
    ]
};

function initAccountPage() {
    const welcomeHeader = document.querySelector('h1');
    if (welcomeHeader && window.location.pathname.includes('account.html')) {
        
        welcomeHeader.textContent = `Welcome, ${currentUser.name}`;
        
        const mainArea = document.querySelector('main');
        currentUser.orderHistory.forEach(order => {
            const detailsElement = document.createElement('details');
            const summaryElement = document.createElement('summary');
            
            summaryElement.textContent = `Order Date: ${order.date}`;
            
            summaryElement.addEventListener('click', () => {
                console.log(`Viewing details for order: ${order.date}`);
            });

            const contentArea = document.createElement('div');
            contentArea.innerHTML = `
                <p><strong>Total:</strong> ₱${order.total.toFixed(2)}</p>
                <p><strong>Items:</strong> ${order.items.join(', ')}</p>
            `;
            
            detailsElement.append(summaryElement, contentArea);
            mainArea.appendChild(detailsElement);
        });
    }
}

renderProductGrids();
renderCartPage();
initAccountPage();

document.body.addEventListener('change', (e) => {
    if (e.target.classList.contains('qty-input')) {
        const index = e.target.dataset.index;
        const qty = parseInt(e.target.value);
        qty <= 0 ? cart.splice(index, 1) : cart[index].quantity = qty;
        saveCart();
        renderCartPage();
    }
});