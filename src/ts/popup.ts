import { inputCardNumber, inputExpirationdate } from './cardvalidation';

const popupHTML = `<div class="popup__bg"></div><div class="popup__container"><form action="#" method="POST" class="popup__form"> <div class="popup__leftside"> <h3 class="popup__header">Personal details</h3> <div class="input__group"> <div class="input__box" id="input-name"> <input type="text" placeholder="Name" required=""> </div> </div> <div class="input__group"> <div class="input__box" id="input-tel"> <input type="tel" placeholder="Phone" required=""> </div> </div> <div class="input__group"> <div class="input__box" id="input-address"> <input type="text" placeholder="Address" required=""> </div> </div> <div class="input__group"> <div class="input__box" id="input-email"> <input type="email" placeholder="E-mail" required=""> </div> </div> <h3 class="popup__header">Card details</h3> </div> <div class="popup__rightside rightside"> <div class="rightside__card card"> <div class="card__front"> <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Blank_button.svg/1124px-Blank_button.svg.png" alt="payment" class="paymenticon visaicon"> <div class="input__box" id="cardnumber-box"> <label for="cardnumber">Card number</label> <input type="text" id="cardnumber"> </div> <div class="input__box" id="expirationdate-box"> <label for="expirationdate">Expiration date</label><input type="text" id="expirationdate" maxlength="5"> </div> <div class="input__box" id="cardholdername-box"> <label for="cardholdername">Cardholder name</label> <input type="text" id="cardholdername"> </div> <div class="input__box" id="cvccvv-box"> <label for="cvccvv">CVC/CVV</label> <input type="text" id="cvccvv" maxlength="3"> <p>The last 3 <br>digits on back <br>of the card</p> </div> </div> <div class="card__back"> <div class="card__magnet"></div></div></div> </div> <button class="popup__confirm">confirm</button> <img src="https://cdn-icons-png.flaticon.com/512/61/61155.png" alt="Close" class="popup__close"> </form> </div>`;

export class PopupPurchase {
  validFlag = false;
  main: HTMLElement | null;
  mainWrapper: HTMLElement | null;
  popup: HTMLElement = document.createElement('div');
  telephone: HTMLInputElement | null = null;
  address: HTMLInputElement | null = null;
  name: HTMLInputElement | null = null;
  email: HTMLInputElement | null = null;

  cardnumber: HTMLInputElement | null = null;
  expirationdate: HTMLInputElement | null = null;
  cardholdername: HTMLInputElement | null = null;
  cvccvv: HTMLInputElement | null = null;

  imagesOfPayment: string[];
  paymenticon: HTMLInputElement | null;

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
    this.popup.innerHTML = popupHTML;

    const telephoneBox = this.popup.querySelector('#input-tel');
    const addressBox = this.popup.querySelector('#input-address');
    const nameBox = this.popup.querySelector('#input-name');
    const emailBox = this.popup.querySelector('#input-email');

    if (telephoneBox) this.telephone = telephoneBox.querySelector('input');
    if (addressBox) this.address = addressBox.querySelector('input');
    if (nameBox) this.name = nameBox.querySelector('input');
    if (emailBox) this.email = emailBox.querySelector('input');

    this.cardnumber = this.popup.querySelector('#cardnumber');
    this.expirationdate = this.popup.querySelector('#expirationdate');
    this.cardholdername = this.popup.querySelector('#cardholdername');
    this.cvccvv = this.popup.querySelector('#cvccvv');

