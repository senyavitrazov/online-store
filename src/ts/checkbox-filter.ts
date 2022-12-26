import dataExample from '../assets/data-exapmle.json';
import { Product } from './product-card';

export class Checkbox {
  drawcheckboxCategories(): void {
    const items: Array<Product> = dataExample.products;
    const categories = new Set();
    items.forEach(item => categories.add(item.category));
    const catarray:Array<string> = <Array<string>>Array.from(categories);
    const fragment: DocumentFragment = document.createDocumentFragment();
    const template: HTMLTemplateElement = document.createElement('template');
    const checkboxElement: HTMLDivElement = <HTMLDivElement>document.querySelector('.category-filter');
    catarray.forEach((item: string): void => {
      template.innerHTML = `<form class="checkbox-input">
      <input id="${item}" name="category-input" type="checkbox">
      <label for="${item}" class="filter-label"></label>
      <span class="filtered-value">(5/5)</span>
      </form>`;
      const checkboxClone: HTMLElement = <HTMLElement>template?.content.cloneNode(true);
      const checkboxTitle = <HTMLElement>checkboxClone.querySelector('.filter-label');
      if (checkboxTitle) checkboxTitle.textContent = `${item}`;
      fragment.append(checkboxClone);
    });
    if (checkboxElement) checkboxElement.innerHTML = '';
    checkboxElement?.appendChild(fragment);
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
      template.innerHTML = `<form class="checkbox-input">
        <input id="${item}" name="brand-input" type="checkbox">
        <label for="${item}" class="filter-label"></label>
        <span class="filtered-value">0</span>
        </form>`;
      const checkboxClone: HTMLElement = <HTMLElement>template?.content.cloneNode(true);
      const checkboxTitle = <HTMLElement>checkboxClone.querySelector('.filter-label');
      if (checkboxTitle) checkboxTitle.textContent = `${item}`;
      fragment.append(checkboxClone);
    });
    if (checkboxElement) checkboxElement.innerHTML = '';
    checkboxElement?.appendChild(fragment);
  }
}
