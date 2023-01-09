import dataExample from '../assets/data-exapmle.json';
import { Product } from './product-card';
import { cart, drawCart, products_in_cart } from './cart-SPA';
import { PopupPurchase } from './popup';
const main: string | null = localStorage.getItem('mainc') ? localStorage.getItem('mainc') : '';
const aboutstr: string | null = localStorage.getItem('aboutproducts') ? localStorage.getItem('aboutproducts') : '';
let about: number[] = [];
dataExample.products.forEach((el: Product, idx: number): void => {
  about.push(idx);
});
if (aboutstr) about = JSON.parse(aboutstr);
export function createTemplate(product: Product): string {
  let imagesstr = '';
  product.images.forEach((el: string) => {
    imagesstr += `<img alt="Slide" class="picture-small" src=${el}>`;
  });
  const template = `<div class="about__product">
  <div class="product__title">
    ${product.title}
  </div>
  <div class="arrow__crums">
  <a href="/"><span class="crum__main">STORE</span></a> >>> <span class="crum__category">${
    product.category
  }</span> >>> <span class="crum__brand">${product.brand}</span> >>> <span class="crum__name">${product.title}</span>
</div>
  <div class="about__content">
    <div class="about__images">
      <div class="about__images-small">
        ${imagesstr}
      </div>
      <div class="about__images-big">
        <img alt="Slide" src=${product.thumbnail}>
      </div>

    </div>
    <div class="about__info">
      <div class="about__info-desc">
        <h3>Description:</h3>
        <p>${product.description}</p>
      </div>
      <div class="about__info-discount">
        <h3>Discount Percentage:</h3>
        <p>${product.discountPercentage}</p>
      </div>
      <div class="about__info-rating">
        <h3>Rating:</h3>
        <p>${product.rating}</p>
      </div>
      <div class="about__info-stock">
        <h3>Stock:</h3>
        <p>${product.stock}</p>
      </div>
      <div class="about__info-brand">
        <h3>Brand:</h3>
        <p>${product.brand}</p>
      </div>
      <div class="about__info-category">
        <h3>Category:</h3>
        <p>${product.category}</p>
      </div>
    </div>
    <div class="about__price">
      <div class="about__price-cart">
        <p>€${product.price}</p>
        <button class="add__button">${
          products_in_cart.includes(
            parseInt(location.hash.slice(1).toLowerCase().split('/')[location.hash.slice(1).split('/').length - 1])
          )
            ? 'Remove from Cart'
            : 'Add to Cart'
        }</button>
        <button class="buy__button">Buy Now</button>
      </div>
    </div>
  </div>
</div>`;
  const buyButton = document.querySelector('.buy__button');
  if (buyButton instanceof HTMLButtonElement) {
    buyButton.addEventListener('click', () => {
      let popup: PopupPurchase | null = null;
      popup = new PopupPurchase(maincontent);
      popup.togglePopup();
    });
  }
  return template;
}
localStorage.setItem('aboutproducts', JSON.stringify(about));
const urlRoutes = {
  '/': main,
  '/about': about,
};
const maincontent: HTMLElement | null = document.querySelector('main');
maincontent?.addEventListener('click', (e: Event) => {
  const targetPicture = e.target;
  if (targetPicture instanceof HTMLElement && !targetPicture.matches('.picture-small')) {
    return;
  }
  e.preventDefault();
  const src: string | null =
    targetPicture instanceof HTMLElement && targetPicture ? targetPicture.getAttribute('src') : '0';
  const bigPicture: HTMLDivElement | null = document.querySelector('.about__images-big');
  if (bigPicture) bigPicture.innerHTML = `<img alt="Slide" src=${src}>`;
});
export const urlRoute = (itemsrc: string): void => {
  window.history.pushState({}, '', window.location.origin + `/#/about/${itemsrc}`);
  if (maincontent) maincontent.innerHTML = createTemplate(dataExample.products[itemsrc]);
};
const parseLocation = (): string => location.hash.slice(1).toLowerCase() || '/';
const processLocation = (location: string): void => {
  if (location === '/') {
    location = location + urlRoutes['/'];
  }
console.log(location.split('/'))
  if (location.split('/')[1] === 'about') {
    if (maincontent)
      maincontent.innerHTML = createTemplate(dataExample.products[location.split('/')[location.split('/').length - 1]]);
  }
  if (location.split('/')[1] === 'cart') {
    if (maincontent) maincontent.innerHTML = cart;
    window.history.pushState({}, '', window.location.origin + `/#/cart`);
    drawCart(products_in_cart);
  }
};
window.onpopstate = (): void => {
  const location: string = parseLocation();
  if (location === '/') {
    urlRoutes['/'] = localStorage.getItem('mainc') ? localStorage.getItem('mainc') : '';
    urlRoutes['/'] ? (window.location.href = urlRoutes['/']) : '';
  }
  processLocation(location);
};
window.addEventListener('DOMContentLoaded', () => {
  processLocation(parseLocation());
});
