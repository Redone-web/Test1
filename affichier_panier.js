let discount = 0; // Variable globale pour la réduction



// Fonction pour afficher le panier dans le HTML
// Fonction pour afficher le panier dans le HTML
function displayCart() {
    const cartItems = getCookie('cart') || [];
    const cartContainer = document.querySelector('.cart-without-promocode-full');
    const withoutCodeSecond = document.querySelector('.without-code-second-full');
    const checkPageBottom = document.querySelector('.check-page-bottom');
    const withoutCodeLast = document.querySelector('.without-code-last-full');

// Création du conteneur principal
const container = document.createElement('div');
container.classList.add('empty-cart-container'); // Ajoutez une classe au conteneur si nécessaire

// Création de l'élément <h2> pour le message
const emptyCartMessage = document.createElement('h2');
emptyCartMessage.textContent = 'Votre panier est vide.';
emptyCartMessage.classList.add('empty-cart-message');
emptyCartMessage.style.textAlign = 'center'; // Style CSS pour centrer le texte

// Création d'une balise <br> pour le saut de ligne
const lineBreak = document.createElement('br');

// Création et configuration de l'image
const imgElement = document.createElement('img');
imgElement.src = 'assets/images/homescreen-1/search-screen/no-favourites.jpeg'; // Chemin vers votre image
imgElement.alt = 'Image alternative'; // Texte alternatif pour l'accessibilité
imgElement.width = '343'; // Largeur de l'image
imgElement.height = '240'; // Hauteur de l'image

// Ajout du message et de l'image au conteneur
container.appendChild(emptyCartMessage); // Ajoute le message à l'intérieur du conteneur
container.appendChild(lineBreak); // Ajoute un saut de ligne à l'intérieur du conteneur
container.appendChild(imgElement); // Ajoute l'image à l'intérieur du conteneur

    // Vérifier si le panier est vide
    if (cartItems.length === 0) {
        cartContainer.innerHTML = ''; // Efface le contenu actuel du panier
        withoutCodeSecond.style.display = 'none'; // Masque la section without-code-second-full
        checkPageBottom.style.display = 'none'; // Masque la section check-page-bottom
        withoutCodeLast.style.display = 'none'; // Masque la section without-code-last-full

        // Affiche le message de panier vide
        cartContainer.appendChild(emptyCartMessage);
    } else {
        // Affiche le contenu du panier et masque le message de panier vide s'il y en avait un
        cartContainer.innerHTML = '';
        withoutCodeSecond.style.display = 'block';
        checkPageBottom.style.display = 'block';
        withoutCodeLast.style.display = 'block';

        let subtotal = 0;
        const delivery = 15; // Vous pouvez ajuster cette valeur selon les besoins

        cartItems.forEach(product => {
            const productTotal = product.price * product.quantity;
            subtotal += productTotal;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-without-promocode-first');

            cartItem.innerHTML = `
                <div class="cart-without-promocode-first-full">
                    <div>
                        <div class="cart-without-img-sec">
                            <img src="${product.image}" alt="clothes-img" width="140" height="140">
                        </div>
                    </div>
                    <div class="cart-without-content-sec">
                        <div class="cart-without-content-sec-full">
                            <p class="price-code-txt1">${product.name}</p>
                            <p class="price-code-txt2">${product.price.toFixed(2)} €</p>
                            <div class="card-without-price-sec">
                                <div class="price-code-txt3">
                                    <span>Couleur:</span>
                                    <span>${product.color}</span>
                                </div>
                                <div class="price-code-txt3">
                                    <span>Taille:</span>
                                    <span>${product.size}</span>
                                </div>
                            </div>
                            <div class="card-without-promocode-increment">
                                <div class="product-incre">
                                    <a href="javascript:void(0)" class="product__minus sub" data-id="${product.id}" data-color="${product.color}" data-size="${product.size}">
                                        <span>
                                            <svg width="8" height="8" viewBox="0 0 8 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1H7" stroke="#707070" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                        </span>
                                    </a>
                                    <input name="quantity" type="text" class="product__input" value="${product.quantity}">
                                    <a href="javascript:void(0)" class="product__plus add" data-id="${product.id}" data-color="${product.color}" data-size="${product.size}">
                                        <span>
                                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 4H7" stroke="#707070" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M4 7V1" stroke="#707070" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cart-boder mt-16"></div>
            `;

            cartContainer.appendChild(cartItem);
        });

        // Ajouter des écouteurs pour les boutons de quantité
        document.querySelectorAll('.product__minus').forEach(button => {
            button.addEventListener('click', updateQuantity);
        });

        document.querySelectorAll('.product__plus').forEach(button => {
            button.addEventListener('click', updateQuantity);
        });

        // Mettre à jour les totaux dans le HTML
        const totalElement = document.querySelector('.check-price-list1 p');
        const discountElement = document.querySelector('.col-green');
        const deliveryElement = document.querySelector('.col-red');
        const finalTotalElement = document.querySelector('.price-txt');

        const discountAmount = subtotal * discount;
        const finalTotal = subtotal - discountAmount + delivery;

        totalElement.textContent = `${subtotal.toFixed(2)} €`;
        discountElement.textContent = `-${discountAmount.toFixed(2)} €`;
        deliveryElement.textContent = `+${delivery.toFixed(2)} €`;
        finalTotalElement.textContent = `${finalTotal.toFixed(2)} €`;
    }

    // Mettre à jour le badge du panier
    updateCartBadge();
}

