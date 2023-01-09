import dataExample from '../assets/data-exapmle.json';
import { Product } from './product-card';
export class Checkbox {
  filterargs: Set<string> = new Set();
  params = new URLSearchParams(window.location.search);
  filterold: string | null = this.params.get('filters') ? this.params.get('filters') : null;

  drawcheckboxCategories(filter: string[]): void {
    const items: Array<Product> = dataExample.products;
    const categories: Set<string> = new Set();
    items.forEach(item => categories.add(item.category));
    const catarray: string[] = Array.from(categories);
    const fragment: DocumentFragment = document.createDocumentFragment();
    const template: HTMLTemplateElement = document.createElement('template');
    const checkboxElement: HTMLDivElement | null = document.querySelector('.category-filter');
    catarray.forEach((item: string): void => {
      template.innerHTML = `<div class="checkbox-input">
      <input id="${item}" name="category-input" type="checkbox">
      <label for="${item}" class="filter-label"></label>
      <span class="filtered-value" id="filtered-value-for-${item}">0</span>
      </div>`;
      const checkboxClone = <HTMLElement>template?.content.cloneNode(true);
      const checkboxTitle: HTMLLabelElement | null = checkboxClone.querySelector('.filter-label');
      if (checkboxTitle) checkboxTitle.textContent = `${item}`;
      fragment.append(checkboxClone);
    });
    if (checkboxElement) checkboxElement.innerHTML = '';
    checkboxElement?.appendChild(fragment);
    const catinputs: NodeListOf<HTMLElement> = document.getElementsByName('category-input');
    catinputs.forEach(el => {
      el.addEventListener('change', () => {
        this.filterargs.has(el.id) ? this.filterargs.delete(el.id) : this.filterargs.add(el.id);
        if (filter.length !== 0)
          filter.forEach(el => (this.filterargs.has(el) ? this.filterargs.delete(el) : this.filterargs.add(el)));
        const filteredargs: string[] = Array.from(this.filterargs);
        this.changeUrl(filteredargs);

        document.querySelector('main')?.dispatchEvent(new Event('filterchange', { bubbles: true }));
      });
    });
    filter.forEach(el => {
      const thisInput = document.getElementById(`${el}`);
      if (thisInput instanceof HTMLInputElement) {
        thisInput.checked = true;
      }
    });
  }
  drawcheckboxBrand(filter: string[]): void {
    const items: Array<Product> = dataExample.products;
    const categories: Set<string> = new Set();
    items.forEach(item => categories.add(item.brand));
    const catarray: string[] = Array.from(categories);
    const fragment: DocumentFragment = document.createDocumentFragment();
    const template: HTMLTemplateElement = document.createElement('template');
    const checkboxElement: HTMLDivElement | null = document.querySelector('.brand-filter');
    catarray.forEach((item: string): void => {
      template.innerHTML = `<div class="checkbox-input">
        <input id="${item}" name="brand-input" type="checkbox">
        <label for="${item}" class="filter-label"></label>
        <span class="filtered-value" id="filtered-value-for-${item}">0</span>
        </div>`;
      const checkboxClone = <HTMLElement>template?.content.cloneNode(true);
      const checkboxTitle: HTMLInputElement | null = checkboxClone.querySelector('.filter-label');
      if (checkboxTitle) checkboxTitle.textContent = `${item}`;
      fragment.append(checkboxClone);
    });
    if (checkboxElement) checkboxElement.innerHTML = '';
    checkboxElement?.appendChild(fragment);
    const brandinputs: NodeListOf<HTMLElement> = document.getElementsByName('brand-input');
    brandinputs.forEach(el => {
         el.addEventListener('change', () => {
        this.filterargs.has(el.id) ? this.filterargs.delete(el.id) : this.filterargs.add(el.id);
        if (filter.length !== 0)
          filter.forEach(el => (this.filterargs.has(el) ? this.filterargs.delete(el) : this.filterargs.add(el)));
        const filteredargs: string[] = Array.from(this.filterargs);
        this.changeUrl(filteredargs);

        document.querySelector('main')?.dispatchEvent(new Event('filterchange', { bubbles: true }));
      });
    });
    filter.forEach(el => {
      const thisInput = document.getElementById(`${el}`);
      if (thisInput instanceof HTMLInputElement) {
        thisInput.checked = true;
      }
    });
  }
  changeUrl(filterargs: string[]): void {
    const params = new URLSearchParams(window.location.search);
 
    if (this.filterold) {
      let temp = this.filterold.includes('.') ? this.filterold.split('.') : [this.filterold];
      temp = temp.filter(el => !filterargs.includes(el));

      let filternew = filterargs.join('.') + '.' + temp.join('.');

      filternew = filternew[filternew.length - 1] === '.' ? filternew.slice(0, filternew.length - 1) : filternew;
   
      params.set('filters', filternew.replace(`${temp}`, ''));
    } else {
      params.set('filters', filterargs.join('.'));
    }
 
    window.history.pushState(null, '', window.location.pathname + '?' + params.toString());
  }
  filteredValue(productsData: Product[]): void {
    const filteredvalues = document.querySelectorAll('.filtered-value');
    filteredvalues.forEach(el => (el.innerHTML = '0'));
    productsData.map(el => {
      const filtervaluebrand: Element | null | undefined = document.getElementById(`filtered-value-for-${el.brand}`);
      const filtervaluecategory: Element | null | undefined = document.getElementById(
        `filtered-value-for-${el.category}`
      );
      if (filtervaluebrand) filtervaluebrand.innerHTML = (parseInt(filtervaluebrand.innerHTML) + 1).toString();
      if (filtervaluecategory) filtervaluecategory.innerHTML = (parseInt(filtervaluecategory.innerHTML) + 1).toString();
    });
  }
  filterProdducts(filterinput: string[], productsinput: Product[]): Product[] {

    let productsData: Product[] =
      filterinput.length === 0
        ? productsinput
        : productsinput.filter((el: Product) => filterinput.includes(el.brand) || filterinput.includes(el.category));
    if (
      productsinput.filter((el: Product) => filterinput.includes(el.brand) && filterinput.includes(el.category))
        .length !== 0
    ) {
      productsData =
        filterinput.length === 0
          ? productsinput
          : productsinput.filter((el: Product) => filterinput.includes(el.brand) && filterinput.includes(el.category));
    }

    this.changeUrl(filterinput);
    this.filteredValue(productsData);

    return productsData;
  }
}
