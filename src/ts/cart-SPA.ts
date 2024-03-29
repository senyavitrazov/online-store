import { Product } from './product-card';
import dataExample from '../assets/data-exapmle.json';
import { urlRoute } from './about-SPA';
import { PopupPurchase } from './popup';
 
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
  <div>Products: <span class="total__products">1</span></div>
  <div class="price__total">Total: <span class="total__price">4495€</span></div>
  <div><h5 class="active__promos">Active Promocodes:</h5><div class="active__promocode"><div class="rs promo hidden"><span>RS: </span> <span>10%</span> <button class="promo__add">ADD</button></div>
  <div class="rsschool promo hidden"> <span>RSSchool: </span> <span>20%</span> <button class="promo__add">ADD</button></div></div></div>
  <div class="promo__input"><input type="text" name="promo_input" placeholder="enter code" id="promo_input"></div>
  <span class="promos">Test RS, RSSchool</span>
  <button id="cart__buy-btn">buy now</button>
</div>
</div>
`;
export let products_in_cart: number[] = [];

const cartnumber:HTMLElement|null = document.querySelector('.cart__number');
const cartprice:HTMLElement|null = document.querySelector('.cart__price-number');
const productstr: string | null = localStorage.getItem('cartproducts') ? localStorage.getItem('cartproducts') : '';
const totalstr: string | null = localStorage.getItem('totalproducts') ? localStorage.getItem('totalproducts') : null;
const total_in_cart: number[] = totalstr ? JSON.parse(totalstr) : new Array(products_in_cart.length).fill(1);
if (productstr) products_in_cart = JSON.parse(productstr);
let discount = 0;
const mainContainer:HTMLElement|null = document.querySelector('main');

document.addEventListener('click', (e: Event):void => {
  const target = <HTMLElement>e.target;
  if (!target.matches('.cart__icon')) {
    return;
  }
  e.preventDefault();
  if (mainContainer) mainContainer.innerHTML = cart;

  window.history.pushState({}, '', window.location.origin+"/online-store/#/cart");

  drawCart(products_in_cart);
});
//Update Total Products and Price
export const updateTotal = () :void => {
  if (cartnumber)
    cartnumber.innerHTML =
      total_in_cart.length > 0 ? `${total_in_cart.reduce((acc, el) => acc + el)} Products` : '0 Products';
  if (cartprice) {
    let price = 0;
    products_in_cart.forEach((el, index) => {
      price += Math.round(dataExample.products[el].price * total_in_cart[index] * (1 - discount));
    });
    cartprice.innerHTML = price + '$';
  }
  if (location.hash.slice(1).toLowerCase().split('/')[1] === 'cart') {
    const totlalproducts:HTMLElement|null = document.querySelector('.total__products');
    const totlalprice:HTMLElement|null = document.querySelector('.total__price');
    if (totlalproducts)
      totlalproducts.innerHTML = total_in_cart.length > 0 ? `${total_in_cart.reduce((acc, el) => acc + el)}` : '0';
    if (cartprice && totlalprice) totlalprice.innerHTML = cartprice?.innerHTML;
  }
};
updateTotal();
 
export const updateCart = (number: number) : void => {

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

  updateTotal();
};

mainContainer?.addEventListener('click', (e: Event):void => {
  const targetButton = e.target;
  if (targetButton instanceof HTMLElement && targetButton && !targetButton.matches('.add__button')) {
    return;
  }
  e.preventDefault();
  updateCart(parseInt(location.hash.slice(1).toLowerCase().split('/')[location.hash.slice(1).split('/').length - 1]));
  if(targetButton&&targetButton instanceof HTMLElement)products_in_cart.includes(
    parseInt(location.hash.slice(1).toLowerCase().split('/')[location.hash.slice(1).split('/').length - 1])
  ) 
    ? (targetButton.innerHTML = 'Remove from Cart')
    : (targetButton.innerHTML = 'Add to Cart');
});

export const drawCart = (products: number[]): void => {
  const pagelimitInput = document.getElementById('number_input');
  const pageNumber:HTMLElement|null = document.querySelector('.page__number');
  const pageNumbertext:HTMLElement|null = document.querySelector('.page__number-count');
  const array:number[] = products;
  const promos:string[] = ['rs', 'rsschool'];
  
  addPromoListeners(promos);
  
  if (pageNumbertext&&pagelimitInput instanceof HTMLInputElement) {
    drawproducts(
      array.slice(
        0 + (parseInt(pageNumbertext.innerHTML) - 1) * parseInt(pagelimitInput.value),
        array.length -
          (array.length - (parseInt(pageNumbertext.innerHTML) - 1) * parseInt(pagelimitInput.value)) +
          parseInt(pagelimitInput.value)
      ),
      parseInt(pageNumbertext.innerHTML),
      parseInt(pagelimitInput.value)
    );
    pagelimitInput?.addEventListener('change', () => {
      drawproducts(
        array.slice(
          0 + (parseInt(pageNumbertext.innerHTML) - 1) * parseInt(pagelimitInput.value),
          array.length -
            (array.length - (parseInt(pageNumbertext.innerHTML) - 1) * parseInt(pagelimitInput.value)) +
            parseInt(pagelimitInput.value)
        ),
        parseInt(pageNumbertext.innerHTML),
        parseInt(pagelimitInput.value)
      );
    });
  }

  pageNumber?.addEventListener('click', (e:Event):void => {
    const target =  e.target;
    if (target instanceof HTMLElement&& target.matches('.page__number-button-left')) {
      if (pageNumbertext && pagelimitInput instanceof HTMLInputElement) {
        pageNumbertext.innerHTML =
          parseInt(pageNumbertext.innerHTML) > 1 ? (parseInt(pageNumbertext.innerHTML) - 1).toString() : '1';

        drawproducts(
          array.slice(
            parseInt(pagelimitInput.value) * (parseInt(pageNumbertext.innerHTML) - 1),
            parseInt(pagelimitInput.value) + parseInt(pagelimitInput.value) * (parseInt(pageNumbertext.innerHTML) - 1)
          ),
          parseInt(pageNumbertext.innerHTML),
          parseInt(pagelimitInput.value)
        );
      }
    }
    if (target instanceof HTMLElement&&target.matches('.page__number-button-right')) {
      if (pageNumbertext&&pagelimitInput instanceof HTMLInputElement) {
        pageNumbertext.innerHTML =
          parseInt(pageNumbertext.innerHTML) < Math.ceil(products_in_cart.length / parseInt(pagelimitInput.value))
            ? (parseInt(pageNumbertext.innerHTML) + 1).toString()
            : Math.ceil(products_in_cart.length / parseInt(pagelimitInput.value)).toString();
        drawproducts(
          array.slice(
            parseInt(pagelimitInput.value) * (parseInt(pageNumbertext.innerHTML) - 1),
            parseInt(pagelimitInput.value) + parseInt(pagelimitInput.value) * (parseInt(pageNumbertext.innerHTML) - 1)
          ),
          parseInt(pageNumbertext.innerHTML),
          parseInt(pagelimitInput.value)
        );
      }
    }
  });

  updateTotal();
};

function addPromoListeners(promos:string[]):void {
  const promoInput =  document.getElementById('promo_input');
  const promoaddButton = document.querySelectorAll('.promo__add');
  promoaddButton.forEach(el => {
    el.addEventListener('click', () => {
      if (el.parentElement?.className.includes('active')) {
        el.parentElement?.classList.remove('active');
        el.innerHTML = 'ADD';
        promoInput instanceof HTMLInputElement &&!promos.includes(promoInput.value.toLowerCase()) ? el.parentElement.classList.add('hidden') : '';
        if (el.previousElementSibling) discount -= parseInt(el.previousElementSibling?.innerHTML.slice(0, -1)) / 100;
        updateTotal();
      } else {
        el.parentElement?.classList.add('active');

        if (el.previousElementSibling) discount += parseInt(el.previousElementSibling?.innerHTML.slice(0, -1)) / 100;
        el.innerHTML = 'REMOVE';
        updateTotal();
      }
    });
  });
  promoInput?.addEventListener('input', ():void => {
    if (promoInput instanceof HTMLInputElement &&promos.includes(promoInput.value.toLowerCase())) {
      const promoactive: HTMLElement | null = document.querySelector(`.${promoInput.value.toLowerCase()}`);
      promoactive?.classList.toggle('hidden');
      promoactive?.className.includes('active') ? promoactive?.classList.toggle('hidden') : '';
    } else {
      const promoList = document.querySelectorAll('.promo');
      promoList.forEach(el => {
        if (el.className.includes('active')) {
          return;
        } else {
          el.classList.add('hidden');
        }
      });
    }
  });
  
  const buyButton = document.getElementById('cart__buy-btn')
  if(buyButton instanceof HTMLButtonElement){
    buyButton.addEventListener('click',()=>{
      let popup: PopupPurchase | null = null;
      popup = new PopupPurchase(mainContainer);
     popup.togglePopup();
    })
  }
}
 
const drawproducts = (products: number[], page: number, limit: number): void => {
  let number = 0;
  const carthtml: Element | null = document.querySelector('.products__list');
  if (carthtml) carthtml.innerHTML = '';
  for (let i = 0; i < products.length; i++) {
    const product: Product = dataExample.products[products[i]];
    const template = `<div class="cart__product">
        <div class="product__number">${number + 1 + (page - 1) * limit}</div>
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
  targetProduct.forEach((el:Element, index:number) => {
    el.addEventListener('click', () => {
      urlRoute(products_in_cart[index].toString());
    });
  });
 
  const productCount = document.querySelectorAll('.product__count');
  productCount.forEach((el:Element, index:number):void => {
    el.addEventListener('click', e => {
      const target = <HTMLElement>e.target;
      if (target.matches('.quantity__button-left')) {
        const pagequanttext:HTMLElement|null|undefined = target.parentElement?.querySelector('.product__quant');
        const price:HTMLElement|null = productCount[index].querySelector('.product__price');
        const stock:HTMLElement|null = productCount[index].querySelector('.product__stock');
        if (pagequanttext && price && stock) {
          price.innerHTML = `€${
            parseInt(pagequanttext.innerHTML) !== parseInt(stock.innerHTML.split(':')[1])
              ? dataExample.products[products_in_cart[index + (page - 1) * limit]].price *
                (parseInt(pagequanttext.innerHTML) + 1)
              : price.innerHTML.slice(1)
          }`;
          if (parseInt(pagequanttext.innerHTML) !== parseInt(stock.innerHTML.split(':')[1])) {
            total_in_cart[index + (page - 1) * limit] += 1;
            localStorage.setItem('totalproducts', JSON.stringify(total_in_cart));
            updateTotal();
          }
          pagequanttext.innerHTML =
            parseInt(pagequanttext.innerHTML) !== parseInt(stock.innerHTML.split(':')[1])
              ? (parseInt(pagequanttext.innerHTML) + 1).toString()
              : pagequanttext.innerHTML;
        }
      }
      if (target.matches('.quantity__button-right')) {
        const pagequanttext:HTMLElement|null|undefined = target.parentElement?.querySelector('.product__quant');
        const price:HTMLElement|null = productCount[index].querySelector('.product__price');
        const stock:HTMLElement|null = productCount[index].querySelector('.product__stock');
        if (pagequanttext && price && stock) {
          price.innerHTML = `€${
            parseInt(pagequanttext.innerHTML) !== 0
              ? dataExample.products[products_in_cart[index + (page - 1) * limit]].price *
                (parseInt(pagequanttext.innerHTML) - 1)
              : price.innerHTML.slice(1)
          }`;
          pagequanttext.innerHTML =
            parseInt(pagequanttext.innerHTML) !== 0
              ? `${parseInt(pagequanttext.innerHTML) - 1}`
              : pagequanttext.innerHTML;
          total_in_cart[index + (page - 1) * limit] -= 1;
          updateTotal();
          if (parseInt(pagequanttext.innerHTML) === 0) {
            products_in_cart.splice(index + (page - 1) * limit, 1);
            total_in_cart.splice(index + (page - 1) * limit, 1);
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
