const { checkMobileView } = require('../check-mobile');

if (!checkMobileView()) {
  var introImages = document.getElementsByClassName('js-intro-image');
  
  var { gsap } = require('gsap/dist/gsap');
  var { ScrollTrigger } = require('gsap/dist/ScrollTrigger');
  
  var timeline = gsap.timeline();
}

const introImagesSelfTimelines = [];

function initIntroImages() {
  if (checkMobileView()) return;
  if (introImages.length === 0) return;
  const portfolioContents = document.getElementsByClassName('js-portfolio-content');
  if (!portfolioContents) return;
  
  const triggerHeader = portfolioContents[0].children[0];
  
  for (let i = 0; i < introImages.length; i++) {
    const introImage = introImages[i];
    const slide = introImage.parentElement;
    const isDesktop = introImage.hasAttribute('data-intro-image-desktop');

    introImagesSelfTimelines.push(timeline.fromTo(slide, {
      y: () => getOffset(introImage, isDesktop) || 0
    }, {
      scrollTrigger: {
        trigger: triggerHeader,
        start: 'top 110%',
        end: 'bottom 80%',
        scrub: true
      },
      y: 0,
      onReverseComplete: () => {
        slide.style.transform = '';
      },
      onStart: () => {
        slide.style.transform = '';
      }
    }));
    slide.style.transform = '';
    setTimeout(() => {
      slide.style.transform = '';
    }, 100);
  }
  return timeline;
}

function updateIntroImages() {
  if (checkMobileView()) return;
  if (introImages.length === 0) return;
  const portfolioContents = document.getElementsByClassName('js-portfolio-content');
  if (!portfolioContents) return;
  
  timeline.invalidate();

  if (!checkEmptyTransform(introImages[0])) {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    setTimeout(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, 200);
    setTimeout(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, 300);
  }
}

function checkEmptyTransform(introImage) {
  return (introImage.parentElement.style.transform == '' || introImage.parentElement.style.transform == 'translate(0px, 0px)');
}

if (!checkMobileView()) {
  window.addEventListener('load', function() {
    if (introImages.length === 0) return;
    ScrollTrigger.refresh();
  
    const centerImage = introImages[getCenterImage(introImages[0].hasAttribute('data-intro-image-desktop'))];
    
    setTimeout(() => {
      if (checkEmptyTransform(centerImage)) {
        ScrollTrigger.refresh();
      }
      window.addEventListener('scroll', refreshIfEmpty);
    }, 100);
  
    function refreshIfEmpty() {
      if (checkEmptyTransform(centerImage)) {
        window.removeEventListener('scroll', refreshIfEmpty);
        ScrollTrigger.refresh();
        
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 500);
      }
    }
  });
}

function getCenterImage(isDesktop) {
  return isDesktop ? 1 : 3;
}

let desktopOffset = getDesktopOffset();

function getDesktopOffset() {
  const windowWidth = window.innerWidth;
  if (windowWidth <= 1460) return 56;
  return 81;
}

let lastWindowWidth = window.innerWidth;
window.addEventListener('resize', function() {
  if (lastWindowWidth !== window.innerWidth) {
    lastWindowWidth = window.innerWidth;
    
    desktopOffset = getDesktopOffset();
  }
});

function getOffset(introImage, isDesktop = false) {
  const slide = introImage.parentElement;
  const slides = Array.from(introImages).map(introImageInArray => {
    return introImageInArray.parentElement;
  });

  if (isCenter(slide)) {
    return 0;
  }
  if (isDesktop) return desktopOffset;
  if (isAroundTheCenter(slide)) {
    return 56;
  }
  try {
    if (isEdge(slide, slides)) {
      return 56 * 2;
    }
    if (isEdge2(slide, slides)) {
      return 56 * 3;
    }

    return 56 * 3;
    
  } catch (error) {
    return 56 * 3;
  }
}

function isCenter(slide) {
  return (
    slide.classList.contains('swiper-slide-active')
    || (slide.classList.contains('swiper-slide-duplicate-active'))
  );
}

function isAroundTheCenter(slide) {
  return (
    (
      (slide.classList.contains('swiper-slide-next'))
      || (slide.classList.contains('swiper-slide-prev'))
      || (slide.classList.contains('swiper-slide-duplicate-next'))
      || (slide.classList.contains('swiper-slide-duplicate-prev'))
    )
  );
}

function isEdge(slide, slides) {
  const i = Array.from(slides).indexOf(slide);
  const prevSlide = slides[i - 1];
  const nextSlide = slides[i + 1];

  return (
    (
      (prevSlide && prevSlide.classList.contains('swiper-slide-next'))
      || (nextSlide && nextSlide.classList.contains('swiper-slide-prev'))

      || (prevSlide && prevSlide.classList.contains('swiper-slide-duplicate-next'))
      || (nextSlide && nextSlide.classList.contains('swiper-slide-duplicate-prev'))
    )
  );
}

function isEdge2(slide, slides) {
  const i = Array.from(slides).indexOf(slide);
  const prevOfPrevSlide = slides[i - 2];
  const nextOfNextSlide = slides[i + 2];

  return (
    (prevOfPrevSlide && prevOfPrevSlide.classList.contains('swiper-slide-next'))
    || (nextOfNextSlide && nextOfNextSlide.classList.contains('swiper-slide-prev'))

    || (prevOfPrevSlide && prevOfPrevSlide.classList.contains('swiper-slide-duplicate-next'))
    || (nextOfNextSlide && nextOfNextSlide.classList.contains('swiper-slide-duplicate-prev'))
  );
}

module.exports = {
  initIntroImages,
  updateIntroImages,
  getCenterImage,
  isCenter,
  isAroundTheCenter,
  isEdge,
  isEdge2,
  introImagesSelfTimelines
};