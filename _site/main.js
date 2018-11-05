(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class CopyLink {
  constructor() {
    this.el = document.querySelector('.copy-link');
    this.el.addEventListener('click', e => {
      this.copyToClipboard(this.el.textContent);
      this.confirmCopyMessage();
    });
  }

  copyToClipboard(value) {
    // copy link content to clipboard
    let temp = document.createElement('input');
    document.body.appendChild(temp);
    temp.value = value;
    temp.select();
    document.execCommand('copy');
    temp.remove();
  }

  confirmCopyMessage() {
    this.el.classList.add('copy-link--copied');
    setTimeout(() => {
      this.el.classList.remove('copy-link--copied');
    }, 750);
  }
}
exports.default = CopyLink;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
class CurrentYear {
	constructor() {
		this.el = document.querySelector('.date');
		this.setYear();
	}

	setYear() {
		this.el.textContent = new Date().getFullYear();
	}
}
exports.default = CurrentYear;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flatpickr = require('flatpickr');

var _flatpickr2 = _interopRequireDefault(_flatpickr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DateInputs {
  constructor() {
    (0, _flatpickr2.default)('.input-field__date', {
      dateFormat: 'J F, Y'
    });

    const timePickers = (0, _flatpickr2.default)('.input-field__time', {
      enableTime: true,
      noCalendar: true,
      allowInput: true,
      dateFormat: 'h:i K'
    });

    timePickers[0].config.onClose = [() => {
      setTimeout(() => timePickers[1].open(), 1);
    }];

    timePickers[0].config.onChange = [selDates => {
      timePickers[1].set("minDate", selDates[0]);
    }];

    timePickers[1].config.onChange = [selDates => {
      timePickers[0].set("maxDate", selDates[0]);
    }];
  }
}
exports.default = DateInputs;

},{"flatpickr":23}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Fetch = require('../utils/Fetch');

var _Fetch2 = _interopRequireDefault(_Fetch);

var _TextInputs = require('./TextInputs');

var _TextInputs2 = _interopRequireDefault(_TextInputs);

var _TextAreas = require('./TextAreas');

var _TextAreas2 = _interopRequireDefault(_TextAreas);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _DateInputs = require('./DateInputs');

var _DateInputs2 = _interopRequireDefault(_DateInputs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Form {
  constructor() {
    const textInputs = new _TextInputs2.default();
    const textAreas = new _TextAreas2.default();
    const dateInputs = new _DateInputs2.default();
    const modal = new _Modal2.default();
    this.elForm = document.querySelector('.contact-form');
    this.elSendBtn = this.elForm.querySelector('.js-btn-send');
    this.elFields = this.elForm.querySelectorAll('.input-field');
    this.elInputs = this.elForm.querySelectorAll('.input-field__text');
    this.elLabels = this.elForm.querySelectorAll('.input-field__label');
    this.elStatus = this.elForm.querySelector('.contact-form__status');
    this.elEmailInput = this.elForm.querySelector('input[name="email"]');
    this.elsRequiredInput = this.elForm.querySelectorAll('.input-field__text--required');
    this.errors = {};

    this.elSendBtn.addEventListener('click', async e => {
      e.preventDefault();

      this.resetForm();

      this.validateEmail();
      this.validateRequired();

      const erroneousInputs = Object.keys(this.errors);
      if (!erroneousInputs.length) {
        const isSuccess = await this.sendEmail();
        this.setStatusText(isSuccess);
        this.scrollFormToBottom();
      } else {
        this.addErrorLabels(erroneousInputs);
        this.scrollFormToTop();
      }
    });
  }

  errorLabel(label) {
    return `<div class="input-field__error">${label}</div>`;
  }

  removeErrors() {
    // remove errors from all inputs
    document.querySelectorAll('.input-field__error').forEach(err => err.remove());
    this.elInputs.forEach(input => input.classList.remove('input-field__text--error'));
    this.elLabels.forEach(label => label.classList.remove('input-field__label--error'));
    this.elStatus.classList.remove('contact-form__status--error');
  }

  validateEmail() {
    if (!/.+@.+/.test(this.elEmailInput.value)) {
      this.errors.email = {
        label: 'Please enter a valid email',
        elInput: this.elEmailInput
      };
    }
  }

  validateRequired() {
    this.elsRequiredInput.forEach(elInput => {
      if (!elInput.value) {
        this.errors[elInput.name] = {
          label: 'Please fill out the required field',
          elInput
        };
      }
    });
  }

  async sendEmail() {
    try {
      const formData = new URLSearchParams(new FormData(this.elForm));
      const res = await _Fetch2.default.post(this.elForm.getAttribute('action'), formData);
      return res.ok;
    } catch (e) {
      console.error(e);
    }
  }

  setStatusText(isSuccess) {
    if (isSuccess) {
      this.elStatus.textContent = 'Thank you for your email :)';
      this.elForm.reset();
    } else {
      this.elStatus.classList.add('contact-form__status--error');
      this.elStatus.textContent = 'Oops! There seems to have been a problem sending your email on our end. Contact us directly at info@airstreamstudio.co.uk';
    }
  }

  scrollFormToBottom() {
    this.elForm.scrollTop = this.elForm.offsetHeight;
  }

  scrollFormToTop() {
    this.elForm.scrollTop = 0;
  }

  addErrorLabel(elInput, elLabel, label) {
    elInput.classList.add('input-field__text--error');
    elLabel.classList.add('input-field__label--error');
    elLabel.insertAdjacentHTML('afterend', this.errorLabel(label));
  }

  addErrorLabels(erroneousInputs) {
    erroneousInputs.forEach(name => {
      const { elInput, label } = this.errors[name];
      const elLabel = elInput.nextElementSibling;
      this.addErrorLabel(elInput, elLabel, label);
    });
  }

  resetStatusText() {
    this.elStatus.textContent = '';
  }

  resetForm() {
    this.errors = {};
    this.removeErrors();
    this.resetStatusText();
  }
}
exports.default = Form;

},{"../utils/Fetch":19,"./DateInputs":3,"./Modal":7,"./TextAreas":9,"./TextInputs":10}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class HamburgerNav {
  constructor() {
    this.el = document.querySelector('.hamburger-menu');
    this.el.addEventListener('click', () => this.toggleActive());
  }

  toggleActive() {
    // click hamburger menu -> toggles primary-nav (small screens)
    this.el.classList.toggle('hamburger-menu--is-active');
  }
}
exports.default = HamburgerNav;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
    return Math.abs(imageNumber - Math.round(imageNumber)) < 0.05 ? Math.round(imageNumber) : imageNumber;
  }

  init() {
    const lazy = new LazyLoad({
      container: this.elSlider,
      threshold: this.elImage.offsetWidth
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
      if (this.elSlider.scrollLeft != this.elSlider.scrollWidth - this.elSlider.offsetWidth) {
        // calculate image number of next image
        const nextImage = this.nextImageNumber(this.imageNumber);

        // set scroll left of the slider to center new image
        scroll.left(this.elSlider, this.calcScrollLeft(nextImage));
      }
    });
  }

  prevImageNumber(imageNumber) {
    return imageNumber % 1 == 0 ? imageNumber - 1 : Math.floor(imageNumber);
  }

  nextImageNumber(imageNumber) {
    return imageNumber % 1 == 0 ? imageNumber + 1 : Math.ceil(imageNumber);
  }

  calcScrollLeft(imageNumber) {
    return imageNumber * this.elImage.offsetWidth - this.centerAdjust;
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
exports.default = ImageSlider;

},{"scroll":26,"vanilla-lazyload":70}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Modal {
  constructor() {
    this.el = document.querySelector('.modal');
    this.elBtn = document.querySelector('.js-btn-contact');
    this.elClose = document.querySelector('.modal__close');

    this.elBtn.addEventListener('click', () => this.show());
    window.addEventListener('click', e => {
      if (e.target == this.el) {
        this.hide();
      }
    });
    this.elClose.addEventListener('click', () => this.hide());
  }

  show() {
    this.el.style.display = 'block';
  }

  hide() {
    this.el.style.display = 'none';
  }
}
exports.default = Modal;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class SubNav {
  constructor() {
    this.elItemHasSubNav = document.querySelectorAll('.nav__item--has-sub');
    this.elItemHasSubNav.forEach(elItem => {
      const elLink = elItem.querySelector('.nav__link');
      elItem.addEventListener('click', () => this.toggleActive(elItem, elLink));
    });
  }

  toggleActive(elItem, elLink) {
    // click nav item with sub nav -> toggles sub-nav and underline (small screens)
    elItem.classList.toggle('nav__item--is-active');
    elLink.classList.toggle('nav__link--underline');
  }
}
exports.default = SubNav;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const autosize = require('autosize');

class TextAreas {
  constructor() {
    this.els = document.querySelectorAll('.input-field__text--textarea');
    autosize(this.els);
  }
}
exports.default = TextAreas;

},{"autosize":22}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class TextInputs {
  constructor() {
    this.els = document.querySelectorAll('.input-field__text');
    this.els.forEach(el => {
      const elLabel = el.nextElementSibling;
      el.addEventListener('focus', () => elLabel.classList.add('input-field__label--active'));
      el.addEventListener('blur', () => {
        if (!el.value) {
          elLabel.classList.remove('input-field__label--active');
        }
      });
    });
  }
}
exports.default = TextInputs;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Fetch = require('../utils/Fetch');

var _Fetch2 = _interopRequireDefault(_Fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Videos {
	async fetchPlaylist({ apiKey, playlistId }) {
		try {
			const res = await _Fetch2.default.get(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=contentDetails,snippet&maxResults=9`);
			return res;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	async init() {
		const apiKey = 'AIzaSyCQFwzDyaunRwLLXw5HmGbtzU7kcXCBCwc';
		const [featureVideoRes, playlistRes] = await Promise.all([this.fetchPlaylist({ apiKey, playlistId: 'PLPgiQYzddFtj1WFE-z8csoUBeWc6_ZqlZ' }), this.fetchPlaylist({ apiKey, playlistId: 'PLPgiQYzddFtiwHeR6XoCixKkVhVPhHP4z' })]);

		const featureVideoId = featureVideoRes.items[0].snippet.resourceId.videoId;
		document.querySelector('.js-feature-video').insertAdjacentHTML('beforeend', `
		<div class="embed-responsive embed-responsive--feature">
			<iframe class="embed-responsive__item" src="https://www.youtube.com/embed/${featureVideoId}?rel=0" allowfullscreen></iframe>
		</div>`);

		const playlistVideos = playlistRes.items;
		playlistVideos.forEach(video => {
			const id = video.snippet.resourceId.videoId;
			document.querySelector('.js-playlist-videos').insertAdjacentHTML('beforeend', `
			<div class="column large-4 medium-6 small-12">
				<div class="box box--large">
					<div class="embed-responsive">
						<iframe class="embed-responsive__item" src="https://www.youtube.com/embed/${id}?rel=0" allowfullscreen></iframe>
					</div>
				</div>
			</div>
			`);
		});
	}
}
exports.default = Videos;

},{"../utils/Fetch":19}],12:[function(require,module,exports){
'use strict';

var _Router = require('./utils/Router');

var _Router2 = _interopRequireDefault(_Router);

var _common = require('./routes/common');

var _common2 = _interopRequireDefault(_common);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

var _theAirstream = require('./routes/theAirstream');

var _theAirstream2 = _interopRequireDefault(_theAirstream);

var _pricing = require('./routes/pricing');

var _pricing2 = _interopRequireDefault(_pricing);

var _videos = require('./routes/videos');

var _videos2 = _interopRequireDefault(_videos);

var _contact = require('./routes/contact');

var _contact2 = _interopRequireDefault(_contact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _Router2.default({
  common: _common2.default,
  index: _index2.default,
  theAirstream: _theAirstream2.default,
  pricing: _pricing2.default,
  videos: _videos2.default,
  contact: _contact2.default
});

document.addEventListener('DOMContentLoaded', () => routes.loadEvents());

/*
const Nav = require('./Nav.js');
import { tns } from '../node_modules/tiny-slider/src/tiny-slider.module.js';
const Fetch = require('./Fetch.js')
import Form from './Form.js'


document.addEventListener('DOMContentLoaded', async () => {
  Nav.init();
  if (document.querySelector('.date')) {
    document.querySelector('.date').textContent = (new Date()).getFullYear();
  }

  if (document.querySelector('.input-field')) {
    const InputField = require('./InputField.js');
    InputField.init();
  }

  if (document.querySelector('.modal')) {
    const Modal = require('./Modal.js');
    Modal.init();
  }

  if (document.querySelector('.copy-link')) {
    const CopyLink = require('./CopyLink.js');
    CopyLink.init();
  }

  if (document.querySelector('.image-slider')) {
    const ImageSlider = require('./ImageSlider.js');
    ImageSlider.init();
  }

  if (document.querySelector('.cross-fader')) {
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

  const lastUrlSegment = window.location.pathname.slice(window.location.pathname.lastIndexOf('/'))

  if (lastUrlSegment === '/contact.html') {
    const contactForm = new Form()
    contactForm.init();
  }
  
  if (lastUrlSegment === '/videos.html') {
    videos()
  }

  async function videos() {
    const apiKey = 'AIzaSyCQFwzDyaunRwLLXw5HmGbtzU7kcXCBCwc'
    const [featureVideoRes, playlistRes] = await Promise.all([fetchPlaylist({apiKey, playlistId:'PLPgiQYzddFtj1WFE-z8csoUBeWc6_ZqlZ'}), fetchPlaylist({apiKey, playlistId:'PLPgiQYzddFtiwHeR6XoCixKkVhVPhHP4z'})])
    console.log(playlistRes)

    const featureVideoId = featureVideoRes.items[0].snippet.resourceId.videoId
    document.querySelector('.js-feature-video').insertAdjacentHTML('beforeend', `
    <div class="embed-responsive embed-responsive--feature">
      <iframe class="embed-responsive__item" src="https://www.youtube.com/embed/${featureVideoId}?rel=0" allowfullscreen></iframe>
    </div>`)

    const playlistVideos = playlistRes.items
    playlistVideos.forEach((video) => {
      const id = video.snippet.resourceId.videoId
      document.querySelector('.js-playlist-videos').insertAdjacentHTML('beforeend', `
      <div class="column large-4 medium-6 small-12">
        <div class="box box--large">
          <div class="embed-responsive">
            <iframe class="embed-responsive__item" src="https://www.youtube.com/embed/${id}?rel=0" allowfullscreen></iframe>
          </div>
        </div>
      </div>
      `)
    })
  }

  async function fetchPlaylist({apiKey, playlistId}) {
    try {
      const res = await Fetch.get(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=contentDetails,snippet&maxResults=9`)
      return res
    } catch(e) {
      console.error(e)
      return false
    }
  }
});
*/

},{"./routes/common":13,"./routes/contact":14,"./routes/index":15,"./routes/pricing":16,"./routes/theAirstream":17,"./routes/videos":18,"./utils/Router":20}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HamburgerNav = require('../components/HamburgerNav');

var _HamburgerNav2 = _interopRequireDefault(_HamburgerNav);

var _SubNav = require('../components/SubNav');

var _SubNav2 = _interopRequireDefault(_SubNav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  init() {
    const hamburgerNav = new _HamburgerNav2.default();
    const subNav = new _SubNav2.default();
  }
};

},{"../components/HamburgerNav":5,"../components/SubNav":8}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Form = require('../components/Form');

var _Form2 = _interopRequireDefault(_Form);

var _CopyLink = require('../components/CopyLink');

var _CopyLink2 = _interopRequireDefault(_CopyLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  init() {
    const copyLink = new _CopyLink2.default();
    const form = new _Form2.default();
  }
};

},{"../components/CopyLink":1,"../components/Form":4}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tinySliderModule = require('../../node_modules/tiny-slider/src/tiny-slider.module.js');

exports.default = {
  init() {
    const slider = (0, _tinySliderModule.tns)({
      container: '.cross-fader',
      items: 1,
      nav: false,
      autoplayButtonOutput: false,
      controlsText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
      lazyload: true,
      loop: false,
      speed: 600
    });
  }
};

},{"../../node_modules/tiny-slider/src/tiny-slider.module.js":69}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CurrentYear = require('../components/CurrentYear');

var _CurrentYear2 = _interopRequireDefault(_CurrentYear);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  init() {
    const currentYear = new _CurrentYear2.default();
  }
};

},{"../components/CurrentYear":2}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ImageSlider = require('../components/ImageSlider');

var _ImageSlider2 = _interopRequireDefault(_ImageSlider);

var _Form = require('../components/Form');

var _Form2 = _interopRequireDefault(_Form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  init() {
    const imageSlider = new _ImageSlider2.default();
    imageSlider.init();
    const form = new _Form2.default();
  }
};

},{"../components/Form":4,"../components/ImageSlider":6}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Videos = require('../components/Videos');

