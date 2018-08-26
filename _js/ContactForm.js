const Fetch = require('./Fetch.js');

class ContactForm {
  constructor() {
    this.elForm = document.querySelector('.contact-form');
    this.elSendBtn = this.elForm.querySelector('.js-btn-send');
    this.elFields = this.elForm.querySelectorAll('.input-field');
    this.elInputs = this.elForm.querySelectorAll('.input-field__text');
    this.elLabels = this.elForm.querySelectorAll('.input-field__label');
    this.elStatus = this.elForm.querySelector('.contact-form__status');
    this.elEmailInput = this.elForm.querySelector('input[name="email"]');
    this.elsRequiredInput = this.elForm.querySelectorAll('.input-field__text--required');

  }

  errorLabel(err) {
    return `<div class="contact-form__error">${err}</div>`;
  }

  init() {
    this.elSendBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      // remove errors from all inputs
      document.querySelectorAll('.contact-form__error').forEach(err => err.remove());
      this.elInputs.forEach(input => input.classList.remove('input-field__text--error'));
      this.elLabels.forEach(label => label.classList.remove('input-field__label--error'));
      this.elStatus.classList.remove('contact-form__status--error');

      let errors = {}
			if (!(/.+@.+/.test(this.elEmailInput.value))) {
				errors.email = {
					text: 'Please enter a valid email',
					input: this.elEmailInput,
				}
			}
			this.elsRequiredInput.forEach((input) => {
				if (!input.value) {
					errors[input.name] = {
						text: 'Please fill out the required field',
						input,
					}
				}
			})

			const errorNames = Object.keys(errors)
			if (errorNames.length === 0) {
				try {
          const formData = new URLSearchParams(new FormData(this.elForm))
					var res = await Fetch.post(this.elForm.getAttribute('action'), formData);
				} catch(e) {
					console.error(e)
				}

				if (res.ok) {
					this.elStatus.textContent = 'Thank you for your email :)'
          this.elForm.reset()
				} else {
					this.elStatus.textContent = 'Oops! There seems to have been a problem sending your email on our end. Contact us directly at info@airstreamstudio.co.uk'
				}
        
        this.elForm.scrollTop = this.elForm.offsetHeight;
			} else {
				errorNames.forEach((name) => {
          const input = errors[name].input
          const errMsg = errors[name].text
          const label = input.nextElementSibling
          input.classList.add('input-field__text--error');
          label.classList.add('input-field__label--error');
          label.insertAdjacentHTML('afterend', this.errorLabel(errMsg));
        })
        
        this.elForm.scrollTop = 0;
			}
    });
  }
}

module.exports = new ContactForm();
