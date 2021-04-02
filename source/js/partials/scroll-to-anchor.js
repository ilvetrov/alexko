const { smoothScrollToElement } = require("./smooth-scroll");

const links = document.getElementsByTagName('a');
for (let i = 0; i < links.length; i++) {
  const link = links[i];
  const anchorArray = link.href.match(/#\w+(-*\w+)*/i);
  if (anchorArray) {
    const anchor = anchorArray[0];
    const anchorElement = document.querySelector(anchor);

    if (anchorElement) {
      const offset = link.getAttribute('data-scroll-offset') || 0;
      link.onclick = () => {
        return smoothScrollToElement(anchorElement, offset);
      }
    }
  }
}