function lookAtMeAnimation(element) {
  if (!element.classList.contains('look-at-me')) {
    element.classList.add('look-at-me');
    setTimeout(() => {
      requestAnimationFrame(() => {
        element.classList.remove('look-at-me');
      });
    }, 750);
  }
}

module.exports = lookAtMeAnimation;