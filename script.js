document.addEventListener('DOMContentLoaded', () => {
    // API URL
    const API_URL = 'https://raw.githubusercontent.com/wilmeldelosantodelarosa-cloud/gamer-api/refs/heads/main/products.json';

    // Selectores del DOM
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

    // --- Carga inicial de productos ---
    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            products = await response.json();
            renderProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            productContainer.innerHTML = `<p class="text-danger text-center">No se pudieron cargar los productos.</p>`;
        }
    };

    // --- Renderizado de productos ---
    const renderProducts = () => {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text price">$${product.price.toFixed(2)}</p>
                            <button class="btn btn-secondary mt-auto" data-id="${product.id}">Ver más</button>
                        </div>
                    </div>
                </div>
            `;
            productContainer.innerHTML += productCard;
        });
    };

    // --- Modal de detalles del producto ---
    productContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-secondary')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            showProductModal(product);
        }
    });
    
    const showProductModal = (product) => {
        const modalTitle = document.getElementById('productModalTitle');
        const modalBody = document.getElementById('productModalBody');
        
        modalTitle.textContent = product.name;
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
                </div>
                <div class="col-md-6">
                    <h3>Detalles</h3>
                    <ul>
                        <li><strong>Categoría:</strong> ${product.category}</li>
                        <li><strong>Descripción:</strong> ${product.description}</li>
                    </ul>
                    <h2 class="price my-3">$${product.price.toFixed(2)}</h2>
                    <div class="d-flex align-items-center mb-3">
                        <label for="quantity-selector" class="form-label me-2">Cantidad:</label>
                        <input type="number" id="quantity-selector" class="form-control" value="1" min="1" style="width: 80px;">
                    </div>
                    <button class="btn btn-primary w-100" id="add-to-cart-btn" data-id="${product.id}">Agregar al Carrito 🛒</button>
                </div>
            </div>
        `;
        productModal.show();

        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantity-selector').value);
            addToCart(product.id, quantity);
            productModal.hide();
        });
    };

    // --- Lógica del Carrito ---
    const addToCart = (productId, quantity = 1) => {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        updateCart();
    };

    const updateCart = () => {
        renderCartItems();
        updateCartCount();
        updateCartTotal();
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const renderCartItems = () => {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            return;
        }
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <p class="mb-0">${item.name}</p>
                        <p class="mb-0 text-muted">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="quantity-controls d-flex align-items-center">
                        <button class="btn btn-sm" data-id="${item.id}" data-action="decrease">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="btn btn-danger btn-sm ms-3 remove-item-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
    };

    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    };

    const updateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    };

    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const id = parseInt(target.getAttribute('data-id'));
        
        if (target.classList.contains('remove-item-btn')) {
            cart = cart.filter(item => item.id !== id);
        } else if (target.dataset.action === 'increase') {
            const item = cart.find(i => i.id === id);
            if(item) item.quantity++;
        } else if (target.dataset.action === 'decrease') {
            const item = cart.find(i => i.id === id);
            if(item && item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(item => item.id !== id);
            }
        }
        updateCart();
    });

    // --- Lógica de Pago ---
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            cartOffcanvas.hide();
            paymentModal.show();
        } else {
            alert("Tu carrito está vacío.");
        }
    });

    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        if (e.target.checkValidity() === false) {
             e.stopPropagation();
             e.target.classList.add('was-validated');
        } else {
            generatePDF(fullName);
            paymentModal.hide();
            
            // Limpiar carrito después de la compra
            cart = [];
            updateCart();
            
            // Mostrar confirmación
            alert('¡Gracias por tu compra! Tu ticket se está descargando.');
        }
    });

    // --- Generación de PDF ---
    const generatePDF = (customerName) => {
        const { jsPDF } = window.jspdf;
        // Dimensiones para recibo térmico (80mm de ancho)
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 200] // Ancho de 80mm, alto flexible
        });

        const storeName = "Kratos Tech";
        const date = new Date().toLocaleString();
        let y = 10; // Posición vertical inicial

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
        doc.text("---------------------------------------", 40, y, { align: 'center' });
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

        doc.text("---------------------------------------", 40, y, { align: 'center' });
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
        
        doc.save(`ticket_${storeName}_${new Date().getTime()}.pdf`);
    };

    // --- Inicialización ---
    fetchProducts();
    updateCart();
});
