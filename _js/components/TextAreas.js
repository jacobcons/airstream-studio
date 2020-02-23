const autosize = require('autosize');

export default class TextAreas {
  constructor() {
    this.els = document.querySelectorAll('.input-field__text--textarea');
    autosize(this.els);
  }
}
