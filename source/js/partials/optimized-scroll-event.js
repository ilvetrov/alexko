const optimizedScrollEvent = new CustomEvent('scroll-optimized');

let didScroll = false;
window.addEventListener('scroll', function() {
  didScroll = true;
}, {
  passive: true
});

setInterval(() => {
  if (didScroll) {
    didScroll = false;

    window.dispatchEvent(optimizedScrollEvent);
  }
}, 300);