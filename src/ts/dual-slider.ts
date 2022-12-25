import styles from '../sass/components/dualslider.styles.scss';

export class DualSlider extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;

    template.innerHTML = `
    <div class="wrapper">
      <div class="values">
        <span id="range1">0</span>
        <span id="range2">1000</span>
      </div>
      <div class="container">
        <div class="slider-track"></div>
        <input type="range" min="0" value="200" max="1000" id="slider-1"></input>
        <input type="range" min="0" value="800" max="1000" id="slider-2"></input>
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

    const MIN_GAP = 50;

    function fillColor() {
      if (sliderOne instanceof HTMLInputElement && sliderTwo instanceof HTMLInputElement && sliderMaxValue !== null) {
        const percent1: number = (+sliderOne.value / +sliderMaxValue) * 100;
        const percent2: number = (+sliderTwo.value / +sliderMaxValue) * 100;
        if (sliderTrack instanceof HTMLDivElement) {
          sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #ff0000 ${percent1}% , #ff0000 ${percent2}%, #dadae5 ${percent2}%)`;
        }
      }
    }

    function slideOne() {
      if (sliderOne instanceof HTMLInputElement && sliderTwo instanceof HTMLInputElement) {
        if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= MIN_GAP) {
          sliderOne.value = `${parseInt(sliderTwo.value) - MIN_GAP}`;
        }
        if (displayValOne) displayValOne.textContent = sliderOne.value;
        fillColor();
      }
    }

    function slideTwo() {
      if (sliderOne instanceof HTMLInputElement && sliderTwo instanceof HTMLInputElement) {
        if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= MIN_GAP) {
          sliderTwo.value = `${parseInt(sliderOne.value) + MIN_GAP}`;
        }
        if (displayValTwo) displayValTwo.textContent = sliderTwo.value;
        fillColor();
      }
    }

    if (sliderOne && sliderTwo) {
      sliderOne.oninput = slideOne;
      sliderTwo.oninput = slideTwo;
    } else {
      console.log(sliderOne);
    }

    window.onload = function () {
      slideOne();
      slideTwo();
    };
  }
}
