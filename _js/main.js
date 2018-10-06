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
