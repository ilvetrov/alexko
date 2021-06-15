const { initIntroImages, updateIntroImages, getCenterImage, isEdge, isEdge2 } = require('./animations/intro-images');
const { initAsyncImg } = require('./async-img-front');
const { getAllBefore, getAllAfter } = require('./get-array-parts');

let windowWidth = window.innerWidth;
window.addEventListener('resize', function() {
  windowWidth = window.innerWidth;
});

const portfolioGalleries = document.querySelectorAll('[data-portfolio-gallery]');
if (portfolioGalleries.length > 0) {
  const { Swiper } = require('swiper');
  
  let edgesExist = !checkMobile();

  for (let i = 0; i < portfolioGalleries.length; i++) {
    setTimeout(() => {
      const portfolioGallery = portfolioGalleries[i];
      const centeredSlides = portfolioGallery.hasAttribute('data-centered-slides');
      const upAndDown = portfolioGallery.hasAttribute('data-up-and-down');
      const isDesktop = portfolioGallery.classList.contains('desktop-gallery');
      const isLoop = portfolioGallery.hasAttribute('data-is-loop');
      const isIncrementingIndent = portfolioGallery.hasAttribute('data-increment-indent');
      const withIntroImages = portfolioGallery.hasAttribute('data-with-intro-images');
      const spaceBetween = Number(portfolioGallery.getAttribute('data-space-between') ?? 54);
      const initialSlide = getCenterImage(isDesktop);

      const swiper = new Swiper(portfolioGallery, {
        slidesPerView: 'auto',
        centeredSlides: centeredSlides,
        initialSlide: initialSlide,
        slideToClickedSlide: true,
        loop: isLoop,
        threshold: 5,
        on: {
          init: function() {
            changeFloatPosition(this);
            if (centeredSlides && !isDesktop && edgesExist) {
              setEdges(this);
            }
            
            if (withIntroImages && edgesExist) {
              initIntroImages();
            }
            if (isIncrementingIndent) {
              initIncrementingIndent(this);
            }
          },
          slideChange: function() {
            changeFloatPosition(this);
            if (centeredSlides && !isDesktop && edgesExist) {
              setEdges(this);
            }

            if (withIntroImages && edgesExist) {
              updateIntroImages();
            }
            if (isIncrementingIndent) {
              updateIncrementingIndent(this.activeIndex - initialSlide, portfolioGallery);
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
        },
        breakpoints: upAndDown ? {
          1241: {
            spaceBetween: spaceBetween
          },
          1024: {
            spaceBetween: 36
          },
          551: {
            spaceBetween: 24
          },
          496: {
            spaceBetween: isDesktop ? -60 : 0
          },
          465: {
            spaceBetween: isDesktop ? -55 : 0
          },
          441: {
            spaceBetween: isDesktop ? -52 : 0
          },
          418: {
            spaceBetween: isDesktop ? -49 : 0
          },
          376: {
            spaceBetween: isDesktop ? -46 : 0
          },
          356: {
            spaceBetween: isDesktop ? -43 : 0
          },
          336: {
            spaceBetween: isDesktop ? -40 : -5
          },
          0: {
            spaceBetween: isDesktop ? -38 : -5
          }
        } : {
          1400: {
            spaceBetween: spaceBetween,
          },
          1057: {
            spaceBetween: spaceBetween * 0.8,
          },
          990: {
            spaceBetween: spaceBetween * 0.7,
          },
          769: {
            spaceBetween: spaceBetween * 0.6,
          },
          561: {
            spaceBetween: isDesktop ? 14 : 24
          },
          0: {
            spaceBetween: 24
          }
        }
      });

      if (isIncrementingIndent) {
        let lastWindowWidth = window.innerWidth;
        window.addEventListener('resize', function() {
          if (lastWindowWidth !== window.innerWidth) {
            lastWindowWidth = window.innerWidth;
            initIncrementingIndent(swiper, initialSlide);
            updateIncrementingIndent(swiper.activeIndex - initialSlide, portfolioGallery);
          }
        });
      }
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

  function initIncrementingIndent(swiperState, initial = swiperState.activeIndex) {
    const initialSlide = swiperState.slides[initial];
    
    const prevSlides = getAllBefore(swiperState.slides, initialSlide);
    const reversedPrevSlides = [...prevSlides].reverse();

    const nextSlides = getAllAfter(swiperState.slides, initialSlide);

    const indent = window.innerWidth > 768 ? 30 : 16;

    for (let i = 0; i < swiperState.slides.length; i++) {
      setTimeout(() => {
        const slide = swiperState.slides[i];
        if (reversedPrevSlides.indexOf(slide) !== -1) {
          slide.style.transform = `translateY(-${(reversedPrevSlides.indexOf(slide) + 1) * indent}px)`;
        } else

        if (nextSlides.indexOf(slide) !== -1) {
          slide.style.transform = `translateY(${(nextSlides.indexOf(slide) + 1) * indent}px)`;
        } else

        if (slide === initialSlide) {
          slide.style.transform = `translateY(0px)`;
        }
      }, 0);
    }
  }

  function updateIncrementingIndent(indentLevel, portfolioGallery) {
    const indent = window.innerWidth > 768 ? 30 : 16;

    portfolioGallery.style.transform = `translateY(${-indent * indentLevel}px)`;
  }

  window.addEventListener('resize', function() {
    edgesExist = !checkMobile();
  });
}
