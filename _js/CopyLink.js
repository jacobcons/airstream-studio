class CopyLink {
  constructor() {
    this.elLinks = document.querySelectorAll('.copy-link');
  }

  init() {
    this.elLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // copy link content to clipboard
        let temp = document.createElement('input');
        document.body.appendChild(temp);
        temp.value = link.textContent;
        temp.select();
        document.execCommand('copy');
        temp.remove();

        // display copied message
        e.target.classList.add('copy-link--copied');
        setTimeout(() => {
          e.target.classList.remove('copy-link--copied');
        }, 750);
      });
    });
  }
}

module.exports = new CopyLink();
