// Fonction pour définir un cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
}

// Fonction pour obtenir un cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(nameEQ)) {
            return JSON.parse(cookie.substring(nameEQ.length));
        }
    }
    return null;
}

// Fonction pour ajouter au panier
function addToCart(event) {
    const button = event.target.closest('.plus-bnt-home1, .add-to-cart-cloth-btn');
    if (!button) return;

    const productElement = button.closest('.product');
    const productId = productElement.dataset.id;
    const productName = productElement.dataset.name;
    const productPrice = parseFloat(productElement.dataset.price);
    const productImage = productElement.dataset.image;
    const productColor = productElement.dataset.color;
    const productSize = productElement.dataset.size;

    if (isNaN(productPrice)) {
        console.error('Le prix du produit n\'est pas valide.');
        return;
    }

    let cart = getCookie('cart') || [];

    const existingProductIndex = cart.findIndex(product => 
        product.id === productId && 
        product.name === productName && 
        product.price === productPrice &&
        product.image === productImage &&
        product.color === productColor &&
        product.size === productSize
    );

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            color: productColor,
            size: productSize,
            quantity: 1
        };
        cart.push(product);
    }

    setCookie('cart', cart, 7);

    updateCartBadge();

    // Afficher l'alerte Bootstrap
    showAlert('Article ajouté à votre panier.');
}

// Fonction pour afficher une alerte Bootstrap
function showAlert(message) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alert);

    // Faire disparaître l'alerte après 2 secondes
    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('hide');
        setTimeout(() => alert.remove(), 150);
    }, 2000);
}

// Fonction pour mettre à jour le badge du panier
function updateCartBadge() {
    const cart = getCookie('cart') || [];
    const totalCount = cart.reduce((sum, product) => sum + product.quantity, 0);
    const badge = document.querySelector('.badge');
    if (badge) {
        badge.style.display = totalCount === 0 ? 'none' : 'block';
        badge.textContent = totalCount;
    }
}

// Ajouter les écouteurs d'événements à chaque bouton "Ajouter au panier"
document.querySelectorAll('.plus-bnt-home1 a, .add-to-cart-cloth-btn a').forEach(button => {
    button.addEventListener('click', addToCart);
});

// Mettre à jour le badge du panier lors du chargement de la page
document.addEventListener('DOMContentLoaded', updateCartBadge);
