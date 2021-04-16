const introImages = document.getElementsByClassName('js-intro-image');
if (introImages.length === 0) return;

const { gsap } = require('gsap/dist/gsap');

const timeline = gsap.timeline();

function initIntroImages() {
  for (let i = 0; i < introImages.length; i++) {
    const introImage = introImages[i];
    const slide = introImage.parentElement;

    timeline.fromTo(slide, {
      y: () => {
        const calculated = getOffset(introImage) || 0;
        return calculated;
      }
    }, {
      scrollTrigger: {
        trigger: '.js-portfolio-intro-images',
        start: 'bottom bottom',
        end: 'center center',
        scrub: true
      },
      y: 0,
      onReverseComplete: () => {
        slide.style.transform = '';
      },
      onStart: () => {
        slide.style.transform = '';
      }
    });
    slide.style.transform = '';
    setTimeout(() => {
      slide.style.transform = '';
    }, 100);
  }
  return timeline;
}

function updateIntroImages() {
  timeline.invalidate();

  if (!(introImages[0].parentElement.style.transform == '' || introImages[0].parentElement.style.transform == 'translate(0px, 0px)')) {
    window.scrollTo({top: window.pageYOffset + 1, behavior: 'smooth'});
    setTimeout(() => {
      window.scrollTo({top: window.pageYOffset - 1, behavior: 'smooth'});
    }, 100);
  }
}

function getOffset(introImage) {
  const slide = introImage.parentElement;
  const i = Array.from(introImages).indexOf(introImage);

  if (
    slide.classList.contains('swiper-slide-active')
    || slide.classList.contains('swiper-slide-duplicate-active')
  ) {
    return 0;
  }
  if (
    (slide.classList.contains('swiper-slide-next'))
    || (slide.classList.contains('swiper-slide-prev'))
  ) {
    return 56;
  }
  try {
    const prevSlide = introImages[i - 1].parentElement;
    const nextSlide = introImages[i + 1].parentElement;
    const prevOfPrevSlide = introImages[i - 2].parentElement;
    const nextOfNextSlide = introImages[i + 2].parentElement;
    
    if (
      (prevSlide && prevSlide.classList.contains('swiper-slide-next'))
      || (nextSlide && nextSlide.classList.contains('swiper-slide-prev'))
  
      || (prevSlide && prevSlide.classList.contains('swiper-slide-duplicate-next'))
      || (nextSlide && nextSlide.classList.contains('swiper-slide-duplicate-prev'))
    ) {
      return 56 * 2;
    }
    if (
      (prevOfPrevSlide && prevOfPrevSlide.classList.contains('swiper-slide-next'))
      || (nextOfNextSlide && nextOfNextSlide.classList.contains('swiper-slide-prev'))
  
      || (prevOfPrevSlide && prevOfPrevSlide.classList.contains('swiper-slide-duplicate-next'))
      || (nextOfNextSlide && nextOfNextSlide.classList.contains('swiper-slide-duplicate-prev'))
    ) {
      return 56 * 3;
    }
    return 56 * 3;
    
  } catch (error) {
    return 56 * 3;
  }
}

module.exports = {
  initIntroImages,
  updateIntroImages
};