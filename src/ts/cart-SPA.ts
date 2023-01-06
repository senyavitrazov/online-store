import { Product } from './product-card';
import dataExample from '../assets/data-exapmle.json';
const cart = `<div class="cart__main">
<div class="cart__products">
  <div class="products__title-and-controls">
    <h2 class="cart__products-title">Products in cart</h2>
    <div class="cart__products-control">
      <div class="page__limit">
        <p class="page__limit-count">Limit:</p>
        <input type="number" id="number_input" value="3" name="limit__input" min="1" max="5" />
      </div>
      <div class="page__number">
        <p class="Page__number-count">Page:</p>
        <button><</button>
        <span class="page__number-count">1</span>
        <button>></button>
      </div>
    </div>
  </div>
  <div class="products__list">
  </div>
</div>
<div class="cart__total">
  <h3>Summary</h3>
  <div>Products:<span class="total__products">1</span></div>
  <div>Total:<span class="total__price">4495$</span></div>
  <div class="promo__input"><input type="text" name="promo_input" id=""></div>
  <span class="promos">Test RS</span>
  <button>BUY NOW</button>
</div>
</div>
`;
const cartnumber = document.querySelector('.cart__number');
const cartprice = document.querySelector('.cart__price-number');
const productstr: string | null = localStorage.getItem('cartproducts') ? localStorage.getItem('cartproducts') : '';
let products_in_cart: number[] = [];
if (productstr) products_in_cart = JSON.parse(productstr);
const maincontent = document.querySelector('main');
document.addEventListener('click', (e: Event) => {
  const target = <HTMLElement>e.target;
  if (!target.matches('.cart__icon')) {
    return;
  }
  e.preventDefault();
  if (maincontent) maincontent.innerHTML = cart;
  window.history.pushState({}, '', window.location.origin + `/cart`);
  drawCart(products_in_cart);
});
if (cartnumber) cartnumber.innerHTML = `${products_in_cart.length.toString()} Products`;
if (cartprice) {
  let price = 0;
  products_in_cart.forEach(el => {
    price += dataExample.products[el].price;
  });
  cartprice.innerHTML = `${price.toString()}$`;
}
export const updateCart = (number: number) => {
  if (products_in_cart.includes(number)) {
    products_in_cart.splice(products_in_cart.indexOf(number), 1);
    localStorage.setItem('cartproducts', JSON.stringify(products_in_cart));
  } else {
    products_in_cart.push(number);
    localStorage.setItem('cartproducts', JSON.stringify(products_in_cart));
  }

  if (cartnumber) cartnumber.innerHTML = `${products_in_cart.length} Products`;
};
const drawCart = (products: number[]): void => {
  const pagelimitInput = <HTMLInputElement>document.getElementById('number_input');
  const array = products;

  drawproducts(array.slice(0, parseInt(pagelimitInput.value)));
  pagelimitInput?.addEventListener('change', () => {
    drawproducts(array.slice(0, parseInt(pagelimitInput.value)));
  });
  const totlalproducts = document.querySelector('.total__products');
  const totlalprice = document.querySelector('.total__price');
  if (totlalproducts) totlalproducts.innerHTML = products_in_cart.length.toString();
  if (cartprice && totlalprice) totlalprice.innerHTML = cartprice?.innerHTML;
};
const drawproducts = (products: number[]): void => {
  let number = 0;
  const carthtml: Element | null = document.querySelector('.products__list');
  if (carthtml) carthtml.innerHTML = '';
  for (let i = 0; i < products.length; i++) {
    const product: Product = dataExample.products[products[i]];
    const template = `<div class="cart__product">
        <div class="product__number">${number + 1}</div>
        <div class="product__preview">
          <img src="${product.thumbnail}" />
          <div class="product__info">
            <div class="product__name">${product.title}</div>
            <div class="product__desc">
              ${product.description}
            </div>
            <div class=product__other>
              <div class="product__rating">Rating:${product.rating}</div>
              <div class="product__discount">Discount:${product.discountPercentage}%</div>
            </div>
          </div>
        </div>
        <div class="product__count">
          <div class="product__stock">Stock:${product.stock}</div>
          <div class="product__quantity">
            <button>+</button>
            <span class="product__quant">1</span>
            <button>-</button>
          </div>
          <div class="product__price">€${product.price}</div>
        </div>
       </div>`;
    number++;
    if (carthtml) carthtml.innerHTML += template;
  }
};
