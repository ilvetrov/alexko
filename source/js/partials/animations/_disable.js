const checkPage = require('../check-page');

function disableScrollAnimations() {
  const { gsap } = require('gsap/dist/gsap');
  const { ScrollTrigger } = require('gsap/dist/ScrollTrigger');

  let selfTimelines = [];

  if (checkPage('home')) {
    const { screenScrollSelfTimelines } = require('./screen-scroll');
    selfTimelines = [...selfTimelines, ...screenScrollSelfTimelines];
  }
  const { introImagesSelfTimelines } = require('./intro-images');
  selfTimelines = [...selfTimelines, ...introImagesSelfTimelines];
  
  clearAllProps(selfTimelines);

  function clearProps(timeline) {
    const tweens = timeline.getChildren();
    for (let i = 0; i < tweens.length; i++) {
      const tween = tweens[i];
      for (let targetIteration = 0; targetIteration < tween._targets.length; targetIteration++) {
        const target = tween._targets[targetIteration];
        gsap.set(target, {
          clearProps: 'all'
        });
      }
      tween.scrollTrigger.disable();
    }
  }
  
  function clearAllProps(timelines) {
    for (let i = 0; i < timelines.length; i++) {
      clearProps(timelines[i]);
    }
  }
}



module.exports = {
  disableScrollAnimations
}