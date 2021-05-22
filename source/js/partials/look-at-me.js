function lookAtMeAnimation(element) {
  if (!element) return;

  if (!element.classList.contains('look-at-me')) {
    element.classList.add('look-at-me');
    setTimeout(() => {
      requestAnimationFrame(() => {
        element.classList.remove('look-at-me');
      });
    }, 750);
  }
}
function lookAtMeInlineAnimation(element) {
  if (!element) return;
  
  if (!element.classList.contains('look-at-me-inline')) {
    element.classList.add('look-at-me-inline');
    setTimeout(() => {
      requestAnimationFrame(() => {
        element.classList.remove('look-at-me-inline');
      });
    }, 750);
  }
}

module.exports = {
  lookAtMeAnimation,
  lookAtMeInlineAnimation
}