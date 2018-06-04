import { tns } from '../node_modules/tiny-slider/src/tiny-slider.module'

document.addEventListener('DOMContentLoaded', () => {
	if (window.location.pathname === '/') {
		console.log('Index')
	} else if (window.location.pathname === '/services.html') {
		console.log('Services')
	}
})