    this.imagesOfPayment = [
      'https://cdn-icons-png.flaticon.com/512/6993/6993594.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/2560px-Visa_2021.svg.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/989px-Mastercard-logo.svg.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/2560px-JCB_logo.svg.png',
    ];
    this.paymenticon = this.popup.querySelector('.paymenticon');
  }

  togglePopup(target?: HTMLElement | null) {
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

    function validationRule(this: HTMLInputElement, regexp: RegExp, messages: string[]) {
      const v = this.value;
      const elParent = this.parentElement;
      if (elParent instanceof HTMLElement) {
        this.classList.add('err');
        if (v.length === 0) {
          elParent.setAttribute('data-value', messages[0]);
        } else if (!v.match(regexp)) {
          elParent.setAttribute('data-value', messages[1]);
        } else {
          elParent.removeAttribute('data-value');
          this.classList.remove('err');
        }
      }
    }

    this.telephone?.addEventListener(
      'keyup',
      validationRule.bind(this.telephone, /^[+][(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/gim, [
        'telephone is required',
        'must start with + and be 10-12 digits',
      ])
    );

    this.name?.addEventListener(
      'keyup',
      validationRule.bind(this.name, /[a-zA-Z]{3,}[\s][a-zA-Z]{3,}/gim, [
        'name is required',
        'at least two words longer than 3 letters',
      ])
    );

    this.address?.addEventListener(
      'keyup',
      validationRule.bind(this.address, /.{5,}[\s].{5,}[\s].{5,}/gim, [
        'address is required',
        'at least three words longer than 5 symbols',
      ])
    );

    this.email?.addEventListener(
      'keyup',
      validationRule.bind(this.email, /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gim, [
        'email is required',
        'someone@example.com',
      ])
    );

    this.expirationdate?.addEventListener('keypress', e => inputExpirationdate(e));
    this.expirationdate?.addEventListener('keyup', function (e) {
      const v = this.value;
      const elParent = this.parentElement;
      if (!isFinite(+e.key) && e.key !== 'Backspace' && !e.key.search('Arrow') && !e.key.search('Delete')) {
        e.preventDefault();
        this.value = v.slice(0, -1);
      }
      if (v.length > 4 && +v.slice(3) > 11) {
        this.value = v.slice(0, 3) + 12;
        if (elParent) elParent.setAttribute('data-value', 'invalid date');
        this.classList.add('err');
      }
      if (v.length < 3) {
        if (elParent) elParent.setAttribute('data-value', 'invalid date');
        this.classList.add('err');
      } else {
        this.classList.remove('err');
        if (elParent) elParent.removeAttribute('data-value');
      }
    });

    this.cardholdername?.addEventListener('keyup', function () {
      const v = this.value;
      this.value = v.replace(/[^a-zA-Z, \s]/gim, '');
      const elParent = this.parentElement;
      if (!v.match(/[a-zA-Z]{3,}[\s][a-zA-Z]{3,}/gim)) {
        this.classList.add('err');
        if (elParent) elParent.setAttribute('data-value', 'invalid name');
      } else {
        this.classList.remove('err');
        if (elParent) elParent.removeAttribute('data-value');
      }
    });

    this.cvccvv?.addEventListener('keyup', function () {
      const v = this.value;
      this.value = v.replace(/[^0-9]/gim, '');
      const elParent = this.parentElement;
      if (v.length !== 3) {
        this.classList.add('err');
        if (elParent) elParent.setAttribute('data-value', 'invalid code');
      } else {
        this.classList.remove('err');
        if (elParent) elParent.removeAttribute('data-value');
      }
    });

    if (this.cardnumber) inputCardNumber(this.cardnumber);
    this.cardnumber?.addEventListener('keyup', () => {
      let firstSymb;
      if (this.paymenticon) {
        this.paymenticon.src = this.imagesOfPayment[0];
        if (!this.cardnumber) {
          firstSymb = '0';
        } else {
          firstSymb = this.cardnumber.value[0];
          console.log(firstSymb);
          if (firstSymb === '3') {
            this.paymenticon.src = this.imagesOfPayment[3];
          }
          if (firstSymb === '4') {
            this.paymenticon.src = this.imagesOfPayment[1];
          }
          if (firstSymb === '5') {
            this.paymenticon.src = this.imagesOfPayment[2];
          }
        }
      }
    });

    const confirm = this.popup.querySelector('button');
    confirm?.addEventListener('click', () => {
      if (this.isValid()) {
      }
    });
  }

  isValid() {
    const allInputs = this.popup.querySelectorAll('input');

    allInputs.forEach(e => {
      const elParent = e.parentElement;
      if (e.value.length === 0) {
        e.classList.add('err');
        if (elParent) elParent.setAttribute('data-value', 'required field');
      }
    });

    for (const e of allInputs) {
      if (e.hasAttribute('data-value')) {
        this.validFlag = false;
        break;
      } else {
        this.validFlag = !0;
      }
    }

    return this.validFlag;
  }
}