// Fonction pour mettre à jour la quantité des produits dans le panier
function updateQuantity(event) {
    const button = event.target.closest('a');
    if (!button) return;

    const cart = getCookie('cart') || [];
    const productId = button.dataset.id;
    const productColor = button.dataset.color;
    const productSize = button.dataset.size;

    const productIndex = cart.findIndex(product => 
        product.id === productId &&
        product.color === productColor &&
        product.size === productSize
    );

    if (productIndex !== -1) {
        if (button.classList.contains('sub')) {
            if (cart[productIndex].quantity > 1) {
                cart[productIndex].quantity -= 1;
            } else {
                cart.splice(productIndex, 1);
            }
        } else if (button.classList.contains('add')) {
            cart[productIndex].quantity += 1;
        }

        setCookie('cart', cart, 7);
        displayCart();
    }
}

// Fonction pour appliquer le code promo
// Fonction pour appliquer le code promo
// Fonction pour appliquer le code promo
function applyPromoCode() {
    const promoCodeInput = document.getElementById('promo-code-input');
    const promoCode = promoCodeInput.value.trim().toLowerCase();
    let message = '';
    let alertClass = ''; // Classe Bootstrap pour le style de la popup

    if (promoCode === 'hajar') {
        discount = 0.10; // Réduction de 10%
        message = 'Code promo appliqué avec succès !';
        alertClass = 'alert-success'; // Classe Bootstrap pour succès (vert)
    } else {
        discount = 0; // Aucun code promo valide
        message = 'Code promo invalide.';
        alertClass = 'alert-danger'; // Classe Bootstrap pour erreur (rouge)
    }

    // Création de la popup Bootstrap
    const popupMessage = document.createElement('div');
    popupMessage.classList.add('alert', 'alert-dismissible', 'fade', 'show', alertClass);
    popupMessage.setAttribute('role', 'alert');
    popupMessage.innerHTML = `
        <strong>${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const popupContainer = document.getElementById('popup-container'); // Remplacez par votre conteneur de popup

    // Effacer le contenu précédent et ajouter la nouvelle popup
    popupContainer.innerHTML = ''; // Efface le contenu précédent
    popupContainer.appendChild(popupMessage); // Ajoute la nouvelle popup

    // Fermer la popup après 2 secondes
    setTimeout(() => {
        popupContainer.innerHTML = ''; // Efface la popup après 2 secondes
    }, 2000);

    displayCart(); // Mettre à jour le panier après avoir appliqué le code promo
}




// Ajouter un écouteur d'événement pour le bouton d'application du code promo
document.getElementById('apply-promo-code').addEventListener('click', applyPromoCode);

// Appeler la fonction pour afficher le panier au chargement de la page
document.addEventListener('DOMContentLoaded', displayCart);

// Fonction pour mettre à jour le badge du panier
function updateCartBadge() {
    const cart = getCookie('cart') || [];
    const totalCount = cart.reduce((sum, product) => sum + product.quantity, 0);
    const badge = document.querySelector('.badge');
    if (badge) {
        if (totalCount === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'block';
            badge.textContent = totalCount;
        }
    }
}
