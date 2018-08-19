const Fetch = require('./Fetch.js');
const { BASE_URL, PAGE_ID, ACCESS_TOKEN } = require('./facebookAPI.js');

class FacebookStars {
  async render(rating) {
    const sheet = window.document.styleSheets[0];
    //sheet.insertRule(`[data-aos="fill-stars"].aos-animate { width: ${rating}; }`, 1);
  }

  async getRating() {
    const rating = await Fetch.get(`${BASE_URL}/${PAGE_ID}?access_token=${ACCESS_TOKEN}&fields=overall_star_rating`);
    return `${(rating.overall_star_rating / 5) * 100}%`;
  }
}

module.exports = new FacebookStars();
