import products from "./products.js";
import cart from "./cart.js";

let app = document.getElementById('app');
let temporaryContent = document.getElementById('temporaryContent');

//load template file
const loadTemplate = function () {
    fetch('/template.html')
    .then(response => response.text())
    .then(html => {
        app.innerHTML = html;
        let contentTab = document.getElementById('contentTab');
        contentTab.innerHTML = temporaryContent.innerHTML;
        temporaryContent.innerHTML = null;
        cart();
        initApp();
        initCarousel();
    });
}
loadTemplate(); 

const initApp = () => {
    let idProduct = new URLSearchParams(window.location.search).get('id');
    let info = products.filter((value) => value.id == idProduct)[0];
    let detail = document.querySelector('.detail');
    detail.querySelector('.review-content h5').innerText = info.name + info.sex + info.sire + "x" + info.dameSire ;
   
    detail.querySelector('.slide-one img').src = info.slideOne;
    detail.querySelector('.slide-two img').src = info.slideTwo;
    detail.querySelector('.slide-three img').src = info.slideThree;
    detail.querySelector('.addCart').dataset.id = idProduct;
    detail.querySelector('.desc p').innerText = info.summary;

    
    // Add event listener for add to cart button
    detail.querySelector('.addCart').addEventListener('click', addToCart);

     // Add event listener for Facts & Features button
     detail.querySelector('.btn-facts').addEventListener('click', () => {
        const factsList = `
            <ul>
                <li>Price: ${info.price}</li>
                <li>Colour: ${info.colour}</li>
                <li>Sex: ${info.sex}</li>
                <li>Height: ${info.height}</li>
                <li>Discipline: ${info.discipline}</li>
            </ul>
        `;
        detail.querySelector('.desc').innerHTML = `<h5>Facts & Features</h5>${factsList}`;
    });

        // Add event listener for Overview button
        detail.querySelector('.btn-overview').addEventListener('click', () => {
            detail.querySelector('.desc').innerHTML = `<h5>Description of Horse</h5><p>${info.summary}</p>`;
        });
    
}

function addToCart(event) {
    // Handle adding to cart here
}

// Carousel functionality

let slideIndex = 1;

function initCarousel() {
    showSlides(slideIndex);

    // Add event listeners for carousel navigation buttons
    document.querySelector('.prev').addEventListener('click', prevSlide);
    document.querySelector('.next').addEventListener('click', nextSlide);
}

function nextSlide() {
    showSlides(slideIndex += 1);
}

function prevSlide() {
    showSlides(slideIndex -= 1);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("slide");
    const indicators = document.getElementsByClassName("indicator");

    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < indicators.length; i++) {
        indicators[i].className = indicators[i].className.replace(" active", "");
    }

    slides[slideIndex-1].style.display = "block";
    indicators[slideIndex-1].className += " active";
}



