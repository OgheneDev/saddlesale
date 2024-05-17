import products from "./products.js";
import cart from "./cart.js";

let appp = document.getElementById('app');
let temporaryContent = document.getElementById('temporaryContent');

// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getFirestore, collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"; // Import Firestore module

document.querySelector('body').style.backgroundColor = 'white';

// Load template file
const loadTemplate = () => {
    fetch('/template.html')
    .then(response => response.text())
    .then(html => {
        appp.innerHTML = html;
        let contentTab = document.getElementById('contentTab');
        contentTab.innerHTML = temporaryContent.innerHTML;
        temporaryContent.innerHTML = null;
        cart();
    });
}
loadTemplate();

const populateOrder = () => {
    const orderContainer = document.getElementById('order');
    console.log('Order Container:', orderContainer);

    const cart = JSON.parse(localStorage.getItem('cart'));
    console.log('Cart Items:', cart);

    // Clear existing content
    orderContainer.innerHTML = "";

    if (cart && cart.length > 0) {
        let totalPrice = 0; // Initialize total price variable
        cart.forEach(item => {
            // Find the product information based on the item's product_id
            let product = products.find(product => product.id == item.product_id);
            
            // Check if the product is found
            if (product) {
                // Calculate the total price
                totalPrice += product.price * item.quantity;

                // Create a new cart item element
                let newItem = document.createElement('div');
                newItem.classList.add('cart-item');
                newItem.innerHTML = `
                <div class="info-container">
                    <div class="info">
                        <div class="image">
                            <img src="${product.image}">
                        </div>
                        <div class="about">
                            <p>${product.name}, ${product.sex} <br> ${product.sire} x ${product.dameSire}</p>
                        </div>
                    </div>
                    <button class="btn-delete" data-id="${product.id}">
                        <img src="./images/Vector (15).svg" alt="">
                    </button>
                </div>`;

                // Append the new cart item to the order container
                orderContainer.appendChild(newItem);
            }
        });

        // Create and append the total price element
        let totalPriceElement = document.createElement('div');
        totalPriceElement.classList.add('total-price');
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        orderContainer.appendChild(totalPriceElement);
    } else {
        orderContainer.textContent = "Your cart is empty.";
    }
};

// Add event listener to handle deletion of items
document.addEventListener('click', (event) => {
    if (event.target.closest('.btn-delete')) {
        const productId = event.target.closest('.btn-delete').dataset.id;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Remove the item from the cart
        cart = cart.filter(item => item.product_id != productId);

        // Update local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Re-populate the order container
        populateOrder();
    }
});

populateOrder();

const firebaseConfig = {
    apiKey: "AIzaSyDHIcilHwvBLQCQCzLNBMlmArIxsiU4eA4",
    authDomain: "ehorse-c5d62.firebaseapp.com",
    projectId: "ehorse-c5d62",
    storageBucket: "ehorse-c5d62.appspot.com",
    messagingSenderId: "577243024543",
    appId: "1:577243024543:web:5713681f1401d0a760e6aa",
    measurementId: "G-T8G5JY06T3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Get Firestore instance

const showCryptoList = async () => {
    let emailValue = document.getElementById('emailInput');
    let contact = document.getElementById('contact');
    let cryptoList = document.getElementById('cryptocurrencies');
    let paymentContainer = document.getElementById('payment-container');

    if(emailValue.value.trim() === '' || !isValidEmail(emailValue.value)) {
        alert('Please enter a valid email.');
    } else {
        await saveEmailToFirebase(emailValue.value);

        paymentContainer.style.display = 'block';
        contact.style.display = 'none';
        cryptoList.style.display = 'block';
    }
}

// Highlighted Timer Function
const startTimer = (duration, display, callback) => {
    let timer = duration, minutes, seconds;
    const intervalId = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(intervalId);
            callback();
        }
    }, 1000);
};

