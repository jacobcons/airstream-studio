class Modal {
  constructor() {
    this.elModal = document.querySelector('.modal');
    this.elBtn = document.querySelector('.js-btn-contact');
    this.elClose = document.querySelector('.modal__close');
  }

  init() {
    this.elBtn.addEventListener('click', () => {
      this.elModal.style.display = 'block';
    });

    window.addEventListener('click', (e) => {
      if (e.target == this.elModal) {
        this.elModal.style.display = 'none';
      }
    });

    this.elClose.addEventListener('click', () => {
      this.elModal.style.display = 'none';
    });
  }
}

module.exports = new Modal();
