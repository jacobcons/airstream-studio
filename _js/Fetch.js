class Fetch {
  async get(url) {
    return await(await fetch(url)).json();
  }

  async post(url, data) {
    return await fetch(url, {
      method: 'POST',
      body: data,
    });
  }
}

module.exports = new Fetch();
