const { checkMobileView } = require('../check-mobile');

const screenScrollSelfTimelines = [];

const { gsap } = require('gsap/dist/gsap');

const advantageItemWraps = document.getElementsByClassName('js-advantage-item-wrap');
const advantageItems = document.getElementsByClassName('js-advantage-item');
const lastAdvantageItem = advantageItems[advantageItems.length - 1];
const lastAdvantageItemWrap = advantageItemWraps[advantageItemWraps.length - 1];

let aspectRatio = window.innerWidth / window.innerHeight;
let windowHeight = window.innerHeight;
let isMobile = checkMobileView();

const timeline = gsap.timeline();

timeline.to('.js-hello-section-wrap', {
  scrollTrigger: {
    trigger: advantageItems[0],
    start: () => {
      if (isMobile && aspectRatio < 1) return 'top bottom';
      return 'center bottom';
    },
    end: () => {
      if (isMobile && aspectRatio < 1) return 'top 5%';
      if (isMobile) return 'top 25%';
      return 'top center';
    },
    scrub: true
  },
  y: -15,
  opacity: 0
});

timeline.to('.js-hello-section-page-menu', {
  scrollTrigger: {
    trigger: advantageItems[0],
    start: () => {
      if (isMobile && aspectRatio < 1) return 'top bottom';
      return 'center bottom';
    },
    end: () => {
      if (isMobile && aspectRatio < 1) return 'top 5%';
      if (isMobile) return 'top 25%';
      return 'top center';
    },
    scrub: true
  },
  y: () => {
    if (isMobile && aspectRatio < 1) return -.04 * windowHeight;
    return -.022 * windowHeight;
  }
});

if (!checkMobileView()) {
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

window.addEventListener('resize', function() {
  aspectRatio = window.innerWidth / window.innerHeight;
  windowHeight = window.innerHeight;
  isMobile = checkMobileView();
});

module.exports = {
  screenScrollSelfTimelines
}