import { tns } from '../node_modules/tiny-slider/src/tiny-slider.module'
import Fetch from './Fetch.js'

document.addEventListener('DOMContentLoaded', async () => {
	if (window.location.pathname === '/') {
		const slider = tns({
    	container: '.js-slider-singles',
			items: 1,
    	nav: false,
    	autoplayButtonOutput: false,
    	controlsText: [`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
			</svg>`, `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
			</svg>`],
      lazyload: true,
    });
	} else if (window.location.pathname === '/portfolio.html') {
		const slider = tns({
    	container: '.js-slider-triples',
			items: 1,
    	nav: false,
    	autoplayButtonOutput: false,
    	controlsText: [`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
			</svg>`, `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
			</svg>`],
      lazyload: true,
			gutter: 8,
			responsive: {
				592: {
					fixedWidth: 592,
				},
			},
    });
	} else if (window.location.pathname === '/contact.html') {
		const elTextInputs = document.querySelectorAll('.js-text-input')
		elTextInputs.forEach((input) => {
			input.addEventListener('focus', () => input.parentElement.classList.add('input-field--active'))
			input.addEventListener('blur', () => {
				if (!input.value) input.parentElement.classList.remove('input-field--active');
			})
		})
		
		const elSendBtn = document.querySelector('.js-send-btn')
		elSendBtn.addEventListener('click', async (e) => {
			e.preventDefault()
			const elForm = document.querySelector('.js-contact-form')
			const elRequiredInputs = document.querySelectorAll('.js-required-input')
			const elEmailInput = document.querySelector('input[name="email"]')
			const elErrors = document.querySelectorAll('.js-input-error')
			
			elErrors.forEach((error) => error.remove())
			
			let errors = {}
			if (!(/.+@.+/.test(elEmailInput.value))) {
				errors.email = {
					text: 'Please enter a valid email',
					input: elEmailInput,
				}
			}
			elRequiredInputs.forEach((input) => {
				if (!input.value) {
					errors[input.name] = {
						text: 'Please fill out the required field',
						input,
					}
				}
			})
			
			const errorNames = Object.keys(errors) 
			if (errorNames.length === 0) {
				const queryString = new URLSearchParams(new FormData(elForm)).toString()
				const res = await Fetch.get(`${elForm.getAttribute('action')}&${queryString}`);
				if (res.success) {
					document.body.insertAdjacentHTML('beforeend', `
					<div class="modal">
						<div class="modal__inner">
							<span>Thank you for your email :)</span>
							<span class="modal__close">X</span>
						</div>
					</div>`)
				}
				const elModal = document.querySelector('.modal')
				const elModalInner = document.querySelector('.modal__inner')
				const elModalClose = document.querySelector('.modal__close')
				elModal.addEventListener('click', (e) => {
					if (e.target !== elModalInner) elModal.remove()
				})
				elModalClose.addEventListener('click', () => elModal.remove())
			} else {
				errorNames.forEach((name) => errors[name].input.insertAdjacentHTML('afterend', `<span class="input-field__error js-input-error">${errors[name].text}</span>`))
			}
		})
	}
})
