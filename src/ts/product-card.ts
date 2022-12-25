import styles from '../sass/components/card.styles.scss';
import dataExample from '../assets/data-exapmle.json';

type Product = {
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
      const product = dataExample.products[+newValue]; //TODO : Product
      this.shadowRoot?.querySelector('.product-card__image')?.setAttribute('src', product.images[0]);

      const descriptionList = this.shadowRoot?.querySelector('.product-card__description');
      const name = this.shadowRoot?.querySelector('.product-card__name');

      if (name) name.innerHTML = product.title;
      descriptionList?.insertAdjacentHTML('afterbegin', `<p class="product-card__text">${product['description']}</p>`);

      const price = this.shadowRoot?.querySelector('.product-card__price');
      const oldPrice = this.shadowRoot?.querySelector('.product-card__oldprice');

      if (price) price.innerHTML = product.price;
      if (oldPrice) oldPrice.innerHTML = '' + product.price * (100 + product.discountPercentage); // TODO percents

      if (descriptionList) {
        for (let i = 0; i < fields.length; i++) {
          descriptionList.innerHTML += `<li><span>${fields[i]}: </span>${product[fields[i]]}</li>`;
        }
      }
    }
  }
}
