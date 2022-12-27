import dataExample from '../assets/data-exapmle.json';
import { Product } from './product-card';
export class Checkbox {
  filterargs = new Set();
  drawcheckboxCategories(): void {
    const items: Array<Product> = dataExample.products;
    const categories = new Set();
    items.forEach(item => categories.add(item.category));
    const catarray: Array<string> = <Array<string>>Array.from(categories);
    const fragment: DocumentFragment = document.createDocumentFragment();
    const template: HTMLTemplateElement = document.createElement('template');
    const checkboxElement: HTMLDivElement = <HTMLDivElement>document.querySelector('.category-filter');
    catarray.forEach((item: string): void => {
      template.innerHTML = `<div class="checkbox-input">
      <input id="${item}" name="category-input" type="checkbox">
      <label for="${item}" class="filter-label"></label>
      <span class="filtered-value">(5/5)</span>
      </div>`;
      const checkboxClone: HTMLElement = <HTMLElement>template?.content.cloneNode(true);
      const checkboxTitle = <HTMLElement>checkboxClone.querySelector('.filter-label');
      if (checkboxTitle) checkboxTitle.textContent = `${item}`;
      fragment.append(checkboxClone);
    });
    if (checkboxElement) checkboxElement.innerHTML = '';
    checkboxElement?.appendChild(fragment);
    const catinputs = document.getElementsByName('category-input');
    catinputs.forEach(el => {
      el.addEventListener('change', () => {
        this.filterargs.has(el.id) ? this.filterargs.delete(el.id) : this.filterargs.add(el.id);

        const filteredargs = <string[]>Array.from(this.filterargs);
        this.filterProdducts(filteredargs);
      });
    });
  }
  drawcheckboxBrand(): void {
    const items: Array<Product> = dataExample.products;
    const categories = new Set();
    items.forEach(item => categories.add(item.brand));
    const catarray = <Array<string>>Array.from(categories);
    const fragment: DocumentFragment = document.createDocumentFragment();
    const template: HTMLTemplateElement = document.createElement('template');
    const checkboxElement: HTMLDivElement = <HTMLDivElement>document.querySelector('.brand-filter');
    catarray.forEach((item: string): void => {
      template.innerHTML = `<div class="checkbox-input">
        <input id="${item}" name="brand-input" type="checkbox">
        <label for="${item}" class="filter-label"></label>
        <span class="filtered-value">0</span>
        </div>`;
      const checkboxClone: HTMLElement = <HTMLElement>template?.content.cloneNode(true);
      const checkboxTitle = <HTMLElement>checkboxClone.querySelector('.filter-label');
      if (checkboxTitle) checkboxTitle.textContent = `${item}`;
      fragment.append(checkboxClone);
    });
    if (checkboxElement) checkboxElement.innerHTML = '';
    checkboxElement?.appendChild(fragment);
    const brandinputs = document.getElementsByName('brand-input');
    brandinputs.forEach(el => {
      el.addEventListener('change', () => {
        this.filterargs.has(el.id) ? this.filterargs.delete(el.id) : this.filterargs.add(el.id);

        const filteredargs = <string[]>Array.from(this.filterargs);
        this.filterProdducts(filteredargs);
      });
    });
  }
  filterProdducts(filterinput: string[]): void {
    const productList = <HTMLElement>document.querySelector('.product-list');
    let mixed = false;
    let categories = 0;
    let brands = 0;
    dataExample.products.forEach((el: Product) => {
      filterinput.forEach(el2 => {
        if (el2 === el.category) {
          categories += 1;
        }
        if (el2 === el.brand) {
          brands += 1;
        }
      });
      if (categories > 0 && brands > 0) mixed = true;
    });
    let productsData: Product[] =
      filterinput.length === 0
        ? dataExample.products
        : dataExample.products.filter(
            (el: Product) => filterinput.includes(el.brand) || filterinput.includes(el.category)
          );
    if (
      dataExample.products.filter((el: Product) => filterinput.includes(el.brand) && filterinput.includes(el.category))
        .length !== 0
    ) {
      productsData =
        filterinput.length === 0
          ? dataExample.products
          : dataExample.products.filter(
              (el: Product) => filterinput.includes(el.brand) && filterinput.includes(el.category)
            );
    }

    productList.innerHTML = '';
    let i: number = productsData.length;
    while (i) {
      i--;
      productList.innerHTML += `<product-card src="${productsData[i].id - 1}"></product-card>`;
    }
    if (
      dataExample.products.filter((el: Product) => filterinput.includes(el.brand) && filterinput.includes(el.category))
        .length === 0 &&
      mixed != false
    ) {
      productList.innerHTML = 'No Data Found';
    }
  }
}
