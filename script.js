document.addEventListener('DOMContentLoaded', () => {
    // URL de la API de productos
   const API_URL = 'https://raw.githubusercontent.com/wilmeldelosantodelarosa-cloud/gamer-api/main/products.json';

    // Selectores de elementos del DOM
    const productContainer = document.getElementById('product-container');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));

    // Estado de la aplicación
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Cargar productos desde la API ---
    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('La respuesta de la red no fue exitosa');
            products = await response.json();
            renderProducts();
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            productContainer.innerHTML = `<p class="text-danger text-center col-12">No se pudieron cargar los productos. Intenta recargar la página.</p>`;
        }
    };

    // --- Dibujar los productos en la página ---
    const renderProducts = () => {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = `
                <div class="col-lg-3 col-md-4 col-sm-6 d-flex align-items-stretch">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text price mt-2">$${product.price.toFixed(2)}</p>
                            <button class="btn btn-secondary mt-auto" data-id="${product.id}">Ver más</button>
                        </div>
                    </div>
                </div>
            `;
            productContainer.innerHTML += productCard;
        });
    };

    // --- Manejar el clic en "Ver más" ---
    productContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-secondary')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            if (product) showProductModal(product);
        }
    });
    
    // --- Mostrar el modal con detalles del producto ---
    const showProductModal = (product) => {
        document.getElementById('productModalTitle').textContent = product.name;
        document.getElementById('productModalBody').innerHTML = `
            <div class="row">
                <div class="col-md-6 text-center">
                    <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
                </div>
                <div class="col-md-6">
                    <h3>Detalles</h3>
                    <ul class="list-unstyled">
                        <li><strong>Categoría:</strong> ${product.category}</li>
                        <li><strong>Descripción:</strong> ${product.description}</li>
                    </ul>
                    <h2 class="price my-3">$${product.price.toFixed(2)}</h2>
                    <div class="d-flex align-items-center mb-3">
                        <label for="quantity-selector" class="form-label me-2 mb-0">Cantidad:</label>
                        <input type="number" id="quantity-selector" class="form-control" value="1" min="1" style="width: 80px;">
                    </div>
                    <button class="btn btn-primary w-100" id="add-to-cart-btn" data-id="${product.id}">Agregar al Carrito 🛒</button>
                </div>
            </div>
        `;
        productModal.show();

        document.getElementById('add-to-cart-btn').addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const quantity = parseInt(document.getElementById('quantity-selector').value);
            addToCart(id, quantity);
            productModal.hide();
        });
    };

    // --- Lógica del Carrito de Compras ---
    const addToCart = (productId, quantity) => {
        const productInCart = cart.find(item => item.id === productId);
        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            const productToAdd = products.find(p => p.id === productId);
            cart.push({ ...productToAdd, quantity });
        }
        updateCart();
    };

    const updateCart = () => {
        renderCartItems();
        updateCartUI();
        localStorage.setItem('cart', JSON.stringify(cart));
    };
    
    const updateCartUI = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    };

    const renderCartItems = () => {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
            return;
        }
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <p class="mb-0 small">${item.name}</p>
                    <p class="mb-0 text-muted small">$${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls d-flex align-items-center">
                    <button class="btn btn-sm" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <button class="btn btn-danger btn-sm ms-3 remove-item-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    };

    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = parseInt(target.getAttribute('data-id'));
        const action = target.getAttribute('data-action');

        if (target.classList.contains('remove-item-btn')) {
            cart = cart.filter(item => item.id !== id);
        } else {
            const item = cart.find(i => i.id === id);
            if (item) {
                if (action === 'increase') {
                    item.quantity++;
                } else if (action === 'decrease') {
                    item.quantity--;
                    if (item.quantity === 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                }
            }
        }
        updateCart();
    });

    // --- Lógica de Pago y Generación de PDF ---
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            cartOffcanvas.hide();
            paymentModal.show();
        } else {
            alert("Tu carrito está vacío. Agrega productos para poder pagar.");
        }
    });

    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const customerName = document.getElementById('fullName').value;

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
        } else {
            generatePDF(customerName);
            paymentModal.hide();
            form.classList.remove('was-validated');
            form.reset();
            
            cart = [];
            updateCart();
            
            alert('✅ ¡Gracias por tu compra!\nTu ticket se ha descargado.');
        }
    });

    const generatePDF = (customerName) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 200]
        });

        const storeName = "Kratos Tech";
        const date = new Date().toLocaleString();
        let y = 10;

        doc.setFont('Courier', 'bold');
        doc.setFontSize(12);
        doc.text(storeName, 40, y, { align: 'center' });
        y += 7;
        
        doc.setFont('Courier', 'normal');
        doc.setFontSize(8);
        doc.text(date, 40, y, { align: 'center' });
        y += 5;
        doc.text(`Cliente: ${customerName}`, 5, y);
        y += 5;
        doc.text("-".repeat(45), 40, y, { align: 'center' });
        y += 5;
        
        doc.setFontSize(7);
        cart.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            const line1 = `${item.quantity}x ${item.name.substring(0, 25)}`;
            const line2 = `$${itemTotal}`;
            doc.text(line1, 5, y);
            doc.text(line2, 75, y, { align: 'right' });
            y += 4;
        });

        doc.text("-".repeat(45), 40, y, { align: 'center' });
        y += 5;

        doc.setFont('Courier', 'bold');
        doc.setFontSize(10);
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        doc.text("TOTAL:", 5, y);
        doc.text(`$${total.toFixed(2)}`, 75, y, { align: 'right' });
        y += 7;
        
        doc.setFont('Courier', 'normal');
        doc.setFontSize(8);
        doc.text("¡Gracias por su compra!", 40, y, { align: 'center' });
        
        doc.save(`ticket_KratosTech_${Date.now()}.pdf`);
    };

    // --- Inicialización de la aplicación ---
    fetchProducts();
    updateCart();
});
