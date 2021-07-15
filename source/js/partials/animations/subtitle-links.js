const subtitleLinks = document.getElementsByClassName('js-subtitle-link-accent');

if (!!subtitleLinks.length) {
  const animationClass = 'subtitle__inner-link_accent';
  
  function _run() {
    animateLink(0);
  }
  
  let delayModifier = 1;
  
  function animateLink(linkNumber) {
    const link = subtitleLinks[linkNumber];
  
    if (!link) {
      setTimeout(() => {
        _run();
  
        if (delayModifier < 12) {
          delayModifier++;
        }
      }, 1000 * 5 * delayModifier);
      return;
    }
  
    requestAnimationFrame(function() {
      link.classList.add(animationClass);
      
      setTimeout(() => {
        requestAnimationFrame(function() {
          link.classList.remove(animationClass);
          
          animateLink(linkNumber + 1);
        });
      }, 500);
    });
  }
  
  setTimeout(() => {
    _run();
  }, 1000 * 2);
}
