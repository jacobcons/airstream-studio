import ImageSlider from '../components/ImageSlider'
import Form from '../components/Form'

export default {
  init() {
		const imageSlider = new ImageSlider();
    imageSlider.init()
    const form = new Form();
  }
};