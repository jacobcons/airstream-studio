import { tns } from '../../node_modules/tiny-slider/src/tiny-slider.module.js';

export default {
  init() {
    const slider = tns({
    	container: '.cross-fader',
    	items: 1,
    	nav: false,
    	autoplayButtonOutput: false,
    	controlsText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
      lazyload: true,
      loop: false,
      speed: 600,
    });
  }
};