var _Videos2 = _interopRequireDefault(_Videos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  async init() {
    const videos = new _Videos2.default();
    await videos.init();
  }
};

},{"../components/Videos":11}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  async get(url) {
    return await (await fetch(url)).json();
  },
  async post(url, data) {
    return await fetch(url, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
};

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _camelCase = require('./camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
class Router {

  /**
   * Create a new Router
   * @param {Object} routes
   */
  constructor(routes) {
    this.routes = routes;
  }

  /**
   * Fire Router events
   * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
   * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
   * @param {string} [arg] Any custom argument to be passed to the event.
   */
  fire(route, event = 'init', arg) {
    const fire = route !== '' && this.routes[route] && typeof this.routes[route][event] === 'function';
    if (fire) {
      this.routes[route][event](arg);
    }
  }

  /**
   * Automatically load and fire Router events
   *
   * Events are fired in the following order:
   *  * common init
   *  * page-specific init
   *  * page-specific finalize
   *  * common finalize
   */
  loadEvents() {
    // Fire common init JS
    this.fire('common');

    // Fire page-specific init JS, and then finalize JS
    document.body.className.toLowerCase().replace(/-/g, '_').split(/\s+/).map(_camelCase2.default).forEach(className => {
      this.fire(className);
      this.fire(className, 'finalize');
    });

    // Fire common finalize JS
    this.fire('common', 'finalize');
  }
}

exports.default = Router;

},{"./camelCase":21}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * the most terrible camelizer on the internet, guaranteed!
 * @param {string} str String that isn't camel-case, e.g., CAMeL_CaSEiS-harD
 * @return {string} String converted to camel-case, e.g., camelCaseIsHard
 */
exports.default = str => `${str.charAt(0).toLowerCase()}${str.replace(/[\W_]/g, '|').split('|').map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join('').slice(1)}`;

},{}],22:[function(require,module,exports){
'use strict';

/*!
	autosize 4.0.2
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['module', 'exports'], factory);
	} else if (typeof exports !== "undefined") {
		factory(module, exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod, mod.exports);
		global.autosize = mod.exports;
	}
})(undefined, function (module, exports) {
	'use strict';

	var map = typeof Map === "function" ? new Map() : function () {
		var keys = [];
		var values = [];

		return {
			has: function has(key) {
				return keys.indexOf(key) > -1;
			},
			get: function get(key) {
				return values[keys.indexOf(key)];
			},
			set: function set(key, value) {
				if (keys.indexOf(key) === -1) {
					keys.push(key);
					values.push(value);
				}
			},
			delete: function _delete(key) {
				var index = keys.indexOf(key);
				if (index > -1) {
					keys.splice(index, 1);
					values.splice(index, 1);
				}
			}
		};
	}();

	var createEvent = function createEvent(name) {
		return new Event(name, { bubbles: true });
	};
	try {
		new Event('test');
	} catch (e) {
		// IE does not support `new Event()`
		createEvent = function createEvent(name) {
			var evt = document.createEvent('Event');
			evt.initEvent(name, true, false);
			return evt;
		};
	}

	function assign(ta) {
		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;

		var heightOffset = null;
		var clientWidth = null;
		var cachedHeight = null;

		function init() {
			var style = window.getComputedStyle(ta, null);

			if (style.resize === 'vertical') {
				ta.style.resize = 'none';
			} else if (style.resize === 'both') {
				ta.style.resize = 'horizontal';
			}

			if (style.boxSizing === 'content-box') {
				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
			} else {
				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
			}
			// Fix when a textarea is not on document body and heightOffset is Not a Number
			if (isNaN(heightOffset)) {
				heightOffset = 0;
			}

			update();
		}

		function changeOverflow(value) {
			{
				// Chrome/Safari-specific fix:
				// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
				// made available by removing the scrollbar. The following forces the necessary text reflow.
				var width = ta.style.width;
				ta.style.width = '0px';
				// Force reflow:
				/* jshint ignore:start */
				ta.offsetWidth;
				/* jshint ignore:end */
				ta.style.width = width;
			}

			ta.style.overflowY = value;
		}

		function getParentOverflows(el) {
			var arr = [];

			while (el && el.parentNode && el.parentNode instanceof Element) {
				if (el.parentNode.scrollTop) {
					arr.push({
						node: el.parentNode,
						scrollTop: el.parentNode.scrollTop
					});
				}
				el = el.parentNode;
			}

			return arr;
		}

		function resize() {
			if (ta.scrollHeight === 0) {
				// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
				return;
			}

			var overflows = getParentOverflows(ta);
			var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

			ta.style.height = '';
			ta.style.height = ta.scrollHeight + heightOffset + 'px';

			// used to check if an update is actually necessary on window.resize
			clientWidth = ta.clientWidth;

			// prevents scroll-position jumping
			overflows.forEach(function (el) {
				el.node.scrollTop = el.scrollTop;
			});

			if (docTop) {
				document.documentElement.scrollTop = docTop;
			}
		}

		function update() {
			resize();

			var styleHeight = Math.round(parseFloat(ta.style.height));
			var computed = window.getComputedStyle(ta, null);

			// Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
			var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight;

			// The actual height not matching the style height (set via the resize method) indicates that 
			// the max-height has been exceeded, in which case the overflow should be allowed.
			if (actualHeight < styleHeight) {
				if (computed.overflowY === 'hidden') {
					changeOverflow('scroll');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			} else {
				// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
				if (computed.overflowY !== 'hidden') {
					changeOverflow('hidden');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			}

			if (cachedHeight !== actualHeight) {
				cachedHeight = actualHeight;
				var evt = createEvent('autosize:resized');
				try {
					ta.dispatchEvent(evt);
				} catch (err) {
					// Firefox will throw an error on dispatchEvent for a detached element
					// https://bugzilla.mozilla.org/show_bug.cgi?id=889376
				}
			}
		}

		var pageResize = function pageResize() {
			if (ta.clientWidth !== clientWidth) {
				update();
			}
		};

		var destroy = function (style) {
			window.removeEventListener('resize', pageResize, false);
			ta.removeEventListener('input', update, false);
			ta.removeEventListener('keyup', update, false);
			ta.removeEventListener('autosize:destroy', destroy, false);
			ta.removeEventListener('autosize:update', update, false);

			Object.keys(style).forEach(function (key) {
				ta.style[key] = style[key];
			});

			map.delete(ta);
		}.bind(ta, {
			height: ta.style.height,
			resize: ta.style.resize,
			overflowY: ta.style.overflowY,
			overflowX: ta.style.overflowX,
			wordWrap: ta.style.wordWrap
		});

		ta.addEventListener('autosize:destroy', destroy, false);

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in ta && 'oninput' in ta) {
			ta.addEventListener('keyup', update, false);
		}

		window.addEventListener('resize', pageResize, false);
		ta.addEventListener('input', update, false);
		ta.addEventListener('autosize:update', update, false);
		ta.style.overflowX = 'hidden';
		ta.style.wordWrap = 'break-word';

		map.set(ta, {
			destroy: destroy,
			update: update
		});

		init();
	}

	function destroy(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.destroy();
		}
	}

	function update(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.update();
		}
	}

	var autosize = null;

	// Do nothing in Node.js environment and IE8 (or lower)
	if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
		autosize = function autosize(el) {
			return el;
		};
		autosize.destroy = function (el) {
			return el;
		};
		autosize.update = function (el) {
			return el;
		};
	} else {
		autosize = function autosize(el, options) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], function (x) {
					return assign(x, options);
				});
			}
			return el;
		};
		autosize.destroy = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], destroy);
			}
			return el;
		};
		autosize.update = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], update);
			}
			return el;
		};
	}

	exports.default = autosize;
	module.exports = exports['default'];
});

},{}],23:[function(require,module,exports){
'use strict';

/* flatpickr v4.5.2, @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.flatpickr = factory();
})(undefined, function () {
  'use strict';

  var pad = function pad(number) {
    return ("0" + number).slice(-2);
  };
  var int = function int(bool) {
    return bool === true ? 1 : 0;
  };
  function debounce(func, wait, immediate) {
    if (immediate === void 0) {
      immediate = false;
    }

    var timeout;
    return function () {
      var context = this,
          args = arguments;
      timeout !== null && clearTimeout(timeout);
      timeout = window.setTimeout(function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }
  var arrayify = function arrayify(obj) {
    return obj instanceof Array ? obj : [obj];
  };

  var do_nothing = function do_nothing() {
    return undefined;
  };

  var monthToStr = function monthToStr(monthNumber, shorthand, locale) {
    return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
  };
  var revFormat = {
    D: do_nothing,
    F: function F(dateObj, monthName, locale) {
      dateObj.setMonth(locale.months.longhand.indexOf(monthName));
    },
    G: function G(dateObj, hour) {
      dateObj.setHours(parseFloat(hour));
    },
    H: function H(dateObj, hour) {
      dateObj.setHours(parseFloat(hour));
    },
    J: function J(dateObj, day) {
      dateObj.setDate(parseFloat(day));
    },
    K: function K(dateObj, amPM, locale) {
      dateObj.setHours(dateObj.getHours() % 12 + 12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
    },
    M: function M(dateObj, shortMonth, locale) {
      dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
    },
    S: function S(dateObj, seconds) {
      dateObj.setSeconds(parseFloat(seconds));
    },
    U: function U(_, unixSeconds) {
      return new Date(parseFloat(unixSeconds) * 1000);
    },
    W: function W(dateObj, weekNum) {
      var weekNumber = parseInt(weekNum);
      return new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
    },
    Y: function Y(dateObj, year) {
      dateObj.setFullYear(parseFloat(year));
    },
    Z: function Z(_, ISODate) {
      return new Date(ISODate);
    },
    d: function d(dateObj, day) {
      dateObj.setDate(parseFloat(day));
    },
    h: function h(dateObj, hour) {
      dateObj.setHours(parseFloat(hour));
    },
    i: function i(dateObj, minutes) {
      dateObj.setMinutes(parseFloat(minutes));
    },
    j: function j(dateObj, day) {
      dateObj.setDate(parseFloat(day));
    },
    l: do_nothing,
    m: function m(dateObj, month) {
      dateObj.setMonth(parseFloat(month) - 1);
    },
    n: function n(dateObj, month) {
      dateObj.setMonth(parseFloat(month) - 1);
    },
    s: function s(dateObj, seconds) {
      dateObj.setSeconds(parseFloat(seconds));
    },
    w: do_nothing,
    y: function y(dateObj, year) {
      dateObj.setFullYear(2000 + parseFloat(year));
    }
  };
  var tokenRegex = {
    D: "(\\w+)",
    F: "(\\w+)",
    G: "(\\d\\d|\\d)",
    H: "(\\d\\d|\\d)",
    J: "(\\d\\d|\\d)\\w+",
    K: "",
    M: "(\\w+)",
    S: "(\\d\\d|\\d)",
    U: "(.+)",
    W: "(\\d\\d|\\d)",
    Y: "(\\d{4})",
    Z: "(.+)",
    d: "(\\d\\d|\\d)",
    h: "(\\d\\d|\\d)",
    i: "(\\d\\d|\\d)",
    j: "(\\d\\d|\\d)",
    l: "(\\w+)",
    m: "(\\d\\d|\\d)",
    n: "(\\d\\d|\\d)",
    s: "(\\d\\d|\\d)",
    w: "(\\d\\d|\\d)",
    y: "(\\d{2})"
  };
  var formats = {
    Z: function Z(date) {
      return date.toISOString();
    },
    D: function D(date, locale, options) {
      return locale.weekdays.shorthand[formats.w(date, locale, options)];
    },
    F: function F(date, locale, options) {
      return monthToStr(formats.n(date, locale, options) - 1, false, locale);
    },
    G: function G(date, locale, options) {
      return pad(formats.h(date, locale, options));
    },
    H: function H(date) {
      return pad(date.getHours());
    },
    J: function J(date, locale) {
      return locale.ordinal !== undefined ? date.getDate() + locale.ordinal(date.getDate()) : date.getDate();
    },
    K: function K(date, locale) {
      return locale.amPM[int(date.getHours() > 11)];
    },
    M: function M(date, locale) {
      return monthToStr(date.getMonth(), true, locale);
    },
    S: function S(date) {
      return pad(date.getSeconds());
    },
    U: function U(date) {
      return date.getTime() / 1000;
    },
    W: function W(date, _, options) {
      return options.getWeek(date);
    },
    Y: function Y(date) {
      return date.getFullYear();
    },
    d: function d(date) {
      return pad(date.getDate());
    },
    h: function h(date) {
      return date.getHours() % 12 ? date.getHours() % 12 : 12;
    },
    i: function i(date) {
      return pad(date.getMinutes());
    },
    j: function j(date) {
      return date.getDate();
    },
    l: function l(date, locale) {
      return locale.weekdays.longhand[date.getDay()];
    },
    m: function m(date) {
      return pad(date.getMonth() + 1);
    },
    n: function n(date) {
      return date.getMonth() + 1;
    },
    s: function s(date) {
      return date.getSeconds();
    },
    w: function w(date) {
      return date.getDay();
    },
    y: function y(date) {
      return String(date.getFullYear()).substring(2);
    }
  };

  var english = {
    weekdays: {
      shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    months: {
      shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    firstDayOfWeek: 0,
    ordinal: function ordinal(nth) {
      var s = nth % 100;
      if (s > 3 && s < 21) return "th";

      switch (s % 10) {
        case 1:
          return "st";

        case 2:
          return "nd";

        case 3:
          return "rd";

        default:
          return "th";
      }
    },
    rangeSeparator: " to ",
    weekAbbreviation: "Wk",
    scrollTitle: "Scroll to increment",
    toggleTitle: "Click to toggle",
    amPM: ["AM", "PM"],
    yearAriaLabel: "Year"
  };

  var createDateFormatter = function createDateFormatter(_ref) {
    var _ref$config = _ref.config,
        config = _ref$config === void 0 ? defaults : _ref$config,
        _ref$l10n = _ref.l10n,
        l10n = _ref$l10n === void 0 ? english : _ref$l10n;
    return function (dateObj, frmt, overrideLocale) {
      var locale = overrideLocale || l10n;

      if (config.formatDate !== undefined) {
        return config.formatDate(dateObj, frmt, locale);
      }

      return frmt.split("").map(function (c, i, arr) {
        return formats[c] && arr[i - 1] !== "\\" ? formats[c](dateObj, locale, config) : c !== "\\" ? c : "";
      }).join("");
    };
  };
  var createDateParser = function createDateParser(_ref2) {
    var _ref2$config = _ref2.config,
        config = _ref2$config === void 0 ? defaults : _ref2$config,
        _ref2$l10n = _ref2.l10n,
        l10n = _ref2$l10n === void 0 ? english : _ref2$l10n;
    return function (date, givenFormat, timeless, customLocale) {
      if (date !== 0 && !date) return undefined;
      var locale = customLocale || l10n;
      var parsedDate;
      var date_orig = date;
      if (date instanceof Date) parsedDate = new Date(date.getTime());else if (typeof date !== "string" && date.toFixed !== undefined) parsedDate = new Date(date);else if (typeof date === "string") {
        var format = givenFormat || (config || defaults).dateFormat;
        var datestr = String(date).trim();

        if (datestr === "today") {
          parsedDate = new Date();
          timeless = true;
        } else if (/Z$/.test(datestr) || /GMT$/.test(datestr)) parsedDate = new Date(date);else if (config && config.parseDate) parsedDate = config.parseDate(date, format);else {
          parsedDate = !config || !config.noCalendar ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0) : new Date(new Date().setHours(0, 0, 0, 0));
          var matched,
              ops = [];

          for (var i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
            var token = format[i];
            var isBackSlash = token === "\\";
            var escaped = format[i - 1] === "\\" || isBackSlash;

            if (tokenRegex[token] && !escaped) {
              regexStr += tokenRegex[token];
              var match = new RegExp(regexStr).exec(date);

              if (match && (matched = true)) {
                ops[token !== "Y" ? "push" : "unshift"]({
                  fn: revFormat[token],
                  val: match[++matchIndex]
                });
              }
            } else if (!isBackSlash) regexStr += ".";

            ops.forEach(function (_ref3) {
              var fn = _ref3.fn,
                  val = _ref3.val;
              return parsedDate = fn(parsedDate, val, locale) || parsedDate;
            });
          }

          parsedDate = matched ? parsedDate : undefined;
        }
      }

      if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
        config.errorHandler(new Error("Invalid date provided: " + date_orig));
        return undefined;
      }

      if (timeless === true) parsedDate.setHours(0, 0, 0, 0);
      return parsedDate;
    };
  };
  function compareDates(date1, date2, timeless) {
    if (timeless === void 0) {
      timeless = true;
    }

    if (timeless !== false) {
      return new Date(date1.getTime()).setHours(0, 0, 0, 0) - new Date(date2.getTime()).setHours(0, 0, 0, 0);
    }

    return date1.getTime() - date2.getTime();
  }
  var getWeek = function getWeek(givenDate) {
    var date = new Date(givenDate.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };
  var isBetween = function isBetween(ts, ts1, ts2) {
    return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
  };
  var duration = {
    DAY: 86400000
  };

  var HOOKS = ["onChange", "onClose", "onDayCreate", "onDestroy", "onKeyDown", "onMonthChange", "onOpen", "onParseConfig", "onReady", "onValueUpdate", "onYearChange", "onPreCalendarPosition"];
  var defaults = {
    _disable: [],
    _enable: [],
    allowInput: false,
    altFormat: "F j, Y",
    altInput: false,
    altInputClass: "form-control input",
    animate: typeof window === "object" && window.navigator.userAgent.indexOf("MSIE") === -1,
    ariaDateFormat: "F j, Y",
    clickOpens: true,
    closeOnSelect: true,
    conjunction: ", ",
    dateFormat: "Y-m-d",
    defaultHour: 12,
    defaultMinute: 0,
    defaultSeconds: 0,
    disable: [],
    disableMobile: false,
    enable: [],
    enableSeconds: false,
    enableTime: false,
    errorHandler: function errorHandler(err) {
      return typeof console !== "undefined" && console.warn(err);
    },
    getWeek: getWeek,
    hourIncrement: 1,
    ignoredFocusElements: [],
    inline: false,
    locale: "default",
    minuteIncrement: 5,
    mode: "single",
    nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
    noCalendar: false,
    now: new Date(),
    onChange: [],
    onClose: [],
    onDayCreate: [],
    onDestroy: [],
    onKeyDown: [],
    onMonthChange: [],
    onOpen: [],
    onParseConfig: [],
    onReady: [],
    onValueUpdate: [],
    onYearChange: [],
    onPreCalendarPosition: [],
    plugins: [],
    position: "auto",
    positionElement: undefined,
    prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
    shorthandCurrentMonth: false,
    showMonths: 1,
    static: false,
    time_24hr: false,
    weekNumbers: false,
    wrap: false
  };

  function toggleClass(elem, className, bool) {
    if (bool === true) return elem.classList.add(className);
    elem.classList.remove(className);
  }
  function createElement(tag, className, content) {
    var e = window.document.createElement(tag);
    className = className || "";
    content = content || "";
    e.className = className;
    if (content !== undefined) e.textContent = content;
    return e;
  }
  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
  function findParent(node, condition) {
    if (condition(node)) return node;else if (node.parentNode) return findParent(node.parentNode, condition);
    return undefined;
  }
  function createNumberInput(inputClassName, opts) {
    var wrapper = createElement("div", "numInputWrapper"),
        numInput = createElement("input", "numInput " + inputClassName),
        arrowUp = createElement("span", "arrowUp"),
        arrowDown = createElement("span", "arrowDown");
    numInput.type = "text";
    numInput.pattern = "\\d*";
    if (opts !== undefined) for (var key in opts) {
      numInput.setAttribute(key, opts[key]);
    }
    wrapper.appendChild(numInput);
    wrapper.appendChild(arrowUp);
    wrapper.appendChild(arrowDown);
    return wrapper;
  }

  if (typeof Object.assign !== "function") {
    Object.assign = function (target) {
      if (!target) {
        throw TypeError("Cannot convert undefined or null to object");
      }

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _loop = function _loop() {
        var source = args[_i];

        if (source) {
          Object.keys(source).forEach(function (key) {
            return target[key] = source[key];
          });
        }
      };

      for (var _i = 0; _i < args.length; _i++) {
        _loop();
      }

      return target;
    };
  }

  var DEBOUNCED_CHANGE_MS = 300;

  function FlatpickrInstance(element, instanceConfig) {
    var self = {
      config: Object.assign({}, flatpickr.defaultConfig),
      l10n: english
    };
    self.parseDate = createDateParser({
      config: self.config,
      l10n: self.l10n
    });
    self._handlers = [];
    self._bind = bind;
    self._setHoursFromDate = setHoursFromDate;
    self._positionCalendar = positionCalendar;
    self.changeMonth = changeMonth;
    self.changeYear = changeYear;
    self.clear = clear;
    self.close = close;
    self._createElement = createElement;
    self.destroy = destroy;
    self.isEnabled = isEnabled;
    self.jumpToDate = jumpToDate;
    self.open = open;
    self.redraw = redraw;
    self.set = set;
    self.setDate = setDate;
    self.toggle = toggle;

    function setupHelperFunctions() {
      self.utils = {
        getDaysInMonth: function getDaysInMonth(month, yr) {
          if (month === void 0) {
            month = self.currentMonth;
          }

          if (yr === void 0) {
            yr = self.currentYear;
          }

          if (month === 1 && (yr % 4 === 0 && yr % 100 !== 0 || yr % 400 === 0)) return 29;
          return self.l10n.daysInMonth[month];
        }
      };
    }

    function init() {
      self.element = self.input = element;
      self.isOpen = false;
      parseConfig();
      setupLocale();
      setupInputs();
      setupDates();
      setupHelperFunctions();
      if (!self.isMobile) build();
      bindEvents();

      if (self.selectedDates.length || self.config.noCalendar) {
        if (self.config.enableTime) {
          setHoursFromDate(self.config.noCalendar ? self.latestSelectedDateObj || self.config.minDate : undefined);
        }

        updateValue(false);
      }

      setCalendarWidth();
      self.showTimeInput = self.selectedDates.length > 0 || self.config.noCalendar;
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (!self.isMobile && isSafari) {
        positionCalendar();
      }

      triggerEvent("onReady");
    }

    function bindToInstance(fn) {
      return fn.bind(self);
    }

    function setCalendarWidth() {
      var config = self.config;
      if (config.weekNumbers === false && config.showMonths === 1) return;else if (config.noCalendar !== true) {
        window.requestAnimationFrame(function () {
          self.calendarContainer.style.visibility = "hidden";
          self.calendarContainer.style.display = "block";

          if (self.daysContainer !== undefined) {
            var daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
            self.daysContainer.style.width = daysWidth + "px";
            self.calendarContainer.style.width = daysWidth + (self.weekWrapper !== undefined ? self.weekWrapper.offsetWidth : 0) + "px";
            self.calendarContainer.style.removeProperty("visibility");
            self.calendarContainer.style.removeProperty("display");
          }
        });
      }
    }

    function updateTime(e) {
      if (self.selectedDates.length === 0) return;

      if (e !== undefined && e.type !== "blur") {
        timeWrapper(e);
      }

      var prevValue = self._input.value;
      setHoursFromInputs();
      updateValue();

      if (self._input.value !== prevValue) {
        self._debouncedChange();
      }
    }

    function ampm2military(hour, amPM) {
      return hour % 12 + 12 * int(amPM === self.l10n.amPM[1]);
    }

    function military2ampm(hour) {
      switch (hour % 24) {
        case 0:
        case 12:
          return 12;

        default:
          return hour % 12;
      }
    }

    function setHoursFromInputs() {
      if (self.hourElement === undefined || self.minuteElement === undefined) return;
      var hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24,
          minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60,
          seconds = self.secondElement !== undefined ? (parseInt(self.secondElement.value, 10) || 0) % 60 : 0;

      if (self.amPM !== undefined) {
        hours = ampm2military(hours, self.amPM.textContent);
      }

      var limitMinHours = self.config.minTime !== undefined || self.config.minDate && self.minDateHasTime && self.latestSelectedDateObj && compareDates(self.latestSelectedDateObj, self.config.minDate, true) === 0;
      var limitMaxHours = self.config.maxTime !== undefined || self.config.maxDate && self.maxDateHasTime && self.latestSelectedDateObj && compareDates(self.latestSelectedDateObj, self.config.maxDate, true) === 0;

      if (limitMaxHours) {
        var maxTime = self.config.maxTime !== undefined ? self.config.maxTime : self.config.maxDate;
        hours = Math.min(hours, maxTime.getHours());
        if (hours === maxTime.getHours()) minutes = Math.min(minutes, maxTime.getMinutes());
        if (minutes === maxTime.getMinutes()) seconds = Math.min(seconds, maxTime.getSeconds());
      }

      if (limitMinHours) {
        var minTime = self.config.minTime !== undefined ? self.config.minTime : self.config.minDate;
        hours = Math.max(hours, minTime.getHours());
        if (hours === minTime.getHours()) minutes = Math.max(minutes, minTime.getMinutes());
        if (minutes === minTime.getMinutes()) seconds = Math.max(seconds, minTime.getSeconds());
      }

      setHours(hours, minutes, seconds);
    }

    function setHoursFromDate(dateObj) {
      var date = dateObj || self.latestSelectedDateObj;
      if (date) setHours(date.getHours(), date.getMinutes(), date.getSeconds());
    }

    function setDefaultHours() {
      var hours = self.config.defaultHour;
      var minutes = self.config.defaultMinute;
      var seconds = self.config.defaultSeconds;

      if (self.config.minDate !== undefined) {
        var min_hr = self.config.minDate.getHours();
        var min_minutes = self.config.minDate.getMinutes();
        hours = Math.max(hours, min_hr);
        if (hours === min_hr) minutes = Math.max(min_minutes, minutes);
        if (hours === min_hr && minutes === min_minutes) seconds = self.config.minDate.getSeconds();
      }

      if (self.config.maxDate !== undefined) {
        var max_hr = self.config.maxDate.getHours();
        var max_minutes = self.config.maxDate.getMinutes();
        hours = Math.min(hours, max_hr);
        if (hours === max_hr) minutes = Math.min(max_minutes, minutes);
        if (hours === max_hr && minutes === max_minutes) seconds = self.config.maxDate.getSeconds();
      }

      setHours(hours, minutes, seconds);
    }

    function setHours(hours, minutes, seconds) {
      if (self.latestSelectedDateObj !== undefined) {
        self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
      }

      if (!self.hourElement || !self.minuteElement || self.isMobile) return;
      self.hourElement.value = pad(!self.config.time_24hr ? (12 + hours) % 12 + 12 * int(hours % 12 === 0) : hours);
      self.minuteElement.value = pad(minutes);
      if (self.amPM !== undefined) self.amPM.textContent = self.l10n.amPM[int(hours >= 12)];
      if (self.secondElement !== undefined) self.secondElement.value = pad(seconds);
    }

    function onYearInput(event) {
      var year = parseInt(event.target.value) + (event.delta || 0);

      if (year / 1000 > 1 || event.key === "Enter" && !/[^\d]/.test(year.toString())) {
        changeYear(year);
      }
    }

    function bind(element, event, handler, options) {
      if (event instanceof Array) return event.forEach(function (ev) {
        return bind(element, ev, handler, options);
      });
      if (element instanceof Array) return element.forEach(function (el) {
        return bind(el, event, handler, options);
      });
      element.addEventListener(event, handler, options);

      self._handlers.push({
        element: element,
        event: event,
        handler: handler,
        options: options
      });
    }

    function onClick(handler) {
      return function (evt) {
        evt.which === 1 && handler(evt);
      };
    }

    function triggerChange() {
      triggerEvent("onChange");
    }

    function bindEvents() {
      if (self.config.wrap) {
        ["open", "close", "toggle", "clear"].forEach(function (evt) {
          Array.prototype.forEach.call(self.element.querySelectorAll("[data-" + evt + "]"), function (el) {
            return bind(el, "click", self[evt]);
          });
        });
      }

      if (self.isMobile) {
        setupMobile();
        return;
      }

      var debouncedResize = debounce(onResize, 50);
      self._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
      if (self.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent)) bind(self.daysContainer, "mouseover", function (e) {
        if (self.config.mode === "range") onMouseOver(e.target);
      });
      bind(window.document.body, "keydown", onKeyDown);
      if (!self.config.static) bind(self._input, "keydown", onKeyDown);
      if (!self.config.inline && !self.config.static) bind(window, "resize", debouncedResize);
      if (window.ontouchstart !== undefined) bind(window.document, "click", documentClick);else bind(window.document, "mousedown", onClick(documentClick));
      bind(window.document, "focus", documentClick, {
        capture: true
      });

      if (self.config.clickOpens === true) {
        bind(self._input, "focus", self.open);
        bind(self._input, "mousedown", onClick(self.open));
      }

      if (self.daysContainer !== undefined) {
        bind(self.monthNav, "mousedown", onClick(onMonthNavClick));
        bind(self.monthNav, ["keyup", "increment"], onYearInput);
        bind(self.daysContainer, "mousedown", onClick(selectDate));
      }

      if (self.timeContainer !== undefined && self.minuteElement !== undefined && self.hourElement !== undefined) {
        var selText = function selText(e) {
          return e.target.select();
        };

        bind(self.timeContainer, ["increment"], updateTime);
        bind(self.timeContainer, "blur", updateTime, {
          capture: true
        });
        bind(self.timeContainer, "mousedown", onClick(timeIncrement));
        bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);
        if (self.secondElement !== undefined) bind(self.secondElement, "focus", function () {
          return self.secondElement && self.secondElement.select();
        });

        if (self.amPM !== undefined) {
          bind(self.amPM, "mousedown", onClick(function (e) {
            updateTime(e);
            triggerChange();
          }));
        }
      }
    }

    function jumpToDate(jumpDate) {
      var jumpTo = jumpDate !== undefined ? self.parseDate(jumpDate) : self.latestSelectedDateObj || (self.config.minDate && self.config.minDate > self.now ? self.config.minDate : self.config.maxDate && self.config.maxDate < self.now ? self.config.maxDate : self.now);

      try {
        if (jumpTo !== undefined) {
          self.currentYear = jumpTo.getFullYear();
          self.currentMonth = jumpTo.getMonth();
        }
      } catch (e) {
        e.message = "Invalid date supplied: " + jumpTo;
        self.config.errorHandler(e);
      }

      self.redraw();
    }

    function timeIncrement(e) {
      if (~e.target.className.indexOf("arrow")) incrementNumInput(e, e.target.classList.contains("arrowUp") ? 1 : -1);
    }

    function incrementNumInput(e, delta, inputElem) {
      var target = e && e.target;
      var input = inputElem || target && target.parentNode && target.parentNode.firstChild;
      var event = createEvent("increment");
      event.delta = delta;
      input && input.dispatchEvent(event);
    }

    function build() {
      var fragment = window.document.createDocumentFragment();
      self.calendarContainer = createElement("div", "flatpickr-calendar");
      self.calendarContainer.tabIndex = -1;

      if (!self.config.noCalendar) {
        fragment.appendChild(buildMonthNav());
        self.innerContainer = createElement("div", "flatpickr-innerContainer");

        if (self.config.weekNumbers) {
          var _buildWeeks = buildWeeks(),
              weekWrapper = _buildWeeks.weekWrapper,
              weekNumbers = _buildWeeks.weekNumbers;

          self.innerContainer.appendChild(weekWrapper);
          self.weekNumbers = weekNumbers;
          self.weekWrapper = weekWrapper;
        }

        self.rContainer = createElement("div", "flatpickr-rContainer");
        self.rContainer.appendChild(buildWeekdays());

        if (!self.daysContainer) {
          self.daysContainer = createElement("div", "flatpickr-days");
          self.daysContainer.tabIndex = -1;
        }

        buildDays();
        self.rContainer.appendChild(self.daysContainer);
        self.innerContainer.appendChild(self.rContainer);
        fragment.appendChild(self.innerContainer);
      }

      if (self.config.enableTime) {
        fragment.appendChild(buildTime());
      }

      toggleClass(self.calendarContainer, "rangeMode", self.config.mode === "range");
      toggleClass(self.calendarContainer, "animate", self.config.animate === true);
      toggleClass(self.calendarContainer, "multiMonth", self.config.showMonths > 1);
      self.calendarContainer.appendChild(fragment);
      var customAppend = self.config.appendTo !== undefined && self.config.appendTo.nodeType !== undefined;

      if (self.config.inline || self.config.static) {
        self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");

        if (self.config.inline) {
          if (!customAppend && self.element.parentNode) self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);else if (self.config.appendTo !== undefined) self.config.appendTo.appendChild(self.calendarContainer);
        }

        if (self.config.static) {
          var wrapper = createElement("div", "flatpickr-wrapper");
          if (self.element.parentNode) self.element.parentNode.insertBefore(wrapper, self.element);
          wrapper.appendChild(self.element);
          if (self.altInput) wrapper.appendChild(self.altInput);
          wrapper.appendChild(self.calendarContainer);
        }
      }

      if (!self.config.static && !self.config.inline) (self.config.appendTo !== undefined ? self.config.appendTo : window.document.body).appendChild(self.calendarContainer);
    }

    function createDay(className, date, dayNumber, i) {
      var dateIsEnabled = isEnabled(date, true),
          dayElement = createElement("span", "flatpickr-day " + className, date.getDate().toString());
      dayElement.dateObj = date;
      dayElement.$i = i;
      dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));

      if (className.indexOf("hidden") === -1 && compareDates(date, self.now) === 0) {
        self.todayDateElem = dayElement;
        dayElement.classList.add("today");
        dayElement.setAttribute("aria-current", "date");
      }

      if (dateIsEnabled) {
        dayElement.tabIndex = -1;

        if (isDateSelected(date)) {
          dayElement.classList.add("selected");
          self.selectedDateElem = dayElement;

          if (self.config.mode === "range") {
            toggleClass(dayElement, "startRange", self.selectedDates[0] && compareDates(date, self.selectedDates[0], true) === 0);
            toggleClass(dayElement, "endRange", self.selectedDates[1] && compareDates(date, self.selectedDates[1], true) === 0);
            if (className === "nextMonthDay") dayElement.classList.add("inRange");
          }
        }
      } else {
        dayElement.classList.add("disabled");
      }

      if (self.config.mode === "range") {
        if (isDateInRange(date) && !isDateSelected(date)) dayElement.classList.add("inRange");
      }

      if (self.weekNumbers && self.config.showMonths === 1 && className !== "prevMonthDay" && dayNumber % 7 === 1) {
        self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self.config.getWeek(date) + "</span>");
      }

      triggerEvent("onDayCreate", dayElement);
      return dayElement;
    }

    function focusOnDayElem(targetNode) {
      targetNode.focus();
      if (self.config.mode === "range") onMouseOver(targetNode);
    }

    function getFirstAvailableDay(delta) {
      var startMonth = delta > 0 ? 0 : self.config.showMonths - 1;
      var endMonth = delta > 0 ? self.config.showMonths : -1;

      for (var m = startMonth; m != endMonth; m += delta) {
        var month = self.daysContainer.children[m];
        var startIndex = delta > 0 ? 0 : month.children.length - 1;
        var endIndex = delta > 0 ? month.children.length : -1;

        for (var i = startIndex; i != endIndex; i += delta) {
          var c = month.children[i];
          if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj)) return c;
        }
      }

      return undefined;
    }

    function getNextAvailableDay(current, delta) {
      var givenMonth = current.className.indexOf("Month") === -1 ? current.dateObj.getMonth() : self.currentMonth;
      var endMonth = delta > 0 ? self.config.showMonths : -1;
      var loopDelta = delta > 0 ? 1 : -1;

      for (var m = givenMonth - self.currentMonth; m != endMonth; m += loopDelta) {
        var month = self.daysContainer.children[m];
        var startIndex = givenMonth - self.currentMonth === m ? current.$i + delta : delta < 0 ? month.children.length - 1 : 0;
        var numMonthDays = month.children.length;

        for (var i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
          var c = month.children[i];
          if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj) && Math.abs(current.$i - i) >= Math.abs(delta)) return focusOnDayElem(c);
        }
      }

      self.changeMonth(loopDelta);
      focusOnDay(getFirstAvailableDay(loopDelta), 0);
      return undefined;
    }

    function focusOnDay(current, offset) {
      var dayFocused = isInView(document.activeElement || document.body);
      var startElem = current !== undefined ? current : dayFocused ? document.activeElement : self.selectedDateElem !== undefined && isInView(self.selectedDateElem) ? self.selectedDateElem : self.todayDateElem !== undefined && isInView(self.todayDateElem) ? self.todayDateElem : getFirstAvailableDay(offset > 0 ? 1 : -1);
      if (startElem === undefined) return self._input.focus();
      if (!dayFocused) return focusOnDayElem(startElem);
      getNextAvailableDay(startElem, offset);
    }

    function buildMonthDays(year, month) {
      var firstOfMonth = (new Date(year, month, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7;
      var prevMonthDays = self.utils.getDaysInMonth((month - 1 + 12) % 12);
      var daysInMonth = self.utils.getDaysInMonth(month),
          days = window.document.createDocumentFragment(),
          isMultiMonth = self.config.showMonths > 1,
          prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay",
          nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
      var dayNumber = prevMonthDays + 1 - firstOfMonth,
          dayIndex = 0;

      for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
        days.appendChild(createDay(prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
      }

      for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
        days.appendChild(createDay("", new Date(year, month, dayNumber), dayNumber, dayIndex));
      }

      for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth && (self.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
        days.appendChild(createDay(nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
      }

      var dayContainer = createElement("div", "dayContainer");
      dayContainer.appendChild(days);
      return dayContainer;
    }

    function buildDays() {
      if (self.daysContainer === undefined) {
        return;
      }

      clearNode(self.daysContainer);
      if (self.weekNumbers) clearNode(self.weekNumbers);
      var frag = document.createDocumentFragment();

      for (var i = 0; i < self.config.showMonths; i++) {
        var d = new Date(self.currentYear, self.currentMonth, 1);
        d.setMonth(self.currentMonth + i);
        frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
      }

      self.daysContainer.appendChild(frag);
      self.days = self.daysContainer.firstChild;

      if (self.config.mode === "range" && self.selectedDates.length === 1) {
        onMouseOver();
      }
    }

    function buildMonth() {
      var container = createElement("div", "flatpickr-month");
      var monthNavFragment = window.document.createDocumentFragment();
      var monthElement = createElement("span", "cur-month");
      var yearInput = createNumberInput("cur-year", {
        tabindex: "-1"
      });
      var yearElement = yearInput.getElementsByTagName("input")[0];
      yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel);
      if (self.config.minDate) yearElement.setAttribute("data-min", self.config.minDate.getFullYear().toString());

      if (self.config.maxDate) {
        yearElement.setAttribute("data-max", self.config.maxDate.getFullYear().toString());
        yearElement.disabled = !!self.config.minDate && self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
      }

      var currentMonth = createElement("div", "flatpickr-current-month");
      currentMonth.appendChild(monthElement);
      currentMonth.appendChild(yearInput);
      monthNavFragment.appendChild(currentMonth);
      container.appendChild(monthNavFragment);
      return {
        container: container,
        yearElement: yearElement,
        monthElement: monthElement
      };
    }

    function buildMonths() {
      clearNode(self.monthNav);
      self.monthNav.appendChild(self.prevMonthNav);

      for (var m = self.config.showMonths; m--;) {
        var month = buildMonth();
        self.yearElements.push(month.yearElement);
        self.monthElements.push(month.monthElement);
        self.monthNav.appendChild(month.container);
      }

      self.monthNav.appendChild(self.nextMonthNav);
    }

    function buildMonthNav() {
      self.monthNav = createElement("div", "flatpickr-months");
      self.yearElements = [];
      self.monthElements = [];
      self.prevMonthNav = createElement("span", "flatpickr-prev-month");
      self.prevMonthNav.innerHTML = self.config.prevArrow;
      self.nextMonthNav = createElement("span", "flatpickr-next-month");
      self.nextMonthNav.innerHTML = self.config.nextArrow;
      buildMonths();
      Object.defineProperty(self, "_hidePrevMonthArrow", {
        get: function get() {
          return self.__hidePrevMonthArrow;
        },
        set: function set(bool) {
          if (self.__hidePrevMonthArrow !== bool) {
            toggleClass(self.prevMonthNav, "disabled", bool);
            self.__hidePrevMonthArrow = bool;
          }
        }
      });
      Object.defineProperty(self, "_hideNextMonthArrow", {
        get: function get() {
          return self.__hideNextMonthArrow;
        },
        set: function set(bool) {
          if (self.__hideNextMonthArrow !== bool) {
            toggleClass(self.nextMonthNav, "disabled", bool);
            self.__hideNextMonthArrow = bool;
          }
        }
      });
      self.currentYearElement = self.yearElements[0];
      updateNavigationCurrentMonth();
      return self.monthNav;
    }

    function buildTime() {
      self.calendarContainer.classList.add("hasTime");
      if (self.config.noCalendar) self.calendarContainer.classList.add("noCalendar");
      self.timeContainer = createElement("div", "flatpickr-time");
      self.timeContainer.tabIndex = -1;
      var separator = createElement("span", "flatpickr-time-separator", ":");
      var hourInput = createNumberInput("flatpickr-hour");
      self.hourElement = hourInput.getElementsByTagName("input")[0];
      var minuteInput = createNumberInput("flatpickr-minute");
      self.minuteElement = minuteInput.getElementsByTagName("input")[0];
      self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;
      self.hourElement.value = pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getHours() : self.config.time_24hr ? self.config.defaultHour : military2ampm(self.config.defaultHour));
      self.minuteElement.value = pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getMinutes() : self.config.defaultMinute);
      self.hourElement.setAttribute("data-step", self.config.hourIncrement.toString());
      self.minuteElement.setAttribute("data-step", self.config.minuteIncrement.toString());
      self.hourElement.setAttribute("data-min", self.config.time_24hr ? "0" : "1");
      self.hourElement.setAttribute("data-max", self.config.time_24hr ? "23" : "12");
      self.minuteElement.setAttribute("data-min", "0");
      self.minuteElement.setAttribute("data-max", "59");
      self.timeContainer.appendChild(hourInput);
      self.timeContainer.appendChild(separator);
      self.timeContainer.appendChild(minuteInput);
      if (self.config.time_24hr) self.timeContainer.classList.add("time24hr");

      if (self.config.enableSeconds) {
        self.timeContainer.classList.add("hasSeconds");
        var secondInput = createNumberInput("flatpickr-second");
        self.secondElement = secondInput.getElementsByTagName("input")[0];
        self.secondElement.value = pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getSeconds() : self.config.defaultSeconds);
        self.secondElement.setAttribute("data-step", self.minuteElement.getAttribute("data-step"));
        self.secondElement.setAttribute("data-min", self.minuteElement.getAttribute("data-min"));
        self.secondElement.setAttribute("data-max", self.minuteElement.getAttribute("data-max"));
        self.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
        self.timeContainer.appendChild(secondInput);
      }

      if (!self.config.time_24hr) {
        self.amPM = createElement("span", "flatpickr-am-pm", self.l10n.amPM[int((self.latestSelectedDateObj ? self.hourElement.value : self.config.defaultHour) > 11)]);
        self.amPM.title = self.l10n.toggleTitle;
        self.amPM.tabIndex = -1;
        self.timeContainer.appendChild(self.amPM);
      }

      return self.timeContainer;
    }

    function buildWeekdays() {
      if (!self.weekdayContainer) self.weekdayContainer = createElement("div", "flatpickr-weekdays");else clearNode(self.weekdayContainer);

      for (var i = self.config.showMonths; i--;) {
        var container = createElement("div", "flatpickr-weekdaycontainer");
        self.weekdayContainer.appendChild(container);
      }

      updateWeekdays();
      return self.weekdayContainer;
    }

    function updateWeekdays() {
      var firstDayOfWeek = self.l10n.firstDayOfWeek;
      var weekdays = self.l10n.weekdays.shorthand.concat();

      if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
        weekdays = weekdays.splice(firstDayOfWeek, weekdays.length).concat(weekdays.splice(0, firstDayOfWeek));
      }

      for (var i = self.config.showMonths; i--;) {
        self.weekdayContainer.children[i].innerHTML = "\n      <span class=flatpickr-weekday>\n        " + weekdays.join("</span><span class=flatpickr-weekday>") + "\n      </span>\n      ";
      }
    }

    function buildWeeks() {
      self.calendarContainer.classList.add("hasWeeks");
      var weekWrapper = createElement("div", "flatpickr-weekwrapper");
      weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
      var weekNumbers = createElement("div", "flatpickr-weeks");
      weekWrapper.appendChild(weekNumbers);
      return {
        weekWrapper: weekWrapper,
        weekNumbers: weekNumbers
      };
    }

    function changeMonth(value, is_offset) {
      if (is_offset === void 0) {
        is_offset = true;
      }

      var delta = is_offset ? value : value - self.currentMonth;
      if (delta < 0 && self._hidePrevMonthArrow === true || delta > 0 && self._hideNextMonthArrow === true) return;
      self.currentMonth += delta;

      if (self.currentMonth < 0 || self.currentMonth > 11) {
        self.currentYear += self.currentMonth > 11 ? 1 : -1;
        self.currentMonth = (self.currentMonth + 12) % 12;
        triggerEvent("onYearChange");
      }

      buildDays();
      triggerEvent("onMonthChange");
      updateNavigationCurrentMonth();
    }

    function clear(triggerChangeEvent) {
      if (triggerChangeEvent === void 0) {
        triggerChangeEvent = true;
      }

      self.input.value = "";
      if (self.altInput !== undefined) self.altInput.value = "";
      if (self.mobileInput !== undefined) self.mobileInput.value = "";
      self.selectedDates = [];
      self.latestSelectedDateObj = undefined;
      self.showTimeInput = false;

      if (self.config.enableTime === true) {
        setDefaultHours();
      }

      self.redraw();
      if (triggerChangeEvent) triggerEvent("onChange");
    }

    function close() {
      self.isOpen = false;

      if (!self.isMobile) {
        self.calendarContainer.classList.remove("open");

        self._input.classList.remove("active");
      }

      triggerEvent("onClose");
    }

    function destroy() {
      if (self.config !== undefined) triggerEvent("onDestroy");

      for (var i = self._handlers.length; i--;) {
        var h = self._handlers[i];
        h.element.removeEventListener(h.event, h.handler, h.options);
      }

      self._handlers = [];

      if (self.mobileInput) {
        if (self.mobileInput.parentNode) self.mobileInput.parentNode.removeChild(self.mobileInput);
        self.mobileInput = undefined;
      } else if (self.calendarContainer && self.calendarContainer.parentNode) {
        if (self.config.static && self.calendarContainer.parentNode) {
          var wrapper = self.calendarContainer.parentNode;
          wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);

          if (wrapper.parentNode) {
            while (wrapper.firstChild) {
              wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            }

            wrapper.parentNode.removeChild(wrapper);
          }
        } else self.calendarContainer.parentNode.removeChild(self.calendarContainer);
      }

      if (self.altInput) {
        self.input.type = "text";
        if (self.altInput.parentNode) self.altInput.parentNode.removeChild(self.altInput);
        delete self.altInput;
      }

      if (self.input) {
        self.input.type = self.input._type;
        self.input.classList.remove("flatpickr-input");
        self.input.removeAttribute("readonly");
        self.input.value = "";
      }

      ["_showTimeInput", "latestSelectedDateObj", "_hideNextMonthArrow", "_hidePrevMonthArrow", "__hideNextMonthArrow", "__hidePrevMonthArrow", "isMobile", "isOpen", "selectedDateElem", "minDateHasTime", "maxDateHasTime", "days", "daysContainer", "_input", "_positionElement", "innerContainer", "rContainer", "monthNav", "todayDateElem", "calendarContainer", "weekdayContainer", "prevMonthNav", "nextMonthNav", "currentMonthElement", "currentYearElement", "navigationCurrentMonth", "selectedDateElem", "config"].forEach(function (k) {
        try {
          delete self[k];
        } catch (_) {}
      });
    }

    function isCalendarElem(elem) {
      if (self.config.appendTo && self.config.appendTo.contains(elem)) return true;
      return self.calendarContainer.contains(elem);
    }

    function documentClick(e) {
      if (self.isOpen && !self.config.inline) {
        var isCalendarElement = isCalendarElem(e.target);
        var isInput = e.target === self.input || e.target === self.altInput || self.element.contains(e.target) || e.path && e.path.indexOf && (~e.path.indexOf(self.input) || ~e.path.indexOf(self.altInput));
        var lostFocus = e.type === "blur" ? isInput && e.relatedTarget && !isCalendarElem(e.relatedTarget) : !isInput && !isCalendarElement;
        var isIgnored = !self.config.ignoredFocusElements.some(function (elem) {
          return elem.contains(e.target);
        });

        if (lostFocus && isIgnored) {
          self.close();

          if (self.config.mode === "range" && self.selectedDates.length === 1) {
            self.clear(false);
            self.redraw();
          }
        }
      }
    }

    function changeYear(newYear) {
      if (!newYear || self.config.minDate && newYear < self.config.minDate.getFullYear() || self.config.maxDate && newYear > self.config.maxDate.getFullYear()) return;
      var newYearNum = newYear,
          isNewYear = self.currentYear !== newYearNum;
      self.currentYear = newYearNum || self.currentYear;

      if (self.config.maxDate && self.currentYear === self.config.maxDate.getFullYear()) {
        self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
      } else if (self.config.minDate && self.currentYear === self.config.minDate.getFullYear()) {
        self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
      }

      if (isNewYear) {
        self.redraw();
        triggerEvent("onYearChange");
      }
    }

    function isEnabled(date, timeless) {
      if (timeless === void 0) {
        timeless = true;
      }

      var dateToCheck = self.parseDate(date, undefined, timeless);
      if (self.config.minDate && dateToCheck && compareDates(dateToCheck, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0 || self.config.maxDate && dateToCheck && compareDates(dateToCheck, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0) return false;
      if (self.config.enable.length === 0 && self.config.disable.length === 0) return true;
      if (dateToCheck === undefined) return false;
      var bool = self.config.enable.length > 0,
          array = bool ? self.config.enable : self.config.disable;

      for (var i = 0, d; i < array.length; i++) {
        d = array[i];
        if (typeof d === "function" && d(dateToCheck)) return bool;else if (d instanceof Date && dateToCheck !== undefined && d.getTime() === dateToCheck.getTime()) return bool;else if (typeof d === "string" && dateToCheck !== undefined) {
          var parsed = self.parseDate(d, undefined, true);
          return parsed && parsed.getTime() === dateToCheck.getTime() ? bool : !bool;
        } else if (typeof d === "object" && dateToCheck !== undefined && d.from && d.to && dateToCheck.getTime() >= d.from.getTime() && dateToCheck.getTime() <= d.to.getTime()) return bool;
      }

      return !bool;
    }

    function isInView(elem) {
      if (self.daysContainer !== undefined) return elem.className.indexOf("hidden") === -1 && self.daysContainer.contains(elem);
      return false;
    }

    function onKeyDown(e) {
      var isInput = e.target === self._input;
      var allowInput = self.config.allowInput;
      var allowKeydown = self.isOpen && (!allowInput || !isInput);
      var allowInlineKeydown = self.config.inline && isInput && !allowInput;

      if (e.keyCode === 13 && isInput) {
        if (allowInput) {
          self.setDate(self._input.value, true, e.target === self.altInput ? self.config.altFormat : self.config.dateFormat);
          return e.target.blur();
        } else self.open();
      } else if (isCalendarElem(e.target) || allowKeydown || allowInlineKeydown) {
        var isTimeObj = !!self.timeContainer && self.timeContainer.contains(e.target);

        switch (e.keyCode) {
          case 13:
            if (isTimeObj) updateTime();else selectDate(e);
            break;

          case 27:
            e.preventDefault();
            focusAndClose();
            break;

          case 8:
          case 46:
            if (isInput && !self.config.allowInput) {
              e.preventDefault();
              self.clear();
            }

            break;

          case 37:
          case 39:
            if (!isTimeObj) {
              e.preventDefault();

              if (self.daysContainer !== undefined && (allowInput === false || isInView(document.activeElement))) {
                var _delta = e.keyCode === 39 ? 1 : -1;

                if (!e.ctrlKey) focusOnDay(undefined, _delta);else {
                  changeMonth(_delta);
                  focusOnDay(getFirstAvailableDay(1), 0);
                }
              }
            } else if (self.hourElement) self.hourElement.focus();

            break;

          case 38:
          case 40:
            e.preventDefault();
            var delta = e.keyCode === 40 ? 1 : -1;

            if (self.daysContainer && e.target.$i !== undefined) {
              if (e.ctrlKey) {
                changeYear(self.currentYear - delta);
                focusOnDay(getFirstAvailableDay(1), 0);
              } else if (!isTimeObj) focusOnDay(undefined, delta * 7);
            } else if (self.config.enableTime) {
              if (!isTimeObj && self.hourElement) self.hourElement.focus();
              updateTime(e);

              self._debouncedChange();
            }

            break;

          case 9:
            if (!isTimeObj) {
              self.element.focus();
              break;
            }

            var elems = [self.hourElement, self.minuteElement, self.secondElement, self.amPM].filter(function (x) {
              return x;
            });
            var i = elems.indexOf(e.target);

            if (i !== -1) {
              var target = elems[i + (e.shiftKey ? -1 : 1)];

              if (target !== undefined) {
                e.preventDefault();
                target.focus();
              } else {
                self.element.focus();
              }
            }

            break;

          default:
            break;
        }
      }

      if (self.amPM !== undefined && e.target === self.amPM) {
        switch (e.key) {
          case self.l10n.amPM[0].charAt(0):
          case self.l10n.amPM[0].charAt(0).toLowerCase():
            self.amPM.textContent = self.l10n.amPM[0];
            setHoursFromInputs();
            updateValue();
            break;

          case self.l10n.amPM[1].charAt(0):
          case self.l10n.amPM[1].charAt(0).toLowerCase():
            self.amPM.textContent = self.l10n.amPM[1];
            setHoursFromInputs();
            updateValue();
            break;
        }
      }

      triggerEvent("onKeyDown", e);
    }

    function onMouseOver(elem) {
      if (self.selectedDates.length !== 1 || elem && (!elem.classList.contains("flatpickr-day") || elem.classList.contains("disabled"))) return;
      var hoverDate = elem ? elem.dateObj.getTime() : self.days.firstElementChild.dateObj.getTime(),
          initialDate = self.parseDate(self.selectedDates[0], undefined, true).getTime(),
          rangeStartDate = Math.min(hoverDate, self.selectedDates[0].getTime()),
          rangeEndDate = Math.max(hoverDate, self.selectedDates[0].getTime()),
          lastDate = self.daysContainer.lastChild.lastChild.dateObj.getTime();
      var containsDisabled = false;
      var minRange = 0,
          maxRange = 0;

      for (var t = rangeStartDate; t < lastDate; t += duration.DAY) {
        if (!isEnabled(new Date(t), true)) {
          containsDisabled = containsDisabled || t > rangeStartDate && t < rangeEndDate;
          if (t < initialDate && (!minRange || t > minRange)) minRange = t;else if (t > initialDate && (!maxRange || t < maxRange)) maxRange = t;
        }
      }

      for (var m = 0; m < self.config.showMonths; m++) {
        var month = self.daysContainer.children[m];
        var prevMonth = self.daysContainer.children[m - 1];

        var _loop = function _loop(i, l) {
          var dayElem = month.children[i],
              date = dayElem.dateObj;
          var timestamp = date.getTime();
          var outOfRange = minRange > 0 && timestamp < minRange || maxRange > 0 && timestamp > maxRange;

          if (outOfRange) {
            dayElem.classList.add("notAllowed");
            ["inRange", "startRange", "endRange"].forEach(function (c) {
              dayElem.classList.remove(c);
            });
            return "continue";
          } else if (containsDisabled && !outOfRange) return "continue";

          ["startRange", "inRange", "endRange", "notAllowed"].forEach(function (c) {
            dayElem.classList.remove(c);
          });

          if (elem !== undefined) {
            elem.classList.add(hoverDate < self.selectedDates[0].getTime() ? "startRange" : "endRange");

            if (month.contains(elem) || !(m > 0 && prevMonth && prevMonth.lastChild.dateObj.getTime() >= timestamp)) {
              if (initialDate < hoverDate && timestamp === initialDate) dayElem.classList.add("startRange");else if (initialDate > hoverDate && timestamp === initialDate) dayElem.classList.add("endRange");
              if (timestamp >= minRange && (maxRange === 0 || timestamp <= maxRange) && isBetween(timestamp, initialDate, hoverDate)) dayElem.classList.add("inRange");
            }
          }
        };

        for (var i = 0, l = month.children.length; i < l; i++) {
          var _ret = _loop(i, l);

          if (_ret === "continue") continue;
        }
      }
    }

    function onResize() {
      if (self.isOpen && !self.config.static && !self.config.inline) positionCalendar();
    }

    function open(e, positionElement) {
      if (positionElement === void 0) {
        positionElement = self._positionElement;
      }

      if (self.isMobile === true) {
        if (e) {
          e.preventDefault();
          e.target && e.target.blur();
        }

        if (self.mobileInput !== undefined) {
          self.mobileInput.focus();
          self.mobileInput.click();
        }

        triggerEvent("onOpen");
        return;
      }

      if (self._input.disabled || self.config.inline) return;
      var wasOpen = self.isOpen;
      self.isOpen = true;

      if (!wasOpen) {
        self.calendarContainer.classList.add("open");

        self._input.classList.add("active");

        triggerEvent("onOpen");
        positionCalendar(positionElement);
      }

      if (self.config.enableTime === true && self.config.noCalendar === true) {
        if (self.selectedDates.length === 0) {
          self.setDate(self.config.minDate !== undefined ? new Date(self.config.minDate.getTime()) : new Date(), false);
          setDefaultHours();
          updateValue();
        }

        if (self.config.allowInput === false && (e === undefined || !self.timeContainer.contains(e.relatedTarget))) {
          setTimeout(function () {
            return self.hourElement.select();
          }, 50);
        }
      }
    }

    function minMaxDateSetter(type) {
      return function (date) {
        var dateObj = self.config["_" + type + "Date"] = self.parseDate(date, self.config.dateFormat);
        var inverseDateObj = self.config["_" + (type === "min" ? "max" : "min") + "Date"];

        if (dateObj !== undefined) {
          self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] = dateObj.getHours() > 0 || dateObj.getMinutes() > 0 || dateObj.getSeconds() > 0;
        }

        if (self.selectedDates) {
          self.selectedDates = self.selectedDates.filter(function (d) {
            return isEnabled(d);
          });
          if (!self.selectedDates.length && type === "min") setHoursFromDate(dateObj);
          updateValue();
        }

        if (self.daysContainer) {
          redraw();
          if (dateObj !== undefined) self.currentYearElement[type] = dateObj.getFullYear().toString();else self.currentYearElement.removeAttribute(type);
          self.currentYearElement.disabled = !!inverseDateObj && dateObj !== undefined && inverseDateObj.getFullYear() === dateObj.getFullYear();
        }
      };
    }

    function parseConfig() {
      var boolOpts = ["wrap", "weekNumbers", "allowInput", "clickOpens", "time_24hr", "enableTime", "noCalendar", "altInput", "shorthandCurrentMonth", "inline", "static", "enableSeconds", "disableMobile"];
      var userConfig = Object.assign({}, instanceConfig, JSON.parse(JSON.stringify(element.dataset || {})));
      var formats$$1 = {};
      self.config.parseDate = userConfig.parseDate;
      self.config.formatDate = userConfig.formatDate;
      Object.defineProperty(self.config, "enable", {
        get: function get() {
          return self.config._enable;
        },
        set: function set(dates) {
          self.config._enable = parseDateRules(dates);
        }
      });
      Object.defineProperty(self.config, "disable", {
        get: function get() {
          return self.config._disable;
        },
        set: function set(dates) {
          self.config._disable = parseDateRules(dates);
        }
      });
      var timeMode = userConfig.mode === "time";

      if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
        formats$$1.dateFormat = userConfig.noCalendar || timeMode ? "H:i" + (userConfig.enableSeconds ? ":S" : "") : flatpickr.defaultConfig.dateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
      }

      if (userConfig.altInput && (userConfig.enableTime || timeMode) && !userConfig.altFormat) {
        formats$$1.altFormat = userConfig.noCalendar || timeMode ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K") : flatpickr.defaultConfig.altFormat + (" h:i" + (userConfig.enableSeconds ? ":S" : "") + " K");
      }

      Object.defineProperty(self.config, "minDate", {
        get: function get() {
          return self.config._minDate;
        },
        set: minMaxDateSetter("min")
      });
      Object.defineProperty(self.config, "maxDate", {
        get: function get() {
          return self.config._maxDate;
        },
        set: minMaxDateSetter("max")
      });

      var minMaxTimeSetter = function minMaxTimeSetter(type) {
        return function (val) {
          self.config[type === "min" ? "_minTime" : "_maxTime"] = self.parseDate(val, "H:i");
        };
      };

      Object.defineProperty(self.config, "minTime", {
        get: function get() {
          return self.config._minTime;
        },
        set: minMaxTimeSetter("min")
      });
      Object.defineProperty(self.config, "maxTime", {
        get: function get() {
          return self.config._maxTime;
        },
        set: minMaxTimeSetter("max")
      });

      if (userConfig.mode === "time") {
        self.config.noCalendar = true;
        self.config.enableTime = true;
      }

      Object.assign(self.config, formats$$1, userConfig);

      for (var i = 0; i < boolOpts.length; i++) {
        self.config[boolOpts[i]] = self.config[boolOpts[i]] === true || self.config[boolOpts[i]] === "true";
      }

      HOOKS.filter(function (hook) {
        return self.config[hook] !== undefined;
      }).forEach(function (hook) {
        self.config[hook] = arrayify(self.config[hook] || []).map(bindToInstance);
      });
      self.isMobile = !self.config.disableMobile && !self.config.inline && self.config.mode === "single" && !self.config.disable.length && !self.config.enable.length && !self.config.weekNumbers && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      for (var _i = 0; _i < self.config.plugins.length; _i++) {
        var pluginConf = self.config.plugins[_i](self) || {};

        for (var key in pluginConf) {
          if (HOOKS.indexOf(key) > -1) {
            self.config[key] = arrayify(pluginConf[key]).map(bindToInstance).concat(self.config[key]);
          } else if (typeof userConfig[key] === "undefined") self.config[key] = pluginConf[key];
        }
      }

      triggerEvent("onParseConfig");
    }

    function setupLocale() {
      if (typeof self.config.locale !== "object" && typeof flatpickr.l10ns[self.config.locale] === "undefined") self.config.errorHandler(new Error("flatpickr: invalid locale " + self.config.locale));
      self.l10n = Object.assign({}, flatpickr.l10ns.default, typeof self.config.locale === "object" ? self.config.locale : self.config.locale !== "default" ? flatpickr.l10ns[self.config.locale] : undefined);
      tokenRegex.K = "(" + self.l10n.amPM[0] + "|" + self.l10n.amPM[1] + "|" + self.l10n.amPM[0].toLowerCase() + "|" + self.l10n.amPM[1].toLowerCase() + ")";
      self.formatDate = createDateFormatter(self);
      self.parseDate = createDateParser({
        config: self.config,
        l10n: self.l10n
      });
    }

    function positionCalendar(customPositionElement) {
      if (self.calendarContainer === undefined) return;
      triggerEvent("onPreCalendarPosition");
      var positionElement = customPositionElement || self._positionElement;
      var calendarHeight = Array.prototype.reduce.call(self.calendarContainer.children, function (acc, child) {
        return acc + child.offsetHeight;
      }, 0),
          calendarWidth = self.calendarContainer.offsetWidth,
          configPos = self.config.position.split(" "),
          configPosVertical = configPos[0],
          configPosHorizontal = configPos.length > 1 ? configPos[1] : null,
          inputBounds = positionElement.getBoundingClientRect(),
          distanceFromBottom = window.innerHeight - inputBounds.bottom,
          showOnTop = configPosVertical === "above" || configPosVertical !== "below" && distanceFromBottom < calendarHeight && inputBounds.top > calendarHeight;
      var top = window.pageYOffset + inputBounds.top + (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
      toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
      toggleClass(self.calendarContainer, "arrowBottom", showOnTop);
      if (self.config.inline) return;
      var left = window.pageXOffset + inputBounds.left - (configPosHorizontal != null && configPosHorizontal === "center" ? (calendarWidth - inputBounds.width) / 2 : 0);
      var right = window.document.body.offsetWidth - inputBounds.right;
      var rightMost = left + calendarWidth > window.document.body.offsetWidth;
      toggleClass(self.calendarContainer, "rightMost", rightMost);
      if (self.config.static) return;
      self.calendarContainer.style.top = top + "px";

      if (!rightMost) {
        self.calendarContainer.style.left = left + "px";
        self.calendarContainer.style.right = "auto";
      } else {
        self.calendarContainer.style.left = "auto";
        self.calendarContainer.style.right = right + "px";
      }
    }

    function redraw() {
      if (self.config.noCalendar || self.isMobile) return;
      updateNavigationCurrentMonth();
      buildDays();
    }

    function focusAndClose() {
      self._input.focus();

      if (window.navigator.userAgent.indexOf("MSIE") !== -1 || navigator.msMaxTouchPoints !== undefined) {
        setTimeout(self.close, 0);
      } else {
        self.close();
      }
    }

    function selectDate(e) {
      e.preventDefault();
      e.stopPropagation();

      var isSelectable = function isSelectable(day) {
        return day.classList && day.classList.contains("flatpickr-day") && !day.classList.contains("disabled") && !day.classList.contains("notAllowed");
      };

      var t = findParent(e.target, isSelectable);
      if (t === undefined) return;
      var target = t;
      var selectedDate = self.latestSelectedDateObj = new Date(target.dateObj.getTime());
      var shouldChangeMonth = (selectedDate.getMonth() < self.currentMonth || selectedDate.getMonth() > self.currentMonth + self.config.showMonths - 1) && self.config.mode !== "range";
      self.selectedDateElem = target;
      if (self.config.mode === "single") self.selectedDates = [selectedDate];else if (self.config.mode === "multiple") {
        var selectedIndex = isDateSelected(selectedDate);
        if (selectedIndex) self.selectedDates.splice(parseInt(selectedIndex), 1);else self.selectedDates.push(selectedDate);
      } else if (self.config.mode === "range") {
        if (self.selectedDates.length === 2) self.clear(false);
        self.selectedDates.push(selectedDate);
        if (compareDates(selectedDate, self.selectedDates[0], true) !== 0) self.selectedDates.sort(function (a, b) {
          return a.getTime() - b.getTime();
        });
      }
      setHoursFromInputs();

      if (shouldChangeMonth) {
        var isNewYear = self.currentYear !== selectedDate.getFullYear();
        self.currentYear = selectedDate.getFullYear();
        self.currentMonth = selectedDate.getMonth();
        if (isNewYear) triggerEvent("onYearChange");
        triggerEvent("onMonthChange");
      }

      updateNavigationCurrentMonth();
      buildDays();
      updateValue();
      if (self.config.enableTime) setTimeout(function () {
        return self.showTimeInput = true;
      }, 50);
      if (!shouldChangeMonth && self.config.mode !== "range" && self.config.showMonths === 1) focusOnDayElem(target);else self.selectedDateElem && self.selectedDateElem.focus();
      if (self.hourElement !== undefined) setTimeout(function () {
        return self.hourElement !== undefined && self.hourElement.select();
      }, 451);

      if (self.config.closeOnSelect) {
        var single = self.config.mode === "single" && !self.config.enableTime;
        var range = self.config.mode === "range" && self.selectedDates.length === 2 && !self.config.enableTime;

        if (single || range) {
          focusAndClose();
        }
      }

      triggerChange();
    }

    var CALLBACKS = {
      locale: [setupLocale, updateWeekdays],
      showMonths: [buildMonths, setCalendarWidth, buildWeekdays]
    };

    function set(option, value) {
      if (option !== null && typeof option === "object") Object.assign(self.config, option);else {
        self.config[option] = value;
        if (CALLBACKS[option] !== undefined) CALLBACKS[option].forEach(function (x) {
          return x();
        });else if (HOOKS.indexOf(option) > -1) self.config[option] = arrayify(value);
      }
      self.redraw();
      jumpToDate();
      updateValue(false);
    }

    function setSelectedDate(inputDate, format) {
      var dates = [];
      if (inputDate instanceof Array) dates = inputDate.map(function (d) {
        return self.parseDate(d, format);
      });else if (inputDate instanceof Date || typeof inputDate === "number") dates = [self.parseDate(inputDate, format)];else if (typeof inputDate === "string") {
        switch (self.config.mode) {
          case "single":
          case "time":
            dates = [self.parseDate(inputDate, format)];
            break;

          case "multiple":
            dates = inputDate.split(self.config.conjunction).map(function (date) {
              return self.parseDate(date, format);
            });
            break;

          case "range":
            dates = inputDate.split(self.l10n.rangeSeparator).map(function (date) {
              return self.parseDate(date, format);
            });
            break;

          default:
            break;
        }
      } else self.config.errorHandler(new Error("Invalid date supplied: " + JSON.stringify(inputDate)));
      self.selectedDates = dates.filter(function (d) {
        return d instanceof Date && isEnabled(d, false);
      });
      if (self.config.mode === "range") self.selectedDates.sort(function (a, b) {
        return a.getTime() - b.getTime();
      });
    }

    function setDate(date, triggerChange, format) {
      if (triggerChange === void 0) {
        triggerChange = false;
      }

      if (format === void 0) {
        format = self.config.dateFormat;
      }

      if (date !== 0 && !date || date instanceof Array && date.length === 0) return self.clear(triggerChange);
      setSelectedDate(date, format);
      self.showTimeInput = self.selectedDates.length > 0;
      self.latestSelectedDateObj = self.selectedDates[0];
      self.redraw();
      jumpToDate();
      setHoursFromDate();
      updateValue(triggerChange);
      if (triggerChange) triggerEvent("onChange");
    }

    function parseDateRules(arr) {
      return arr.slice().map(function (rule) {
        if (typeof rule === "string" || typeof rule === "number" || rule instanceof Date) {
          return self.parseDate(rule, undefined, true);
        } else if (rule && typeof rule === "object" && rule.from && rule.to) return {
          from: self.parseDate(rule.from, undefined),
          to: self.parseDate(rule.to, undefined)
        };

        return rule;
      }).filter(function (x) {
        return x;
      });
    }

    function setupDates() {
      self.selectedDates = [];
      self.now = self.parseDate(self.config.now) || new Date();
      var preloadedDate = self.config.defaultDate || ((self.input.nodeName === "INPUT" || self.input.nodeName === "TEXTAREA") && self.input.placeholder && self.input.value === self.input.placeholder ? null : self.input.value);
      if (preloadedDate) setSelectedDate(preloadedDate, self.config.dateFormat);
      var initialDate = self.selectedDates.length > 0 ? self.selectedDates[0] : self.config.minDate && self.config.minDate.getTime() > self.now.getTime() ? self.config.minDate : self.config.maxDate && self.config.maxDate.getTime() < self.now.getTime() ? self.config.maxDate : self.now;
      self.currentYear = initialDate.getFullYear();
      self.currentMonth = initialDate.getMonth();
      if (self.selectedDates.length > 0) self.latestSelectedDateObj = self.selectedDates[0];
      if (self.config.minTime !== undefined) self.config.minTime = self.parseDate(self.config.minTime, "H:i");
      if (self.config.maxTime !== undefined) self.config.maxTime = self.parseDate(self.config.maxTime, "H:i");
      self.minDateHasTime = !!self.config.minDate && (self.config.minDate.getHours() > 0 || self.config.minDate.getMinutes() > 0 || self.config.minDate.getSeconds() > 0);
      self.maxDateHasTime = !!self.config.maxDate && (self.config.maxDate.getHours() > 0 || self.config.maxDate.getMinutes() > 0 || self.config.maxDate.getSeconds() > 0);
      Object.defineProperty(self, "showTimeInput", {
        get: function get() {
          return self._showTimeInput;
        },
        set: function set(bool) {
          self._showTimeInput = bool;
          if (self.calendarContainer) toggleClass(self.calendarContainer, "showTimeInput", bool);
          self.isOpen && positionCalendar();
        }
      });
    }

    function setupInputs() {
      self.input = self.config.wrap ? element.querySelector("[data-input]") : element;

      if (!self.input) {
        self.config.errorHandler(new Error("Invalid input element specified"));
        return;
      }

      self.input._type = self.input.type;
      self.input.type = "text";
      self.input.classList.add("flatpickr-input");
      self._input = self.input;

      if (self.config.altInput) {
        self.altInput = createElement(self.input.nodeName, self.input.className + " " + self.config.altInputClass);
        self._input = self.altInput;
        self.altInput.placeholder = self.input.placeholder;
        self.altInput.disabled = self.input.disabled;
        self.altInput.required = self.input.required;
        self.altInput.tabIndex = self.input.tabIndex;
        self.altInput.type = "text";
        self.input.setAttribute("type", "hidden");
        if (!self.config.static && self.input.parentNode) self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
      }

      if (!self.config.allowInput) self._input.setAttribute("readonly", "readonly");
      self._positionElement = self.config.positionElement || self._input;
    }

    function setupMobile() {
      var inputType = self.config.enableTime ? self.config.noCalendar ? "time" : "datetime-local" : "date";
      self.mobileInput = createElement("input", self.input.className + " flatpickr-mobile");
      self.mobileInput.step = self.input.getAttribute("step") || "any";
      self.mobileInput.tabIndex = 1;
      self.mobileInput.type = inputType;
      self.mobileInput.disabled = self.input.disabled;
      self.mobileInput.required = self.input.required;
      self.mobileInput.placeholder = self.input.placeholder;
      self.mobileFormatStr = inputType === "datetime-local" ? "Y-m-d\\TH:i:S" : inputType === "date" ? "Y-m-d" : "H:i:S";

      if (self.selectedDates.length > 0) {
        self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
      }

      if (self.config.minDate) self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");
      if (self.config.maxDate) self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");
      self.input.type = "hidden";
      if (self.altInput !== undefined) self.altInput.type = "hidden";

      try {
        if (self.input.parentNode) self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
      } catch (_a) {}

      bind(self.mobileInput, "change", function (e) {
        self.setDate(e.target.value, false, self.mobileFormatStr);
        triggerEvent("onChange");
        triggerEvent("onClose");
      });
    }

    function toggle(e) {
      if (self.isOpen === true) return self.close();
      self.open(e);
    }

    function triggerEvent(event, data) {
      if (self.config === undefined) return;
      var hooks = self.config[event];

      if (hooks !== undefined && hooks.length > 0) {
        for (var i = 0; hooks[i] && i < hooks.length; i++) {
          hooks[i](self.selectedDates, self.input.value, self, data);
        }
      }

      if (event === "onChange") {
        self.input.dispatchEvent(createEvent("change"));
        self.input.dispatchEvent(createEvent("input"));
      }
    }

    function createEvent(name) {
      var e = document.createEvent("Event");
      e.initEvent(name, true, true);
      return e;
    }

    function isDateSelected(date) {
      for (var i = 0; i < self.selectedDates.length; i++) {
        if (compareDates(self.selectedDates[i], date) === 0) return "" + i;
      }

      return false;
    }

    function isDateInRange(date) {
      if (self.config.mode !== "range" || self.selectedDates.length < 2) return false;
      return compareDates(date, self.selectedDates[0]) >= 0 && compareDates(date, self.selectedDates[1]) <= 0;
    }

    function updateNavigationCurrentMonth() {
      if (self.config.noCalendar || self.isMobile || !self.monthNav) return;
      self.yearElements.forEach(function (yearElement, i) {
        var d = new Date(self.currentYear, self.currentMonth, 1);
        d.setMonth(self.currentMonth + i);
        self.monthElements[i].textContent = monthToStr(d.getMonth(), self.config.shorthandCurrentMonth, self.l10n) + " ";
        yearElement.value = d.getFullYear().toString();
      });
      self._hidePrevMonthArrow = self.config.minDate !== undefined && (self.currentYear === self.config.minDate.getFullYear() ? self.currentMonth <= self.config.minDate.getMonth() : self.currentYear < self.config.minDate.getFullYear());
      self._hideNextMonthArrow = self.config.maxDate !== undefined && (self.currentYear === self.config.maxDate.getFullYear() ? self.currentMonth + 1 > self.config.maxDate.getMonth() : self.currentYear > self.config.maxDate.getFullYear());
    }

    function getDateStr(format) {
      return self.selectedDates.map(function (dObj) {
        return self.formatDate(dObj, format);
      }).filter(function (d, i, arr) {
        return self.config.mode !== "range" || self.config.enableTime || arr.indexOf(d) === i;
      }).join(self.config.mode !== "range" ? self.config.conjunction : self.l10n.rangeSeparator);
    }

    function updateValue(triggerChange) {
      if (triggerChange === void 0) {
        triggerChange = true;
      }

      if (self.selectedDates.length === 0) return self.clear(triggerChange);

      if (self.mobileInput !== undefined && self.mobileFormatStr) {
        self.mobileInput.value = self.latestSelectedDateObj !== undefined ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr) : "";
      }

      self.input.value = getDateStr(self.config.dateFormat);

      if (self.altInput !== undefined) {
        self.altInput.value = getDateStr(self.config.altFormat);
      }

      if (triggerChange !== false) triggerEvent("onValueUpdate");
    }

    function onMonthNavClick(e) {
      e.preventDefault();
      var isPrevMonth = self.prevMonthNav.contains(e.target);
      var isNextMonth = self.nextMonthNav.contains(e.target);

      if (isPrevMonth || isNextMonth) {
        changeMonth(isPrevMonth ? -1 : 1);
      } else if (self.yearElements.indexOf(e.target) >= 0) {
        e.target.select();
      } else if (e.target.classList.contains("arrowUp")) {
        self.changeYear(self.currentYear + 1);
      } else if (e.target.classList.contains("arrowDown")) {
        self.changeYear(self.currentYear - 1);
      }
    }

    function timeWrapper(e) {
      e.preventDefault();
      var isKeyDown = e.type === "keydown",
          input = e.target;

      if (self.amPM !== undefined && e.target === self.amPM) {
        self.amPM.textContent = self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
      }

      var min = parseFloat(input.getAttribute("data-min")),
          max = parseFloat(input.getAttribute("data-max")),
          step = parseFloat(input.getAttribute("data-step")),
          curValue = parseInt(input.value, 10),
          delta = e.delta || (isKeyDown ? e.which === 38 ? 1 : -1 : 0);
      var newValue = curValue + step * delta;

      if (typeof input.value !== "undefined" && input.value.length === 2) {
        var isHourElem = input === self.hourElement,
            isMinuteElem = input === self.minuteElement;

        if (newValue < min) {
          newValue = max + newValue + int(!isHourElem) + (int(isHourElem) && int(!self.amPM));
          if (isMinuteElem) incrementNumInput(undefined, -1, self.hourElement);
        } else if (newValue > max) {
          newValue = input === self.hourElement ? newValue - max - int(!self.amPM) : min;
          if (isMinuteElem) incrementNumInput(undefined, 1, self.hourElement);
        }

        if (self.amPM && isHourElem && (step === 1 ? newValue + curValue === 23 : Math.abs(newValue - curValue) > step)) {
          self.amPM.textContent = self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
        }

        input.value = pad(newValue);
      }
    }

    init();
    return self;
  }

  function _flatpickr(nodeList, config) {
    var nodes = Array.prototype.slice.call(nodeList);
    var instances = [];

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];

      try {
        if (node.getAttribute("data-fp-omit") !== null) continue;

        if (node._flatpickr !== undefined) {
          node._flatpickr.destroy();

          node._flatpickr = undefined;
        }

        node._flatpickr = FlatpickrInstance(node, config || {});
        instances.push(node._flatpickr);
      } catch (e) {
        console.error(e);
      }
    }

    return instances.length === 1 ? instances[0] : instances;
  }

  if (typeof HTMLElement !== "undefined") {
    HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
      return _flatpickr(this, config);
    };

    HTMLElement.prototype.flatpickr = function (config) {
      return _flatpickr([this], config);
    };
  }

  var flatpickr = function flatpickr(selector, config) {
    if (selector instanceof NodeList) return _flatpickr(selector, config);else if (typeof selector === "string") return _flatpickr(window.document.querySelectorAll(selector), config);
    return _flatpickr([selector], config);
  };

  flatpickr.defaultConfig = defaults;
  flatpickr.l10ns = {
    en: Object.assign({}, english),
    default: Object.assign({}, english)
  };

  flatpickr.localize = function (l10n) {
    flatpickr.l10ns.default = Object.assign({}, flatpickr.l10ns.default, l10n);
  };

  flatpickr.setDefaults = function (config) {
    flatpickr.defaultConfig = Object.assign({}, flatpickr.defaultConfig, config);
  };

  flatpickr.parseDate = createDateParser({});
  flatpickr.formatDate = createDateFormatter({});
  flatpickr.compareDates = compareDates;

  if (typeof jQuery !== "undefined") {
    jQuery.fn.flatpickr = function (config) {
      return _flatpickr(this, config);
    };
  }

  Date.prototype.fp_incr = function (days) {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
  };

  if (typeof window !== "undefined") {
    window.flatpickr = flatpickr;
  }

  return flatpickr;
});

},{}],24:[function(require,module,exports){
(function (global){
"use strict";

var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined") {
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],25:[function(require,module,exports){
'use strict';

var global = require('global');

/**
 * `requestAnimationFrame()`
 */

var request = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || fallback;

var prev = +new Date();
function fallback(fn) {
  var curr = +new Date();
  var ms = Math.max(0, 16 - (curr - prev));
  var req = setTimeout(fn, ms);
  return prev = curr, req;
}

/**
 * `cancelAnimationFrame()`
 */

var cancel = global.cancelAnimationFrame || global.webkitCancelAnimationFrame || global.mozCancelAnimationFrame || clearTimeout;

if (Function.prototype.bind) {
  request = request.bind(global);
  cancel = cancel.bind(global);
}

exports = module.exports = request;
exports.cancel = cancel;

},{"global":24}],26:[function(require,module,exports){
'use strict';

var raf = require('rafl');
var E_NOSCROLL = new Error('Element already at target scroll position');
var E_CANCELLED = new Error('Scroll cancelled');
var min = Math.min;

module.exports = {
  left: make('scrollLeft'),
  top: make('scrollTop')
};

function make(prop) {
  return function scroll(el, to, opts, cb) {
    opts = opts || {};

    if (typeof opts == 'function') cb = opts, opts = {};
    if (typeof cb != 'function') cb = noop;

    var start = +new Date();
    var from = el[prop];
    var ease = opts.ease || inOutSine;
    var duration = !isNaN(opts.duration) ? +opts.duration : 350;
    var cancelled = false;

    return from === to ? cb(E_NOSCROLL, el[prop]) : raf(animate), cancel;

    function cancel() {
      cancelled = true;
    }

    function animate(timestamp) {
      if (cancelled) return cb(E_CANCELLED, el[prop]);

      var now = +new Date();
      var time = min(1, (now - start) / duration);
      var eased = ease(time);

      el[prop] = eased * (to - from) + from;

      time < 1 ? raf(animate) : raf(function () {
        cb(null, el[prop]);
      });
    }
  };
}

function inOutSine(n) {
  return 0.5 * (1 - Math.cos(Math.PI * n));
}

function noop() {}

},{"rafl":25}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCSSRule = addCSSRule;

var _raf = require('./raf');

function addCSSRule(sheet, selector, rules, index) {
  // return raf(function() {
  'insertRule' in sheet ? sheet.insertRule(selector + '{' + rules + '}', index) : sheet.addRule(selector, rules, index);
  // });
} // cross browsers addRule method

},{"./raf":56}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addClass = undefined;

