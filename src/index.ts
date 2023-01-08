import { DualSlider } from './ts/dual-slider';
import { ProductCard, Product } from './ts/product-card';
import { Checkbox } from './ts/checkbox-filter';
import { SortSelect, SortingField } from './ts/sort-select';
import dataExample from './assets/data-exapmle.json';
import './ts/about-SPA';
import './ts/cart-SPA';

class App {
  productsData: Product[] = dataExample.products;
  filteredProducts: Product[] = dataExample.products;
  body = document.querySelector('body');
  main = document.querySelector('main');
  productsBlock = document.querySelector('.products');
  productList = document.querySelector('.product-list');
  searchText = '';
  filtersBlock = '';
  mainWithInner: Node | null = null;

  drawCards() {
    const params = new URLSearchParams(window.location.search);
    this.filteredProducts = dataExample.products;
    for (const [key, value] of params.entries()) {
      if (key === 'dsp' && value !== '') {
        const left = +value.slice(0, value.indexOf('t'));
        const right = +value.slice(value.indexOf('t') + 1);
        this.filteredProducts = this.filteredProducts.filter(e => left <= e.price && e.price <= right);
      }
      if (key === 'dsa' && value !== '') {
        const left = +value.slice(0, value.indexOf('t'));
        const right = +value.slice(value.indexOf('t') + 1);
        this.filteredProducts = this.filteredProducts.filter(e => left <= e.stock && e.stock <= right);
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
        if (reverseFlag) this.filteredProducts.reverse();
      }
      if (key === 'filters' && value !== '') {
        const checkbox = new Checkbox();
        this.filteredProducts = checkbox.filterProdducts(
          value.slice(0, value.length - 1).split('.'),
          this.filteredProducts
        );
        checkbox.filteredValue(this.filteredProducts);
      }
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
    const founded = document.querySelector('#founded-amount');
    if (founded) founded.innerHTML = `Found: ${this.filteredProducts.length}`;
  }

  constructor() {
    const params = new URLSearchParams(window.location.search);
    const oldSearch = params.get('search');
    this.searchText = oldSearch ? oldSearch : '';

    this.filtersBlock = `<div class="filters"> <div class="filter price-filter"> <span class="filter__title">Price:</span> <dual-slider class="filter__slider" type="price"></dual-slider> </div> <div class="filter stock-filter"> <span class="filter__title">Stock:</span> <dual-slider class="filter__slider"></dual-slider> </div> <span class="checkbox__title">Category</span> <div class="checkbox-filter category-filter"></div> <span class="checkbox__title">Brand</span> <div class="checkbox-filter brand-filter"></div> <div class="filters__buttons"> <button id="copy-filters">copy filters</button> <button id="clear-filters"></button> </div> </div>`;

    window.customElements.define('dual-slider', DualSlider);
    window.customElements.define('product-card', ProductCard);
    window.customElements.define('sort-select', SortSelect);
    if (!this.main) {
      this.body && this.body.insertAdjacentHTML('afterend', '<main><div class="main__wrapper wrapper"></div></main>');
    }
    const mainWrapper = this.main?.querySelector('.main__wrapper');

    mainWrapper?.insertAdjacentHTML('afterbegin', this.filtersBlock);

    if (!this.productsBlock) {
      this.productsBlock = document.createElement('div');
      this.productsBlock.classList.add('products');
      this.productsBlock.innerHTML =
        '<div class="products__top"><div class="products__search search"><button class="search__button"></button><input type="text" ' +
        'name="search" id="search-input" placeholder="search product"></div><span id="founded-amount">Found: 100</span><button id="view-change"></button><sort-select></sort-select></div>';
      mainWrapper?.append(this.productsBlock);
    }

    const searchInput = this.productsBlock.querySelector('input');
    if (searchInput) searchInput.value = this.searchText;
    searchInput?.addEventListener('change', () => {
      this.searchText = searchInput.value;
    });
    searchInput?.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        let btn = null;
        if (this.productsBlock) btn = this.productsBlock.querySelector('.search__button');
        if (btn instanceof HTMLButtonElement) {
          btn.click();
        }
      }
    });
    searchInput?.addEventListener('blur', () => {
      let btn = null;
      if (this.productsBlock) btn = this.productsBlock.querySelector('.search__button');
      if (btn instanceof HTMLButtonElement) {
        btn.click();
      }
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
    const value = params.get('filters');
    if (value) {
      checkbox.drawcheckboxCategories(value.slice(0, value.length - 1).split('.'));
      checkbox.drawcheckboxBrand(value.slice(0, value.length - 1).split('.'));
    } else {
      checkbox.drawcheckboxCategories([]);
      checkbox.drawcheckboxBrand([]);
    }
    checkbox.filteredValue(this.filteredProducts);

    const viewChanger = document.querySelector('#view-change');
    if (viewChanger)
      viewChanger.addEventListener('click', () => {
        viewChanger.classList.toggle('active');
        this.productList?.classList.toggle('little');
        document.querySelectorAll('product-card').forEach(e => {
          e.shadowRoot?.querySelector('.product-card')?.classList.toggle('little');
        });
      });

    const copyFilterButton = document.querySelector('#copy-filters');
    if (copyFilterButton) {
      copyFilterButton.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        copyFilterButton.innerHTML = 'copied in buffer';
        copyFilterButton.setAttribute('disabled', '');
        setTimeout(() => {
          copyFilterButton.innerHTML = 'copy link';
          copyFilterButton.removeAttribute('disabled');
        }, 1000);
      });
    }
    if (this.main) this.mainWithInner = this.main.cloneNode(true);
    document.querySelector('#clear-filters')?.addEventListener('click', () => {
      // window.history.pushState(null, '', window.location.pathname + '?dsp=10t1749&dsa=2t150&sort=00');
      if (this.main && this.mainWithInner instanceof HTMLElement) this.main.innerHTML = this.mainWithInner.innerHTML;
    });
    this.main?.addEventListener('filterchange', this.drawCards.bind(this));
  }
}

new App();
