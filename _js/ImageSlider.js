const scroll = require('scroll');
const LazyLoad = require('vanilla-lazyload');

class ImageSlider {
  constructor(frames = 60, time = 1000) {
    this.elSlider = document.querySelector('.image-slider__scroll');
    this.elImage = document.querySelector('.image-slider__image');
    this.elLeftControl = document.querySelector('.image-slider__left-control');
    this.elRightControl = document.querySelector('.image-slider__right-control');
    this.frames = frames;
    this.time = time;
  }

  // value needed to adjust scrollLeft so image is horizontally centered
  get centerAdjust() {
    return (this.elSlider.offsetWidth - this.elImage.offsetWidth) / 2;
  }

  // returns image number being viewed as a float e.g. if 2nd image is centered it will return 2
  get imageNumber() {
    let imageNumber = (this.elSlider.scrollLeft + this.centerAdjust) / this.elImage.offsetWidth;

    // if image being viewed is nearly centered assume that the image number is centered
    return (Math.abs(imageNumber - Math.round(imageNumber)) < 0.05) ? Math.round(imageNumber) : imageNumber;
  }

  init() {
    const lazy = new LazyLoad({
      container: this.elSlider,
      threshold: this.elImage.offsetWidth,
    });

    this.elSlider.scrollLeft = this.calcScrollLeft(1);

    this.elLeftControl.addEventListener('click', () => {
      // if slider isn't at beginning
      if (this.elSlider.scrollLeft != 0) {
        // calculate image number of previous image
        const prevImage = this.prevImageNumber(this.imageNumber);

        // set scroll left of the slider to center new image
        scroll.left(this.elSlider, this.calcScrollLeft(prevImage));
      }
    });

    this.elRightControl.addEventListener('click', () => {
      // if slider hasn't reached end
      if (this.elSlider.scrollLeft != (this.elSlider.scrollWidth - this.elSlider.offsetWidth)) {
        // calculate image number of next image
        const nextImage = this.nextImageNumber(this.imageNumber);

        // set scroll left of the slider to center new image
        scroll.left(this.elSlider, this.calcScrollLeft(nextImage));
      }
    });
  }

  prevImageNumber(imageNumber) {
    return (imageNumber % 1 == 0) ? imageNumber - 1 : Math.floor(imageNumber);
  }

  nextImageNumber(imageNumber) {
    return (imageNumber % 1 == 0) ? imageNumber + 1 : Math.ceil(imageNumber);
  }

  calcScrollLeft(imageNumber) {
    return (imageNumber * this.elImage.offsetWidth) - this.centerAdjust;
  }

  async animate(start, end) {
    const distance = end - start;
    const delta = Math.floor(distance / this.frames);
    const ticker = Math.floor(this.time / this.frames);
    let currentFrame = 0;

    console.log(this.elSlider.scrollLeft + distance);

    let myTimer = setInterval(() => {
      //make sure the end of the animation has not been reached
      if (currentFrame < this.frames) {
        this.elSlider.scrollLeft += delta;
      } else {
        // the end of the animation has been reached so stop the interval
        console.log(this.elSlider.scrollLeft);
        clearInterval(myTimer);
      }

      currentFrame++;
    }, ticker);
  }
}

module.exports = new ImageSlider();
