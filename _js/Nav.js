class Nav {
  constructor() {
    this.elHamburgerMenu = document.querySelector('.hamburger-menu');
    this.hasSubItem = document.querySelectorAll('.nav__item--has-sub');
  }

  toggleHamburgerMenu() {
    // click hamburger menu -> toggles primary-nav (small screens)
    this.elHamburgerMenu.addEventListener('click', () => {
      this.elHamburgerMenu.classList.toggle('hamburger-menu--is-active');
    });
  }

  toggleSubNav() {
    // click nav item with sub nav -> toggles sub-nav and underline (small screens)
    this.hasSubItem.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('nav__item--is-active');
        item.querySelector('.nav__link').classList.toggle('nav__link--underline');
      });
    });
  }

  init() {
    this.toggleHamburgerMenu();
    this.toggleSubNav();
  }
}

module.exports = new Nav();
