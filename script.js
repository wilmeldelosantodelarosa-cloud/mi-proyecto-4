document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const productModal = new bootstrap.Modal(document.getElementById('product-modal'));
    const cartModal = new bootstrap.Modal(document.getElementById('cart-modal'));
    const paymentModal = new bootstrap.Modal(document.getElementById('payment-modal'));

    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalCategory = document.getElementById('modal-category');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');
    const modalQuantity = document.getElementById('modal-quantity');
    const addToCartButton = document.getElementById('add-to-cart-button');

    const cartButton = document.getElementById('cart-button');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkout-button');

    const paymentForm = document.getElementById('payment-form');

    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentProduct = {};

    // Fetch local JSON data
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data.products;
            displayProducts(products);
        });

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'col-lg-3 col-md-4 col-sm-6';
            card.innerHTML = `
                <div class="card h-100 product-card">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text fw-bold">$${product.price}</p>
                        <button class="btn btn-outline-primary" data-id="${product.id}">Ver más</button>
                    </div>
                </div>
            `;
            productList.appendChild(card);
        });
    }

    productList.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            const id = parseInt(e.target.dataset.id);
            currentProduct = products.find(p => p.id === id);
            
            modalTitle.textContent = currentProduct.title;
            modalImage.src = currentProduct.image;
            modalCategory.textContent = currentProduct.category;
            modalDescription.textContent = currentProduct.description;
            modalPrice.textContent = `$${currentProduct.price}`;
            modalQuantity.value = 1;

            productModal.show();
        }
    });

    addToCartButton.addEventListener('click', () => {
        const quantity = parseInt(modalQuantity.value);
        addToCart(currentProduct, quantity);
        productModal.hide();
    });

    function addToCart(product, quantity) {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        updateCart();
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;

            const itemElement = document.createElement('div');
            itemElement.className = 'row mb-3 align-items-center';
            itemElement.innerHTML = `
                <div class="col-2">
                    <img src="${item.image}" class="img-fluid rounded" alt="${item.title}">
                </div>
                <div class="col-4">${item.title}</div>
                <div class="col-3">
                    <div class="input-group">
                        <button class="btn btn-outline-secondary btn-sm" data-id="${item.id}" data-change="-1">-</button>
                        <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary btn-sm" data-id="${item.id}" data-change="1">+</button>
                    </div>
                </div>
                <div class="col-2 text-end">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="col-1 text-end">
                    <button class="btn btn-danger btn-sm" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalElement.textContent = total.toFixed(2);
        cartCount.textContent = count;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    cartItemsContainer.addEventListener('click', e => {
        const id = parseInt(e.target.closest('button').dataset.id);

        if (e.target.classList.contains('fa-trash') || e.target.closest('button').classList.contains('btn-danger')) {
            cart = cart.filter(item => item.id !== id);
        } else if (e.target.closest('button').dataset.change) {
            const change = parseInt(e.target.closest('button').dataset.change);
            const item = cart.find(p => p.id === id);
            item.quantity += change;
            if (item.quantity === 0) {
                cart = cart.filter(p => p.id !== id);
            }
        }
        updateCart();
    });

    cartButton.addEventListener('click', () => {
        updateCart();
        cartModal.show();
    });

    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            cartModal.hide();
            paymentModal.show();
        } else {
            alert('El carrito está vacío.');
        }
    });

    paymentForm.addEventListener('submit', e => {
        e.preventDefault();
        const fullName = document.getElementById('full-name').value;
        generatePDF(fullName);
        paymentModal.hide();
        cart = [];
        updateCart();
    });

    function generatePDF(customerName) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [80, 297] // Thermal receipt paper width
        });
        
        const storeName = "TechStore";
        const now = new Date();
        const date = now.toLocaleDateString('es-ES');
        const time = now.toLocaleTimeString('es-ES');
        let y = 10; // Initial Y position

        doc.setFont('Courier', 'bold');
        doc.setFontSize(12);
        doc.text(storeName, 40, y, { align: 'center' });
        y += 10;

        doc.setFont('Courier', 'normal');
        doc.setFontSize(8);
        doc.text(`Fecha: ${date} - Hora: ${time}`, 40, y, { align: 'center' });
        y += 5;
        doc.text(`Cliente: ${customerName}`, 40, y, { align: 'center' });
        y += 10;

        doc.text('--------------------------------', 40, y, { align: 'center' });
        y += 5;
        
        doc.setFont('Courier', 'bold');
        doc.text('Cant.  Producto             Total', 5, y);
        y += 5;
        doc.setFont('Courier', 'normal');

        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const line1 = `${item.quantity.toString().padStart(4)}   ${item.title.substring(0, 15)}`;
            const line2 = `$${itemTotal.toFixed(2).padStart(10)}`;
            doc.text(line1, 5, y);
            doc.text(line2, 75, y, { align: 'right' });
            y += 5;
        });

        doc.text('--------------------------------', 40, y, { align: 'center' });
        y += 5;
        
        doc.setFont('Courier', 'bold');
        doc.text('TOTAL:', 5, y);
        doc.text(`$${total.toFixed(2)}`, 75, y, { align: 'right' });

        doc.save('recibo_TechStore.pdf');
    }
});
