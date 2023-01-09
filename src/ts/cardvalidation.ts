export const inputCardNumber = function (input: HTMLInputElement) {
  const format_and_pos = function (char: string, backspace: boolean | null) {
    let start = 0;
    let end = 0;
    let pos = 0;
    const separator = ' ';
    let value = input.value;

    if (char) {
      if (input.selectionStart) start = input.selectionStart;
      if (input.selectionEnd) end = input.selectionEnd;
      if (backspace && start > 0) {
        start--;
        if (value[start] == separator) {
          start--;
        }
      }
      value = value.substring(0, start) + char + value.substring(end);
      pos = start + char.length;
    }

    let d = 0; // digit count
    let gi = 0; // group index
    let newV = '';
    const groups = /^\D*3[47]/.test(value) // check for American Express
      ? [4, 6, 5]
      : [4, 4, 4, 4];

    for (let i = 0; i < value.length; i++) {
      if (/\D/.test(value[i])) {
        if (start > i) {
          pos--;
        }
      } else {
        if (d === groups[gi]) {
          newV += separator;
          d = 0;
          gi++;
          if (start >= i) {
            pos++;
          }
        }
        newV += value[i];
        d++;
      }
      if (d === groups[gi] && groups.length === gi + 1) {
        break;
      }
    }
    input.value = newV;

    if (char) {
      input.setSelectionRange(pos, pos);
    }
  };

  input.addEventListener('keypress', function (e) {
    const code = e.charCode || e.keyCode || e.which;
    const elParent = this.parentElement;
    if (this.value.length < 18 || this.value.length > 19) {
      this.classList.add('err');
      if (elParent) elParent.setAttribute('data-value', 'invalid card number');
    } else {
      this.classList.remove('err');
      if (elParent) elParent.removeAttribute('data-value');
    }
    if (code !== 9 && (code < 37 || code > 40) && !(e.ctrlKey && (code === 99 || code === 118))) {
      e.preventDefault();
      const char = String.fromCharCode(code);
      if (
        /\D/.test(char) ||
        (this.selectionStart === this.selectionEnd &&
          this.value.replace(/\D/g, '').length >= (/^\D*3[47]/.test(this.value) ? 15 : 16))
      ) {
        return false;
      }
      format_and_pos(char, null);
    }
  });

  input.addEventListener('keydown', function (e) {
    if (e.keyCode === 8 || e.keyCode === 46) {
      //e.preventDefault();
      format_and_pos('', this.selectionStart === this.selectionEnd);
    }
  });

  input.addEventListener('paste', function () {
    setTimeout(function () {
      format_and_pos('', null);
    }, 50);
  });
};

export function inputExpirationdate(event: KeyboardEvent) {
  const code = event.key;
  const allowedKeys = [8];
  if (allowedKeys.indexOf(+code) !== -1) {
    return;
  }
  if (event.target instanceof HTMLInputElement) {
    event.target.value = event.target.value
      .replace(
        /^([1-9]\/|[2-9])$/g,
        '0$1/' // 3 > 03/
      )
      .replace(
        /^(0[1-9]|1[0-2])$/g,
        '$1/' // 11 > 11/
      )
      .replace(
        /^([0-1])([3-9])$/g,
        '0$1/$2' // 13 > 01/3
      )
      .replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
        '$1/$2' // 141 > 01/41
      )
      .replace(
        /^([0]+)\/|[0]+$/g,
        '0' // 0/ > 0 and 00 > 0
      )
      .replace(
        /[^\d/]|^[/]*$/g,
        '' // To allow only digits and `/`
      )
      .replace(
        /\/\//g,
        '/' // Prevent entering more than 1 `/`
      );
  }
}
