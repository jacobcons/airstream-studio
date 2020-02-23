export default class CurrentYear {
	constructor() {
		this.els = document.querySelectorAll('.date')
		this.els.forEach(this.setYear)
	}
	
	setYear(el) {
		el.textContent = (new Date()).getFullYear();
	}
}