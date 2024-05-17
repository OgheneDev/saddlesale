import products from "./products.js";

const cart = () => {
    let iconCart = document.querySelector('.icon-cart');
    let cartTab = document.querySelector('.cartTab');
    let keepShopping = document.querySelector('.btn-shop');
    let mobileMenu = document.querySelector('.mobile-menu');
    let menuButton = document.querySelector('.menu-icon');
    let closeButton = document.querySelector('.close-icon');
    let cart = [];

    iconCart.addEventListener('click', () => {
        //body.classList.toggle('activeTabCart')
        cartTab.style.display = 'block';
    });

    keepShopping.addEventListener('click', () => {
        cartTab.style.display = 'none';
    });

    menuButton.addEventListener('click', () => {
        mobileMenu.style.display = 'block';
        closeButton.style.display = 'block';
        menuButton.style.display = 'none';
    });

    closeButton.addEventListener('click', () => {
         mobileMenu.style.display = 'none';
         closeButton.style.display = 'none';
         menuButton.style.display = 'block';
    });

    const setProductInCart = (idProduct) => {
        let existingItem = cart.find(item => item.product_id === idProduct);
        if (!existingItem) {
            cart.push({
                product_id: idProduct,
                quantity: 1
            });
        } else {
            existingItem.quantity = 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        refreshCartHTML();
    }

    const removeProductFromCart = (idProduct) => {
        cart = cart.filter(item => item.product_id !== idProduct);
        localStorage.setItem('cart', JSON.stringify(cart));
        refreshCartHTML();
    }

    const refreshCartHTML = () => {
        let listHTML = document.querySelector('.listCart');
        let totalHTML = document.querySelector('.icon-cart span');
        let totalQuantity = 0;
        listHTML.innerHTML = null;
        cart.forEach(item => {
            totalQuantity++;
            let position = products.findIndex(value => value.id == item.product_id);
            let info = products[position];
            let newItem = document.createElement('div');
            newItem.classList.add('cart-item');
            newItem.innerHTML = `
                <div class="info-container">
                <div class="info">
                <div class="image">
                <img src="${info.image}">
            </div>
            <div class="about">
                <p>${info.name}, ${info.sex} <br> ${info.sire} x ${info.dameSire}</p>
            </div>
                </div>
                
                    <button class="btn-delete" data-id="${info.id}">
                        <img src="./images/Vector (15).svg" alt="">
                    </button>
                </div>`;
                
                listHTML.appendChild(newItem);

                let deleteButton = newItem.querySelector('.btn-delete');
                console.log('Delete Button');
                
                deleteButton.addEventListener('click', () => {
                    const productId = deleteButton.getAttribute('data-id');
                  removeProductFromCart(productId);
                });
                
                });
               
        
        totalHTML.innerText = totalQuantity;
    }

    const redirectToCheckout = () => {
        window.location.href = 'checkout.html'; // Redirect to checkout.html
    };

    // Event listeners
    document.addEventListener('click', (event) => {
        let buttonClick = event.target;
        let idProduct = buttonClick.dataset.id;
        let position = cart.findIndex(value => value.product_id == idProduct);

        if (buttonClick.classList.contains('addCart')) {
            setProductInCart(idProduct, position);
        } 
        

          // Check if the clicked button has class 'btn-checkout'
          if (buttonClick.classList.contains('btn-checkout')) {
            redirectToCheckout();
        }
    });

    const initApp = () => {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        refreshCartHTML();
    }
    initApp();
}

export default cart;













