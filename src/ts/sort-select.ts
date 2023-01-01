import styles from '../sass/components/sortselect.styles.scss';

export class SortSelect extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;

    template.innerHTML = `<div class="sort-container">
    <button id="reverse-storing"></button>
    <div class="select">
      <div class="select__header">
        <span class="select__current">sort by price</span>
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
        });
      }
    });
  }
}
