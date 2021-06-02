const { initIntroImages, updateIntroImages, getCenterImage, isEdge, isEdge2 } = require('./animations/intro-images');
const { initAsyncImg } = require('./async-img-front');
const { getAllBefore, getAllAfter } = require('./get-array-parts');

const portfolioGalleries = document.querySelectorAll('[data-portfolio-gallery]');
if (portfolioGalleries.length > 0) {
  const { Swiper } = require('swiper');

  for (let i = 0; i < portfolioGalleries.length; i++) {
    setTimeout(() => {
      const portfolioGallery = portfolioGalleries[i];
      const centeredSlides = portfolioGallery.hasAttribute('data-centered-slides');
      const isDesktop = portfolioGallery.classList.contains('desktop-gallery');
      const isLoop = portfolioGallery.hasAttribute('data-is-loop');
      const isIncrementingIndent = portfolioGallery.hasAttribute('data-increment-indent');
      const swiperWrapper = portfolioGallery.getElementsByClassName('swiper-wrapper')[0];
      const numberOfSlides = swiperWrapper.children.length;
      const withIntroImages = portfolioGallery.hasAttribute('data-with-intro-images');
      const spaceBetween = Number(portfolioGallery.getAttribute('data-space-between') ?? 67);
      const swiper = new Swiper(portfolioGallery, {
        slidesPerView: 'auto',
        centeredSlides: centeredSlides,
        initialSlide: getCenterImage(numberOfSlides) - (
          !centeredSlides && !isLoop && !isDesktop
            ? 1
            : 0
        ),
        spaceBetween: spaceBetween,
        slideToClickedSlide: true,
        loop: isLoop,
        threshold: 5,
        on: {
          init: function() {
            changeFloatPosition(this);
            if (centeredSlides) {
              setEdges(this);
            }
            
            if (withIntroImages) {
              initIntroImages();
            }
            if (isIncrementingIndent) {
              initIncrementingIndent(this);
            }
          },
          slideChange: function() {
            changeFloatPosition(this);
            if (centeredSlides) {
              setEdges(this);
            }

            if (withIntroImages) {
              updateIntroImages();
            }
            if (isIncrementingIndent) {
              initIncrementingIndent(this);
            }
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
    }, 0);

  }

  function changeFloatPosition(swiperState) {
    swiperState.setTranslate(Math.round(swiperState.translate));
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

  function initIncrementingIndent(swiperState) {
    const activeSlide = swiperState.slides[swiperState.activeIndex];
    
    const prevSlides = getAllBefore(swiperState.slides, activeSlide);
    const reversedPrevSlides = [...prevSlides].reverse();

    const nextSlides = getAllAfter(swiperState.slides, activeSlide);

    for (let i = 0; i < swiperState.slides.length; i++) {
      setTimeout(() => {
        const slide = swiperState.slides[i];
        if (reversedPrevSlides.indexOf(slide) !== -1) {
          slide.style.transform = `translateY(-${(reversedPrevSlides.indexOf(slide) + 1) * 30}px)`;
        } else

        if (nextSlides.indexOf(slide) !== -1) {
          slide.style.transform = `translateY(${(nextSlides.indexOf(slide) + 1) * 30}px)`;
        } else

        if (slide === activeSlide) {
          slide.style.transform = `translateY(0px)`;
        }
      }, 0);
    }
  }
}