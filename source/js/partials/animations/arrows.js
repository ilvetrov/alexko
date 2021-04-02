const { gsap } = require('./../libs/gsap.min');
const { ScrollTrigger } = require('./../libs/gsap-scroll-trigger.min');

const timeline = gsap.timeline({
  repeat: -1,
  delay: 3,
  repeatDelay: 5
});

window.addEventListener('load', () => {
  timeline.to('.js-right-arrow', {
    duration: .6,
    x: 12,
    opacity: .1,
    ease: Back.easeIn.config(3)
  })
  .to('.js-left-arrow', {
    duration: .35,
    x: 12,
    opacity: .1,
    ease: Expo.easeOut
  })
  .to('.js-left-arrow', {
    duration: .3,
    x: 0,
    opacity: 1
  })
  .to('.js-right-arrow', {
    duration: .3,
    x: 0,
    opacity: 1
  }, '-=.45');
});