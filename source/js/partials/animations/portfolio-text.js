const { gsap, Power1 } = require("gsap/dist/gsap");

const textBlocks = document.getElementsByClassName('text-block-animation');

for (let i = 0; i < textBlocks.length; i++) {
  const textBlock = textBlocks[i];
  gsap.fromTo(textBlock, {
    y: 15,
    opacity: 0
  }, {
    scrollTrigger: {
      trigger: textBlock,
      toggleActions: 'play none play none',
      start: 'top bottom',
      end: 'bottom top'
    },
    y: 0,
    opacity: 1,
    duration: .4,
    ease: Power1.easeInOut
  });
}