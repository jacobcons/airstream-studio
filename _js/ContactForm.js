const Fetch = require('./Fetch.js');

class ContactForm {
  constructor() {
    this.elForm = document.querySelector('.contact-form');
    this.elSendBtn = this.elForm.querySelector('.js-btn-send');
    this.elFields = this.elForm.querySelectorAll('.input-field');
    this.elInputs = this.elForm.querySelectorAll('.input-field__text');
    this.elLabels = this.elForm.querySelectorAll('.input-field__label');
    this.elStatus = this.elForm.querySelector('.contact-form__status');
    this.elRecaptcha = this.elForm.querySelector('.g-recaptcha');
  }

  errorLabel(err) {
    return `<div class="contact-form__error">${err}</div>`;
  }

  init() {
    this.elSendBtn.addEventListener('click', async (e) => {
      // post request to submit form data to be emailed
      e.preventDefault();
      const res = await Fetch.post(this.elForm.getAttribute('action'), new FormData(this.elForm));
      const body = await res.json();

      // remove errors from all inputs
      if (document.querySelectorAll('.contact-form__error')) {
        document.querySelectorAll('.contact-form__error').forEach(err => err.remove());
      }

      this.elInputs.forEach(input => input.classList.remove('input-field__text--error'));
      this.elLabels.forEach(label => label.classList.remove('input-field__label--error'));
      this.elStatus.classList.remove('contact-form__status--error');
      grecaptcha.reset();

      if (body.errors) {
        // add errors to inputs that need it
        Object.keys(body.errors).forEach((key, index) => {
          const input = this.elForm.querySelector(`.input-field__text[name=${key}]`);
          const label = input.nextElementSibling;
          input.classList.add('input-field__text--error');
          label.classList.add('input-field__label--error');
          label.insertAdjacentHTML('afterend', this.errorLabel(body.errors[key]));
        });
      }

      if (body.recaptcha) {
        this.elRecaptcha.insertAdjacentHTML('afterend', this.errorLabel(body.recaptcha));
      }

      if (res.status === 400 || res.status === 500) {
        this.elStatus.classList.add('contact-form__status--error');
      }

      // display results of post request
      this.elStatus.textContent = body.status;

      // scroll to bottom of form
      this.elForm.scrollTop = this.elForm.offsetHeight;
    });
  }
}

module.exports = new ContactForm();