var _hasClass = require('./hasClass');

var addClass = _hasClass.classListSupport ? function (el, str) {
  if (!(0, _hasClass.hasClass)(el, str)) {
    el.classList.add(str);
  }
} : function (el, str) {
  if (!(0, _hasClass.hasClass)(el, str)) {
    el.className += ' ' + str;
  }
};

exports.addClass = addClass;

},{"./hasClass":48}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEvents = addEvents;

var _passiveOption = require('./passiveOption');

function addEvents(el, obj) {
  for (var prop in obj) {
    var option = prop === 'touchstart' || prop === 'touchmove' ? _passiveOption.passiveOption : false;
    el.addEventListener(prop, obj[prop], option);
  }
}

},{"./passiveOption":55}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayFromNodeList = arrayFromNodeList;
function arrayFromNodeList(nl) {
  var arr = [];
  for (var i = 0, l = nl.length; i < l; i++) {
    arr.push(nl[i]);
  }
  return arr;
}

},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var win = window;

var caf = exports.caf = win.cancelAnimationFrame || win.mozCancelAnimationFrame || function (id) {
  clearTimeout(id);
};

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calc = calc;

require('./childNode.remove');

var _getBody = require('./getBody');

var _setFakeBody = require('./setFakeBody');

var _resetFakeBody = require('./resetFakeBody');

