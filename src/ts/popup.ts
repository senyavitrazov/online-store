export class PopupPurchase {
  main: HTMLElement | null;
  mainWrapper: HTMLElement | null;

  constructor(main: HTMLElement | null) {
    if (!main) {
      this.main = document.createElement('main');
      this.mainWrapper = document.createElement('div');
      this.mainWrapper.classList.add('main__wrapper', 'wrapper');
      this.main.append(this.mainWrapper);
    } else {
      this.main = main;
      this.mainWrapper = main.querySelector('.main__wrapper');
    }
  }

  togglePopupBackground() {
    const bg = document.createElement('div');
    bg.classList.add('popup__background');
    this.main?.append(bg);
  }
}
