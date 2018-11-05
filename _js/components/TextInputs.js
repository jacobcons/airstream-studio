export default class TextInputs {
  constructor() {
    this.els = document.querySelectorAll('.input-field__text');
    this.els.forEach(el => {
      const elLabel = el.nextElementSibling
      el.addEventListener('focus', () => elLabel.classList.add('input-field__label--active'))
      el.addEventListener('blur', () => {
        if (!el.value) {
          elLabel.classList.remove('input-field__label--active');
        }
      });
    });
  }
}