// get css-calc 
// @return - false | calc | -webkit-calc | -moz-calc
// @usage - var calc = getCalc(); 
function calc() {
  var doc = document,
      body = (0, _getBody.getBody)(),
      docOverflow = (0, _setFakeBody.setFakeBody)(body),
      div = doc.createElement('div'),
      result = false;

  body.appendChild(div);
  try {
    var vals = ['calc(10px)', '-moz-calc(10px)', '-webkit-calc(10px)'],
        val;
    for (var i = 0; i < 3; i++) {
      val = vals[i];
      div.style.width = val;
      if (div.offsetWidth === 10) {
        result = val.replace('(10px)', '');
        break;
      }
    }
  } catch (e) {}

  body.fake ? (0, _resetFakeBody.resetFakeBody)(body, docOverflow) : div.remove();

  return result;
}

},{"./childNode.remove":34,"./getBody":42,"./resetFakeBody":61,"./setFakeBody":63}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkStorageValue = checkStorageValue;
function checkStorageValue(value) {
  return ['true', 'false'].indexOf(value) >= 0 ? JSON.parse(value) : value;
}

},{}],34:[function(require,module,exports){
"use strict";

// ChildNode.remove
(function () {
  "use strict";

  if (!("remove" in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }
})();

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var classListSupport = exports.classListSupport = 'classList' in document.createElement('_');

},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStyleSheet = createStyleSheet;
// create and append style sheet
function createStyleSheet(media) {
  // Create the <style> tag
  var style = document.createElement("style");
  // style.setAttribute("type", "text/css");

  // Add a media (and/or media query) here if you'd like!
  // style.setAttribute("media", "screen")
  // style.setAttribute("media", "only screen and (max-width : 1024px)")
  if (media) {
    style.setAttribute("media", media);
  }

  // WebKit hack :(
  // style.appendChild(document.createTextNode(""));

  // Add the <style> element to the page
  document.querySelector('head').appendChild(style);

  return style.sheet ? style.sheet : style.styleSheet;
};

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var docElement = exports.docElement = document.documentElement;

},{}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Events = Events;
function Events() {
  return {
    topics: {},
    on: function on(eventName, fn) {
      this.topics[eventName] = this.topics[eventName] || [];
      this.topics[eventName].push(fn);
    },
    off: function off(eventName, fn) {
      if (this.topics[eventName]) {
        for (var i = 0; i < this.topics[eventName].length; i++) {
          if (this.topics[eventName][i] === fn) {
            this.topics[eventName].splice(i, 1);
            break;
          }
        }
      }
    },
    emit: function emit(eventName, data) {
      if (this.topics[eventName]) {
        this.topics[eventName].forEach(function (fn) {
          fn(data);
        });
      }
    }
  };
};

},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;
function extend() {
  var obj,
      name,
      copy,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length;

  for (; i < length; i++) {
    if ((obj = arguments[i]) !== null) {
      for (name in obj) {
        copy = obj[name];

        if (target === copy) {
          continue;
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
}

},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEachNodeList = forEachNodeList;
// https://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
function forEachNodeList(arr, callback, scope) {
  for (var i = 0, l = arr.length; i < l; i++) {
    callback.call(scope, arr[i], i);
  }
}

},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAttr = getAttr;
function getAttr(el, attr) {
  return el.getAttribute(attr);
}

},{}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBody = getBody;
function getBody() {
  var doc = document,
      body = doc.body;

  if (!body) {
    body = doc.createElement('body');
    body.fake = true;
  }

  return body;
}

},{}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCssRulesLength = getCssRulesLength;
function getCssRulesLength(sheet) {
  var rule = 'insertRule' in sheet ? sheet.cssRules : sheet.rules;
  return rule.length;
}

},{}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEndProperty = getEndProperty;
// get transitionend, animationend based on transitionDuration
// @propin: string
// @propOut: string, first-letter uppercase
// Usage: getEndProperty('WebkitTransitionDuration', 'Transition') => webkitTransitionEnd
function getEndProperty(propIn, propOut) {
  var endProp = false;
  if (/^Webkit/.test(propIn)) {
    endProp = 'webkit' + propOut + 'End';
  } else if (/^O/.test(propIn)) {
    endProp = 'o' + propOut + 'End';
  } else if (propIn) {
    endProp = propOut.toLowerCase() + 'end';
  }
  return endProp;
}

},{}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSlideId = getSlideId;
function getSlideId() {
  var id = window.tnsId;
  window.tnsId = !id ? 1 : id + 1;

  return 'tns' + window.tnsId;
}

},{}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTouchDirection = getTouchDirection;
function getTouchDirection(angle, range) {
  var direction = false,
      gap = Math.abs(90 - Math.abs(angle));

  if (gap >= 90 - range) {
    direction = 'horizontal';
  } else if (gap <= range) {
    direction = 'vertical';
  }

  return direction;
}

},{}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasAttr = hasAttr;
function hasAttr(el, attr) {
  return el.hasAttribute(attr);
}

},{}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasClass = exports.classListSupport = undefined;

