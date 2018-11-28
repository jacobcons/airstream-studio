export default class Modal {
  constructor() {
    this.el = document.querySelector('.modal');
    this.elBtn = document.querySelector('.js-btn-contact');
    this.elClose = document.querySelector('.modal__close');
    
    this.elBtn.addEventListener('click', () => this.show())
    window.addEventListener('click', (e) => {
      if (e.target == this.el) {
        this.hide()
      }
    });
    this.elClose.addEventListener('click', () => this.hide())
  }
  
  show() {
    this.el.style.display = 'block'
  }
  
  hide() {
    this.el.style.display = 'none'
  }
}
