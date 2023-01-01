import { DualSlider } from './ts/dual-slider';
import { ProductCard, Product } from './ts/product-card';
import { Checkbox } from './ts/checkbox-filter';
import { SortSelect } from './ts/sort-select';
import dataExample from './assets/data-exapmle.json'; 
import  './ts/about-SPA';

const checkbox = new Checkbox();

checkbox.drawcheckboxCategories();
checkbox.drawcheckboxBrand();

class App {
  productsData: Product[] = dataExample.products;
  body = document.querySelector('body');
  main = document.querySelector('main');
  productsBlock = document.querySelector('.products');
  productList = document.querySelector('.product-list');

  constructor() {
    window.customElements.define('dual-slider', DualSlider);
    window.customElements.define('product-card', ProductCard);
    window.customElements.define('sort-select', SortSelect);
    if (!this.main) {
      this.body && this.body.insertAdjacentHTML('afterend', '<main><div class="main__wrapper wrapper"></div></main>');
    }

    const mainWrapper = this.main?.querySelector('.main__wrapper');

    if (!this.productsBlock) {
      this.productsBlock = document.createElement('div');
      this.productsBlock.classList.add('products');
      this.productsBlock.innerHTML =
        '<div class="products__top"><div class="products__search search"><button class="search__button"></button><input type="text" ' +
        'name="search" id="search-input" placeholder="search product"></div><sort-select></sort-select></div><div class="products__bottom product-list"></div>';
      mainWrapper?.append(this.productsBlock);
    }

    //filters block
    if (!this.productList) {
      this.productList = document.createElement('div');
      this.productList.classList.add('product-list');
      this.productsBlock?.append(this.productList);
    }
    let i = 0;
    while (i <= this.productsData.length) {
      i++;
      this.productList.innerHTML += `<product-card src="${i}"></product-card>`;
    }
  //checkbox-filters
  const checkbox = new Checkbox();
  checkbox.drawcheckboxCategories();
  checkbox.drawcheckboxBrand();
  }
  
}

new App();
