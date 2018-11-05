class CrossFader {
  constructor() {
    this.elContainer = document.querySelector('.cross-fader');
    this.elImages = this.elContainer.querySelectorAll('.cross-fader__image');
  }

  init() {
    // load top two images
    this.loadImage(this.elImages[this.elImages.length - 1]);
    this.loadImage(this.elImages[this.elImages.length - 2]);

    // ensures that top two images will always be loaded at the top
    setInterval(() => {
      this.loadImage(this.elContainer.querySelector(':nth-last-child(3)'));
      this.elContainer.lastChild.style.opacity = 0;
    }, 4000);

    // event listener for when image fades out
    this.elImages.forEach(image => {
      image.addEventListener('transitionend', () => {
        // insert image that just faded out to the bottom
        this.elContainer.insertBefore(image, this.elContainer.firstChild);

        // make it visible for when it's at the front again
        image.style.opacity = 1;
      });
    });
  }

  loadImage(image) {
    if (image.getAttribute('data-src')) {
      image.setAttribute('src', image.getAttribute('data-src'));
      image.addEventListener('load', () => image.removeAttribute('data-src'));
    }
  }
}

module.exports = new CrossFader();