var _classListSupport = require('./classListSupport');

var hasClass = _classListSupport.classListSupport ? function (el, str) {
    return el.classList.contains(str);
} : function (el, str) {
    return el.className.indexOf(str) >= 0;
};

exports.classListSupport = _classListSupport.classListSupport;
exports.hasClass = hasClass;

},{"./classListSupport":35}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideElement = hideElement;

var _hasAttr = require('./hasAttr');

var _setAttrs = require('./setAttrs');

function hideElement(el) {
  if (!(0, _hasAttr.hasAttr)(el, 'hidden')) {
    (0, _setAttrs.setAttrs)(el, { 'hidden': '' });
  }
}

},{"./hasAttr":47,"./setAttrs":62}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNodeList = isNodeList;
function isNodeList(el) {
  // Only NodeList has the "item()" function
  return typeof el.item !== "undefined";
}

},{}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isVisible = isVisible;
function isVisible(el) {
  return el.offsetWidth > 0 && el.offsetHeight > 0;
}

},{}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsTransform = jsTransform;
function jsTransform(element, attr, prefix, postfix, to, duration, callback) {
  var tick = Math.min(duration, 10),
      unit = to.indexOf('%') >= 0 ? '%' : 'px',
      to = to.replace(unit, ''),
      from = Number(element.style[attr].replace(prefix, '').replace(postfix, '').replace(unit, '')),
      positionTick = (to - from) / duration * tick,
      running;

  setTimeout(moveElement, tick);
  function moveElement() {
    duration -= tick;
    from += positionTick;
    element.style[attr] = prefix + from + unit + postfix;
    if (duration > 0) {
      setTimeout(moveElement, tick);
    } else {
      callback();
    }
  }
}

},{}],53:[function(require,module,exports){
"use strict";

// keys
if (!Object.keys) {
    Object.keys = function (object) {
        var keys = [];
        for (var name in object) {
            if (Object.prototype.hasOwnProperty.call(object, name)) {
                keys.push(name);
            }
        }
        return keys;
    };
}

},{}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaquerySupport = mediaquerySupport;

require('./childNode.remove');

var _getBody = require('./getBody');

var _setFakeBody = require('./setFakeBody');

var _resetFakeBody = require('./resetFakeBody');

function mediaquerySupport() {
  var doc = document,
      body = (0, _getBody.getBody)(),
      docOverflow = (0, _setFakeBody.setFakeBody)(body),
      div = doc.createElement('div'),
      style = doc.createElement('style'),
      rule = '@media all and (min-width:1px){.tns-mq-test{position:absolute}}',
      position;

  style.type = 'text/css';
  div.className = 'tns-mq-test';

  body.appendChild(style);
  body.appendChild(div);

  if (style.styleSheet) {
    style.styleSheet.cssText = rule;
  } else {
    style.appendChild(doc.createTextNode(rule));
  }

  position = window.getComputedStyle ? window.getComputedStyle(div).position : div.currentStyle['position'];

  body.fake ? (0, _resetFakeBody.resetFakeBody)(body, docOverflow) : div.remove();

  return position === "absolute";
}

},{"./childNode.remove":34,"./getBody":42,"./resetFakeBody":61,"./setFakeBody":63}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Test via a getter in the options object to see if the passive property is accessed
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      supportsPassive = true;
    }
  });
  window.addEventListener("test", null, opts);
} catch (e) {}
var passiveOption = exports.passiveOption = supportsPassive ? { passive: true } : false;

},{}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var win = window;

var raf = exports.raf = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function (cb) {
  return setTimeout(cb, 16);
};

},{}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAttrs = removeAttrs;

var _isNodeList = require("./isNodeList");

function removeAttrs(els, attrs) {
  els = (0, _isNodeList.isNodeList)(els) || els instanceof Array ? els : [els];
  attrs = attrs instanceof Array ? attrs : [attrs];

  var attrLength = attrs.length;
  for (var i = els.length; i--;) {
    for (var j = attrLength; j--;) {
      els[i].removeAttribute(attrs[j]);
    }
  }
}

},{"./isNodeList":50}],58:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeClass = undefined;

var _hasClass = require('./hasClass');

var removeClass = _hasClass.classListSupport ? function (el, str) {
  if ((0, _hasClass.hasClass)(el, str)) {
    el.classList.remove(str);
  }
} : function (el, str) {
  if ((0, _hasClass.hasClass)(el, str)) {
    el.className = el.className.replace(str, '');
  }
};

exports.removeClass = removeClass;

},{"./hasClass":48}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeElementStyles = removeElementStyles;
function removeElementStyles(el) {
  el.style.cssText = '';
}

},{}],60:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeEvents = removeEvents;

var _passiveOption = require('./passiveOption');

function removeEvents(el, obj) {
  for (var prop in obj) {
    var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 ? _passiveOption.passiveOption : false;
    el.removeEventListener(prop, obj[prop], option);
  }
}

},{"./passiveOption":55}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetFakeBody = resetFakeBody;

require('./childNode.remove');

var _docElement = require('./docElement');

function resetFakeBody(body, docOverflow) {
  if (body.fake) {
    body.remove();
    _docElement.docElement.style.overflow = docOverflow;
    // Trigger layout so kinetic scrolling isn't disabled in iOS6+
    // eslint-disable-next-line
    _docElement.docElement.offsetHeight;
  }
}

},{"./childNode.remove":34,"./docElement":37}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAttrs = setAttrs;

var _isNodeList = require("./isNodeList");

function setAttrs(els, attrs) {
  els = (0, _isNodeList.isNodeList)(els) || els instanceof Array ? els : [els];
  if (Object.prototype.toString.call(attrs) !== '[object Object]') {
    return;
  }

  for (var i = els.length; i--;) {
    for (var key in attrs) {
      els[i].setAttribute(key, attrs[key]);
    }
  }
}

},{"./isNodeList":50}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFakeBody = setFakeBody;

var _docElement = require('./docElement');

function setFakeBody(body) {
  var docOverflow = '';
  if (body.fake) {
    docOverflow = _docElement.docElement.style.overflow;
    //avoid crashing IE8, if background image is used
    body.style.background = '';
    //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
    body.style.overflow = _docElement.docElement.style.overflow = 'hidden';
    _docElement.docElement.appendChild(body);
  }

  return docOverflow;
}

},{"./docElement":37}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLocalStorage = setLocalStorage;
function setLocalStorage(key, value, access) {
  if (access) {
    localStorage.setItem(key, value);
  }
  return value;
}

},{}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showElement = showElement;

var _hasAttr = require('./hasAttr');

var _removeAttrs = require('./removeAttrs');

function showElement(el) {
  if ((0, _hasAttr.hasAttr)(el, 'hidden')) {
    (0, _removeAttrs.removeAttrs)(el, 'hidden');
  }
}

},{"./hasAttr":47,"./removeAttrs":57}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subpixelLayout = subpixelLayout;

require('./childNode.remove');

var _getBody = require('./getBody');

var _setFakeBody = require('./setFakeBody');

var _resetFakeBody = require('./resetFakeBody');

// get subpixel support value
// @return - boolean
function subpixelLayout() {
    var doc = document,
        body = (0, _getBody.getBody)(),
        docOverflow = (0, _setFakeBody.setFakeBody)(body),
        parent = doc.createElement('div'),
        child1 = doc.createElement('div'),
        child2,
        supported;

    parent.style.cssText = 'width: 10px';
    child1.style.cssText = 'float: left; width: 5.5px; height: 10px;';
    child2 = child1.cloneNode(true);

    parent.appendChild(child1);
    parent.appendChild(child2);
    body.appendChild(parent);

    supported = child1.offsetTop !== child2.offsetTop;

    body.fake ? (0, _resetFakeBody.resetFakeBody)(body, docOverflow) : parent.remove();

    return supported;
}

},{"./childNode.remove":34,"./getBody":42,"./resetFakeBody":61,"./setFakeBody":63}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDegree = toDegree;
function toDegree(y, x) {
  return Math.atan2(y, x) * (180 / Math.PI);
}

},{}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whichProperty = whichProperty;
function whichProperty(props) {
  var el = document.createElement('fakeelement'),
      len = props.length;
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    if (el.style[prop] !== undefined) {
      return prop;
    }
  }

  return false; // explicit for ie9-
}

},{}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tns = undefined;

require('./helpers/keys');

require('./helpers/childNode.remove');

var _raf = require('./helpers/raf');

var _caf = require('./helpers/caf');

var _extend = require('./helpers/extend');

var _checkStorageValue = require('./helpers/checkStorageValue');

var _setLocalStorage = require('./helpers/setLocalStorage');

var _getSlideId = require('./helpers/getSlideId');

var _calc = require('./helpers/calc');

var _subpixelLayout = require('./helpers/subpixelLayout');

var _mediaquerySupport = require('./helpers/mediaquerySupport');

var _createStyleSheet = require('./helpers/createStyleSheet');

var _addCSSRule = require('./helpers/addCSSRule');

var _getCssRulesLength = require('./helpers/getCssRulesLength');

var _toDegree = require('./helpers/toDegree');

var _getTouchDirection = require('./helpers/getTouchDirection');

var _forEachNodeList = require('./helpers/forEachNodeList');

var _hasClass = require('./helpers/hasClass');

var _addClass = require('./helpers/addClass');

var _removeClass = require('./helpers/removeClass');

var _hasAttr = require('./helpers/hasAttr');

var _getAttr = require('./helpers/getAttr');

var _setAttrs = require('./helpers/setAttrs');

var _removeAttrs = require('./helpers/removeAttrs');

var _removeElementStyles = require('./helpers/removeElementStyles');

var _arrayFromNodeList = require('./helpers/arrayFromNodeList');

var _hideElement = require('./helpers/hideElement');

var _showElement = require('./helpers/showElement');

var _isVisible = require('./helpers/isVisible');

var _whichProperty = require('./helpers/whichProperty');

var _getEndProperty = require('./helpers/getEndProperty');

var _addEvents = require('./helpers/addEvents');

var _removeEvents = require('./helpers/removeEvents');

var _events = require('./helpers/events');

var _jsTransform = require('./helpers/jsTransform');

// check browser version and local storage
// if browser upgraded, 
// 1. delete browser ralated data from local storage and 
// 2. recheck these options and save them to local storage
var browserInfo = navigator.userAgent,
    localStorageAccess = true,
    tnsStorage = {};

// tC => calc
// tSP => subpixel
// tMQ => mediaquery
// tTf => transform
// tTDu => transitionDuration
// tTDe => transitionDelay
// tADu => animationDuration
// tADe => animationDelay
// tTE => transitionEnd
// tAE => animationEnd
// Format: ES MODULE
// Version: 2.7.1

// helper functions
try {
  tnsStorage = localStorage;
  // remove storage when browser version changes
  if (tnsStorage['tnsApp'] && tnsStorage['tnsApp'] !== browserInfo) {
    ['tC', 'tSP', 'tMQ', 'tTf', 'tTDu', 'tTDe', 'tADu', 'tADe', 'tTE', 'tAE'].forEach(function (item) {
      tnsStorage.removeItem(item);
    });
  }
  // update browserInfo
  tnsStorage['tnsApp'] = browserInfo;
} catch (e) {
  localStorageAccess = false;
}

// reset tnsStorage when localStorage is null (on some versions of Chrome Mobile #134)
// https://stackoverflow.com/questions/8701015/html-localstorage-is-null-on-android-when-using-webview
if (localStorageAccess && !localStorage) {
  tnsStorage = {};
}

// get browser related data from local storage if they exist
// otherwise, run the functions again and save these data to local storage
// checkStorageValue() convert non-string value to its original value: 'true' > true
var doc = document,
    win = window,
    KEYS = {
  ENTER: 13,
  SPACE: 32,
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
},
    CALC = (0, _checkStorageValue.checkStorageValue)(tnsStorage['tC']) || (0, _setLocalStorage.setLocalStorage)('tC', (0, _calc.calc)(), localStorageAccess),
    SUBPIXEL = (0, _checkStorageValue.checkStorageValue)(tnsStorage['tSP']) || (0, _setLocalStorage.setLocalStorage)('tSP', (0, _subpixelLayout.subpixelLayout)(), localStorageAccess),
    CSSMQ = (0, _checkStorageValue.checkStorageValue)(tnsStorage['tMQ']) || (0, _setLocalStorage.setLocalStorage)('tMQ', (0, _mediaquerySupport.mediaquerySupport)(), localStorageAccess),
    TRANSFORM = (0, _checkStorageValue.checkStorageValue)(tnsStorage['tTf']) || (0, _setLocalStorage.setLocalStorage)('tTf', (0, _whichProperty.whichProperty)(['transform', 'WebkitTransform', 'MozTransform', 'msTransform', 'OTransform']), localStorageAccess),
    TRANSITIONDURATION = (0, _checkStorageValue.checkStorageValue)(tnsStorage['tTDu']) || (0, _setLocalStorage.setLocalStorage)('tTDu', (0, _whichProperty.whichProperty)(['transitionDuration', 'WebkitTransitionDuration', 'MozTransitionDuration', 'OTransitionDuration']), localStorageAccess),
    TRANSITIONDELAY = (0, _checkStorageValue.checkStorageValue)(tnsStorage['tTDe']) || (0, _setLocalStorage.setLocalStorage)('tTDe', (0, _whichProperty.whichProperty)(['transitionDelay', 'WebkitTransitionDelay', 'MozTransitionDelay', 'OTransitionDelay']), localStorageAccess),
    ANIMATIONDURATION = (0, _checkStorageValue.checkStorageValue)(tnsStorage['tADu']) || (0, _setLocalStorage.setLocalStorage)('tADu', (0, _whichProperty.whichProperty)(['animationDuration', 'WebkitAnimationDuration', 'MozAnimationDuration', 'OAnimationDuration']), localStorageAccess),
    ANIMATIONDELAY = (0, _checkStorageValue.checkStorageValue)(tnsStorage['tADe']) || (0, _setLocalStorage.setLocalStorage)('tADe', (0, _whichProperty.whichProperty)(['animationDelay', 'WebkitAnimationDelay', 'MozAnimationDelay', 'OAnimationDelay']), localStorageAccess),
    TRANSITIONEND = (0, _checkStorageValue.checkStorageValue)(tnsStorage['tTE']) || (0, _setLocalStorage.setLocalStorage)('tTE', (0, _getEndProperty.getEndProperty)(TRANSITIONDURATION, 'Transition'), localStorageAccess),
    ANIMATIONEND = (0, _checkStorageValue.checkStorageValue)(tnsStorage['tAE']) || (0, _setLocalStorage.setLocalStorage)('tAE', (0, _getEndProperty.getEndProperty)(ANIMATIONDURATION, 'Animation'), localStorageAccess);

// reset SUBPIXEL for IE8
if (!CSSMQ) {
  SUBPIXEL = false;
}

