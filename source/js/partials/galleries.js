const { initIntroImages, updateIntroImages } = require('./animations/intro-images');
const { initAsyncImg } = require('./async-img-front');

const portfolioGalleries = document.querySelectorAll('[data-portfolio-gallery]');
if (portfolioGalleries.length > 0) {
  const { Swiper } = require('swiper');

  for (let i = 0; i < portfolioGalleries.length; i++) {
    const portfolioGallery = portfolioGalleries[i];
    const swiper = new Swiper(portfolioGallery, {
      slidesPerView: 'auto',
      centeredSlides: true,
      initialSlide: 3,
      spaceBetween: 67,
      slideToClickedSlide: true,
      loop: true,
      threshold: 5,
      on: {
        init: function() {
          setEdges(this);
          changeFloatPosition(this);

          initIntroImages();
        },
        slideChange: function() {
          setEdges(this);
          changeFloatPosition(this);

          updateIntroImages();
        },
        resize: function() {
          changeFloatPosition(this);
        },
        slidesLengthChange: function() {
          setTimeout(() => {
            initDuplicateImages(this);
          }, 500);
        }
      }
    });

    function changeFloatPosition(swiperState) {
      swiperState.setTranslate(Math.round(swiperState.translate));
    }
    function setEdges(swiperState) {
      const slides = swiperState.slides;

      setTimeout(() => {
        for (let i = 0; i < slides.length; i++) {
          const slide = slides[i];
          const prevSlide = slides[i - 1];
          const nextSlide = slides[i + 1];
          const prevOfPrevSlide = slides[i - 2];
          const nextOfNextSlide = slides[i + 2];
          
          let edgeIsSet = false;
          let edge2IsSet = false;
          if (
            (prevSlide && prevSlide.classList.contains('swiper-slide-next'))
            || (nextSlide && nextSlide.classList.contains('swiper-slide-prev'))
  
            || (prevSlide && prevSlide.classList.contains('swiper-slide-duplicate-next'))
            || (nextSlide && nextSlide.classList.contains('swiper-slide-duplicate-prev'))
          ) {
            slide.classList.add('swiper-slide-edge');
            slide.classList.remove('swiper-slide-edge-2');
            edgeIsSet = true;
          }
          if (
            (prevOfPrevSlide && prevOfPrevSlide.classList.contains('swiper-slide-next'))
            || (nextOfNextSlide && nextOfNextSlide.classList.contains('swiper-slide-prev'))
  
            || (prevOfPrevSlide && prevOfPrevSlide.classList.contains('swiper-slide-duplicate-next'))
            || (nextOfNextSlide && nextOfNextSlide.classList.contains('swiper-slide-duplicate-prev'))
          ) {
            slide.classList.add('swiper-slide-edge-2');
            slide.classList.remove('swiper-slide-edge');
            edge2IsSet = true;
          }
          if (!edgeIsSet && !edge2IsSet) {
            slide.classList.remove('swiper-slide-edge-2');
            slide.classList.remove('swiper-slide-edge');
          }
        }
      }, 0);
    }
    
    function initDuplicateImages(swiperState) {
      const imagesToLoad = swiperState.imagesToLoad;
      for (let i = 0; i < imagesToLoad.length; i++) {
        const imageToLoad = imagesToLoad[i];
        if (imageToLoad.parentElement.classList.contains('swiper-slide-duplicate')) {
          initAsyncImg(imageToLoad, true);
        }
      }
    }
  }

}