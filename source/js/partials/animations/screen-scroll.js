const { gsap } = require('./../libs/gsap.min');
const { ScrollTrigger } = require('./../libs/gsap-scroll-trigger.min');

const advantageItemWraps = document.getElementsByClassName('js-advantage-item-wrap');
const advantageItems = document.getElementsByClassName('js-advantage-item');
const lastAdvantageItem = advantageItems[advantageItems.length - 1];
const lastAdvantageItemWrap = advantageItemWraps[advantageItemWraps.length - 1];

ScrollTrigger.defaults({
  toggleActions: "play reverse play reverse"
});

const timeline = gsap.timeline();

timeline.to('.js-hello-section-wrap', {
  scrollTrigger: {
    trigger: advantageItems[0],
    start: 'center bottom',
    end: 'top center',
    scrub: true
  },
  y: -15,
  opacity: 0
});

for (let i = 0; i < advantageItemWraps.length; i++) {
  const advantageItemWrap = advantageItemWraps[i];
  timeline.to(advantageItemWrap, {
    scrollTrigger: {
      trigger: advantageItemWrap,
      start: 'center center',
      end: 'bottom 20%',
      pin: true,
      pinType: 'transform',
      scrub: true
    }
  });
  timeline.to(advantageItemWrap, {
    scrollTrigger: {
      trigger: advantageItemWrap,
      start: 'center 49%',
      end: 'top top',
      scrub: true
    },
    opacity: 0
  });
}
timeline.to(lastAdvantageItem, {
  scrollTrigger: {
    trigger: lastAdvantageItemWrap,
    start: 'center 49%',
    end: 'top top',
    scrub: true
  },
  y: -70
});
timeline.from('.js-portfolio-section', {
  scrollTrigger: {
    trigger: lastAdvantageItemWrap,
    start: 'center 49%',
    end: 'top 11%',
    scrub: true
  },
  opacity: 0
});