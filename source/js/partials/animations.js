const { gsap } = require('./libs/gsap.min');
const { ScrollTrigger } = require('./libs/gsap-scroll-trigger.min');

gsap.registerPlugin(ScrollTrigger);

// gsap.from('.left-appearing', {
//   duration: .2,
//   x: -100,
//   opacity: 0
// });