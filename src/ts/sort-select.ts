import styles from '../sass/components/sortselect.styles.scss';

export enum SortingField {
  'price',
  'rating',
  'discountPercentage',
}

export class SortSelect extends HTMLElement {
  reverseFlag = false;
  sortingField = 0;

  changeUrl() {
    const params = new URLSearchParams(window.location.search);
    const sortCode = `${this.sortingField}` + Number(this.reverseFlag);
    params.set('sort', sortCode);
    window.history.pushState(null, '', location.hash.slice(1) + '?' + params.toString());

    this.dispatchEvent(new Event('filterchange', { bubbles: true }));
  }

  constructor() {
    super();
    const template = document.createElement('template');
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;

    const params = new URLSearchParams(window.location.search);
    let oldValue = params.get('sort');
    if (oldValue === null) {
      oldValue = '00';
      params.set('sort', '00');
      //window.history.pushState(null, '', location.hash.slice(1) + '?' + params.toString());
    }
    let sortField = 0;
    this.reverseFlag = !!(+oldValue % 10);
    sortField = Math.floor(+oldValue / 10);

    template.innerHTML = `<div class="sort-container">
    <button id="reverse-storing" ${this.reverseFlag ? 'class="active"' : ''}></button>
    <div class="select">
      <div class="select__header">
        <span class="select__current">sort by ${sortField === 2 ? 'discount' : SortingField[sortField]}</span>
        <img class="select__icon" src="http://cdn.onlinewebfonts.com/svg/img_295694.svg" alt="Arrow Icon" aria-hidden="true">
      </div>
      <div class="select__body">
        <div class="select__item" data-sorting="0">sort by price</div>
        <div class="select__item" data-sorting="1">sort by rating</div>
        <div class="select__item" data-sorting="2">sort by discount</div>
      </div>
    </div>
    </div>`;

    shadow.appendChild(style);
    shadow.appendChild(template.content.cloneNode(true));

    const selectHeader = shadow.querySelectorAll('.select__header');
    const selectItem = shadow.querySelectorAll('.select__item');
    const reverseButton = shadow.getElementById('reverse-storing');

    reverseButton?.addEventListener('click', () => {
      this.reverseFlag = !this.reverseFlag;
      reverseButton.classList.toggle('active');
      this.changeUrl();
    });

    selectHeader.forEach(item => {
      if (item instanceof HTMLElement) {
        item.addEventListener('click', () => {
          if (item.parentElement) item.parentElement.classList.toggle('is-active');
        });
      }
    });

    selectItem.forEach(item => {
      if (item instanceof HTMLElement) {
        item.addEventListener('click', () => {
          const text = item.innerText,
            select = item.closest('.select');
          let currentText = null;
          if (select) {
            currentText = select.querySelector('.select__current');
            if (currentText instanceof HTMLElement) currentText.innerText = text;
            select.classList.remove('is-active');
          }
          this.sortingField = +(item.getAttribute('data-sorting') || 0);
          this.changeUrl();
        });
      }
    });
  }
}
