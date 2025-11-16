document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    const paymentForm = document.getElementById('payment-form');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = [];
    
    const API_URL = 'https://wilmeldelosantodelarosa-cloud.github.io/gamer-api/products.json';

    // 1. Cargar y mostrar productos
    async function fetchProducts() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            // La API devuelve un objeto { "products": [...] }, accedemos al array.
            products = data.products; 
            
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            productContainer.innerHTML = '<p class="text-danger">No se pudieron cargar los productos.</p>';
        }
    }

    function displayProducts(productsToDisplay) {
        productContainer.innerHTML = '';
        productsToDisplay.forEach(product => {
            const card = document.createElement('div');
            card.className = 'col-lg-3 col-md-4 col-sm-6';
            
            // Usamos la clave "title" para el nombre y la URL de imagen directamente.
            const imageUrl = product.image;
            const productName = product.title;

            card.innerHTML = `
                <div class="card h-100 product-card">
                    <img src="${imageUrl}" class="card-img-top" alt="${productName}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${productName}</h5>
                        <p class="card-text flex-grow-1">${product.description.substring(0, 50)}...</p>
                        <p class="card-price">$${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary mt-auto" onclick="showProductDetails(${product.id})">Ver más</button>
                    </div>
                </div>
            `;
            productContainer.appendChild(card);
        });
    }

    // 2. Mostrar detalles del producto en el modal
    window.showProductDetails = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Se ajustan las claves para el modal
        document.getElementById('modal-product-image').src = product.image;
        document.getElementById('modal-product-title').textContent = product.title;
        document.getElementById('modal-product-description').textContent = product.description;
        document.getElementById('modal-product-category').textContent = product.category;
        document.getElementById('modal-product-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('quantity-selector').value = 1;

        const addToCartBtn = document.getElementById('add-to-cart-btn');
        addToCartBtn.onclick = () => {
            const quantity = parseInt(document.getElementById('quantity-selector').value);
            addToCart(product.id, quantity);
            productModal.hide();
        };

        productModal.show();
    };
    
    // 3. Lógica del Carrito
    function addToCart(productId, quantity = 1) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const product = products.find(p => p.id === productId);
            cart.push({ ...product, quantity });
        }
        updateCart();
    }
    
    function updateCart() {
        renderCartItems();
        updateCartCount();
        updateCartTotal();
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
            document.getElementById('go-to-payment-btn').disabled = true;
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => {
            // Se ajustan las claves para el carrito
            const imageUrl = item.image;
            const productName = item.title;
            return `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <img src="${imageUrl}" alt="${productName}" class="cart-item-img">
                    <div class="flex-grow-1 ms-3">
                        <p class="mb-0 fw-bold">${productName}</p>
                        <small>$${item.price.toFixed(2)} x ${item.quantity}</small>
                    </div>
                    <div class="d-flex align-items-center cart-item-actions">
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${item.id}, 1)">+</button>
                        <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById('go-to-payment-btn').disabled = false;
    }

    function updateCartCount() {
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalQuantity;
    }
    
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    window.changeQuantity = (productId, amount) => {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += amount;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCart();
            }
        }
    };
    
    window.removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    };
    
    // 4. Lógica de Pago y Generación de PDF
    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (paymentForm.checkValidity()) {
            const successAlert = document.getElementById('payment-success-alert');
            successAlert.classList.remove('d-none');
            
            const customerName = document.getElementById('fullName').value;

            setTimeout(() => {
                generatePDF(customerName);
                paymentModal.hide();
                successAlert.classList.add('d-none');
                paymentForm.classList.remove('was-validated');
                paymentForm.reset();
                cart = [];
                updateCart();
            }, 1500);
        }
        
        paymentForm.classList.add('was-validated');
    });

    function generatePDF(customerName) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [80, 150]
        });

        const storeName = "ShopMaster";
        const date = new Date().toLocaleString();
        let y = 10;

        doc.setFont('Courier', 'bold');
        doc.setFontSize(12);
        doc.text(storeName, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += 8;

        doc.setFont('Courier', 'normal');
        doc.setFontSize(8);
        doc.text("---------------------------------", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += 5;

        doc.text(`Fecha: ${date}`, 5, y);
        y += 5;
        doc.text(`Cliente: ${customerName}`, 5, y);
        y += 8;

        doc.text("Producto       Cant.  Subtotal", 5, y);
        y += 2;
        doc.text("---------------------------------", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += 5;

        cart.forEach(item => {
            const subtotal = (item.price * item.quantity).toFixed(2);
            // Usar item.title para el nombre en el PDF
            const name = item.title.length > 14 ? item.title.substring(0, 14) + '.' : item.title;
            doc.text(`${name.padEnd(16)} ${item.quantity.toString().padStart(3)}    $${subtotal.padStart(7)}`, 5, y);
            y += 5;
        });

        doc.text("---------------------------------", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += 5;

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
        doc.setFont('Courier', 'bold');
        doc.setFontSize(10);
        doc.text(`TOTAL: $${total.padStart(7)}`, 40, y);

        doc.save(`recibo_ShopMaster_${Date.now()}.pdf`);
    }

    // Inicialización
    fetchProducts();
    updateCart();
});