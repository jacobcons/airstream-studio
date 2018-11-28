export default class CurrentYear {
	constructor() {
		this.el = document.querySelector('.date')
		this.setYear()
	}
	
	setYear() {
		this.el.textContent = (new Date()).getFullYear();
	}
}