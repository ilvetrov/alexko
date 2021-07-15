const widthResizeEvent = new CustomEvent('resize-width');

let lastWidth = window.innerWidth;

window.addEventListener('resize', function() {
  if (window.innerWidth !== lastWidth) {
    lastWidth = window.innerWidth;
    
    window.dispatchEvent(widthResizeEvent);
  }
});