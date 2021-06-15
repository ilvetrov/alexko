const { checkMobileView } = require('../check-mobile');

const screenScrollSelfTimelines = [];

if (!checkMobileView()) {
  const { gsap } = require('gsap/dist/gsap');
  
  const advantageItemWraps = document.getElementsByClassName('js-advantage-item-wrap');
  const advantageItems = document.getElementsByClassName('js-advantage-item');
  const lastAdvantageItem = advantageItems[advantageItems.length - 1];
  const lastAdvantageItemWrap = advantageItemWraps[advantageItemWraps.length - 1];
  
  const timeline = gsap.timeline();
  
  screenScrollSelfTimelines.push(timeline.to('.js-hello-section-wrap', {
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
    y: -.022 * window.innerHeight
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

module.exports = {
  screenScrollSelfTimelines
}