var tns = exports.tns = function tns(options) {
  options = (0, _extend.extend)({
    container: '.slider',
    mode: 'carousel',
    axis: 'horizontal',
    items: 1,
    gutter: 0,
    edgePadding: 0,
    fixedWidth: false,
    fixedWidthViewportWidth: false,
    slideBy: 1,
    controls: true,
    controlsText: ['prev', 'next'],
    controlsContainer: false,
    prevButton: false,
    nextButton: false,
    nav: true,
    navContainer: false,
    navAsThumbnails: false,
    arrowKeys: false,
    speed: 300,
    autoplay: false,
    autoplayTimeout: 5000,
    autoplayDirection: 'forward',
    autoplayText: ['start', 'stop'],
    autoplayHoverPause: false,
    autoplayButton: false,
    autoplayButtonOutput: true,
    autoplayResetOnVisibility: true,
    // animateIn: 'tns-fadeIn',
    // animateOut: 'tns-fadeOut',
    // animateNormal: 'tns-normal',
    // animateDelay: false,
    loop: true,
    rewind: false,
    autoHeight: false,
    responsive: false,
    lazyload: false,
    touch: true,
    mouseDrag: false,
    swipeAngle: 15,
    nested: false,
    freezable: true,
    // startIndex: 0,
    onInit: false
  }, options || {});

  // get element nodes from selectors
  var supportConsoleWarn = win.console && typeof win.console.warn === "function";
  var list = ['container', 'controlsContainer', 'prevButton', 'nextButton', 'navContainer', 'autoplayButton'];
  for (var i = list.length; i--;) {
    var item = list[i];
    if (typeof options[item] === 'string') {
      var el = doc.querySelector(options[item]);

      if (el && el.nodeName) {
        options[item] = el;
      } else {
        if (supportConsoleWarn) {
          console.warn('Can\'t find', options[item]);
        }
        return;
      }
    }
  }

  // make sure at least 1 slide
  if (options.container.children && options.container.children.length < 1) {
    if (supportConsoleWarn) {
      console.warn('No slides found in', options.container);
    }
    return;
  }

  // update responsive
  // from: { 
  //    300: 2, 
  //    800: {
  //      loop: false
  //    }
  // }
  // to: {
  //    300: { 
  //      items: 2 
  //    }, 
  //    800: {
  //      loop: false
  //    }
  // }
  if (options.responsive) {
    var resTem = {},
        res = options.responsive;
    for (var key in res) {
      var val = res[key];
      resTem[key] = typeof val === 'number' ? { items: val } : val;
    }

    options.responsive = resTem;
    resTem = null;

    // apply responsive[0] to options and remove it
    if (0 in options.responsive) {
      options = (0, _extend.extend)(options, options.responsive[0]);
      delete options.responsive[0];
    }
  }

  // === define and set variables ===
  var carousel = options.mode === 'carousel' ? true : false;

  if (!carousel) {
    options.axis = 'horizontal';
    options.rewind = false;
    // options.loop = true;
    options.edgePadding = false;

    var animateIn = 'tns-fadeIn',
        animateOut = 'tns-fadeOut',
        animateDelay = false,
        animateNormal = options.animateNormal || 'tns-normal';

    if (TRANSITIONEND && ANIMATIONEND) {
      animateIn = options.animateIn || animateIn;
      animateOut = options.animateOut || animateOut;
      animateDelay = options.animateDelay || animateDelay;
    }
  }

  var horizontal = options.axis === 'horizontal' ? true : false,
      outerWrapper = doc.createElement('div'),
      innerWrapper = doc.createElement('div'),
      container = options.container,
      containerParent = container.parentNode,
      slideItems = container.children,
      slideCount = slideItems.length,
      vpInner,
      responsive = options.responsive,
      responsiveItems = [],
      breakpoints = false,
      breakpointZone = 0,
      windowWidth = getWindowWidth(),
      isOn;

  if (options.fixedWidth) {
    var vpOuter = getViewportWidth(containerParent);
  }

  if (responsive) {
    breakpoints = Object.keys(responsive).map(function (x) {
      return parseInt(x);
    }).sort(function (a, b) {
      return a - b;
    });

    // get all responsive items
    breakpoints.forEach(function (bp) {
      responsiveItems = responsiveItems.concat(Object.keys(responsive[bp]));
    });

    // remove duplicated items
    var arr = [];
    responsiveItems.forEach(function (item) {
      if (arr.indexOf(item) < 0) {
        arr.push(item);
      }
    });
    responsiveItems = arr;

    setBreakpointZone();
  }

  var items = getOption('items'),
      slideBy = getOption('slideBy') === 'page' ? items : getOption('slideBy'),
      nested = options.nested,
      gutter = getOption('gutter'),
      edgePadding = getOption('edgePadding'),
      fixedWidth = getOption('fixedWidth'),
      fixedWidthViewportWidth = options.fixedWidthViewportWidth,
      arrowKeys = getOption('arrowKeys'),
      speed = getOption('speed'),
      rewind = options.rewind,
      loop = rewind ? false : options.loop,
      autoHeight = getOption('autoHeight'),
      sheet = (0, _createStyleSheet.createStyleSheet)(),
      lazyload = options.lazyload,
      slideOffsetTops,
      // collection of slide offset tops
  slideItemsOut = [],
      hasEdgePadding = checkOption('edgePadding'),
      cloneCount = loop ? getCloneCountForLoop() : 0,
      slideCountNew = !carousel ? slideCount + cloneCount : slideCount + cloneCount * 2,
      hasRightDeadZone = fixedWidth && !loop && !edgePadding ? true : false,
      updateIndexBeforeTransform = !carousel || !loop ? true : false,

  // transform
  transformAttr = horizontal ? 'left' : 'top',
      transformPrefix = '',
      transformPostfix = '',

  // index
  startIndex = getOption('startIndex'),
      index = startIndex ? updateStartIndex(startIndex) : !carousel ? 0 : cloneCount,
      indexCached = index,
      indexMin = 0,
      indexMax = getIndexMax(),

  // resize
  resizeTimer,
      swipeAngle = options.swipeAngle,
      moveDirectionExpected = swipeAngle ? '?' : true,
      running = false,
      onInit = options.onInit,
      events = new _events.Events(),

  // id, class
  containerIdCached = container.id,
      classContainer = ' tns-slider tns-' + options.mode,
      slideId = container.id || (0, _getSlideId.getSlideId)(),
      disable = getOption('disable'),
      freezable = options.freezable,
      freeze = disable ? true : freezable ? slideCount <= items : false,
      frozen,
      importantStr = nested === 'inner' ? ' !important' : '',
      controlsEvents = {
    'click': onControlsClick,
    'keydown': onControlsKeydown
  },
      navEvents = {
    'click': onNavClick,
    'keydown': onNavKeydown
  },
      hoverEvents = {
    'mouseover': mouseoverPause,
    'mouseout': mouseoutRestart
  },
      visibilityEvent = { 'visibilitychange': onVisibilityChange },
      docmentKeydownEvent = { 'keydown': onDocumentKeydown },
      touchEvents = {
    'touchstart': onPanStart,
    'touchmove': onPanMove,
    'touchend': onPanEnd,
    'touchcancel': onPanEnd
  },
      dragEvents = {
    'mousedown': onPanStart,
    'mousemove': onPanMove,
    'mouseup': onPanEnd,
    'mouseleave': onPanEnd
  },
      hasControls = checkOption('controls'),
      hasNav = checkOption('nav'),
      navAsThumbnails = options.navAsThumbnails,
      hasAutoplay = checkOption('autoplay'),
      hasTouch = checkOption('touch'),
      hasMouseDrag = checkOption('mouseDrag'),
      slideActiveClass = 'tns-slide-active',
      imgCompleteClass = 'tns-complete',
      imgEvents = {
    'load': imgLoadedOrError,
    'error': imgLoadedOrError
  },
      imgsComplete;

  // controls
  if (hasControls) {
    var controls = getOption('controls'),
        controlsText = getOption('controlsText'),
        controlsContainer = options.controlsContainer,
        prevButton = options.prevButton,
        nextButton = options.nextButton,
        prevIsButton,
        nextIsButton;
  }

  // nav
  if (hasNav) {
    var nav = getOption('nav'),
        navContainer = options.navContainer,
        navItems,
        visibleNavIndexes = [],
        visibleNavIndexesCached = visibleNavIndexes,
        navClicked = -1,
        navCurrentIndex = getAbsIndex(),
        navCurrentIndexCached = navCurrentIndex,
        navActiveClass = 'tns-nav-active';
  }

  // autoplay
  if (hasAutoplay) {
    var autoplay = getOption('autoplay'),
        autoplayTimeout = getOption('autoplayTimeout'),
        autoplayDirection = options.autoplayDirection === 'forward' ? 1 : -1,
        autoplayText = getOption('autoplayText'),
        autoplayHoverPause = getOption('autoplayHoverPause'),
        autoplayButton = options.autoplayButton,
        autoplayResetOnVisibility = getOption('autoplayResetOnVisibility'),
        autoplayHtmlStrings = ['<span class=\'tns-visually-hidden\'>', ' animation</span>'],
        autoplayTimer,
        animating,
        autoplayHoverPaused,
        autoplayUserPaused,
        autoplayVisibilityPaused;
  }

  if (hasTouch || hasMouseDrag) {
    var initPosition = {},
        lastPosition = {},
        translateInit,
        disX,
        disY,
        panStart = false,
        rafIndex = 0,
        getDist = horizontal ? function (a, b) {
      return a.x - b.x;
    } : function (a, b) {
      return a.y - b.y;
    };
  }

  // touch
  if (hasTouch) {
    var touch = getOption('touch');
  }

  // mouse drag
  if (hasMouseDrag) {
    var mouseDrag = getOption('mouseDrag');
  }

  // disable slider when slidecount <= items
  if (freeze) {
    controls = nav = touch = mouseDrag = arrowKeys = autoplay = autoplayHoverPause = autoplayResetOnVisibility = false;
  }

  if (TRANSFORM) {
    transformAttr = TRANSFORM;
    transformPrefix = 'translate';
    transformPrefix += horizontal ? 'X(' : 'Y(';
    transformPostfix = ')';
  }

  // === COMMON FUNCTIONS === //
  function getIndexMax() {
    return carousel ? slideCountNew - items : loop ? slideCount - slideCount % items : slideCountNew - 1;
  }

  function updateStartIndex(indexTem) {
    indexTem = indexTem % slideCount;
    if (indexTem < 0) {
      indexTem += slideCount;
    }
    indexTem = Math.min(indexTem, slideCountNew - items);
    return indexTem;
  }

  function getAbsIndex(i) {
    if (i === undefined) {
      i = index;
    }
    while (i < cloneCount) {
      i += slideCount;
    }
    return (i - cloneCount) % slideCount;
  }

  function getItemsMax() {
    if (fixedWidth && !fixedWidthViewportWidth) {
      return slideCount - 1;
    } else {
      var str = fixedWidth ? 'fixedWidth' : 'items',
          isFW = fixedWidth,
          arr = [];

      if (isFW || options[str] < slideCount) {
        arr.push(options[str]);
      }

      if (breakpoints && responsiveItems.indexOf(str) >= 0) {
        breakpoints.forEach(function (bp) {
          var tem = responsive[bp][str];
          if (tem && (isFW || tem < slideCount)) {
            arr.push(tem);
          }
        });
      }

      if (!arr.length) {
        arr.push(0);
      }

      return isFW ? Math.ceil(fixedWidthViewportWidth / Math.min.apply(null, arr)) : Math.max.apply(null, arr);
    }
  }

  function getCloneCountForLoop() {
    var itemsMax = getItemsMax(),
        result = carousel ? Math.ceil((itemsMax * 5 - slideCount) / 2) : itemsMax * 3 - slideCount;
    result = Math.max(itemsMax, result);

    return hasEdgePadding ? result + 1 : result;
  }

  function getWindowWidth() {
    return win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
  }

  function getViewportWidth(el) {
    return el.clientWidth || getViewportWidth(el.parentNode);
  }

  function checkOption(item) {
    var result = options[item];
    if (!result && breakpoints && responsiveItems.indexOf(item) >= 0) {
      breakpoints.forEach(function (bp) {
        if (responsive[bp][item]) {
          result = true;
        }
      });
    }
    return result;
  }

  function getOption(item, viewport) {
    viewport = viewport ? viewport : windowWidth;

    var obj = {
      slideBy: 'page',
      edgePadding: false
    },
        result;

    if (!carousel && item in obj) {
      result = obj[item];
    } else {
      if (item === 'items' && getOption('fixedWidth')) {
        result = Math.floor(vpOuter / (getOption('fixedWidth') + getOption('gutter')));
      } else if (item === 'autoHeight' && nested === 'outer') {
        result = true;
      } else {
        result = options[item];

        if (breakpoints && responsiveItems.indexOf(item) >= 0) {
          for (var i = 0, len = breakpoints.length; i < len; i++) {
            var bp = breakpoints[i];
            if (viewport >= bp) {
              if (item in responsive[bp]) {
                result = responsive[bp][item];
              }
            } else {
              break;
            }
          }
        }
      }
    }

    if (item === 'slideBy' && result === 'page') {
      result = getOption('items');
    }

    return result;
  }

  function getSlideMarginLeft(i) {
    var str = CALC ? CALC + '(' + i * 100 + '% / ' + slideCountNew + ')' : i * 100 / slideCountNew + '%';
    return str;
  }

  function getInnerWrapperStyles(edgePaddingTem, gutterTem, fixedWidthTem, speedTem) {
    var str = '';

    if (edgePaddingTem) {
      var gap = edgePaddingTem;
      if (gutterTem) {
        gap += gutterTem;
      }
      if (fixedWidthTem) {
        str = 'margin: 0px ' + (vpOuter % (fixedWidthTem + gutterTem) + gutterTem) / 2 + 'px';
      } else {
        str = horizontal ? 'margin: 0 ' + edgePaddingTem + 'px 0 ' + gap + 'px;' : 'padding: ' + gap + 'px 0 ' + edgePaddingTem + 'px 0;';
      }
    } else if (gutterTem && !fixedWidthTem) {
      var gutterTemUnit = '-' + gutterTem + 'px',
          dir = horizontal ? gutterTemUnit + ' 0 0' : '0 ' + gutterTemUnit + ' 0';
      str = 'margin: 0 ' + dir + ';';
    }

    if (TRANSITIONDURATION && speedTem) {
      str += getTrsnsitionDurationStyle(speedTem);
    }

    return str;
  }

  function getContainerWidth(fixedWidthTem, gutterTem, itemsTem) {
    var str;

    if (fixedWidthTem) {
      str = (fixedWidthTem + gutterTem) * slideCountNew + 'px';
    } else {
      str = CALC ? CALC + '(' + slideCountNew * 100 + '% / ' + itemsTem + ')' : slideCountNew * 100 / itemsTem + '%';
    }

    return str;
  }

  function getSlideWidthStyle(fixedWidthTem, gutterTem, itemsTem) {
    var str = '';

    if (horizontal) {
      str = 'width:';
      if (fixedWidthTem) {
        str += fixedWidthTem + gutterTem + 'px';
      } else {
        var dividend = carousel ? slideCountNew : itemsTem;
        str += CALC ? CALC + '(100% / ' + dividend + ')' : 100 / dividend + '%';
      }
      str += importantStr + ';';
    }

    return str;
  }

  function getSlideGutterStyle(gutterTem) {
    var str = '';

    // gutter maybe interger || 0
    // so can't use 'if (gutter)'
    if (gutterTem !== false) {
      var prop = horizontal ? 'padding-' : 'margin-',
          dir = horizontal ? 'right' : 'bottom';
      str = prop + dir + ': ' + gutterTem + 'px;';
    }

    return str;
  }

  function getCSSPrefix(name, num) {
    var prefix = name.substring(0, name.length - num).toLowerCase();
    if (prefix) {
      prefix = '-' + prefix + '-';
    }

    return prefix;
  }

  function getTrsnsitionDurationStyle(speed) {
    return getCSSPrefix(TRANSITIONDURATION, 18) + 'transition-duration:' + speed / 1000 + 's;';
  }

  function getAnimationDurationStyle(speed) {
    return getCSSPrefix(ANIMATIONDURATION, 17) + 'animation-duration:' + speed / 1000 + 's;';
  }

  (function sliderInit() {
    // First thing first, wrap container with 'outerWrapper > innerWrapper',
    // to get the correct view width
    outerWrapper.appendChild(innerWrapper);
    containerParent.insertBefore(outerWrapper, container);
    innerWrapper.appendChild(container);
    vpInner = getViewportWidth(innerWrapper);

    var classOuter = 'tns-outer',
        classInner = 'tns-inner',
        hasGutter = checkOption('gutter');

    if (carousel) {
      if (horizontal) {
        if (checkOption('edgePadding') || hasGutter && !options.fixedWidth) {
          classOuter += ' tns-ovh';
        } else {
          classInner += ' tns-ovh';
        }
      } else {
        classInner += ' tns-ovh';
      }
    } else if (hasGutter) {
      classOuter += ' tns-ovh';
    }

    outerWrapper.className = classOuter;
    innerWrapper.className = classInner;
    innerWrapper.id = slideId + '-iw';
    if (autoHeight) {
      innerWrapper.className += ' tns-ah';
      innerWrapper.style[TRANSITIONDURATION] = speed / 1000 + 's';
    }

    // set container properties
    if (container.id === '') {
      container.id = slideId;
    }
    classContainer += SUBPIXEL ? ' tns-subpixel' : ' tns-no-subpixel';
    classContainer += CALC ? ' tns-calc' : ' tns-no-calc';
    if (carousel) {
      classContainer += ' tns-' + options.axis;
    }
    container.className += classContainer;
    // add event
    if (carousel && TRANSITIONEND) {
      var eve = {};
      eve[TRANSITIONEND] = onTransitionEnd;
      (0, _addEvents.addEvents)(container, eve);
    }

    // delete datas after init
    classOuter = classInner = null;

    // add id, class, aria attributes 
    // before clone slides
    for (var x = 0; x < slideCount; x++) {
      var item = slideItems[x];
      if (!item.id) {
        item.id = slideId + '-item' + x;
      }
      (0, _addClass.addClass)(item, 'tns-item');
      if (!carousel && animateNormal) {
        (0, _addClass.addClass)(item, animateNormal);
      }
      (0, _setAttrs.setAttrs)(item, {
        'aria-hidden': 'true',
        'tabindex': '-1'
      });
    }

    // clone slides
    if (loop || edgePadding) {
      var fragmentBefore = doc.createDocumentFragment(),
          fragmentAfter = doc.createDocumentFragment();

      for (var j = cloneCount; j--;) {
        var num = j % slideCount,
            cloneFirst = slideItems[num].cloneNode(true);
        (0, _removeAttrs.removeAttrs)(cloneFirst, 'id');
        fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild);

        if (carousel) {
          var cloneLast = slideItems[slideCount - 1 - num].cloneNode(true);
          (0, _removeAttrs.removeAttrs)(cloneLast, 'id');
          fragmentBefore.appendChild(cloneLast);
        }
      }

      container.insertBefore(fragmentBefore, container.firstChild);
      container.appendChild(fragmentAfter);
      slideItems = container.children;
    }

    // add image events
    if (checkOption('autoHeight') || !carousel) {
      var imgs = container.querySelectorAll('img');

      // check all image complete status
      // add complete class if true
      (0, _forEachNodeList.forEachNodeList)(imgs, function (img) {
        (0, _addEvents.addEvents)(img, imgEvents);

        var src = img.src;
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
      });

      // set imgsComplete to true 
      // when all images are compulete (loaded or error)
      (0, _raf.raf)(function () {
        checkImagesLoaded((0, _arrayFromNodeList.arrayFromNodeList)(imgs), function () {
          imgsComplete = true;
        });
      });
    }

    // activate visible slides
    // add aria attrs
    // set animation classes and left value for gallery slider
    // use slide count when slides are fewer than items
    for (var i = index, l = index + Math.min(slideCount, items); i < l; i++) {
      var item = slideItems[i];
      (0, _setAttrs.setAttrs)(item, { 'aria-hidden': 'false' });
      (0, _removeAttrs.removeAttrs)(item, ['tabindex']);
      (0, _addClass.addClass)(item, slideActiveClass);

      if (!carousel) {
        item.style.left = (i - index) * 100 / items + '%';
        (0, _addClass.addClass)(item, animateIn);
        (0, _removeClass.removeClass)(item, animateNormal);
      }
    }

    if (carousel && horizontal) {
      // set font-size rules
      // for modern browsers
      if (SUBPIXEL) {
        // set slides font-size first
        (0, _addCSSRule.addCSSRule)(sheet, '#' + slideId + ' > .tns-item', 'font-size:' + win.getComputedStyle(slideItems[0]).fontSize + ';', (0, _getCssRulesLength.getCssRulesLength)(sheet));
        (0, _addCSSRule.addCSSRule)(sheet, '#' + slideId, 'font-size:0;', (0, _getCssRulesLength.getCssRulesLength)(sheet));

        // slide left margin
        // for IE8 & webkit browsers (no subpixel)
      } else {
        (0, _forEachNodeList.forEachNodeList)(slideItems, function (slide, i) {
          slide.style.marginLeft = getSlideMarginLeft(i);
        });
      }
    }

    // all browsers which support CSS transitions support CSS media queries
    if (CSSMQ) {
      // inner wrapper styles
      var str = getInnerWrapperStyles(options.edgePadding, options.gutter, options.fixedWidth, options.speed);
      (0, _addCSSRule.addCSSRule)(sheet, '#' + slideId + '-iw', str, (0, _getCssRulesLength.getCssRulesLength)(sheet));

      // container styles
      if (carousel) {
        str = horizontal ? 'width:' + getContainerWidth(options.fixedWidth, options.gutter, options.items) + ';' : '';
        if (TRANSITIONDURATION) {
          str += getTrsnsitionDurationStyle(speed);
        }
        (0, _addCSSRule.addCSSRule)(sheet, '#' + slideId, str, (0, _getCssRulesLength.getCssRulesLength)(sheet));
      }

      // slide styles
      if (horizontal || options.gutter) {
        str = getSlideWidthStyle(options.fixedWidth, options.gutter, options.items) + getSlideGutterStyle(options.gutter);
        // set gallery items transition-duration
        if (!carousel) {
          if (TRANSITIONDURATION) {
            str += getTrsnsitionDurationStyle(speed);
          }
          if (ANIMATIONDURATION) {
            str += getAnimationDurationStyle(speed);
          }
        }
        (0, _addCSSRule.addCSSRule)(sheet, '#' + slideId + ' > .tns-item', str, (0, _getCssRulesLength.getCssRulesLength)(sheet));
      }

      // non CSS mediaqueries: IE8
      // ## update inner wrapper, container, slides if needed
      // set inline styles for inner wrapper & container
      // insert stylesheet (one line) for slides only (since slides are many)
    } else {
      // inner wrapper styles
      innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth);

      // container styles
      if (carousel && horizontal) {
        container.style.width = getContainerWidth(fixedWidth, gutter, items);
      }

      // slide styles
      if (horizontal || gutter) {
        var str = getSlideWidthStyle(fixedWidth, gutter, items) + getSlideGutterStyle(gutter);
        // append to the last line
        (0, _addCSSRule.addCSSRule)(sheet, '#' + slideId + ' > .tns-item', str, (0, _getCssRulesLength.getCssRulesLength)(sheet));
      }
    }

    if (!horizontal && !disable) {
      getSlideOffsetTops();
      updateContentWrapperHeight();
    }

    // media queries
    if (responsive && CSSMQ) {
      breakpoints.forEach(function (bp) {
        var opts = responsive[bp],
            str = '',
            innerWrapperStr = '',
            containerStr = '',
            slideStr = '',
            itemsBP = getOption('items', bp),
            fixedWidthBP = getOption('fixedWidth', bp),
            speedBP = getOption('speed', bp),
            edgePaddingBP = getOption('edgePadding', bp),
            gutterBP = getOption('gutter', bp);

        // inner wrapper string
        if ('edgePadding' in opts || 'gutter' in opts) {
          innerWrapperStr = '#' + slideId + '-iw{' + getInnerWrapperStyles(edgePaddingBP, gutterBP, fixedWidthBP, speedBP) + '}';
        }

        // container string
        if (carousel && horizontal && ('fixedWidth' in opts || 'gutter' in opts || 'items' in opts)) {
          containerStr = 'width:' + getContainerWidth(fixedWidthBP, gutterBP, itemsBP) + ';';
        }
        if (TRANSITIONDURATION && 'speed' in opts) {
          containerStr += getTrsnsitionDurationStyle(speedBP);
        }
        if (containerStr) {
          containerStr = '#' + slideId + '{' + containerStr + '}';
        }

        // slide string
        if ('fixedWidth' in opts || checkOption('fixedWidth') && 'gutter' in opts || !carousel && 'items' in opts) {
          slideStr += getSlideWidthStyle(fixedWidthBP, gutterBP, itemsBP);
        }
        if ('gutter' in opts) {
          slideStr += getSlideGutterStyle(gutterBP);
        }
        // set gallery items transition-duration
        if (!carousel && 'speed' in opts) {
          if (TRANSITIONDURATION) {
            slideStr += getTrsnsitionDurationStyle(speedBP);
          }
          if (ANIMATIONDURATION) {
            slideStr += getAnimationDurationStyle(speedBP);
          }
        }
        if (slideStr) {
          slideStr = '#' + slideId + ' > .tns-item{' + slideStr + '}';
        }

        // add up
        str = innerWrapperStr + containerStr + slideStr;

        if (str) {
          sheet.insertRule('@media (min-width: ' + bp / 16 + 'em) {' + str + '}', sheet.cssRules.length);
        }
      });
    }

    // set container transform property
    if (carousel && !disable) {
      doContainerTransformSilent();
    }

    // == msInit ==
    // for IE10
    if (navigator.msMaxTouchPoints) {
      (0, _addClass.addClass)(outerWrapper, 'ms-touch');
      (0, _addEvents.addEvents)(outerWrapper, { 'scroll': ie10Scroll });
      setSnapInterval();
    }

    // == navInit ==
    if (hasNav) {
      var initIndex = !carousel ? 0 : cloneCount;
      // customized nav
      // will not hide the navs in case they're thumbnails
      if (navContainer) {
        (0, _setAttrs.setAttrs)(navContainer, { 'aria-label': 'Carousel Pagination' });
        navItems = navContainer.children;
        (0, _forEachNodeList.forEachNodeList)(navItems, function (item, i) {
          (0, _setAttrs.setAttrs)(item, {
            'data-nav': i,
            'tabindex': '-1',
            'aria-selected': 'false',
            'aria-controls': slideItems[initIndex + i].id
          });
        });

        // generated nav 
      } else {
        var navHtml = '',
            hiddenStr = navAsThumbnails ? '' : 'hidden';
        for (var i = 0; i < slideCount; i++) {
          // hide nav items by default
          navHtml += '<button data-nav="' + i + '" tabindex="-1" aria-selected="false" aria-controls="' + slideItems[initIndex + i].id + '" ' + hiddenStr + ' type="button"></button>';
        }
        navHtml = '<div class="tns-nav" aria-label="Carousel Pagination">' + navHtml + '</div>';
        outerWrapper.insertAdjacentHTML('afterbegin', navHtml);

        navContainer = outerWrapper.querySelector('.tns-nav');
        navItems = navContainer.children;
      }

      updateNavVisibility();

      // add transition
      if (TRANSITIONDURATION) {
        var prefix = TRANSITIONDURATION.substring(0, TRANSITIONDURATION.length - 18).toLowerCase(),
            str = 'transition: all ' + speed / 1000 + 's';

        if (prefix) {
          str = '-' + prefix + '-' + str;
        }

        (0, _addCSSRule.addCSSRule)(sheet, '[aria-controls^=' + slideId + '-item]', str, (0, _getCssRulesLength.getCssRulesLength)(sheet));
      }

      (0, _setAttrs.setAttrs)(navItems[navCurrentIndex], { 'tabindex': '0', 'aria-selected': 'true' });
      (0, _addClass.addClass)(navItems[navCurrentIndex], navActiveClass);

      // add events
      (0, _addEvents.addEvents)(navContainer, navEvents);

      if (!nav) {
        (0, _hideElement.hideElement)(navContainer);
      }
    }

    // == autoplayInit ==
    if (hasAutoplay) {
      var txt = autoplay ? 'stop' : 'start';
      if (autoplayButton) {
        (0, _setAttrs.setAttrs)(autoplayButton, { 'data-action': txt });
      } else if (options.autoplayButtonOutput) {
        innerWrapper.insertAdjacentHTML('beforebegin', '<button data-action="' + txt + '" type="button">' + autoplayHtmlStrings[0] + txt + autoplayHtmlStrings[1] + autoplayText[0] + '</button>');
        autoplayButton = outerWrapper.querySelector('[data-action]');
      }

      // add event
      if (autoplayButton) {
        (0, _addEvents.addEvents)(autoplayButton, { 'click': toggleAutoplay });
      }

      if (!autoplay) {
        if (autoplayButton) {
          (0, _hideElement.hideElement)(autoplayButton);
        }
      } else {
        startAutoplay();
        if (autoplayHoverPause) {
          (0, _addEvents.addEvents)(container, hoverEvents);
        }
        if (autoplayResetOnVisibility) {
          (0, _addEvents.addEvents)(container, visibilityEvent);
        }
      }
    }

    // == controlsInit ==
    if (hasControls) {
      if (controlsContainer || prevButton && nextButton) {
        if (controlsContainer) {
          prevButton = controlsContainer.children[0];
          nextButton = controlsContainer.children[1];
          (0, _setAttrs.setAttrs)(controlsContainer, {
            'aria-label': 'Carousel Navigation',
            'tabindex': '0'
          });
          (0, _setAttrs.setAttrs)(controlsContainer.children, {
            'aria-controls': slideId,
            'tabindex': '-1'
          });
        }

        (0, _setAttrs.setAttrs)(prevButton, { 'data-controls': 'prev' });
        (0, _setAttrs.setAttrs)(nextButton, { 'data-controls': 'next' });
      } else {
        outerWrapper.insertAdjacentHTML('afterbegin', '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button data-controls="prev" tabindex="-1" aria-controls="' + slideId + '" type="button">' + controlsText[0] + '</button><button data-controls="next" tabindex="-1" aria-controls="' + slideId + '" type="button">' + controlsText[1] + '</button></div>');

        controlsContainer = outerWrapper.querySelector('.tns-controls');
        prevButton = controlsContainer.children[0];
        nextButton = controlsContainer.children[1];
      }

      prevIsButton = isButton(prevButton);
      nextIsButton = isButton(nextButton);

      updateControlsStatus();

      // add events
      if (controlsContainer) {
        (0, _addEvents.addEvents)(controlsContainer, controlsEvents);
      } else {
        (0, _addEvents.addEvents)(prevButton, controlsEvents);
        (0, _addEvents.addEvents)(nextButton, controlsEvents);
      }

      if (!controls) {
        (0, _hideElement.hideElement)(controlsContainer);
      }
    }

    if (carousel && touch) {
      (0, _addEvents.addEvents)(container, touchEvents);
    }
    if (carousel && mouseDrag) {
      (0, _addEvents.addEvents)(container, dragEvents);
    }
    if (arrowKeys) {
      (0, _addEvents.addEvents)(doc, docmentKeydownEvent);
    }

    if (nested === 'inner') {
      events.on('outerResized', function () {
        resizeTasks();
        events.emit('innerLoaded', info());
      });
    } else {
      (0, _addEvents.addEvents)(win, { 'resize': onResize });
    }

    if (nested === 'outer') {
      events.on('innerLoaded', runAutoHeight);
    } else if ((autoHeight || !carousel) && !disable) {
      runAutoHeight();
    }

    lazyLoad();
    toggleSlideDisplayAndEdgePadding();
    updateFixedWidthInnerWrapperStyle();

    events.on('indexChanged', additionalUpdates);

    if (typeof onInit === 'function') {
      onInit(info());
    }
    if (nested === 'inner') {
      events.emit('innerLoaded', info());
    }

    if (disable) {
      disableSlider(true);
    }

    isOn = true;
  })();

  // === ON RESIZE ===
  function onResize(e) {
    (0, _raf.raf)(function () {
      resizeTasks(getEvent(e));
    });
  }

  function resizeTasks(e) {
    if (!isOn) {
      return;
    }

    windowWidth = getWindowWidth();
    if (nested === 'outer') {
      events.emit('outerResized', info(e));
    }

    var breakpointZoneTem = breakpointZone,
        indexTem = index,
        itemsTem = items,
        freezeTem = freeze,
        needContainerTransform = false;

    if (fixedWidth) {
      vpOuter = getViewportWidth(outerWrapper);
    }
    vpInner = getViewportWidth(innerWrapper);
    if (breakpoints) {
      setBreakpointZone();
    }

    // things do when breakpoint zone change
    if (breakpointZoneTem !== breakpointZone || fixedWidth) {
      var slideByTem = slideBy,
          arrowKeysTem = arrowKeys,
          autoHeightTem = autoHeight,
          fixedWidthTem = fixedWidth,
          edgePaddingTem = edgePadding,
          gutterTem = gutter,
          disableTem = disable;

      // update variables
      items = getOption('items');
      slideBy = getOption('slideBy');
      disable = getOption('disable');
      freeze = disable ? true : freezable ? slideCount <= items : false;

      if (items !== itemsTem) {
        indexMax = getIndexMax();
        // check index before transform in case
        // slider reach the right edge then items become bigger
        updateIndex();
      }

      if (disable !== disableTem) {
        disableSlider(disable);
      }

      if (freeze !== freezeTem) {
        // reset index to initial status
        if (freeze) {
          index = !carousel ? 0 : cloneCount;
        }

        toggleSlideDisplayAndEdgePadding();
      }

      if (breakpointZoneTem !== breakpointZone) {
        speed = getOption('speed');
        edgePadding = getOption('edgePadding');
        gutter = getOption('gutter');

        fixedWidth = getOption('fixedWidth');
        if (!disable && fixedWidth !== fixedWidthTem) {
          needContainerTransform = true;
        }

        autoHeight = getOption('autoHeight');
        if (autoHeight !== autoHeightTem) {
          if (!autoHeight) {
            innerWrapper.style.height = '';
          }
        }
      }

      arrowKeys = freeze ? false : getOption('arrowKeys');
      if (arrowKeys !== arrowKeysTem) {
        arrowKeys ? (0, _addEvents.addEvents)(doc, docmentKeydownEvent) : (0, _removeEvents.removeEvents)(doc, docmentKeydownEvent);
      }

      if (hasControls) {
        var controlsTem = controls,
            controlsTextTem = controlsText;
        controls = freeze ? false : getOption('controls');
        controlsText = getOption('controlsText');

        if (controls !== controlsTem) {
          controls ? (0, _showElement.showElement)(controlsContainer) : (0, _hideElement.hideElement)(controlsContainer);
        }
        if (controlsText !== controlsTextTem) {
          prevButton.innerHTML = controlsText[0];
          nextButton.innerHTML = controlsText[1];
        }
      }
      if (hasNav) {
        var navTem = nav;
        nav = freeze ? false : getOption('nav');

        if (nav !== navTem) {
          if (nav) {
            (0, _showElement.showElement)(navContainer);
            updateNavVisibility();
          } else {
            (0, _hideElement.hideElement)(navContainer);
          }
        }
      }
      if (hasTouch) {
        var touchTem = touch;
        touch = freeze ? false : getOption('touch');

        if (touch !== touchTem && carousel) {
          touch ? (0, _addEvents.addEvents)(container, touchEvents) : (0, _removeEvents.removeEvents)(container, touchEvents);
        }
      }
      if (hasMouseDrag) {
        var mouseDragTem = mouseDrag;
        mouseDrag = freeze ? false : getOption('mouseDrag');

        if (mouseDrag !== mouseDragTem && carousel) {
          mouseDrag ? (0, _addEvents.addEvents)(container, dragEvents) : (0, _removeEvents.removeEvents)(container, dragEvents);
        }
      }
      if (hasAutoplay) {
        var autoplayTem = autoplay,
            autoplayHoverPauseTem = autoplayHoverPause,
            autoplayResetOnVisibilityTem = autoplayResetOnVisibility,
            autoplayTextTem = autoplayText;

        if (freeze) {
          autoplay = autoplayHoverPause = autoplayResetOnVisibility = false;
        } else {
          autoplay = getOption('autoplay');

          if (autoplay) {
            autoplayHoverPause = getOption('autoplayHoverPause');
            autoplayResetOnVisibility = getOption('autoplayResetOnVisibility');
          } else {
            autoplayHoverPause = autoplayResetOnVisibility = false;
          }
        }
        autoplayText = getOption('autoplayText');
        autoplayTimeout = getOption('autoplayTimeout');

        if (autoplay !== autoplayTem) {
          if (autoplay) {
            if (autoplayButton) {
              (0, _showElement.showElement)(autoplayButton);
            }
            if (!animating && !autoplayUserPaused) {
              startAutoplay();
            }
          } else {
            if (autoplayButton) {
              (0, _hideElement.hideElement)(autoplayButton);
            }
            if (animating) {
              stopAutoplay();
            }
          }
        }
        if (autoplayHoverPause !== autoplayHoverPauseTem) {
          autoplayHoverPause ? (0, _addEvents.addEvents)(container, hoverEvents) : (0, _removeEvents.removeEvents)(container, hoverEvents);
        }
        if (autoplayResetOnVisibility !== autoplayResetOnVisibilityTem) {
          autoplayResetOnVisibility ? (0, _addEvents.addEvents)(doc, visibilityEvent) : (0, _removeEvents.removeEvents)(doc, visibilityEvent);
        }
        if (autoplayButton && autoplayText !== autoplayTextTem) {
          var i = autoplay ? 1 : 0,
              html = autoplayButton.innerHTML,
              len = html.length - autoplayTextTem[i].length;
          if (html.substring(len) === autoplayTextTem[i]) {
            autoplayButton.innerHTML = html.substring(0, len) + autoplayText[i];
          }
        }
      }

      // IE8
      // ## update inner wrapper, container, slides if needed
      // set inline styles for inner wrapper & container
      // insert stylesheet (one line) for slides only (since slides are many)
      if (!CSSMQ) {
        // inner wrapper styles
        if (!freeze && (edgePadding !== edgePaddingTem || gutter !== gutterTem)) {
          innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth);
        }

        // container styles
        if (carousel && horizontal && (fixedWidth !== fixedWidthTem || gutter !== gutterTem || items !== itemsTem)) {
          container.style.width = getContainerWidth(fixedWidth, gutter, items);
        }

        // slide styles
        if (horizontal && (items !== itemsTem || gutter !== gutterTem || fixedWidth != fixedWidthTem)) {
          var str = getSlideWidthStyle(fixedWidth, gutter, items) + getSlideGutterStyle(gutter);

          // remove the last line and
          // add new styles
          sheet.removeRule((0, _getCssRulesLength.getCssRulesLength)(sheet) - 1);
          (0, _addCSSRule.addCSSRule)(sheet, '#' + slideId + ' > .tns-item', str, (0, _getCssRulesLength.getCssRulesLength)(sheet));
        }

        if (!fixedWidth) {
          needContainerTransform = true;
        }
      }

      if (index !== indexTem) {
        events.emit('indexChanged', info());
        needContainerTransform = true;
      }

      if (items !== itemsTem) {
        additionalUpdates();
        updateSlidePosition();

        if (navigator.msMaxTouchPoints) {
          setSnapInterval();
        }
      }
    }

    // things always do regardless of breakpoint zone changing
    if (!horizontal && !disable) {
      getSlideOffsetTops();
      updateContentWrapperHeight();
      needContainerTransform = true;
    }

    if (needContainerTransform) {
      doContainerTransformSilent();
      indexCached = index;
    }

    updateFixedWidthInnerWrapperStyle(true);

    // auto height
    if ((autoHeight || !carousel) && !disable) {
      runAutoHeight();
    }
  }

  // === INITIALIZATION FUNCTIONS === //
  function setBreakpointZone() {
    breakpointZone = 0;
    breakpoints.forEach(function (bp, i) {
      if (windowWidth >= bp) {
        breakpointZone = i + 1;
      }
    });
  }

  function loopNumber(num, min, max) {
    return index >= indexMin && index <= indexMax ? index : index > indexMax ? index - slideCount : index + slideCount;
  }

  function cutindexber(index, min, indexMax) {
    return index >= indexMin && index <= indexMax ? index : index > indexMax ? indexMax : indexMin;
  }

  // (slideBy, indexMin, indexMax) => index
  var updateIndex = function () {
    return loop ? carousel ? function () {
      var leftEdge = indexMin,
          rightEdge = indexMax;

      leftEdge += slideBy;
      rightEdge -= slideBy;

      // adjust edges when edge padding is true
      // or fixed-width slider with extra space on the right side
      if (edgePadding) {
        leftEdge += 1;
        rightEdge -= 1;
      } else if (fixedWidth) {
        var gt = gutter ? gutter : 0;
        if (vpOuter % (fixedWidth + gt) > gt) {
          rightEdge -= 1;
        }
      }

      if (cloneCount) {
        if (index > rightEdge) {
          index -= slideCount;
        } else if (index < leftEdge) {
          index += slideCount;
        }
      }
    } : function () {
      index = index >= indexMin && index <= indexMax ? index : index > indexMax ? index - slideCount : index + slideCount;
    } : function () {
      index = index >= indexMin && index <= indexMax ? index : index > indexMax ? indexMax : indexMin;
    };
  }();

  function toggleSlideDisplayAndEdgePadding() {
    // if (cloneCount) {
    // if (fixedWidth && cloneCount) {
    var str = 'tns-transparent';

    if (freeze) {
      if (!frozen) {
        // remove edge padding from inner wrapper
        if (edgePadding) {
          innerWrapper.style.margin = '0px';
        }

        // add class tns-transparent to cloned slides
        if (cloneCount) {
          for (var i = cloneCount; i--;) {
            if (carousel) {
              (0, _addClass.addClass)(slideItems[i], str);
            }
            (0, _addClass.addClass)(slideItems[slideCountNew - i - 1], str);
          }
        }

        frozen = true;
      }
    } else if (frozen) {
      // restore edge padding for inner wrapper
      // for mordern browsers
      if (edgePadding && !fixedWidth && CSSMQ) {
        innerWrapper.style.margin = '';
      }

      // remove class tns-transparent to cloned slides
      if (cloneCount) {
        for (var i = cloneCount; i--;) {
          if (carousel) {
            (0, _removeClass.removeClass)(slideItems[i], str);
          }
          (0, _removeClass.removeClass)(slideItems[slideCountNew - i - 1], str);
        }
      }

      frozen = false;
    }
    // }
  }

  function updateFixedWidthInnerWrapperStyle(resize) {
    if (fixedWidth && edgePadding) {
      // remove edge padding when freeze or viewport narrower than one slide
      if (freeze || vpOuter <= fixedWidth + gutter) {
        if (innerWrapper.style.margin !== '0px') {
          innerWrapper.style.margin = '0px';
        }
        // update edge padding on resize
      } else if (resize) {
        innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth);
      }
    }
  }

  function disableSlider(disable) {
    var len = slideItems.length;

    if (disable) {
      sheet.disabled = true;
      container.className = container.className.replace(classContainer.substring(1), '');
      (0, _removeElementStyles.removeElementStyles)(container);
      if (loop) {
        for (var j = cloneCount; j--;) {
          if (carousel) {
            (0, _hideElement.hideElement)(slideItems[j]);
          }
          (0, _hideElement.hideElement)(slideItems[len - j - 1]);
        }
      }

      // vertical slider
      if (!horizontal || !carousel) {
        (0, _removeElementStyles.removeElementStyles)(innerWrapper);
      }

      // gallery
      if (!carousel) {
        for (var i = index, l = index + slideCount; i < l; i++) {
          var item = slideItems[i];
          (0, _removeElementStyles.removeElementStyles)(item);
          (0, _removeClass.removeClass)(item, animateIn);
          (0, _removeClass.removeClass)(item, animateNormal);
        }
      }
    } else {
      sheet.disabled = false;
      container.className += classContainer;

      // vertical slider: get offsetTops before container transform
      if (!horizontal) {
        getSlideOffsetTops();
      }

      doContainerTransformSilent();
      if (loop) {
        for (var j = cloneCount; j--;) {
          if (carousel) {
            (0, _showElement.showElement)(slideItems[j]);
          }
          (0, _showElement.showElement)(slideItems[len - j - 1]);
        }
      }

      // gallery
      if (!carousel) {
        for (var i = index, l = index + slideCount; i < l; i++) {
          var item = slideItems[i],
              classN = i < index + items ? animateIn : animateNormal;
          item.style.left = (i - index) * 100 / items + '%';
          (0, _addClass.addClass)(item, classN);
        }
      }
    }
  }

  // lazyload
  function lazyLoad() {
    if (lazyload && !disable) {
      var i = index,
          len = index + items;

      if (edgePadding) {
        i -= 1;
        len += 1;
      }

      for (; i < len; i++) {
        (0, _forEachNodeList.forEachNodeList)(slideItems[i].querySelectorAll('.tns-lazy-img'), function (img) {
          // stop propagationl transitionend event to container
          var eve = {};
          eve[TRANSITIONEND] = function (e) {
            e.stopPropagation();
          };
          (0, _addEvents.addEvents)(img, eve);

          if (!(0, _hasClass.hasClass)(img, 'loaded')) {
            img.src = (0, _getAttr.getAttr)(img, 'data-src');
            (0, _addClass.addClass)(img, 'loaded');
          }
        });
      }
    }
  }

  function imgLoadedOrError(e) {
    var img = getTarget(e);
    (0, _addClass.addClass)(img, imgCompleteClass);
    (0, _removeEvents.removeEvents)(img, imgEvents);
  }

  function getImageArray(slideStart, slideRange) {
    var imgs = [];
    for (var i = slideStart, l = slideStart + slideRange; i < l; i++) {
      (0, _forEachNodeList.forEachNodeList)(slideItems[i].querySelectorAll('img'), function (img) {
        imgs.push(img);
      });
    }

    return imgs;
  }

  // check if all visible images are loaded
  // and update container height if it's done
  function runAutoHeight() {
    var imgs = autoHeight ? getImageArray(index, items) : getImageArray(cloneCount, slideCount);

    (0, _raf.raf)(function () {
      checkImagesLoaded(imgs, updateInnerWrapperHeight);
    });
  }

  function checkImagesLoaded(imgs, cb) {
    // directly execute callback function if all images are complete
    if (imgsComplete) {
      return cb();
    }

    // check selected image classes otherwise
    imgs.forEach(function (img, index) {
      if ((0, _hasClass.hasClass)(img, imgCompleteClass)) {
        imgs.splice(index, 1);
      }
    });

    // execute callback function if selected images are all complete
    if (!imgs.length) {
      return cb();
    }

    // otherwise execute this functiona again
    (0, _raf.raf)(function () {
      checkImagesLoaded(imgs, cb);
    });
  }

  function additionalUpdates() {
    lazyLoad();
    updateSlideStatus();
    updateControlsStatus();
    updateNavVisibility();
    updateNavStatus();
  }

  function getMaxSlideHeight(slideStart, slideRange) {
    var heights = [];
    for (var i = slideStart, l = slideStart + slideRange; i < l; i++) {
      heights.push(slideItems[i].offsetHeight);
    }

    return Math.max.apply(null, heights);
  }

  // update inner wrapper height
  // 1. get the max-height of the visible slides
  // 2. set transitionDuration to speed
  // 3. update inner wrapper height to max-height
  // 4. set transitionDuration to 0s after transition done
  function updateInnerWrapperHeight() {
    var maxHeight = autoHeight ? getMaxSlideHeight(index, items) : getMaxSlideHeight(cloneCount, slideCount);

    if (innerWrapper.style.height !== maxHeight) {
      innerWrapper.style.height = maxHeight + 'px';
    }
  }

  // get the distance from the top edge of the first slide to each slide
  // (init) => slideOffsetTops
  function getSlideOffsetTops() {
    slideOffsetTops = [0];
    var topFirst = slideItems[0].getBoundingClientRect().top,
        attr;
    for (var i = 1; i < slideCountNew; i++) {
      attr = slideItems[i].getBoundingClientRect().top;
      slideOffsetTops.push(attr - topFirst);
    }
  }

  // set snapInterval (for IE10)
  function setSnapInterval() {
    outerWrapper.style.msScrollSnapPointsX = 'snapInterval(0%, ' + 100 / items + '%)';
  }

  // update slide
  function updateSlideStatus() {
    var l = index + Math.min(slideCount, items);
    for (var i = slideCountNew; i--;) {
      var item = slideItems[i];

      // visible slides
      if (i >= index && i < l) {
        if ((0, _hasAttr.hasAttr)(item, 'tabindex')) {
          (0, _setAttrs.setAttrs)(item, { 'aria-hidden': 'false' });
          (0, _removeAttrs.removeAttrs)(item, ['tabindex']);
          (0, _addClass.addClass)(item, slideActiveClass);
        }
        // hidden slides
      } else {
        if (!(0, _hasAttr.hasAttr)(item, 'tabindex')) {
          (0, _setAttrs.setAttrs)(item, {
            'aria-hidden': 'true',
            'tabindex': '-1'
          });
        }
        if ((0, _hasClass.hasClass)(item, slideActiveClass)) {
          (0, _removeClass.removeClass)(item, slideActiveClass);
        }
      }
    }
  }

  // gallery: update slide position
  function updateSlidePosition() {
    if (!carousel) {
      var l = index + Math.min(slideCount, items);
      for (var i = slideCountNew; i--;) {
        var item = slideItems[i];

        if (i >= index && i < l) {
          // add transitions to visible slides when adjusting their positions
          (0, _addClass.addClass)(item, 'tns-moving');

          item.style.left = (i - index) * 100 / items + '%';
          (0, _addClass.addClass)(item, animateIn);
          (0, _removeClass.removeClass)(item, animateNormal);
        } else if (item.style.left) {
          item.style.left = '';
          (0, _addClass.addClass)(item, animateNormal);
          (0, _removeClass.removeClass)(item, animateIn);
        }

        // remove outlet animation
        (0, _removeClass.removeClass)(item, animateOut);
      }

      // removing '.tns-moving'
      setTimeout(function () {
        (0, _forEachNodeList.forEachNodeList)(slideItems, function (el) {
          (0, _removeClass.removeClass)(el, 'tns-moving');
        });
      }, 300);
    }
  }

  // set tabindex & aria-selected on Nav
  function updateNavStatus() {
    // get current nav
    if (nav) {
      navCurrentIndex = navClicked !== -1 ? navClicked : getAbsIndex();
      navClicked = -1;

      if (navCurrentIndex !== navCurrentIndexCached) {
        var navPrev = navItems[navCurrentIndexCached],
            navCurrent = navItems[navCurrentIndex];

        (0, _setAttrs.setAttrs)(navPrev, {
          'tabindex': '-1',
          'aria-selected': 'false'
        });
        (0, _setAttrs.setAttrs)(navCurrent, {
          'tabindex': '0',
          'aria-selected': 'true'
        });
        (0, _removeClass.removeClass)(navPrev, navActiveClass);
        (0, _addClass.addClass)(navCurrent, navActiveClass);
      }
    }
  }

  function getLowerCaseNodeName(el) {
    return el.nodeName.toLowerCase();
  }

  function isButton(el) {
    return getLowerCaseNodeName(el) === 'button';
  }

  function isAriaDisabled(el) {
    return el.getAttribute('aria-disabled') === 'true';
  }

  function disEnableElement(isButton, el, val) {
    if (isButton) {
      el.disabled = val;
    } else {
      el.setAttribute('aria-disabled', val.toString());
    }
  }

  // set 'disabled' to true on controls when reach the edges
  function updateControlsStatus() {
    if (!controls || rewind || loop) {
      return;
    }

    var prevDisabled = prevIsButton ? prevButton.disabled : isAriaDisabled(prevButton),
        nextDisabled = nextIsButton ? nextButton.disabled : isAriaDisabled(nextButton),
        disablePrev = index === indexMin ? true : false,
        disableNext = !rewind && index === indexMax ? true : false;

    if (disablePrev && !prevDisabled) {
      disEnableElement(prevIsButton, prevButton, true);
    }
    if (!disablePrev && prevDisabled) {
      disEnableElement(prevIsButton, prevButton, false);
    }
    if (disableNext && !nextDisabled) {
      disEnableElement(nextIsButton, nextButton, true);
    }
    if (!disableNext && nextDisabled) {
      disEnableElement(nextIsButton, nextButton, false);
    }
  }

  // set duration
  function resetDuration(el, str) {
    if (TRANSITIONDURATION) {
      el.style[TRANSITIONDURATION] = str;
    }
  }

  function getContainerTransformValue() {
    var val;
    if (horizontal) {
      if (fixedWidth) {
        val = -(fixedWidth + gutter) * index + 'px';
      } else {
        var denominator = TRANSFORM ? slideCountNew : items;
        val = -index * 100 / denominator + '%';
      }
    } else {
      val = -slideOffsetTops[index] + 'px';
    }
    return val;
  }

  function doContainerTransformSilent(val) {
    resetDuration(container, '0s');
    doContainerTransform(val);
    setTimeout(function () {
      resetDuration(container, '');
    }, 0);
  }

  function doContainerTransform(val, test) {
    if (!val) {
      val = getContainerTransformValue();
    }
    container.style[transformAttr] = transformPrefix + val + transformPostfix;
  }

  function animateSlide(number, classOut, classIn, isOut) {
    var l = number + items;
    if (!loop) {
      l = Math.min(l, slideCountNew);
    }

    for (var i = number; i < l; i++) {
      var item = slideItems[i];

      // set item positions
      if (!isOut) {
        item.style.left = (i - index) * 100 / items + '%';
      }

      if (animateDelay && TRANSITIONDELAY) {
        item.style[TRANSITIONDELAY] = item.style[ANIMATIONDELAY] = animateDelay * (i - number) / 1000 + 's';
      }
      (0, _removeClass.removeClass)(item, classOut);
      (0, _addClass.addClass)(item, classIn);

      if (isOut) {
        slideItemsOut.push(item);
      }
    }
  }

  // make transfer after click/drag:
  // 1. change 'transform' property for mordern browsers
  // 2. change 'left' property for legacy browsers
  var transformCore = function () {
    return carousel ? function (duration, distance) {
      if (!distance) {
        distance = getContainerTransformValue();
      }

      // constrain the distance when non-loop no-edgePadding fixedWidth reaches the right edge
      if (hasRightDeadZone && index === indexMax) {
        distance = -((fixedWidth + gutter) * slideCountNew - vpInner) + 'px';
      }

      if (TRANSITIONDURATION || !duration) {
        // for morden browsers with non-zero duration or 
        // zero duration for all browsers
        doContainerTransform(distance);
        // run fallback function manually 
        // when duration is 0 / container is hidden
        if (!duration || !(0, _isVisible.isVisible)(container)) {
          onTransitionEnd();
        }
      } else {
        // for old browser with non-zero duration
        (0, _jsTransform.jsTransform)(container, transformAttr, transformPrefix, transformPostfix, distance, speed, onTransitionEnd);
      }

      if (!horizontal) {
        updateContentWrapperHeight();
      }
    } : function (duration) {
      slideItemsOut = [];

      var eve = {};
      eve[TRANSITIONEND] = eve[ANIMATIONEND] = onTransitionEnd;
      (0, _removeEvents.removeEvents)(slideItems[indexCached], eve);
      (0, _addEvents.addEvents)(slideItems[index], eve);

      animateSlide(indexCached, animateIn, animateOut, true);
      animateSlide(index, animateNormal, animateIn);

      // run fallback function manually 
      // when transition or animation not supported / duration is 0
      if (!TRANSITIONEND || !ANIMATIONEND || !duration) {
        onTransitionEnd();
      }
    };
  }();

  function doTransform(duration, distance) {
    // check duration is defined and is a number
    if (isNaN(duration)) {
      duration = speed;
    }

    // if container is hidden, set duration to 0
    // to fix an issue where browser doesn't fire ontransitionend on hidden element
    if (animating && !(0, _isVisible.isVisible)(container)) {
      duration = 0;
    }

    transformCore(duration, distance);
  }

  function render(e, sliderMoved) {
    if (updateIndexBeforeTransform) {
      updateIndex();
    }

    // render when slider was moved (touch or drag) even though index may not change
    if (index !== indexCached || sliderMoved) {
      // events
      events.emit('indexChanged', info());
      events.emit('transitionStart', info());

      // pause autoplay when click or keydown from user
      if (animating && e && ['click', 'keydown'].indexOf(e.type) >= 0) {
        stopAutoplay();
      }

      running = true;
      doTransform();
    }
  }

  /*
   * Transfer prefixed properties to the same format
   * CSS: -Webkit-Transform => webkittransform
   * JS: WebkitTransform => webkittransform
   * @param {string} str - property
   *
   */
  function strTrans(str) {
    return str.toLowerCase().replace(/-/g, '');
  }

  // AFTER TRANSFORM
  // Things need to be done after a transfer:
  // 1. check index
  // 2. add classes to visible slide
  // 3. disable controls buttons when reach the first/last slide in non-loop slider
  // 4. update nav status
  // 5. lazyload images
  // 6. update container height
  function onTransitionEnd(event) {
    // check running on gallery mode
    // make sure trantionend/animationend events run only once
    if (carousel || running) {
      events.emit('transitionEnd', info(event));

      if (!carousel && slideItemsOut.length > 0) {
        for (var i = 0; i < slideItemsOut.length; i++) {
          var item = slideItemsOut[i];
          // set item positions
          item.style.left = '';

          if (ANIMATIONDELAY && TRANSITIONDELAY) {
            item.style[ANIMATIONDELAY] = '';
            item.style[TRANSITIONDELAY] = '';
          }
          (0, _removeClass.removeClass)(item, animateOut);
          (0, _addClass.addClass)(item, animateNormal);
        }
      }

      /* update slides, nav, controls after checking ...
       * => legacy browsers who don't support 'event' 
       *    have to check event first, otherwise event.target will cause an error 
       * => or 'gallery' mode: 
       *   + event target is slide item
       * => or 'carousel' mode: 
       *   + event target is container, 
       *   + event.property is the same with transform attribute
       */
      if (!event || !carousel && event.target.parentNode === container || event.target === container && strTrans(event.propertyName) === strTrans(transformAttr)) {

        if (!updateIndexBeforeTransform) {
          var indexTem = index;
          updateIndex();
          if (index !== indexTem) {
            events.emit('indexChanged', info());

            doContainerTransformSilent();
          }
        }

        if (autoHeight) {
          runAutoHeight();
        }

        if (nested === 'inner') {
          events.emit('innerLoaded', info());
        }
        running = false;
        navCurrentIndexCached = navCurrentIndex;
        indexCached = index;
      }
    }
  }

  // # ACTIONS
  function goTo(targetIndex, e) {
    if (freeze) {
      return;
    }

    // prev slideBy
    if (targetIndex === 'prev') {
      onControlsClick(e, -1);

      // next slideBy
    } else if (targetIndex === 'next') {
      onControlsClick(e, 1);

      // go to exact slide
    } else {
      if (running) {
        onTransitionEnd();
      }

      // } else if (!running) {
      var absIndex = getAbsIndex(),
          indexGap = 0;
      if (absIndex < 0) {
        absIndex += slideCount;
      }

      if (targetIndex === 'first') {
        indexGap = -absIndex;
      } else if (targetIndex === 'last') {
        indexGap = slideCount - items - absIndex;
      } else {
        if (typeof targetIndex !== 'number') {
          targetIndex = parseInt(targetIndex);
        }
        if (!isNaN(targetIndex)) {
          var absTargetIndex = getAbsIndex(targetIndex);
          if (absTargetIndex < 0) {
            absTargetIndex += slideCount;
          }
          indexGap = absTargetIndex - absIndex;
        }
      }

      index += indexGap;

      // if index is changed, start rendering
      if (getAbsIndex(index) !== getAbsIndex(indexCached)) {
        render(e);
      }
    }
  }

  // on controls click
  function onControlsClick(e, dir) {
    // if (!running) {
    if (running) {
      onTransitionEnd();
    }

    var passEventObject;

    if (!dir) {
      e = getEvent(e);
      var target = e.target || e.srcElement;

      while (target !== controlsContainer && [prevButton, nextButton].indexOf(target) < 0) {
        target = target.parentNode;
      }

      var targetIn = [prevButton, nextButton].indexOf(target);
      if (targetIn >= 0) {
        passEventObject = true;
        dir = targetIn === 0 ? -1 : 1;
      }
    }

    if (rewind) {
      if (index === indexMin && dir === -1) {
        goTo('last', e);
        return;
      } else if (index === indexMax && dir === 1) {
        goTo(0, e);
        return;
      }
    }

    if (dir) {
      index += slideBy * dir;
      // pass e when click control buttons or keydown
      render(passEventObject || e && e.type === 'keydown' ? e : null);
    }
    // }
  }

  // on nav click
  function onNavClick(e) {
    // if (!running) {
    if (running) {
      onTransitionEnd();
    }

    e = getEvent(e);
    var target = e.target || e.srcElement,
        navIndex;

    // find the clicked nav item
    while (target !== navContainer && !(0, _hasAttr.hasAttr)(target, 'data-nav')) {
      target = target.parentNode;
    }
    if ((0, _hasAttr.hasAttr)(target, 'data-nav')) {
      navIndex = navClicked = [].indexOf.call(navItems, target);
      goTo(navIndex + cloneCount, e);
    }
    // }
  }

  // autoplay functions
  function setAutoplayTimer() {
    autoplayTimer = setInterval(function () {
      onControlsClick(null, autoplayDirection);
    }, autoplayTimeout);

    animating = true;
  }

  function stopAutoplayTimer() {
    clearInterval(autoplayTimer);
    animating = false;
  }

  function updateAutoplayButton(action, txt) {
    (0, _setAttrs.setAttrs)(autoplayButton, { 'data-action': action });
    autoplayButton.innerHTML = autoplayHtmlStrings[0] + action + autoplayHtmlStrings[1] + txt;
  }

  function startAutoplay() {
    setAutoplayTimer();
    if (autoplayButton) {
      updateAutoplayButton('stop', autoplayText[1]);
    }
  }

  function stopAutoplay() {
    stopAutoplayTimer();
    if (autoplayButton) {
      updateAutoplayButton('start', autoplayText[0]);
    }
  }

  // programaitcally play/pause the slider
  function play() {
    if (autoplay && !animating) {
      startAutoplay();
      autoplayUserPaused = false;
    }
  }
  function pause() {
    if (animating) {
      stopAutoplay();
      autoplayUserPaused = true;
    }
  }

  function toggleAutoplay() {
    if (animating) {
      stopAutoplay();
      autoplayUserPaused = true;
    } else {
      startAutoplay();
      autoplayUserPaused = false;
    }
  }

  function onVisibilityChange() {
    if (doc.hidden) {
      if (animating) {
        stopAutoplayTimer();
        autoplayVisibilityPaused = true;
      }
    } else if (autoplayVisibilityPaused) {
      setAutoplayTimer();
      autoplayVisibilityPaused = false;
    }
  }

  function mouseoverPause() {
    if (animating) {
      stopAutoplayTimer();
      autoplayHoverPaused = true;
    }
  }

  function mouseoutRestart() {
    if (autoplayHoverPaused) {
      setAutoplayTimer();
      autoplayHoverPaused = false;
    }
  }

  // keydown events on document 
  function onDocumentKeydown(e) {
    e = getEvent(e);
    switch (e.keyCode) {
      case KEYS.LEFT:
        onControlsClick(e, -1);
        break;
      case KEYS.RIGHT:
        onControlsClick(e, 1);
    }
  }

  // on key control
  function onControlsKeydown(e) {
    e = getEvent(e);
    var code = e.keyCode;

    switch (code) {
      case KEYS.LEFT:
      case KEYS.UP:
      case KEYS.PAGEUP:
        if (!prevButton.disabled) {
          onControlsClick(e, -1);
        }
        break;
      case KEYS.RIGHT:
      case KEYS.DOWN:
      case KEYS.PAGEDOWN:
        if (!nextButton.disabled) {
          onControlsClick(e, 1);
        }
        break;
      case KEYS.HOME:
        goTo(0, e);
        break;
      case KEYS.END:
        goTo(slideCount - 1, e);
        break;
    }
  }

  // set focus
  function setFocus(focus) {
    focus.focus();
  }

  // on key nav
  function onNavKeydown(e) {
    var curElement = doc.activeElement;
    if (!(0, _hasAttr.hasAttr)(curElement, 'data-nav')) {
      return;
    }

    e = getEvent(e);
    var code = e.keyCode,
        navIndex = [].indexOf.call(navItems, curElement),
        len = visibleNavIndexes.length,
        current = visibleNavIndexes.indexOf(navIndex);

    if (options.navContainer) {
      len = slideCount;
      current = navIndex;
    }

    function getNavIndex(num) {
      return options.navContainer ? num : visibleNavIndexes[num];
    }

    switch (code) {
      case KEYS.LEFT:
      case KEYS.PAGEUP:
        if (current > 0) {
          setFocus(navItems[getNavIndex(current - 1)]);
        }
        break;

      case KEYS.UP:
      case KEYS.HOME:
        if (current > 0) {
          setFocus(navItems[getNavIndex(0)]);
        }
        break;

      case KEYS.RIGHT:
      case KEYS.PAGEDOWN:
        if (current < len - 1) {
          setFocus(navItems[getNavIndex(current + 1)]);
        }
        break;

      case KEYS.DOWN:
      case KEYS.END:
        if (current < len - 1) {
          setFocus(navItems[getNavIndex(len - 1)]);
        }
        break;

      // Can't use onNavClick here,
      // Because onNavClick require event.target as nav items
      case KEYS.ENTER:
      case KEYS.SPACE:
        navClicked = navIndex;
        goTo(navIndex + cloneCount, e);
        break;
    }
  }

  // IE10 scroll function
  function ie10Scroll() {
    transformCore(0, container.scrollLeft());
    indexCached = index;
  }

  function getEvent(e) {
    e = e || win.event;
    return isTouchEvent(e) ? e.changedTouches[0] : e;
  }
  function getTarget(e) {
    return e.target || win.event.srcElement;
  }

  function isTouchEvent(e) {
    return e.type.indexOf('touch') >= 0;
  }

  function preventDefaultBehavior(e) {
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
  }

  function onPanStart(e) {
    if (running) {
      onTransitionEnd();
    }

    panStart = true;
    (0, _caf.caf)(rafIndex);
    rafIndex = (0, _raf.raf)(function () {
      panUpdate(e);
    });

    var $ = getEvent(e);
    events.emit(isTouchEvent(e) ? 'touchStart' : 'dragStart', info(e));

    if (!isTouchEvent(e) && ['img', 'a'].indexOf(getLowerCaseNodeName(getTarget(e))) >= 0) {
      preventDefaultBehavior(e);
    }

    lastPosition.x = initPosition.x = parseInt($.clientX);
    lastPosition.y = initPosition.y = parseInt($.clientY);
    translateInit = parseFloat(container.style[transformAttr].replace(transformPrefix, '').replace(transformPostfix, ''));

    resetDuration(container, '0s');
  }

  function onPanMove(e) {
    if (panStart) {
      var $ = getEvent(e);
      lastPosition.x = parseInt($.clientX);
      lastPosition.y = parseInt($.clientY);
    }
  }

  function panUpdate(e) {
    if (!moveDirectionExpected) {
      panStart = false;
      return;
    }
    (0, _caf.caf)(rafIndex);
    if (panStart) {
      rafIndex = (0, _raf.raf)(function () {
        panUpdate(e);
      });
    }

    if (moveDirectionExpected === '?' && lastPosition.x !== initPosition.x && lastPosition.y !== initPosition.y) {
      moveDirectionExpected = (0, _getTouchDirection.getTouchDirection)((0, _toDegree.toDegree)(lastPosition.y - initPosition.y, lastPosition.x - initPosition.x), swipeAngle) === options.axis;
    }

    if (moveDirectionExpected) {
      events.emit(isTouchEvent(e) ? 'touchMove' : 'dragMove', info(e));

      var x = translateInit,
          dist = getDist(lastPosition, initPosition);
      if (!horizontal || fixedWidth) {
        x += dist;
        x += 'px';
      } else {
        var percentageX = TRANSFORM ? dist * items * 100 / (vpInner * slideCountNew) : dist * 100 / vpInner;
        x += percentageX;
        x += '%';
      }

      container.style[transformAttr] = transformPrefix + x + transformPostfix;
    }
  }

  function onPanEnd(e) {
    if (swipeAngle) {
      moveDirectionExpected = '?';
    } // reset

    if (panStart) {
      (0, _caf.caf)(rafIndex);
      resetDuration(container, '');
      panStart = false;

      var $ = getEvent(e);
      lastPosition.x = parseInt($.clientX);
      lastPosition.y = parseInt($.clientY);
      var dist = getDist(lastPosition, initPosition);

      // initPosition = {x:0, y:0}; // reset positions
      // lastPosition = {x:0, y:0}; // reset positions

      if (Math.abs(dist) >= 5) {
        // drag vs click
        if (!isTouchEvent(e)) {

          // prevent "click"
          var target = getTarget(e);
          (0, _addEvents.addEvents)(target, { 'click': function preventClick(e) {
              preventDefaultBehavior(e);
              (0, _removeEvents.removeEvents)(target, { 'click': preventClick });
            } });
        }

        rafIndex = (0, _raf.raf)(function () {
          events.emit(isTouchEvent(e) ? 'touchEnd' : 'dragEnd', info(e));

          if (horizontal) {
            var indexMoved = -dist * items / vpInner;
            indexMoved = dist > 0 ? Math.floor(indexMoved) : Math.ceil(indexMoved);
            index += indexMoved;
          } else {
            var moved = -(translateInit + dist);
            if (moved <= 0) {
              index = indexMin;
            } else if (moved >= slideOffsetTops[slideOffsetTops.length - 1]) {
              index = indexMax;
            } else {
              var i = 0;
              do {
                i++;
                index = dist < 0 ? i + 1 : i;
              } while (i < slideCountNew && moved >= slideOffsetTops[i + 1]);
            }
          }

          render(e, dist);
        });
      }
    }
  }

  // === RESIZE FUNCTIONS === //
  // (slideOffsetTops, index, items) => vertical_conentWrapper.height
  function updateContentWrapperHeight() {
    innerWrapper.style.height = slideOffsetTops[index + items] - slideOffsetTops[index] + 'px';
  }

  /*
   * get nav item indexes per items
   * add 1 more if the nav items cann't cover all slides
   * [0, 1, 2, 3, 4] / 3 => [0, 3]
   */
  function getVisibleNavIndex() {
    // reset visibleNavIndexes
    visibleNavIndexes = [];

    var absIndexMin = getAbsIndex() % items;
    while (absIndexMin < slideCount) {
      if (!loop && absIndexMin + items > slideCount) {
        absIndexMin = slideCount - items;
      }
      visibleNavIndexes.push(absIndexMin);
      absIndexMin += items;
    }

    // nav count * items < slide count means
    // some slides can not be displayed only by nav clicking
    if (loop && visibleNavIndexes.length * items < slideCount || !loop && visibleNavIndexes[0] > 0) {
      visibleNavIndexes.unshift(0);
    }
  }

  /*
   * 1. update visible nav items list
   * 2. add "hidden" attributes to previous visible nav items
   * 3. remove "hidden" attrubutes to new visible nav items
   */
  function updateNavVisibility() {
    if (!nav || navAsThumbnails) {
      return;
    }
    getVisibleNavIndex();

    if (visibleNavIndexes !== visibleNavIndexesCached) {
      (0, _forEachNodeList.forEachNodeList)(navItems, function (el, i) {
        if (visibleNavIndexes.indexOf(i) < 0) {
          (0, _hideElement.hideElement)(el);
        } else {
          (0, _showElement.showElement)(el);
        }
      });

      // cache visible nav indexes
      visibleNavIndexesCached = visibleNavIndexes;
    }
  }

  function info(e) {
    return {
      container: container,
      slideItems: slideItems,
      navContainer: navContainer,
      navItems: navItems,
      controlsContainer: controlsContainer,
      hasControls: hasControls,
      prevButton: prevButton,
      nextButton: nextButton,
      items: items,
      slideBy: slideBy,
      cloneCount: cloneCount,
      slideCount: slideCount,
      slideCountNew: slideCountNew,
      index: index,
      indexCached: indexCached,
      navCurrentIndex: navCurrentIndex,
      navCurrentIndexCached: navCurrentIndexCached,
      visibleNavIndexes: visibleNavIndexes,
      visibleNavIndexesCached: visibleNavIndexesCached,
      sheet: sheet,
      event: e || {}
    };
  }

  return {
    getInfo: info,
    events: events,
    goTo: goTo,
    play: play,
    pause: pause,
    isOn: isOn,
    updateSliderHeight: updateInnerWrapperHeight,
    rebuild: function rebuild() {
      return tns(options);
    },

    destroy: function destroy() {
      // remove win event listeners
      (0, _removeEvents.removeEvents)(win, { 'resize': onResize });

      // remove arrowKeys eventlistener
      (0, _removeEvents.removeEvents)(doc, docmentKeydownEvent);

      // sheet
      sheet.disabled = true;

      // cloned items
      if (loop) {
        for (var j = cloneCount; j--;) {
          if (carousel) {
            slideItems[0].remove();
          }
          slideItems[slideItems.length - 1].remove();
        }
      }

      // Slide Items
      var slideClasses = ['tns-item', slideActiveClass];
      if (!carousel) {
        slideClasses = slideClasses.concat('tns-normal', animateIn);
      }

      for (var i = slideCount; i--;) {
        var slide = slideItems[i];
        if (slide.id.indexOf(slideId + '-item') >= 0) {
          slide.id = '';
        }

        slideClasses.forEach(function (cl) {
          (0, _removeClass.removeClass)(slide, cl);
        });
      }
      (0, _removeAttrs.removeAttrs)(slideItems, ['style', 'aria-hidden', 'tabindex']);
      slideItems = slideId = slideCount = slideCountNew = cloneCount = null;

      // controls
      if (controls) {
        (0, _removeEvents.removeEvents)(controlsContainer, controlsEvents);
        if (options.controlsContainer) {
          (0, _removeAttrs.removeAttrs)(controlsContainer, ['aria-label', 'tabindex']);
          (0, _removeAttrs.removeAttrs)(controlsContainer.children, ['aria-controls', 'aria-disabled', 'tabindex']);
        }
        controlsContainer = prevButton = nextButton = null;
      }

      // nav
      if (nav) {
        (0, _removeEvents.removeEvents)(navContainer, navEvents);
        if (options.navContainer) {
          (0, _removeAttrs.removeAttrs)(navContainer, ['aria-label']);
          (0, _removeAttrs.removeAttrs)(navItems, ['aria-selected', 'aria-controls', 'tabindex']);
        }
        navContainer = navItems = null;
      }

      // auto
      if (autoplay) {
        clearInterval(autoplayTimer);
        if (autoplayButton) {
          (0, _removeEvents.removeEvents)(autoplayButton, { 'click': toggleAutoplay });
        }
        (0, _removeEvents.removeEvents)(container, hoverEvents);
        (0, _removeEvents.removeEvents)(container, visibilityEvent);
        if (options.autoplayButton) {
          (0, _removeAttrs.removeAttrs)(autoplayButton, ['data-action']);
        }
      }

      // container
      container.id = containerIdCached || '';
      container.className = container.className.replace(classContainer, '');
      (0, _removeElementStyles.removeElementStyles)(container);
      if (carousel && TRANSITIONEND) {
        var eve = {};
        eve[TRANSITIONEND] = onTransitionEnd;
        (0, _removeEvents.removeEvents)(container, eve);
      }
      (0, _removeEvents.removeEvents)(container, touchEvents);
      (0, _removeEvents.removeEvents)(container, dragEvents);

      // outerWrapper
      containerParent.insertBefore(container, outerWrapper);
      outerWrapper.remove();
      outerWrapper = innerWrapper = container = index = indexCached = items = slideBy = navCurrentIndex = navCurrentIndexCached = hasControls = visibleNavIndexes = visibleNavIndexesCached = this.getInfo = this.events = this.goTo = this.play = this.pause = this.destroy = null;
      this.isOn = isOn = false;
    }
  };
};

},{"./helpers/addCSSRule":27,"./helpers/addClass":28,"./helpers/addEvents":29,"./helpers/arrayFromNodeList":30,"./helpers/caf":31,"./helpers/calc":32,"./helpers/checkStorageValue":33,"./helpers/childNode.remove":34,"./helpers/createStyleSheet":36,"./helpers/events":38,"./helpers/extend":39,"./helpers/forEachNodeList":40,"./helpers/getAttr":41,"./helpers/getCssRulesLength":43,"./helpers/getEndProperty":44,"./helpers/getSlideId":45,"./helpers/getTouchDirection":46,"./helpers/hasAttr":47,"./helpers/hasClass":48,"./helpers/hideElement":49,"./helpers/isVisible":51,"./helpers/jsTransform":52,"./helpers/keys":53,"./helpers/mediaquerySupport":54,"./helpers/raf":56,"./helpers/removeAttrs":57,"./helpers/removeClass":58,"./helpers/removeElementStyles":59,"./helpers/removeEvents":60,"./helpers/setAttrs":62,"./helpers/setLocalStorage":64,"./helpers/showElement":65,"./helpers/subpixelLayout":66,"./helpers/toDegree":67,"./helpers/whichProperty":68}],70:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t];for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
  }return e;
},
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
  return typeof e;
} : function (e) {
  return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};!function (e, t) {
  "object" === ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.LazyLoad = t();
}(undefined, function () {
  "use strict";
  function e(e, t, n) {
    return !(i(e, t, n) || l(e, t, n) || r(e, t, n) || a(e, t, n));
  }var t = function () {
    return { elements_selector: "img", container: window, threshold: 300, throttle: 150, data_src: "src", data_srcset: "srcset", data_sizes: "sizes", class_loading: "loading", class_loaded: "loaded", class_error: "error", class_initial: "initial", skip_invisible: !0, callback_load: null, callback_error: null, callback_set: null, callback_processed: null, callback_enter: null, to_webp: !1 };
  },
      n = function (e, t) {
    e && e(t);
  },
      o = function (e) {
    return e.getBoundingClientRect().top + window.pageYOffset - e.ownerDocument.documentElement.clientTop;
  },
      i = function (e, t, n) {
    return (t === window ? window.innerHeight + window.pageYOffset : o(t) + t.offsetHeight) <= o(e) - n;
  },
      s = function (e) {
    return e.getBoundingClientRect().left + window.pageXOffset - e.ownerDocument.documentElement.clientLeft;
  },
      r = function (e, t, n) {
    var o = window.innerWidth;return (t === window ? o + window.pageXOffset : s(t) + o) <= s(e) - n;
  },
      l = function (e, t, n) {
    return (t === window ? window.pageYOffset : o(t)) >= o(e) + n + e.offsetHeight;
  },
      a = function (e, t, n) {
    return (t === window ? window.pageXOffset : s(t)) >= s(e) + n + e.offsetWidth;
  },
      c = function (e, t) {
    var n,
        o = new e(t);try {
      n = new CustomEvent("LazyLoad::Initialized", { detail: { instance: o } });
    } catch (e) {
      (n = document.createEvent("CustomEvent")).initCustomEvent("LazyLoad::Initialized", !1, !1, { instance: o });
    }window.dispatchEvent(n);
  },
      u = function (e, t) {
    return e.getAttribute("data-" + t);
  },
      d = function (e, t, n) {
    return e.setAttribute("data-" + t, n);
  },
      f = function (e) {
    return d(e, "was-processed", "true");
  },
      _ = function (e) {
    return "true" === u(e, "was-processed");
  },
      h = function (e, t) {
    return t ? e.replace(/\.(jpe?g|png)/gi, ".webp") : e;
  },
      p = "undefined" != typeof window,
      m = p && !("onscroll" in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent),
      g = p && "classList" in document.createElement("p"),
      v = p && function () {
    var e = document.createElement("canvas");return !(!e.getContext || !e.getContext("2d")) && 0 === e.toDataURL("image/webp").indexOf("data:image/webp");
  }(),
      w = function (e, t, n, o) {
    for (var i, s = 0; i = e.children[s]; s += 1) if ("SOURCE" === i.tagName) {
      var r = u(i, n);b(i, t, r, o);
    }
  },
      b = function (e, t, n, o) {
    n && e.setAttribute(t, h(n, o));
  },
      y = function (e, t) {
    var n = v && t.to_webp,
        o = u(e, t.data_src);if (o) {
      var i = h(o, n);e.style.backgroundImage = 'url("' + i + '")';
    }
  },
      E = { IMG: function (e, t) {
      var n = v && t.to_webp,
          o = t.data_srcset,
          i = e.parentNode;i && "PICTURE" === i.tagName && w(i, "srcset", o, n);var s = u(e, t.data_sizes);b(e, "sizes", s);var r = u(e, o);b(e, "srcset", r, n);var l = u(e, t.data_src);b(e, "src", l, n);
    }, IFRAME: function (e, t) {
      var n = u(e, t.data_src);b(e, "src", n);
    }, VIDEO: function (e, t) {
      var n = t.data_src,
          o = u(e, n);w(e, "src", n), b(e, "src", o);
    } },
      L = function (e, t) {
    var n = e.tagName,
        o = E[n];o ? o(e, t) : y(e, t);
  },
      T = function (e, t) {
    g ? e.classList.add(t) : e.className += (e.className ? " " : "") + t;
  },
      S = function (e, t) {
    g ? e.classList.remove(t) : e.className = e.className.replace(new RegExp("(^|\\s+)" + t + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
  },
      O = function (e) {
    this._settings = _extends({}, t(), e), this._queryOriginNode = this._settings.container === window ? document : this._settings.container, this._previousLoopTime = 0, this._loopTimeout = null, this._boundHandleScroll = this.handleScroll.bind(this), this._isFirstLoop = !0, window.addEventListener("resize", this._boundHandleScroll), this.update();
  };return O.prototype = { _reveal: function (e, t) {
      if (t || !_(e)) {
        var o = this._settings,
            i = function t() {
          o && (e.removeEventListener("load", s), e.removeEventListener("error", t), S(e, o.class_loading), T(e, o.class_error), n(o.callback_error, e));
        },
            s = function t() {
          o && (S(e, o.class_loading), T(e, o.class_loaded), e.removeEventListener("load", t), e.removeEventListener("error", i), n(o.callback_load, e));
        };n(o.callback_enter, e), ["IMG", "IFRAME", "VIDEO"].indexOf(e.tagName) > -1 && (e.addEventListener("load", s), e.addEventListener("error", i), T(e, o.class_loading)), L(e, o), n(o.callback_set, e);
      }
    }, _loopThroughElements: function (t) {
      var o = this._settings,
          i = this._elements,
          s = i ? i.length : 0,
          r = void 0,
          l = [],
          a = this._isFirstLoop;for (r = 0; r < s; r++) {
        var c = i[r];o.skip_invisible && null === c.offsetParent || (m || t || e(c, o.container, o.threshold)) && (a && T(c, o.class_initial), this.load(c), l.push(r), f(c));
      }for (; l.length;) i.splice(l.pop(), 1), n(o.callback_processed, i.length);0 === s && this._stopScrollHandler(), a && (this._isFirstLoop = !1);
    }, _purgeElements: function () {
      var e = this._elements,
          t = e.length,
          n = void 0,
          o = [];for (n = 0; n < t; n++) {
        var i = e[n];_(i) && o.push(n);
      }for (; o.length > 0;) e.splice(o.pop(), 1);
    }, _startScrollHandler: function () {
      this._isHandlingScroll || (this._isHandlingScroll = !0, this._settings.container.addEventListener("scroll", this._boundHandleScroll));
    }, _stopScrollHandler: function () {
      this._isHandlingScroll && (this._isHandlingScroll = !1, this._settings.container.removeEventListener("scroll", this._boundHandleScroll));
    }, handleScroll: function () {
      var e = this._settings.throttle;if (0 !== e) {
        var t = Date.now(),
            n = e - (t - this._previousLoopTime);n <= 0 || n > e ? (this._loopTimeout && (clearTimeout(this._loopTimeout), this._loopTimeout = null), this._previousLoopTime = t, this._loopThroughElements()) : this._loopTimeout || (this._loopTimeout = setTimeout(function () {
          this._previousLoopTime = Date.now(), this._loopTimeout = null, this._loopThroughElements();
        }.bind(this), n));
      } else this._loopThroughElements();
    }, loadAll: function () {
      this._loopThroughElements(!0);
    }, update: function () {
      this._elements = Array.prototype.slice.call(this._queryOriginNode.querySelectorAll(this._settings.elements_selector)), this._purgeElements(), this._loopThroughElements(), this._startScrollHandler();
    }, destroy: function () {
      window.removeEventListener("resize", this._boundHandleScroll), this._loopTimeout && (clearTimeout(this._loopTimeout), this._loopTimeout = null), this._stopScrollHandler(), this._elements = null, this._queryOriginNode = null, this._settings = null;
    }, load: function (e, t) {
      this._reveal(e, t);
    } }, p && function (e, t) {
    if (t) if (t.length) for (var n, o = 0; n = t[o]; o += 1) c(e, n);else c(e, t);
  }(O, window.lazyLoadOptions), O;
});


},{}]},{},[12]);
