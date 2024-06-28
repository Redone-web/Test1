document.addEventListener('DOMContentLoaded', () => {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return JSON.parse(parts.pop().split(';').shift());
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
    }

    function updateFavouritesCountBadge() {
        const favourites = getCookie('favourites') || [];
        const favouritesCount = favourites.length;
        const favouritesCountBadge = document.getElementById('favouritesCount');

        if (favouritesCountBadge) {
            favouritesCountBadge.textContent = favouritesCount.toString();

            if (favouritesCount === 0) {
                favouritesCountBadge.style.display = 'none';
            } else {
                favouritesCountBadge.style.display = 'block';
            }
        }
    }

    function displayFavourites() {
        const favourites = getCookie('favourites') || [];
        const favouritesContainer = document.getElementById('favouritesContainer');

        if (favourites.length === 0) {
            favouritesContainer.innerHTML = '<div class="no-favourites"><center><br><br><br><h2>Vous n\'avez aucun produit dans votre liste de favoris.</h2> <br><br><center><img src="assets/images/homescreen-1/search-screen/no-favourites.jpeg" alt="No favourites" width="343" height="240"></center></div>';
            favouritesContainer.classList.remove('wishlist-wrapper-full');
            return;
        } else {
            favouritesContainer.classList.add('wishlist-wrapper-full');
        }

        favouritesContainer.innerHTML = '';

        favourites.forEach(product => {
            const productHtml = `
                <div class="shoes-screen-wrapper electronic-redirect" data-id="${product.id}">
                    <div class="shoes-screen-top">
                        <a href="#">
                            <div class="shoes-img wishlist-img">
                                <img src="${product.image}" alt="product-img">
                            </div>
                        </a>
                        <div class="clothes-favourite">
                            <a href="javascript:void(0);" class="item-bookmark active" tabindex="-1">
                                <img src="assets/images/icons/unfill-heart.svg" alt="unfill-heart">
                            </a>
                        </div>
                    </div>
                    <div class="shoes-screen-bottom">
                        <div class="shoes-screen-bottom-full">
                            <div class="shoes-screen-first">
                                <h3>${product.name}</h3>
                            </div>
                            <div class="shoes-screen-second">
                                <div class="cloth-txt1">
                                    <span>$${product.price.toFixed(2)}</span>
                                </div>
                                <div class="shoes-screen-second-full">
                                    <span class="cloth-star"><img src="assets/images/icons/orange-star.svg" alt="star-img"></span>
                                    <span class="cloth-txt2">5.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            favouritesContainer.insertAdjacentHTML('beforeend', productHtml);
        });

        // Add event listeners to newly added elements
        document.querySelectorAll('.clothes-favourite').forEach(button => {
            button.addEventListener('click', event => {
                const productElement = event.target.closest('.shoes-screen-wrapper');
                if (productElement) {
                    const productId = productElement.dataset.id;
                    removeFavourite(productId);
                }
            });
        });
    }

    function removeFavourite(productId) {
        let favourites = getCookie('favourites') || [];
        favourites = favourites.filter(product => product.id !== productId);
        setCookie('favourites', favourites, 7);
        updateFavouritesCountBadge();
        displayFavourites();
    }

    displayFavourites();
});