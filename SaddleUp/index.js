import cart from "./cart.js";
import products from "./products.js";
let app = document.getElementById('app');
let temporaryContent = document.getElementById('temporaryContent');

document.querySelector('body').style.backgroundColor = 'white';

const ageMapping = {
    '0': 'Foal',
    '1': 'Young Horses',
    '2': 'Adults'
};

const disciplineMapping = {
    '0': 'Dressage',
    '1': 'Show Jumping',
    '2': 'Hunter/Jumper',
    '3': 'Eventing',
    '4': 'Pleasure'
};

const breedMapping = {
    '0': 'Arabian',
    '1': 'Apaloosa',
    '2': 'Warmblood',
    '3': 'Friesian',
    '4': 'Pony',
    '5': 'Aegidienberger',
    '6': 'Filly' // Assuming 'Filly' should have a unique value
};

const colourMapping = {
    '0': 'Brown',
    '1': 'Chestnut',
    '2': 'Black',
    '3': 'Gray',
    '4': 'Pinto'
};

const countryMapping = {
    '32': 'Albania',
    '34': 'Algeria',
    '40': 'Argentina',
    '35': 'Australia',
    '16': 'Austria',
    '54': 'Belarus',
    '1': 'Belgium',
    '59': 'Bosnia and Herzegovina',
    '44': 'Brazil',
    '2': 'Bulgaria',
    '11': 'Canada',
    '38': 'China',
    '53': 'Colombia',
    '43': 'Croatia',
    '55': 'Cyprus',
    '25': 'Czech Republic',
    '3': 'Denmark',
    '31': 'Egypt',
    '39': 'Estonia',
    '41': 'Finland',
    '5': 'France',
    '4': 'Germany',
    '6': 'Greece',
    '28': 'Hungary',
    '9': 'Iceland',
    '8': 'Ireland',
    '10': 'Italy',
    '42': 'Japan',
    '51': 'Latvia',
    '58': 'Liechtenstein',
    '45': 'Lithuania',
    '12': 'Luxembourg',
    '56': 'Malta',
    '37': 'Mexico',
    '46': 'Morocco',
    '57': 'Namibia',
    '13': 'Netherlands',
    '36': 'New Zealand',
    '14': 'Norway',
    '15': 'Oman',
    '17': 'Poland',
    '18': 'Portugal',
    '19': 'Romania',
    '20': 'Russia',
    '21': 'Saudi Arabia',
    '48': 'Serbia',
    '50': 'Slovakia',
    '30': 'Slovenia',
    '24': 'Spain',
    '22': 'Sweden',
    '23': 'Switzerland',
    '33': 'Tunisia',
    '26': 'Turkey',
    '29': 'U.A.E',
    '47': 'Ukraine',
    '7': 'United Kingdom',
    '27': 'United States'
};

const sexMapping = {
    '0': 'Stallion',
    '1': 'Mare',
    '2': 'Gelding',
    '3': 'Filly'
};

//load template file
const loadTemplate = () => {
    fetch('/template.html')
    .then(response => response.text())
    .then(html => {
        app.innerHTML = html;
        let contentTab = document.getElementById('contentTab');
        contentTab.innerHTML = temporaryContent.innerHTML;
        temporaryContent.innerHTML = null;
        cart();
        initApp();
        setUpFilterButton();
    });
}
loadTemplate();
const initApp = () => {
    console.log('Initializing app...');
    // load list products
    let listProduct = document.querySelector('.listProduct');
    listProduct.innerHTML = null;
    products.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('item');
         newProduct.innerHTML =
          `
          <div class="item-fav"><img src="./images/Vector (4).svg" alt="" ></div>
         <div class="item-container">
         <div class="profile">
         <a href="detail.html?id=${product.id}">
         <img src="${product.image}" alt="">
         </a>
         <p>${product.name}</p>
     </div>
     <div class="info">
     <div>
     <p class="desktop-name">${product.name}</p>
      <p>Birth Year: ${product.birth}</p>
      <p>Breed: ${product.breed}</p>
      <p>Sex: ${product.sex}</p>
     </div>
     <div class="un-fact">
      <p>Height: ${product.height}</p>
      <p>Dame's Sire:${product.dameSire}</p>
      <p>Sire: ${product.sire}</p>
     </div>
 </div>
     </div>
     <div class="price">
         <p>$${product.price}</p>
         <button class="addCart"
             data-id="${product.id}">    
             <div class="cart"><img src="./images/Vector (5).svg" alt=""></div>
             Add to Cart
         </button>
     </div>
         `
        listProduct.appendChild(newProduct);
        
    })
    console.log('Products loaded:', products);
}



const filterProducts = () => {
    const age = document.getElementById('age').value;
    const discipline = document.getElementById('suitability').value;
    const breed = document.getElementById('breed').value;
    const colour = document.getElementById('colour').value;
    const country = document.getElementById('country').value;
    const sex = document.getElementById('sex').value;

    let filteredProducts = products.filter(product => {
        return (age === 'Age Group' || product.age === ageMapping[age]) &&
               (discipline === 'Discipline' || product.discipline === disciplineMapping[discipline]) &&
               (breed === 'Breed' || product.breed === breedMapping[breed]) &&
               (colour === 'Colours' || product.colour === colourMapping[colour]) &&
               (country === 'Location' || product.country === countryMapping[country]) &&
               (sex === 'Gender' || product.sex === sexMapping[sex]);
});
console.log('Filter values:', { age, discipline, breed, colour, country, sex });
      console.log('Filtered products:', filteredProducts);
      showFilteredProducts(filteredProducts);
}

const showFilteredProducts = (filteredProducts) => {
    let listProduct = document.querySelector('.listProduct');
    listProduct.innerHTML = null;
    filteredProducts.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('item');
        newProduct.innerHTML =
          `
         <div class="profile">
         <a href="detail.html?id=${product.id}">
         <img src="${product.image}" alt="">
         </a>
         <p>${product.name}</p>
     </div>

     <div class="info">
         <div>
          <p>Birth Year: ${product.birth}</p>
          <p>Breed: ${product.breed}</p>
          <p>Sex: ${product.sex}</p>
         </div>
         <div>
          <p>Height: ${product.height}</p>
          <p>Dame's Sire :${product.dameSire}</p>
          <p>Sire: ${product.sire}</p>
         </div>
     </div>
     
     <div class="price">
         <p>$${product.price}</p>
         <button class="addCart"
             data-id="${product.id}">    
             <div class="cart"><img src="./images/Vector (5).svg" alt=""></div>
             Add to Cart
         </button>
     </div>
         `;
        listProduct.appendChild(newProduct);
    });
}

const setUpFilterButton = () => {
    // Add event listener to the form for filtering
const searchButton = document.querySelector('.btn-search');
searchButton.addEventListener('click',(event) => {
    event.preventDefault(); // Prevent default form submission
    filterProducts(); // Call the function to filter products
});
}

// Call initApp function to initially load products
initApp();

setUpFilterButton();





