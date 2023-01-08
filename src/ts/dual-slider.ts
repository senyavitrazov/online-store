import styles from '../sass/components/dualslider.styles.scss';
import dataExample from '../assets/data-exapmle.json';
import { Product } from './product-card';

const data: Product[] = dataExample.products;

export class DualSlider extends HTMLElement {
  limitsOfValues: { left: number; right: number } = { left: 0, right: 0 };
  oldValues: { left: number; right: number } = { left: 0, right: 0 };

  changeUrl(type: string | null, l: string, r: string) {
    const params = new URLSearchParams(window.location.search);
    const limits = l + 't' + r;
    params.set(`ds${type ? 'p' : 'a'}`, limits);
    window.history.pushState(null, '', window.location.pathname + '?' + params.toString());
  }

  constructor() {
    super();
    const template = document.createElement('template');
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;

    const params = new URLSearchParams(window.location.search);
    let value = null;
    if (this.attributes['type' as keyof typeof this.attributes]) {
      value = params.get('dsp');
    } else {
      value = params.get('dsa');
    }
    if (value) {
      this.oldValues.left = +value.slice(0, value.indexOf('t'));
      this.oldValues.right = +value.slice(value.indexOf('t') + 1);
    }

    let symbolOfValue = '';
    if (this.attributes['type' as keyof typeof this.attributes]) {
      symbolOfValue = '$';
      this.limitsOfValues.left = data.reduce((acc, curr) => (acc.price < curr.price ? acc : curr)).price;
      this.limitsOfValues.right = data.reduce((acc, curr) => (acc.price > curr.price ? acc : curr)).price;
    } else {
      this.limitsOfValues.left = data.reduce((acc, curr) => (acc.stock < curr.stock ? acc : curr)).stock;
      this.limitsOfValues.right = data.reduce((acc, curr) => (acc.stock > curr.stock ? acc : curr)).stock;
    }

    const MIN_GAP: number = (this.limitsOfValues.right - this.limitsOfValues.left) / 100;

    template.innerHTML = `
    <div class="wrapper">
      <div class="values">
        <span id="range1"></span>
        <span id="range2"></span>
      </div>
      <div class="container">
        <div class="slider-track"></div>
        <input type="range" min="${this.limitsOfValues.left}" value="${
      this.oldValues.left || this.limitsOfValues.left
    }" max="${this.limitsOfValues.right}" id="slider-1"></input>
        <input type="range" min="${this.limitsOfValues.left}" value="${
      this.oldValues.right || this.limitsOfValues.right
    }" max="${this.limitsOfValues.right}" id="slider-2"></input>
      </div>
    </div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(template.content.cloneNode(true));

    const sliderOne = shadow.getElementById('slider-1');
    const sliderTwo = shadow.getElementById('slider-2');
    const displayValOne = shadow.getElementById('range1');
    const displayValTwo = shadow.getElementById('range2');
    const sliderTrack = shadow.querySelector('.slider-track');
    const sliderMaxValue = sliderOne instanceof HTMLInputElement ? sliderOne.max : null;

    const fillColor = () => {
      if (sliderOne instanceof HTMLInputElement && sliderTwo instanceof HTMLInputElement && sliderMaxValue !== null) {
        const percent1: number = (+sliderOne.value / +sliderMaxValue) * 100;
        const percent2: number = (+sliderTwo.value / +sliderMaxValue) * 100;
        if (sliderTrack instanceof HTMLDivElement) {
          sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #ff0000 ${percent1}% , #ff0000 ${percent2}%, #dadae5 ${percent2}%)`;
        }
        this.changeUrl(symbolOfValue, sliderOne.value, sliderTwo.value);
      }
    };

    function slideOne() {
      if (sliderOne instanceof HTMLInputElement && sliderTwo instanceof HTMLInputElement) {
        if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= MIN_GAP) {
          sliderOne.value = `${parseInt(sliderTwo.value) - MIN_GAP}`;
        }
        if (displayValOne) displayValOne.textContent = symbolOfValue + sliderOne.value;
        fillColor();
      }
    }

    function slideTwo() {
      if (sliderOne instanceof HTMLInputElement && sliderTwo instanceof HTMLInputElement) {
        if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= MIN_GAP) {
          sliderTwo.value = `${parseInt(sliderOne.value) + MIN_GAP}`;
        }
        if (displayValTwo) displayValTwo.textContent = symbolOfValue + sliderTwo.value;
        fillColor();
      }
    }

    if (sliderOne && sliderTwo) {
      slideOne();
      slideTwo();
      sliderOne.oninput = slideOne;
      sliderTwo.oninput = slideTwo;
      sliderOne.onchange = () => {
        this.dispatchEvent(new Event('filterchange', { bubbles: true }));
      };
      sliderTwo.onchange = () => {
        this.dispatchEvent(new Event('filterchange', { bubbles: true }));
      };
    } else {
      console.log(sliderOne);
    }
  }

  static get observedAttributes() {
    return ['type'];
  }

  set type(val) {
    if (val == null) {
      this.removeAttribute('type');
    } else {
      this.setAttribute('type', val);
    }
  }

  get type() {
    return this.getAttribute('type');
  }
}
