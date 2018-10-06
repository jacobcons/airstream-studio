const AOS = require('aos');
const queryString = require('query-string');

module.exports = {
  base: 'https://graph.facebook.com/',
  access_token: 'EAAYYSRcOKvcBAARSx9lIbGSE3Cj8X9BrvxAKeUDgxMN9cObKSinPraTDicZBT1vZAYsnIvsU5bDO5nX9g66B5xsFW5wRV7jxREtB52eumRG0swCZB3oe1vzjJhf4XpgtLUIhcIQRZCv9OHpidViI7q1XbjTQwDQgDZBtk1buRdgZDZD',
  pageId: '882543461878481',
  numberOfReviews: 8,

  async render() {
    const [starRating, postUrls] = await Promise.all([this.fetchStarRating(), this.buildUrls()]);
    this.renderReviews(postUrls, () => {
      this.hideLoader();
      this.renderStarRating(starRating);
      AOS.refreshHard();
    });
  },

  // tweet sized templating engine
  t(s, d) {
    for (var p in d)
      s = s.replace(new RegExp('{' + p + '}', 'g'), d[p]);
    return s;
  },

  async fetchStarRating() {
    const res = await(await fetch(this.base + this.pageId + '?' + queryString.stringify({ access_token: this.access_token, fields: 'overall_star_rating'}))).json();
    const rating = (res.overall_star_rating / 5) * 100 + '%';
    return rating;
  },

  renderStarRating(rating) {
    // add style to set width when aos-animate class is added
    let sheet = window.document.styleSheets[0];
    sheet.insertRule(`[data-aos="rating"].aos-animate { width: ${rating}; }`, 1);
  },

  async fetchReviews() {
    return await(await fetch(this.base + this.pageId + '/ratings?' + queryString.stringify({ access_token: this.access_token }))).json();
  },

  async fetchReviewsOpenGraph() {
    return await(await fetch(this.base + this.pageId + '/ratings?' + queryString.stringify({ access_token: this.access_token, fields: 'open_graph_story' }))).json();
  },

  async buildUrls() {
    let [reviews, reviewsOpenGraph] = await Promise.all([this.fetchReviews(), this.fetchReviewsOpenGraph()]);

    // get post id for each review
    const postIds = reviewsOpenGraph.data
                .filter((review, i) => {
                  if (review.open_graph_story.data.review_text) {
                    return true;
                  } else {
                    reviews.data.splice(i, 1);
                    return false;
                  }
                })
                .slice(0, this.numberOfReviews)
                .map(review => review.open_graph_story.id);

    // get user id for each review
    const userIds = reviews.data
                .slice(0, this.numberOfReviews)
                .map(review => review.reviewer.id);

    // build post urls from user and post id's
    let urls = [];
    for (let i = 0; i < this.numberOfReviews; i++) {
      urls.push('https://www.facebook.com/' + userIds[i] + '/posts/' + postIds[i]);
    }

    return urls;
  },

  async renderReviews(urls, cb) {
    let reviewContainer = document.querySelector('.facebook__container');
    const half = Math.floor(this.numberOfReviews / 2);
    const reviewTemplate = `
                            <div class="facebook__review" data-aos="fade-down" data-aos-offset="400">
                              <div class="fb-post" data-href={url} data-width="auto"></div>
                            </div>
                            `;

    // append half of the reviews to the first column
    for (let i = 0; i < half; i++) {
      reviewContainer.firstChild.insertAdjacentHTML('beforeEnd', this.t(reviewTemplate, { url: urls[i] }));
    }

    // append half of the reviews to the second column
    for (let i = half; i < this.numberOfReviews; i++) {
      reviewContainer.lastChild.insertAdjacentHTML('beforeEnd', this.t(reviewTemplate, { url: urls[i] }));
    }

    // embed social plugins and run callback when done
    window.fbAsyncInit = function() {
      FB.init({
        appId            : '247871935641546',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.10'
      });
      FB.AppEvents.logPageView();
      //FB.XFBML.parse(reviewContainer, cb);
    };
  },

  hideLoader() {
    let loader = document.querySelector('.facebook__loader');
    loader.style.display = 'none';
  },
};
