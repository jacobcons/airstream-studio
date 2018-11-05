export default {
  async get(url) {
    return await(await fetch(url)).json();
  },
  async post(url, data) {
    return await fetch(url, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }
}
