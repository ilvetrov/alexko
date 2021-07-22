const arrayRemove = require("../array-remove");

const subtitleLinks = document.getElementsByClassName('js-subtitle-link-accent');

if (!!subtitleLinks.length) {
  const animationClass = 'subtitle__inner-link_accent';
  
  function _run() {
    animateLink(0);
  }

  let hoveredLinks = [];

  for (let i = 0; i < subtitleLinks.length; i++) {
    const subtitleLink = subtitleLinks[i];
    subtitleLink.addEventListener('mouseenter', function() {
      if (hoveredLinks.indexOf(i) === -1) {
        hoveredLinks.push(i);
      }
    });
    subtitleLink.addEventListener('mouseout', function() {
      hoveredLinks = arrayRemove(hoveredLinks, i);
    });
  }
  
  let delayModifier = 1;
  
  function animateLink(linkNumber) {
    if (hoveredLinks.length > 0) {
      setTimeout(() => {
        _run();
      }, Math.max(1000 * 5 * delayModifier, 3000));
      return;
    }

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
