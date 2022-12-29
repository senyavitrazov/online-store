import { DualSlider } from './ts/dual-slider';
import { ProductCard, Product } from './ts/product-card';
import { Checkbox } from './ts/checkbox-filter';
import dataExample from './assets/data-exapmle.json';
import { SortSelect } from './ts/sort-select';

const checkbox = new Checkbox();

checkbox.drawcheckboxCategories();
checkbox.drawcheckboxBrand();

class App {
  productList = document.querySelector('.product-list');
  productsData: Product[] = dataExample.products;
  body = document.querySelector('body');
  main = document.querySelector('main');

  constructor() {
    window.customElements.define('dual-slider', DualSlider);
    window.customElements.define('product-card', ProductCard);
    window.customElements.define('sort-select', SortSelect);
    if (!this.main) {
      this.body && this.body.insertAdjacentHTML('afterend', '<main><div class="main__wrapper wrapper"></div></main>');
    }
    //filters block
    if (!this.productList) {
      this.productList = document.createElement('div');
      this.productList.classList.add('.product-list');
    }
    // let i = this.productsData.length;
    let i = 6;
    while (i) {
      i--;
      this.productList.innerHTML += `<product-card src="${i}"></product-card>`;
    }
  }
}

new App();
