const removeWhitespaces = require("../../../libs/remove-whitespaces");

const imagesElements = document.querySelectorAll('[data-async-images]');

function getAsyncBackgroundsOutput() {
  return document.getElementsByClassName('js-async-backgrounds')[0];
};

function initAllNotManualAsyncImg() {
  for (let elementIteration = 0; elementIteration < imagesElements.length; elementIteration++) {
    const imageElement = imagesElements[elementIteration];
    setTimeout(() => {
      initAsyncImg(imageElement, false);
    }, 0);
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
      setSrcForImg(linksProperties.images, imageElement);
    }
  } else {
    const imageNumber = Math.round(Math.random() * 99999);
    const backgroundClassName = `background-image-${imageNumber}`;
    setSrc = () => {
      setSrcForBackground(linksProperties.images, imageElement, backgroundClassName);
    }
  }

  setSrc();
}

function setSrcForBackground(images, imageElement, className) {
  const newImage = new Image();
  newImage.src = images[0].webSrc;
  
  let html = '';
  images = Array.from(images).sort((a, b) => {
    return a.minWindowWidth - b.minWindowWidth;
  });
  imageElement.classList.add(className);

  newImage.onload = function() {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      html = html + removeWhitespaces(`
      @media (min-width: ${image.minWindowWidth}px) {
        .${className} {
          background-image: url("${image.webSrc}");
        }
      }
      `);
    }
    getAsyncBackgroundsOutput().innerHTML = (getAsyncBackgroundsOutput.innerHTML || '') + html;
  };
}

function setSrcForImg(images, imageElement) {
  const newImage = new Image();
  newImage.src = images[0].webSrc;

  images = Array.from(images);
  let minSizes = images.map((image) => {
    return image.minWindowWidth;
  });
  minSizes.sort((a, b) => {
    return b - a;
  });

  newImage.onload = function() {
    srcDependingOfTheWindowWidth();
  
    if (images.length > 1) {
      window.addEventListener('resize', () => {
        srcDependingOfTheWindowWidth();
      });
    }
  };

  function srcDependingOfTheWindowWidth() {
    for (let i = 0; i < minSizes.length; i++) {
      const minSize = minSizes[i];
      if (window.innerWidth >= minSize) {
        setTimeout(() => {
          const neededImage = images.find((image) => {
            return image.minWindowWidth === minSize;
          });
          
          if (imageElement.src !== neededImage.webSrc) {
            requestAnimationFrame(function() {
              imageElement.src = neededImage.webSrc;
            });
          }
        }, 0);
  
        break;
      }
    }
  }
}

module.exports = {
  initAsyncImg
}