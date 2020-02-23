import { tns } from '../../node_modules/tiny-slider/src/tiny-slider.module.js';

export default {
  init() {
    const slider = tns({
    	container: '.cross-fader',
    	items: 1,
    	nav: false,
    	controlsText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
      lazyload: false,
      loop: false,
      speed: 600,
    });
  }
};