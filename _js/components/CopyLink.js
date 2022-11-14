export default class CopyLink {
  constructor() {
    this.el = document.querySelector('.copy-link');
    this.el.addEventListener('click', (e) => {
      this.copyToClipboard(this.el.textContent)
      this.confirmCopyMessage()
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
