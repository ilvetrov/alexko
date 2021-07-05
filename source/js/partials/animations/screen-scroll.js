const { checkMobileView } = require('../check-mobile');

const screenScrollSelfTimelines = [];

const { gsap } = require('gsap/dist/gsap');

const helloSection = document.getElementsByClassName('js-hello-section')[0];
const helloSectionWrap = document.getElementsByClassName('js-hello-section-wrap')[0];
const helloSectionMobileBackground = document.getElementsByClassName('js-hello-section-mobile-background')[0];
const advantageItemWraps = document.getElementsByClassName('js-advantage-item-wrap');
const advantageItems = document.getElementsByClassName('js-advantage-item');
const lastAdvantageItem = advantageItems[advantageItems.length - 1];
const lastAdvantageItemWrap = advantageItemWraps[advantageItemWraps.length - 1];

let windowHeight = window.innerHeight;
let isMobile = checkMobileView();
let mobileAnimationsExist = false;

const timeline = gsap.timeline();

function mobileAnimations() {
  timeline.to(helloSectionMobileBackground, {
    scrollTrigger: {
      trigger: helloSection,
      start: 'bottom 95%',
      end: 'bottom center',
      scrub: true
    },
    opacity: 1
  });
}
if (!mobileAnimationsExist && isMobile) {
  mobileAnimationsExist = true;
  mobileAnimations();
}

if (!checkMobileView()) {
  screenScrollSelfTimelines.push(timeline.to(helloSectionWrap, {
    scrollTrigger: {
      trigger: advantageItems[0],
      start: 'center bottom',
      end: 'top center',
      scrub: true
    },
    y: -15,
    opacity: 0
  }));
  screenScrollSelfTimelines.push(timeline.to('.js-hello-section-page-menu', {
    scrollTrigger: {
      trigger: advantageItems[0],
      start: 'center bottom',
      end: 'top center',
      scrub: true
    },
    y: -.022 * windowHeight
  }));
  for (let i = 0; i < advantageItemWraps.length; i++) {
    const advantageItemWrap = advantageItemWraps[i];
    screenScrollSelfTimelines.push(timeline.to(advantageItemWrap, {
      scrollTrigger: {
        trigger: advantageItemWrap,
        start: 'center center',
        end: 'bottom 10%',
        pin: true,
        pinType: 'transform',
        scrub: true
      }
    }));
    screenScrollSelfTimelines.push(timeline.to(advantageItemWrap, {
      scrollTrigger: {
        trigger: advantageItemWrap,
        start: 'center 49%',
        end: 'top top',
        scrub: true
      },
      opacity: 0
    }));
  }
  screenScrollSelfTimelines.push(timeline.to(lastAdvantageItem, {
    scrollTrigger: {
      trigger: lastAdvantageItemWrap,
      start: 'center 49%',
      end: 'top top',
      scrub: true
    },
    y: -70
  }));
  screenScrollSelfTimelines.push(timeline.from('.js-portfolio-section', {
    scrollTrigger: {
      trigger: lastAdvantageItemWrap,
      start: 'center 49%',
      end: 'top 11%',
      scrub: true
    },
    opacity: 0
  }));
}

let lastWindowWidth = window.innerWidth;
window.addEventListener('resize', function() {
  if (lastWindowWidth !== window.innerWidth) {
    lastWindowWidth = window.innerWidth;
    
    windowHeight = window.innerHeight;
  }
  isMobile = checkMobileView();

  if (isMobile && !mobileAnimationsExist) {
    mobileAnimationsExist = true;

    mobileAnimations();
  }
});

module.exports = {
  screenScrollSelfTimelines
}