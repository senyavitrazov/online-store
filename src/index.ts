import { DualSlider } from './ts/dual-slider';
import { ProductCard, Product } from './ts/product-card';
import { Checkbox } from './ts/checkbox-filter';
import { SortSelect, SortingField } from './ts/sort-select';
import dataExample from './assets/data-exapmle.json';
import './ts/about-SPA';

const checkbox = new Checkbox();

checkbox.drawcheckboxCategories();
checkbox.drawcheckboxBrand();

class App {
  productsData: Product[] = dataExample.products;
  filteredProducts: Product[] = dataExample.products;
  body = document.querySelector('body');
  main = document.querySelector('main');
  productsBlock = document.querySelector('.products');
  productList = document.querySelector('.product-list');
  searchText = '';

  drawCards() {
    const params = new URLSearchParams(window.location.search);
    this.filteredProducts = dataExample.products;
    for (const [key, value] of params.entries()) {
      if (key === 'dsp' && value !== '') {
        const left = +value.slice(0, value.indexOf('t'));
        const right = +value.slice(value.indexOf('t') + 1);
        this.filteredProducts = this.filteredProducts.filter(e => left < e.price && e.price < right);
      }
      if (key === 'dsa' && value !== '') {
        const left = +value.slice(0, value.indexOf('t'));
        const right = +value.slice(value.indexOf('t') + 1);
        this.filteredProducts = this.filteredProducts.filter(e => left < e.stock && e.stock < right);
      }
      if (key === 'search' && value !== '') {
        this.filteredProducts = this.filteredProducts.filter(e => {
          for (const key in e) {
            if (e[key as keyof typeof e].toString().search(value) != -1) return 1;
          }
        });
      }
      if (key === 'sort' && value !== '') {
        const reverseFlag = !!(+value % 10);
        const sortField = Math.floor(+value / 10);
        this.filteredProducts = this.filteredProducts.sort(
          (a, b) => +a[SortingField[sortField] as keyof Product] - +b[SortingField[sortField] as keyof Product]
        );
        console.log(this.filteredProducts);
        if (reverseFlag) this.filteredProducts.reverse();
      }
      // if(key === 'filter')
    }
    if (!this.productList) {
      this.productList = document.createElement('div');
      this.productList.classList.add('product-list');
      this.productsBlock?.append(this.productList);
    }
    let i = 0;
    this.productList.innerHTML = '';
    while (i < this.filteredProducts.length) {
      this.productList.innerHTML += `<product-card src="${this.filteredProducts[i].id - 1}"></product-card>`;
      i++;
    }
  }

  constructor() {
    const params = new URLSearchParams(window.location.search);
    const oldSearch = params.get('search');
    this.searchText = oldSearch ? oldSearch : '';

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
    const searchInput = this.productsBlock.querySelector('input');
    if (searchInput) searchInput.value = this.searchText;
    searchInput?.addEventListener('change', () => {
      this.searchText = searchInput.value;
    });
    this.productsBlock.querySelector('.search__button')?.addEventListener('click', () => {
      const params = new URLSearchParams(window.location.search);
      if (this.searchText !== ' ') {
        params.set('search', this.searchText);
        window.history.pushState(null, '', window.location.pathname + '?' + params.toString());
      }
      this.drawCards();
    });
    //filters block
    this.drawCards();
    //checkbox-filters
    const checkbox = new Checkbox();
    checkbox.drawcheckboxCategories();
    checkbox.drawcheckboxBrand();
    checkbox.filteredValue(dataExample.products);

    this.main?.addEventListener('filterchange', this.drawCards.bind(this));
  }
}

new App();
