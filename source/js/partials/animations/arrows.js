const rightArrow = document.getElementsByClassName('js-right-arrow')[0];
const leftArrow = document.getElementsByClassName('js-left-arrow')[0];

if (rightArrow && leftArrow) {
  const { gsap, Back, Expo } = require('gsap/dist/gsap');
  
  const timeline = gsap.timeline({
    repeat: -1,
    delay: 2,
    repeatDelay: 5
  });
  
  window.addEventListener('load', () => {
  
    timeline.to(rightArrow, {
      duration: .6,
      x: 12,
      opacity: .1,
      ease: Back.easeIn.config(3)
    })
    .to(leftArrow, {
      duration: .35,
      x: 12,
      opacity: .1,
      ease: Expo.easeOut
    })
    .to(leftArrow, {
      duration: .3,
      x: 0,
      opacity: 1
    })
    .to(rightArrow, {
      duration: .3,
      x: 0,
      opacity: 1
    }, '-=.45');
  });
}
