const { initIntroImages, updateIntroImages, getCenterImage, isEdge, isEdge2 } = require('./animations/intro-images');
const { initAsyncImg } = require('./async-img-front');

const portfolioGalleries = document.querySelectorAll('[data-portfolio-gallery]');
if (portfolioGalleries.length > 0) {
  const { Swiper } = require('swiper');

  for (let i = 0; i < portfolioGalleries.length; i++) {
    const portfolioGallery = portfolioGalleries[i];
    const swiperWrapper = portfolioGallery.getElementsByClassName('swiper-wrapper')[0];
    const numberOfSlides = swiperWrapper.children.length;
    const swiper = new Swiper(portfolioGallery, {
      slidesPerView: 'auto',
      centeredSlides: true,
      initialSlide: getCenterImage(numberOfSlides),
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
          
          let edgeIsSet = false;
          let edge2IsSet = false;

          if (isEdge(slide, slides)) {
            slide.classList.add('swiper-slide-edge');
            slide.classList.remove('swiper-slide-edge-2');
            edgeIsSet = true;
          }
          if (isEdge2(slide, slides)) {
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