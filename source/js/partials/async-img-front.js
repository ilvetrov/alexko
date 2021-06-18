const removeWhitespaces = require("../../../libs/remove-whitespaces");
const { checkThatElementIsNear } = require("./check-scroll");

const imagesElements = document.querySelectorAll('[data-async-images]');
const loadingLazySupport = "loading" in HTMLImageElement.prototype;

function getAsyncBackgroundsOutput() {
  return document.getElementsByClassName('js-async-backgrounds')[0];
};

function initAllNotManualAsyncImg() {
  for (let elementIteration = 0; elementIteration < imagesElements.length; elementIteration++) {
    const imageElement = imagesElements[elementIteration];
    initAsyncImg(imageElement, false);
  }
}

initAllNotManualAsyncImg();

function initAsyncImg(imageElement, manual = true) {
  if (!imageElement.hasAttribute('data-async-images')) return 'not for async';
  
  const linksProperties = JSON.parse(imageElement.getAttribute('data-async-images'));
  
  if (linksProperties.manual && !manual) return;
  
  let setSrc;
  if (!linksProperties.isBackground) {
    setSrc = () => {
      setSrcForImg(linksProperties.images, linksProperties.scroll, imageElement);
    }
  } else {
    const imageNumber = Math.round(Math.random() * 99999);
    const backgroundClassName = `background-image-${imageNumber}`;
    setSrc = () => {
      setSrcForBackground(linksProperties.images, imageElement, backgroundClassName);
    }
  }

  window.addEventListener('load', function() {
    setSrc();
  });
}

function setSrcForBackground(images, imageElement, className) {
  const image = images[0];
  const newImage = new Image();
  newImage.src = image.webSrc;
  
  let html = '';
  imageElement.classList.add(className);

  newImage.onload = function() {
    html = html + removeWhitespaces(`
    @media (min-width: ${image.minWindowWidth}px) {
      .${className} {
        background-image: url("${image.webSrc}");
      }
    }
    `);
    getAsyncBackgroundsOutput().innerHTML = (getAsyncBackgroundsOutput().innerHTML || '') + html;
  };
}

function setSrcForImg(images, isScroll = true, imageElement) {
  const image = images[0];

  if (loadingLazySupport) {
    setNow();
  } else {
    if (!isScroll) return setAfterLoad();

    if (checkThatElementIsNear(imageElement, 800)) {
      setAfterLoad();
    } else {
      let didScroll = false;
      const scrollHandler = function() {
        didScroll = true;
      };
      window.addEventListener('scroll', scrollHandler, {
        passive: true
      });

      let finished = false;
      const interval = setInterval(() => {
        if (didScroll && !finished) {
          didScroll = false;
          if (checkThatElementIsNear(imageElement, 800)) {
            finished = true;
            setAfterLoad();

            setTimeout(() => {
              window.removeEventListener('scroll', scrollHandler, {
                passive: true
              });
              clearInterval(interval);
            }, 200);
          }
        }
      }, 300);
    }
  }
  
  function setAfterLoad() {
    var newImage = new Image();
    newImage.src = image.webSrc;
  
    newImage.onload = function() {
      setNow();
    };
  }
  function setNow() {
    requestAnimationFrame(function() {
      imageElement.src = image.webSrc;
    });
  }
}

module.exports = {
  initAsyncImg
}