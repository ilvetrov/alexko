const { checkMobile, checkMobileAgent } = require("./check-mobile");

let advancedElementsForScrollBlocking = document.getElementsByClassName('js-for-replace-scrollbar');

const bodyPaddingClass = 'js-body-padding-instead-of-scrollbar';
const paddingClass = 'js-padding-instead-of-scrollbar';

function blockScroll() {
  if (checkScrollbar()) {
    blockScrollBar();
  }
  document.documentElement.classList.add('block-scroll');
}
function unblockScroll() {
  document.documentElement.classList.remove('block-scroll');
  unblockScrollBar();
}

function blockScrollBar() {
  document.body.style.paddingRight = getScrollBarWidth() + 'px';
  document.body.classList.add(bodyPaddingClass);
  for (let i = 0; i < advancedElementsForScrollBlocking.length; i++) {
    const advancedElementForScrollBlocking = advancedElementsForScrollBlocking[i];
    advancedElementForScrollBlocking.style.paddingRight = getScrollBarWidth() + 'px';
  }
}
function unblockScrollBar() {
  document.body.style.paddingRight = '';
  document.body.classList.remove(bodyPaddingClass);
  for (let i = 0; i < [...advancedElementsForScrollBlocking, ...document.getElementsByClassName(paddingClass)].length; i++) {
    const advancedElementForScrollBlocking = [...advancedElementsForScrollBlocking, ...document.getElementsByClassName(paddingClass)][i];
    if (advancedElementForScrollBlocking.style.paddingRight != '') {
      advancedElementForScrollBlocking.style.paddingRight = '';
    }
  }
}
function blockScrollBarIn(element, cached = false) {
  if (cached) {
    element.style.paddingRight = getScrollBarWidth() + 'px';
  } else {
    element.style.paddingRight = getScrollBarWidthFrom(element) + 'px';
  }
  element.classList.add(paddingClass);
}
function checkScrollbar() {
  return window.innerWidth > document.body.clientWidth;
}
function getScrollBarWidth() {
  const scrollBarWidth = window.innerWidth - document.body.clientWidth;
  return scrollBarWidth;
}
function checkScrollbarIn(element) {
  return element.offsetWidth > element.clientWidth;
}
function getScrollBarWidthFrom(element) {
  return element.offsetWidth - element.clientWidth;
}

window.addEventListener('resize-width', function() {
  if (checkMobileAgent()) {
    if (document.body.classList.contains(bodyPaddingClass)) {
      unblockScroll();
    }
  }
});

module.exports = {
  blockScroll,
  unblockScroll,
  blockScrollBar,
  blockScrollBarIn,
  checkScrollbar,
  checkScrollbarIn
}