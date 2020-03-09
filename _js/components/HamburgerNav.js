export default class HamburgerNav {
  constructor() {
    this.el = document.querySelector('.hamburger-menu');
    this.el.addEventListener('click', () => this.toggleActive())
  }

  toggleActive() {
    // click hamburger menu -> toggles primary-nav (small screens)
    this.el.classList.toggle('hamburger-menu--is-active')
  }
}
