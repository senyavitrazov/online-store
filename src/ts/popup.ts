const popupHTML = `<div class="popup__bg"></div><div class="popup__container"><form action="#" method="POST" class="popup__form"> <div class="popup__leftside"> <h3 class="popup__header">Personal details</h3> <div class="input__group"> <div class="input__box" id="input-name"> <input type="text" placeholder="Name" required=""> </div> </div> <div class="input__group"> <div class="input__box" id="input-tel"> <input type="tel" placeholder="Phone" required=""> </div> </div> <div class="input__group"> <div class="input__box" id="input-adress"> <input type="text" placeholder="Adress" required=""> </div> </div> <div class="input__group"> <div class="input__box" id="input-email"> <input type="email" placeholder="E-mail" required=""> </div> </div> <h3 class="popup__header">Card details</h3> </div> <div class="popup__rightside rightside"> <div class="rightside__card card"> <div class="card__front"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/989px-Mastercard-logo.svg.png" alt="Mastercard" class="mastercardicon"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/2560px-Visa_2021.svg.png" alt="visa" class="visaicon"> <div class="input__box" id="cardnumber-box"> <label for="cardnumber">Card number</label> <input type="text" id="cardnumber"> </div> <div class="input__box" id="expirationdate-box"> <label for="expirationdate">Expiration date</label> <div> <input type="text" id="expirationdate"> <input type="text" id="expirationdate1"> </div> </div> <div class="input__box" id="cardholdername-box"> <label for="cardholdername">Cardholder name</label> <input type="text" id="cardholdername"> </div> <div class="input__box" id="cvccvv-box"> <label for="cvccvv">CVC/CVV</label> <input type="text" id="cvccvv"> <p>The last <br>3 or 4 digits <br>on back <br>of the card</p> </div> </div> <div class="card__back"> <div class="card__magnet"></div> </div> <button class="rightside__book-btn button">Book</button> </div> </div> <button class="popup__confirm">confirm</button> <img src="https://cdn-icons-png.flaticon.com/512/61/61155.png" alt="Close" class="popup__close"> </form> </div>`;

export class PopupPurchase {
  main: HTMLElement | null;
  mainWrapper: HTMLElement | null;
  popup: HTMLElement;

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
    this.popup = document.createElement('div');
    this.popup.classList.add('popup');
  }

  togglePopup(target?: HTMLElement | null) {
    this.popup.innerHTML = popupHTML;
    if (target) {
      target.append(this.popup);
    } else {
      this.main?.append(this.popup);
    }
    this.attractListeners();
  }

  attractListeners() {
    const close = this.popup.querySelector('.popup__close');
    const bg = this.popup.querySelector('.popup__bg');
    close?.addEventListener('click', () => {
      this.popup.remove();
    });
    bg?.addEventListener('click', () => {
      this.popup.remove();
    });
  }
}
