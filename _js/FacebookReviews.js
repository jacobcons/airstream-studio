const Fetch = require('./Fetch.js');
const { BASE_URL, PAGE_ID, ACCESS_TOKEN } = require('./facebookAPI.js');
const AOS = require('AOS');

class FacebookReviews {
  constructor(reviewCount) {
    this.elLoader = document.querySelector('.loader');
    this.elContainer = document.querySelector('.review-container');
    this.reviewCount = reviewCount;
  }

  async render(urls, cb) {
    const reviewCount = urls.length;
    const reviewCountHalf = Math.floor(reviewCount / 2);

    // append half of the reviews to the first column
    for (let i = 0; i < reviewCountHalf; i++) {
      this.elContainer.firstChild.insertAdjacentHTML('beforeEnd', this.reviewTemplate(urls[i]));
    }

    // append half of the reviews to the second column
    for (let i = reviewCountHalf; i < reviewCount; i++) {
      this.elContainer.lastChild.insertAdjacentHTML('beforeEnd', this.reviewTemplate(urls[i]));
    }

    // embed social plugins and run callback when done
    FB.XFBML.parse(this.elContainer, cb);
  }

  reviewTemplate(url) {
    return `
    <div class="review" data-aos="fade-down" data-aos-offset="200">
      <div class="fb-post" data-href=${url} data-width="auto"></div>
    </div>
    `;
  }

  showContainer() {
    this.elContainer.style.display = 'flex';
  }

  hideLoader() {
    this.elLoader.style.display = 'none';
  }

  buildUrls(ratings, ratingsOpenGraph) {
    let reviews = [];
    console.log(ratings)
    debugger;
    for (let i = 0; i < ratings.length; i++) {
      if (ratingsOpenGraph[i].open_graph_story.data.review_text) {
        const userId = ratings[i].reviewer.id;
        const postId = ratingsOpenGraph[i].open_graph_story.id;
        reviews.push(`https://www.facebook.com/${userId}/posts/${postId}`);
      }
    }

    return reviews.slice(0, this.reviewCount);
  }

  getRatings() {
    return Fetch.get(`${BASE_URL}/${PAGE_ID}/ratings?access_token=${ACCESS_TOKEN}&fields=reviewer`);
  }

  getRatingsOpenGraph() {
    return Fetch.get(`${BASE_URL}/${PAGE_ID}/ratings?access_token=${ACCESS_TOKEN}&fields=open_graph_story`);
  }
}

module.exports = new FacebookReviews(4);