const handleCryptoSelection = async (cryptoName) => {
    let email = await getEmailFromFirebase(); // Retrieve email from Firebase
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

     // Calculate the total price in the selected cryptocurrency
     let totalPriceCrypto = 0;
     cart.forEach(item => {
         let product = products.find(product => product.id == item.product_id);
         if (product) {
             totalPriceCrypto += product.cryptoPrices[cryptoName] * item.quantity;
         }
     }); 

    document.getElementById('cryptocurrencies').style.display = 'none';

    // Create payment details container
    let paymentDetails = document.createElement('div');
    paymentDetails.classList.add = 'payment-details';
    paymentDetails.innerHTML = `
        <div class="crypto-name">
            <img src="./images/${cryptoName.toLowerCase()}_icon.svg" alt="${cryptoName} Icon" class="crypto-icon">
            <h4>Pay with ${cryptoName}</h4>
        </div>
        <div id="qr-code-container">
            <img id="qr-code" src="./images/${cryptoName.toLowerCase()}_qr.png" alt="${cryptoName} QR Code">
        </div>
        <div class="address">
            <h4>Payment Details</h4>
            <h5>Email: ${email}</h5>
            <h5>Amount to Pay: ${totalPriceCrypto.toFixed(8)}   ${cryptoName}</h5>
            <h5>Payment Unique Address: </h5>
            <div class="address-number">
                <p id="unique-address">${paymentAddresses[cryptoName]}</p>
                <button id="copy-address-btn" class="copy-btn">
                    <img src="./images/copy-icon.svg" alt="Copy Icon">
                </button>
            </div>
        </div>
        <div class="timer">
        <h4>Expires in:</h4>
        <span id="timer">30:00</span>
        </div>
        <div class="payment-button"><button id="make-payment">Payment Made</button></div>
    `;
    document.getElementById('payment-container').appendChild(paymentDetails);

    // Start the timer when a crypto item is selected
    startTimer(30 * 60, document.getElementById('timer'), () => {
        document.getElementById('contact').style.display = 'block';
        document.getElementById('cryptocurrencies').style.display = 'none';
        document.getElementById('payment-container').style.display = 'none';
    });
};

const paymentAddresses = {
    "Bitcoin": "bc1q6c4hpzrlh6luyrvyvf42c7u94gf0568p6yn90",
    "Lightning": "0x7CA6548FaEdCFD09FcD9A456c9D177667545C8EB",
    "Ethereum": "0x4A6b54fEeE989A3d7EE83EfB24bdf6781E9F0C62",
    "USDC": "0x7CA6548FaEdCFD09FcD9A456c9D177667545C8EB",
    "Tether": "TPaUnSNphG5Xa69ysNterfjZJKQmhppiNY",
    "LTC": "TPaUnSNphG5Xa69ysNterfjZJKQmhppiNY",
    "Doge": "D7mXNuAVsLW12XeyQq7SM8kqKxMcc7eS5R"

    // Add more payment addresses for other cryptocurrencies here
};

document.addEventListener('click', (event) => {
    let buttonClick = event.target;
    
    if (buttonClick.classList.contains('btn-payment')) {
        showCryptoList();
    }

    if (event.target.tagName === 'LI') {
        let cryptoName = event.target.textContent;
        let paymentAddress = paymentAddresses[cryptoName];
        handleCryptoSelection(cryptoName, paymentAddress); // Pass the selected cryptocurrency name and payment address to the function
    }

    if (buttonClick.id === 'copy-address-btn' || buttonClick.parentElement.id === 'copy-address-btn') {
        const addressText = document.getElementById('unique-address').textContent;
        navigator.clipboard.writeText(addressText).then(() => {
            alert('Address copied to clipboard');
        }).catch(err => {
            console.error('Error copying address to clipboard: ', err);
        });
    }

    if (buttonClick.id === 'make-payment') {
        // Display payment successful message
        document.getElementById('payment-container').innerHTML = '<div class="payment-success">Payment Successful. Hold on for confirmation.</div>';
    }
});

const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}

const saveEmailToFirebase = async (email) => {
    try {
        // Specify the document ID
        const docRef = await setDoc(doc(db, "emails", "9wYLRabYcXAnZEX7jrP4"), {
            email: email
        });
        
    } catch (error) {
        console.error("Error adding email: ", error);
    }
};

const getEmailFromFirebase = async () => {
    try {
        const docRef = doc(db, "emails", "9wYLRabYcXAnZEX7jrP4");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().email;
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document: ", error);
    }
};



























