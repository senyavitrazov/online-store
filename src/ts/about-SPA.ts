import dataExample from '../assets/data-exapmle.json';
import { Product } from './product-card';
import { Checkbox } from './checkbox-filter';   
const main: string | null = localStorage.getItem('mainc') ? localStorage.getItem('mainc') : '';
let src2 = '';
const aboutstr: string | null = localStorage.getItem('aboutproducts') ? localStorage.getItem('aboutproducts') : '';
let about: string[] = [];       
document.addEventListener('click', (e: Event) => {
    const target = <HTMLElement>e.target;
    if (!target.matches('product-card')) {
      return;
    }
    e.preventDefault();
    const maincontents: string | undefined = document.querySelector('main')?.innerHTML;
    localStorage.setItem('mainc', maincontents ? maincontents : 'hello');
    const src: string | null = target.getAttribute('src');
    if (src) src2 = src;
    urlRoute(src2);
  });
dataExample.products.forEach((el: Product, idx: number):void => {
  about.push(`<product-card src="${idx}"></product-card>`);
});
if (aboutstr) about = JSON.parse(aboutstr);
localStorage.setItem('aboutproducts', JSON.stringify(about));
const urlRoutes = {
  '/': main,
  '/about': about,
};
const maincontent: HTMLElement | null = document.querySelector('main');
const urlRoute = (itemsrc: string): void => {
  window.history.pushState({}, '', window.location.origin + `/about/${itemsrc}`);
  if (maincontent) maincontent.innerHTML = urlRoutes['/about'][parseInt(itemsrc)];
};
window.onpopstate = (): void => {
  let location: string = window.location.pathname;
  if (location.length == 0) {
    location = '/';
  }
  if (location === '/') {
    urlRoutes['/'] = localStorage.getItem('mainc') ? localStorage.getItem('mainc') : ''
    if (maincontent) maincontent.innerHTML = urlRoutes['/'] ? urlRoutes['/'] : 'hello';
    const checkbox = new Checkbox();
    checkbox.drawcheckboxCategories();
    checkbox.drawcheckboxBrand();
  }
  if (location.split('/')[1] === 'about') {
    if (maincontent) maincontent.innerHTML = urlRoutes['/about'][location.split('/').length-1];
  }
};
