import styles from '../sass/components/card.styles.scss';
import dataExample from '../assets/data-exapmle.json';
import { updateCart, updateTotal } from './cart-SPA';
import { createTemplate, urlRoute } from './about-SPA';

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

const fields = ['category', 'brand', 'rating', 'stock'];
const MAX_LENGTH_OF_TITLE = 33;

export class ProductCard extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;
    template.innerHTML = `
    <div class="product-card">
      <div class="product-card__image-container">
        <img src="#" alt="product-image" class="product-card__image">
      </div>
      <div class="product-card__info">
        <span class="product-card__name"></span>
        <ul class="product-card__description"></ul>
        <ul class="product-card__price-list">
          <span class="product-card__price-text">Price: </span>
          <div>
            <span class="product-card__price">600$</span>
            <span class="product-card__oldprice">700$</span>
            <div>
        <ul>
        <button class="product-card__button">+</button>
      </div>
    </div>
    `;
    shadow.appendChild(style);
    shadow.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['src'];
  }

  set src(val) {
    if (val == null) {
      this.removeAttribute('src');
    } else {
      this.setAttribute('src', val);
    }
  }

  get src() {
    return this.getAttribute('src');
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'src') {
      const product: Product = dataExample.products[+newValue];
      this.shadowRoot?.querySelector('.product-card__image')?.setAttribute('src', product.images[0]);

      const descriptionList = this.shadowRoot?.querySelector('.product-card__description');
      const name = this.shadowRoot?.querySelector('.product-card__name');

      if (name) {
        const title =
          product.title.length > MAX_LENGTH_OF_TITLE
            ? product.title.slice(0, MAX_LENGTH_OF_TITLE).trim() + '...'
            : product.title;
        name.innerHTML = title;
      }
      descriptionList?.insertAdjacentHTML('afterbegin', `<p class="product-card__text">${product['description']}</p>`);

      const price = this.shadowRoot?.querySelector('.product-card__price');
      const oldPrice = this.shadowRoot?.querySelector('.product-card__oldprice');

      const cart__button = this.shadowRoot?.querySelector('.product-card');

      cart__button?.addEventListener('click', (e: Event) => {
        const target = <HTMLElement>e.target;
        const maincontents: string | undefined = window.location.pathname+window.location.search;
        localStorage.setItem('mainc', maincontents ? maincontents : 'hello');

        const src = this.getAttribute('src');

        if (!target.matches('.product-card__button')) {
          if (src) {

            urlRoute(src);
            createTemplate(dataExample.products[parseInt(src)]);
          }
        } else {
          if (src) {
            updateCart(parseInt(src));
            const a = localStorage.getItem('cartproducts') || '[]';
            const temp: number[] = JSON.parse(a);
            temp.includes(+src) ? (target.innerHTML = '−') : (target.innerHTML = '+');
            updateTotal();
          }
        }
      });

      if (price) price.innerHTML = '$' + product.price.toFixed(2);
      if (oldPrice) {
        oldPrice.innerHTML = '$' + ((product.price / (100 - product.discountPercentage)) * 100).toFixed(2);
      }
      if (descriptionList) {
        for (let i = 0; i < fields.length; i++) {
          descriptionList.innerHTML += `<li><span>${fields[i]}: </span>
          ${product[fields[i] as keyof typeof product]}</li>`;
        }
      }
    }
  }
}
