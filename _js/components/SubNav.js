export default class SubNav {
  constructor() {
    this.elItemHasSubNav = document.querySelectorAll('.nav__item--has-sub');
    this.elItemHasSubNav.forEach(elItem => {
      const elLink = elItem.querySelector('.nav__link')
      elItem.addEventListener('click', () => this.toggleActive(elItem, elLink))
    });
  }

  toggleActive(elItem, elLink) {
    // click nav item with sub nav -> toggles sub-nav and underline (small screens)
    elItem.classList.toggle('nav__item--is-active');
    elLink.classList.toggle('nav__link--underline');
  }
}
