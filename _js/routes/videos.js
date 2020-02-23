import Videos from '../components/Videos'

export default {
  async init() {
    const videos = new Videos()
    await videos.init()
  }
};