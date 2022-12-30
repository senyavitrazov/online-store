import dataExample from '../assets/data-exapmle.json';
import { Product } from './product-card';
import { Checkbox } from './checkbox-filter';
const main: string | null = localStorage.getItem('mainc') ? localStorage.getItem('mainc') : '';
let src2 = '';
const aboutstr: string | null = localStorage.getItem('aboutproducts') ? localStorage.getItem('aboutproducts') : '';
let about: number[] = [];
document.addEventListener('click', (e: Event) => {
  const target = <HTMLElement>e.target;
  if (!target.matches('product-card')) {
    return;
  }
  e.preventDefault();
  const maincontents: string | undefined = document.querySelector('main')?.innerHTML;
  localStorage.setItem('mainc', maincontents ? maincontents : 'hello');
  const src: string | null = target.getAttribute('src');
  if (src) src2 = src;
  urlRoute(src2);
  createTemplate(dataExample.products[src2]);
});
dataExample.products.forEach((el: Product, idx: number): void => {
  about.push(idx);
});
if (aboutstr) about = JSON.parse(aboutstr);
function createTemplate(product: Product): string {
  let imagesstr = '';
  product.images.forEach((el: string) => {
    imagesstr += `<img alt="Slide" src=${el}>`;
  });
  const template = `<div class="about__product">
  <div class="product__title">
    ${product.title}
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
        <button>Add to cart</button>
        <button>Buy Now</button>
      </div>
    </div>
  </div>
</div>`;
  return template;
}
localStorage.setItem('aboutproducts', JSON.stringify(about));
const urlRoutes = {
  '/': main,
  '/about': about,
};
const maincontent: HTMLElement | null = document.querySelector('main');
const urlRoute = (itemsrc: string): void => {
  window.history.pushState({}, '', window.location.origin + `/about/${itemsrc}`);
  if (maincontent) maincontent.innerHTML = createTemplate(dataExample.products[itemsrc]);
};
window.onpopstate = (): void => {
  let location: string = window.location.pathname;
  if (location.length == 0) {
    location = '/';
  }
  if (location === '/') {
    urlRoutes['/'] = localStorage.getItem('mainc') ? localStorage.getItem('mainc') : '';
    if (maincontent) maincontent.innerHTML = urlRoutes['/'] ? urlRoutes['/'] : 'hello';
    const checkbox = new Checkbox();
    checkbox.drawcheckboxCategories();
    checkbox.drawcheckboxBrand();
  }
  if (location.split('/')[1] === 'about') {
    if (maincontent)
      maincontent.innerHTML = createTemplate(dataExample.products[location.split('/')[location.split('/').length - 1]]);
  }
};