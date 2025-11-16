document.addEventListener('DOMContentLoaded', () => {

    // --- LISTA DE PRODUCTOS INTEGRADA ---
    // Ya no se necesita una API. Los productos están aquí mismo.
    const products = [
        { "id": 1, "name": "NVIDIA GeForce RTX 4090", "category": "Tarjeta Gráfica", "price": 1899.99, "image": "https://i.imgur.com/TNHuVrV.jpeg", "description": "La GPU más poderosa del mercado, ideal para gaming 4K y creación de contenido." },
        { "id": 2, "name": "AMD Radeon RX 7900 XTX", "category": "Tarjeta Gráfica", "price": 1099.99, "image": "https://i.imgur.com/NFQEozd.jpeg", "description": "Una tarjeta gráfica de última generación con excepcional rendimiento en 4K." },
        { "id": 3, "name": "Intel Core i9-14900K", "category": "Procesador", "price": 649.99, "image": "https://i.imgur.com/CG7sOUC.png", "description": "CPU tope de gama para gaming competitivo y tareas intensivas." },
        { "id": 4, "name": "AMD Ryzen 9 7950X", "category": "Procesador", "price": 599.99, "image": "https://i.imgur.com/QxTFchJ.png", "description": "Procesador AM5 de 16 núcleos ideal para multitarea extrema." },
        { "id": 5, "name": "MSI MPG X670E Carbon WiFi", "category": "Placa Base", "price": 399.99, "image": "https://i.imgur.com/0SDk90E.png", "description": "Placa base premium para procesadores Ryzen serie 7000." },
        { "id": 6, "name": "ASUS ROG Strix B650E-F Gaming", "category": "Placa Base", "price": 329.99, "image": "https://i.imgur.com/5NM0w3Z.jpeg", "description": "Placa base con PCIe 5.0 y WiFi 6E para setups modernos." },
        { "id": 7, "name": "Corsair Vengeance DDR5 32GB 6000MHz", "category": "RAM", "price": 169.99, "image": "https://i.imgur.com/S2mwKUV.png", "description": "Memorias DDR5 de alto rendimiento ideales para gaming extremo." },
        { "id": 8, "name": "G.Skill Trident Z5 RGB 32GB 6400MHz", "category": "RAM", "price": 229.99, "image": "https://i.imgur.com/PTyFMA7.png", "description": "RAM DDR5 premium con RGB y alta frecuencia para overclocking." },
        { "id": 9, "name": "Samsung Odyssey G7 32'' 240Hz", "category": "Monitor", "price": 699.99, "image": "https://i.imgur.com/s6sYXlx.jpeg", "description": "Monitor curvo QHD de alta velocidad ideal para eSports." },
        { "id": 10, "name": "LG UltraGear 27GP850-B 165Hz", "category": "Monitor", "price": 379.99, "image": "https://i.imgur.com/3X1CIeR.jpeg", "description": "Monitor 1440p con Nano IPS y colores profesionales." },
        { "id": 11, "name": "NZXT Kraken Z73 RGB", "category": "Refrigeración Líquida", "price": 279.99, "image": "https://i.imgur.com/s0UpibT.png", "description": "AIO de 360mm con pantalla LCD personalizable." },
        { "id": 13, "name": "EVGA SuperNova 1000 G5", "category": "Fuente de Alimentación", "price": 199.99, "image": "https://i.imgur.com/jX9mu9l.png", "description": "Fuente 1000W 80+ Gold totalmente modular." },
        { "id": 15, "name": "NZXT H710i Smart Case", "category": "Case", "price": 199.99, "image": "https://i.imgur.com/tCSZKm4.png", "description": "Case premium con vidrio templado y gestión inteligente de cables." },
        { "id": 17, "name": "Xbox Elite Wireless Controller Series 2", "category": "Controlador", "price": 179.99, "image": "https://i.imgur.com/HWOOTx4.jpeg", "description": "Mando profesional con piezas intercambiables." },
        { "id": 19, "name": "HyperX Cloud III Wireless", "category": "Audífonos", "price": 169.99, "image": "https://i.imgur.com/gkdebiN.png", "description": "Audífonos inalámbricos de alta calidad con sonido envolvente." },
        { "id": 23, "name": "MSI RTX 4080 Super Gaming X Trio", "category": "Tarjeta Gráfica", "price": 1299.99, "image": "https://i.imgur.com/p6JLWRR.png", "description": "GPU de alta gama con gran rendimiento por watt." },
        { "id": 26, "name": "Razer Basilisk V3 Pro", "category": "Mouse", "price": 169.99, "image": "https://i.imgur.com/3u9KVk2.png", "description": "Mouse personalizable con rueda háptica y sensor de 30K DPI." },
        { "id": 28, "name": "SteelSeries Apex Pro TKL", "category": "Teclado", "price": 219.99, "image": "https://i.imgur.com/jjfXSDh.png", "description": "Teclado con switches ajustables y pantalla OLED." },
        { "id": 29, "name": "AOC CU34G2X Curved 34'' 144Hz", "category": "Monitor", "price": 449.99, "image": "https://i.imgur.com/inDnpeo.png", "description": "Monitor ultra ancho ideal para multitarea y gaming." },
        { "id": 30, "name": "HP Victus 15 (2022)", "category": "Laptop gamer", "price": 699.99, "image": "https://i.imgur.com/Uk2d05A.jpeg", "description": "Viene equipada con una CPU Intel Core i5-12500H, una GPU NVIDIA GeForce RTX 3050, 8 GB de RAM y 512 GB de almacenamiento SSD." },
        { "id": 31, "name": "ASUS TUF F15", "category": "Laptop gamer", "price": 669.99, "image": "https://i.imgur.com/tdK8Va4.jpeg", "description": "Un modelo conocido por su durabilidad y buena relación calidad-precio." },
        { "id": 32, "name": "Acer Nitro 5", "category": "Laptop gamer", "price": 1492.29, "image": "https://i.imgur.com/a1WXMV4.jpeg", "description": "Incluye un procesador Intel de decimotercera generación, 1 TB de almacenamiento y una tarjeta gráfica RTX 3050." }
    ];

    // Selectores de elementos del DOM
    const productContainer = document.getElementById('product-container');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));

    // Estado del carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
    renderProducts(); // Dibuja los productos al cargar la página
    updateCart();     // Actualiza el carrito desde localStorage
});
