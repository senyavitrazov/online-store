import { Product } from './product-card';
import dataExample from '../assets/data-exapmle.json';
import { urlRoute } from './about-SPA';
export const cart = `<div class="cart__main">
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
        <button class="page__number-button-left"><</button>
        <span class="page__number-count">1</span>
        <button class="page__number-button-right">></button>
      </div>
    </div>
  </div>
  <div class="products__list">
  </div>
</div>
<div class="cart__total">
  <h3>Summary</h3>
  <div>Products:<span class="total__products">1</span></div>
  <div>Total:<span class="total__price">4495€</span></div>
  <div class="promo__input"><input type="text" name="promo_input" id=""></div>
  <span class="promos">Test RS</span>
  <button>BUY NOW</button>
</div>
</div>
`;
const cartnumber = document.querySelector('.cart__number');
const cartprice = document.querySelector('.cart__price-number');
const productstr: string | null = localStorage.getItem('cartproducts') ? localStorage.getItem('cartproducts') : '';
export let products_in_cart: number[] = [];
if (productstr) products_in_cart = JSON.parse(productstr);
const totalstr: string | null = localStorage.getItem('totalproducts') ? localStorage.getItem('totalproducts') : null;
const total_in_cart: number[] = totalstr ? JSON.parse(totalstr) : new Array(products_in_cart.length).fill(1);
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

