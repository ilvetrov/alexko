const { checkThatElementIsNear } = require("./check-scroll");
const removeWhitespaces = require("./remove-whitespaces");

const imagesElements = document.querySelectorAll('[data-async-images]');
const srcComplexStorage = {};
let currentImageNumber = 0;

function getAsyncBackgroundsOutput() {
  return document.getElementsByClassName('js-async-backgrounds')[0];
};

for (let elementIteration = 0; elementIteration < imagesElements.length; elementIteration++) {
  const imageElement = imagesElements[elementIteration];
  initAsyncImg(imageElement, false);
}

function initAsyncImg(imageElement, manual = true) {
  const imageNumberOfThis = currentImageNumber;
  if (!imageElement.hasAttribute('data-async-images')) return 'not for async';

  const linksProperties = JSON.parse(imageElement.getAttribute('data-async-images'));

  if (linksProperties.manual && !manual) return;

  const backgroundClassName = `background-image-${imageNumberOfThis}`;
  
  let setSrc;
  if (!linksProperties.isBackground) {
    setSrc = () => {
      setSrcForImg(linksProperties.images, imageElement);
    }
  } else {
    setSrc = () => {
      setSrcForBackground(linksProperties.images, imageElement, backgroundClassName);
    }
  }
  
  if (linksProperties.scroll) {
    srcComplexStorage[imageNumberOfThis] = () => {
      if (checkThatElementIsNear(imageElement)) {
        window.removeEventListener('scroll', srcComplexStorage[imageNumberOfThis]);
  
        setSrc();
      }
    };
    if (!manual) {
      window.addEventListener('load', () => {
        if (checkThatElementIsNear(imageElement)) {
          setSrc();
        } else {
          window.addEventListener('scroll', srcComplexStorage[imageNumberOfThis]);
        }
      });
    } else {
      if (checkThatElementIsNear(imageElement)) {
        setSrc();
      } else {
        window.addEventListener('scroll', srcComplexStorage[imageNumberOfThis]);
      }
    }
  } else {
    if (!manual) {
      window.addEventListener('load', () => {
        setSrc();
      });
    } else {
      setSrc();
    }
  }

  currentImageNumber++;
}

function setSrcForBackground(images, imageElement, className) {
  imageElement.classList.add(className);
  
  let html = '';
  images = Array.from(images).sort((a, b) => {
    return a.minWindowWidth - b.minWindowWidth;
  });
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    html = html + removeWhitespaces(`
    @media (min-width: ${image.minWindowWidth}px) {
      .${className} {
        background-image: url(${image.webSrc});
      }
    }
    `);
  }
  getAsyncBackgroundsOutput().innerHTML = (getAsyncBackgroundsOutput.innerHTML || '') + html;
}

function setSrcForImg(images, imageElement) {
  images = Array.from(images);

  let minSizes = images.map((image) => {
    return image.minWindowWidth;
  });

  minSizes.sort((a, b) => {
    return b - a;
  });

  srcDependingOfTheWindowWidth();

  if (images.length > 1) {
    window.addEventListener('resize', () => {
      srcDependingOfTheWindowWidth();
    });
  }

  function srcDependingOfTheWindowWidth() {
    for (let i = 0; i < minSizes.length; i++) {
      const minSize = minSizes[i];
      if (window.innerWidth >= minSize) {
        
        const neededImage = images.find((image) => {
          return image.minWindowWidth === minSize;
        });
  
        if (imageElement.src != neededImage.webSrc) {
          imageElement.src = neededImage.webSrc;
        }
  
        break;
      }
    }
  }
}

module.exports = {
  initAsyncImg
}