document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour mettre à jour la classe du bouton de favoris
    function updateFavouriteButtonClass(productId) {
        const buttons = document.querySelectorAll(`.product_favorie[data-id="${productId}"] .item-bookmark`);
        if (!buttons || buttons.length === 0) return;

        const favourites = getCookie('favourites') || [];
        const isFavourite = favourites.some(product => product.id === productId);

        buttons.forEach(button => {
            if (isFavourite) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Fonction pour mettre à jour le badge du nombre de favoris
    function updateFavouritesCountBadge() {
        const favourites = getCookie('favourites') || [];
        const favouritesCount = favourites.length;
        const favouritesCountBadge = document.getElementById('favouritesCount');
        
        if (favouritesCountBadge) {
            favouritesCountBadge.textContent = favouritesCount.toString();
            
            // Masquer le badge si le nombre de favoris est zéro
            if (favouritesCount === 0) {
                favouritesCountBadge.style.display = 'none';
            } else {
                favouritesCountBadge.style.display = 'block';
            }
        }
    }

    // Fonction pour mettre à jour les boutons et le badge
    function updateFavourites() {
        const products = document.querySelectorAll('.product_favorie');
        products.forEach(product => {
            const productId = product.dataset.id;
            updateFavouriteButtonClass(productId);
        });
        updateFavouritesCountBadge();
    }

    // Appeler updateFavourites au chargement de la page pour afficher le nombre initial
    updateFavourites();

    // Fonction pour ajouter ou retirer des favoris
    function toggleFavourite(productId) {
        let favourites = getCookie('favourites') || [];
        const index = favourites.findIndex(product => product.id === productId);

        if (index !== -1) {
            // Le produit est déjà dans les favoris, le retirer
            favourites.splice(index, 1);
        } else {
            // Ajouter le produit aux favoris
            const productElements = document.querySelectorAll(`.product_favorie[data-id="${productId}"]`);
            if (productElements.length > 0) {
                const productName = productElements[0].dataset.name;
                const productPrice = parseFloat(productElements[0].dataset.price);
                const productImage = productElements[0].dataset.image;
                const productColor = productElements[0].dataset.color;
                const productSize = productElements[0].dataset.size;

                favourites.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    color: productColor,
                    size: productSize
                });
            }
        }

        // Mettre à jour les cookies des favoris
        setCookie('favourites', favourites, 7);

        // Mettre à jour visuellement le bouton de favoris et le badge
        updateFavouriteButtonClass(productId);
        updateFavouritesCountBadge();
    }

    // Ajouter les écouteurs d'événements pour chaque bouton de favori dans toutes les sections
    document.querySelectorAll('.home-page-favourite .item-bookmark, .home-page-arrival-favourite .item-bookmark, .clothes-favourite .item-bookmark, .home-page-featured-favourite .item-bookmark,.single-clothes-favourite .item-bookmark').forEach(button => {
        button.addEventListener('click', event => {
            const productElement = event.target.closest('.product_favorie');
            if (productElement) {
                const productId = productElement.dataset.id;
                toggleFavourite(productId);
            }
        });
    });

    // Écouteur pour l'événement pageshow pour mettre à jour les favoris
    window.addEventListener('pageshow', () => {
        updateFavourites();
    });
});
