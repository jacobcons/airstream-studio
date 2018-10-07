const autosize = require('autosize');

class InputField {
  constructor() {
    this.elInputs = document.querySelectorAll('.input-field__text');
    this.elTextAreas = document.querySelectorAll('.input-field__text--textarea');
  }

  init() {
    this.elInputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.nextElementSibling.classList.add('input-field__label--active');
      });
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.nextElementSibling.classList.remove('input-field__label--active');
        }
      });
    });

    autosize(this.elTextAreas);
  }
}

module.exports = new InputField();
