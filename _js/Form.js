const Fetch = require('./Fetch.js');

class Form {
  constructor() {
    this.elForm = document.querySelector('.contact-form');
    this.elSendBtn = this.elForm.querySelector('.js-btn-send');
    this.elFields = this.elForm.querySelectorAll('.input-field');
    this.elInputs = this.elForm.querySelectorAll('.input-field__text');
    this.elLabels = this.elForm.querySelectorAll('.input-field__label');
    this.elStatus = this.elForm.querySelector('.contact-form__status');
    this.elEmailInput = this.elForm.querySelector('input[name="email"]');
    this.elsRequiredInput = this.elForm.querySelectorAll('.input-field__text--required');
    this.errors = {}

  }

  errorLabel(label) {
    return `<div class="input-field__error">${label}</div>`;
  }
  
  removeErrors() {
    // remove errors from all inputs
    document.querySelectorAll('.input-field__error').forEach(err => err.remove());
    this.elInputs.forEach(input => input.classList.remove('input-field__text--error'));
    this.elLabels.forEach(label => label.classList.remove('input-field__label--error'));
    this.elStatus.classList.remove('contact-form__status--error');
  }
  
  validateEmail() {
    if (!(/.+@.+/.test(this.elEmailInput.value))) {
      this.errors.email = {
        label: 'Please enter a valid email',
        elInput: this.elEmailInput,
      }
    }
  }
  
  validateRequired() {
    this.elsRequiredInput.forEach((elInput) => {
      if (!elInput.value) {
        this.errors[elInput.name] = {
          label: 'Please fill out the required field',
          elInput,
        }
      }
    })
  }
  
  async sendEmail() {
    try {
      const formData = new URLSearchParams(new FormData(this.elForm))
      const res = await Fetch.post(this.elForm.getAttribute('action'), formData);
      return res.ok
    } catch(e) {
      console.error(e)
    }
  }
  
  setStatusText(isSuccess) {
    if (isSuccess) {
      this.elStatus.textContent = 'Thank you for your email :)'
      this.elForm.reset()
    } else {
      this.elStatus.classList.add('contact-form__status--error');
      this.elStatus.textContent = 'Oops! There seems to have been a problem sending your email on our end. Contact us directly at info@airstreamstudio.co.uk'
    }
  }
  
  scrollFormToBottom() {
    this.elForm.scrollTop = this.elForm.offsetHeight
  }
  
  scrollFormToTop() {
    this.elForm.scrollTop = 0;
  }
  
  addErrorLabel(elInput, elLabel, label) {
    elInput.classList.add('input-field__text--error');
    elLabel.classList.add('input-field__label--error');
    elLabel.insertAdjacentHTML('afterend', this.errorLabel(label));
  }
  
  addErrorLabels(erroneousInputs) {
    erroneousInputs.forEach((name) => {
      const {elInput, label} = this.errors[name]
      const elLabel = elInput.nextElementSibling
      this.addErrorLabel(elInput, elLabel, label)
    })
  }
  
  resetStatusText() {
    this.elStatus.textContent = ''
  }
  
  resetForm() {
    this.errors = {}
    this.removeErrors()
    this.resetStatusText()
  }
  
  init() {
    this.elSendBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      this.resetForm()
      
      this.validateEmail()
      this.validateRequired()
      
			const erroneousInputs = Object.keys(this.errors)
			if (!erroneousInputs.length) {
				const isSuccess = await this.sendEmail()
        this.setStatusText(isSuccess)
        this.scrollFormToBottom()
			} else {
        this.addErrorLabels(erroneousInputs)
        this.scrollFormToTop()
			}
    });
  }
}

export {Form as default}
