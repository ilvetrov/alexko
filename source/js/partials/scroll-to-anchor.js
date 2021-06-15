const getFromBreakpoints = require("./get-from-breakpoints");
const { smoothScrollToElement } = require("./smooth-scroll");

let windowWidth = window.innerWidth;
window.addEventListener('resize', function() {
  windowWidth = window.innerWidth;
});

const links = document.getElementsByTagName('a');
for (let i = 0; i < links.length; i++) {
  try {
    const link = links[i];
    const anchorArray = link.href.match(/#\w+(-*\w+)*/i);
    if (anchorArray) {
      const anchor = anchorArray[0];
      const anchorElement = document.querySelector(anchor);
  
      if (anchorElement) {
        const getOffset = (function() {
          const offset = link.getAttribute('data-scroll-offset') || 0;
          const offsetMedia = JSON.parse(link.getAttribute('data-scroll-offset-media'));
          if (!offsetMedia) return () => offset;
          return () => getFromBreakpoints(offsetMedia, false, windowWidth) ?? offset;
        }());
        link.onclick = () => {
          return smoothScrollToElement(anchorElement, getOffset());
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

const buttons = document.querySelectorAll('[data-scroll-to]');
for (let i = 0; i < buttons.length; i++) {
  try {
    const button = buttons[i];
    const anchor = button.getAttribute('data-scroll-to');
    const anchorElement = document.getElementById(anchor);
    if (anchorElement) {
      const offset = button.getAttribute('data-scroll-offset') || 0;
      button.addEventListener('click', function() {
        smoothScrollToElement(anchorElement, offset);
      });
    }
  } catch (error) {
    console.error(error);
  }
}