const updateTotal = () => {
  if (cartnumber)
    cartnumber.innerHTML =
      total_in_cart.length > 0 ? `${total_in_cart.reduce((acc, el) => acc + el)} Products` : '0 Products';
  if (cartprice) {
    let price = 0;
    products_in_cart.forEach((el, index) => {
      price += dataExample.products[el].price * total_in_cart[index];
    });
    cartprice.innerHTML = `${price.toString()}€`;
  }
  if (window.location.pathname.split('/')[1] === 'cart') {
    const totlalproducts = document.querySelector('.total__products');
    const totlalprice = document.querySelector('.total__price');
    if (totlalproducts)
      totlalproducts.innerHTML =
        total_in_cart.length > 0 ? `${total_in_cart.reduce((acc, el) => acc + el)} Products` : '0 Products';
    if (cartprice && totlalprice) totlalprice.innerHTML = cartprice?.innerHTML;
  }
};
updateTotal();
export const updateCart = (number: number) => {
  if (products_in_cart.includes(number)) {
    products_in_cart.splice(products_in_cart.indexOf(number), 1);
    total_in_cart.splice(products_in_cart.indexOf(number), 1);
    localStorage.setItem('cartproducts', JSON.stringify(products_in_cart));
    localStorage.setItem('totalproducts', JSON.stringify(total_in_cart));
  } else {
    products_in_cart.push(number);
    total_in_cart.push(1);
    localStorage.setItem('cartproducts', JSON.stringify(products_in_cart));
    localStorage.setItem('totalproducts', JSON.stringify(total_in_cart));
  }

  if (cartnumber) cartnumber.innerHTML = `${products_in_cart.length} Products`;
  if (cartprice) {
    let price = 0;
    products_in_cart.forEach(el => {
      price += dataExample.products[el].price;
    });
    cartprice.innerHTML = `${price.toString()}€`;
  }
};
maincontent?.addEventListener('click', (e: Event) => {
  const targetButton = <HTMLElement>e.target;
  if (!targetButton.matches('.add__button')) {
    return;
  }
  e.preventDefault();
  updateCart(parseInt(window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]));
  products_in_cart.includes(
    parseInt(window.location.pathname.split('/')[window.location.pathname.split('/').length - 1])
  )
    ? (targetButton.innerHTML = 'Remove from Cart')
    : (targetButton.innerHTML = 'Add to Cart');
});
export const drawCart = (products: number[]): void => {
  const pagelimitInput = <HTMLInputElement>document.getElementById('number_input');
  const pageNumber = document.querySelector('.page__number');

  const array = products;

  drawproducts(array.slice(0, parseInt(pagelimitInput.value)));

  pagelimitInput?.addEventListener('change', () => {
    drawproducts(array.slice(0, parseInt(pagelimitInput.value)));
  });

  pageNumber?.addEventListener('click', e => {
    const target = <HTMLElement>e.target;
    const pageNumbertext = document.querySelector('.page__number-count');
    if (target.matches('.page__number-button-left')) {
      if (pageNumbertext) {
        pageNumbertext.innerHTML =
          parseInt(pageNumbertext.innerHTML) > 1 ? (parseInt(pageNumbertext.innerHTML) - 1).toString() : '1';

        drawproducts(
          array.slice(
            parseInt(pagelimitInput.value) * (parseInt(pageNumbertext.innerHTML) - 1),
            parseInt(pagelimitInput.value) + parseInt(pagelimitInput.value) * (parseInt(pageNumbertext.innerHTML) - 1)
          )
        );
      }
    }
    if (target.matches('.page__number-button-right')) {
      if (pageNumbertext) {
        pageNumbertext.innerHTML =
          parseInt(pageNumbertext.innerHTML) < Math.ceil(products_in_cart.length / parseInt(pagelimitInput.value))
            ? (parseInt(pageNumbertext.innerHTML) + 1).toString()
            : Math.ceil(products_in_cart.length / parseInt(pagelimitInput.value)).toString();
        drawproducts(
          array.slice(
            parseInt(pagelimitInput.value) * (parseInt(pageNumbertext.innerHTML) - 1),
            parseInt(pagelimitInput.value) + parseInt(pagelimitInput.value) * (parseInt(pageNumbertext.innerHTML) - 1)
          )
        );
      }
    }
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
            <button class="quantity__button-left">+</button>
            <span class="product__quant">${total_in_cart[products_in_cart.indexOf(product.id - 1)]}</span>
            <button class="quantity__button-right">-</button>
          </div>
          <div class="product__price">€${product.price * total_in_cart[products_in_cart.indexOf(product.id - 1)]}</div>
        </div>
       </div>`;
    number++;
    if (carthtml) carthtml.innerHTML += template;
  }
  const targetProduct = document.querySelectorAll('.product__preview');
  targetProduct.forEach((el, index) => {
    el.addEventListener('click', () => {
      urlRoute(products_in_cart[index].toString());
    });
  });
  const productCount = document.querySelectorAll('.product__count');

  productCount.forEach((el, index) => {
    el.addEventListener('click', e => {
      const target = <HTMLElement>e.target;
      if (target.matches('.quantity__button-left')) {
        const pagequanttext = target.parentElement?.querySelector('.product__quant');
        const price = productCount[index].querySelector('.product__price');
        const stock = productCount[index].querySelector('.product__stock');
        if (pagequanttext && price && stock) {
          pagequanttext.innerHTML =
            parseInt(pagequanttext.innerHTML) !== parseInt(stock.innerHTML.split(':')[1])
              ? (parseInt(pagequanttext.innerHTML) + 1).toString()
              : pagequanttext.innerHTML;

          price.innerHTML = `€${
            parseInt(pagequanttext.innerHTML) !== parseInt(stock.innerHTML.split(':')[1])
              ? (
                  (parseInt(price.innerHTML.slice(1)) / (parseInt(pagequanttext.innerHTML) - 1)) *
                  parseInt(pagequanttext.innerHTML)
                ).toString()
              : price.innerHTML.slice(1)
          }`;
          total_in_cart[index] += 1;
          localStorage.setItem('totalproducts', JSON.stringify(total_in_cart));
          updateTotal();
        }
      }
      if (target.matches('.quantity__button-right')) {
        const pagequanttext = target.parentElement?.querySelector('.product__quant');
        const price = productCount[index].querySelector('.product__price');
        const stock = productCount[index].querySelector('.product__stock');
        if (pagequanttext && price && stock) {
          pagequanttext.innerHTML =
            parseInt(pagequanttext.innerHTML) !== 0
              ? `${parseInt(pagequanttext.innerHTML) - 1}`
              : pagequanttext.innerHTML;

          price.innerHTML = `€${
            parseInt(pagequanttext.innerHTML) !== 0
              ? (parseInt(price.innerHTML.slice(1)) / (parseInt(pagequanttext.innerHTML) + 1)) *
                parseInt(pagequanttext.innerHTML)
              : price.innerHTML.slice(1)
          }`;
          total_in_cart[index] -= 1;
          updateTotal();
          if (parseInt(pagequanttext.innerHTML) === 0) {
            products_in_cart.splice(index, 1);
            total_in_cart.splice(index, 1);
            localStorage.setItem('cartproducts', JSON.stringify(products_in_cart));
            localStorage.setItem('totalproducts', JSON.stringify(total_in_cart));
            drawCart(products_in_cart);
            updateTotal();
          }
        }
      }
    });
  });
};
