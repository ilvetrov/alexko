const removeWhitespaces = require("./remove-whitespaces");

const imagesElements = document.querySelectorAll('[data-async-images]');
const srcComplexStorage = {};

function getAsyncBackgroundsOutput() {
  return document.getElementsByClassName('js-async-backgrounds')[0];
};

for (let elementIteration = 0; elementIteration < imagesElements.length; elementIteration++) {
  const imageElement = imagesElements[elementIteration];
  setTimeout(() => {
    initAsyncImg(imageElement, false);
  }, 0);
}

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
  
  if (linksProperties.scroll) {
    const observer = new IntersectionObserver(function(entries) {
      for (let i = 0; i < entries.length; i++) {
        setTimeout(() => {
          const entry = entries[i];
          if (entry.isIntersecting) {
            observer.unobserve(imageElement);
            setSrc();
          }
        }, 0);
      }
    });
    observer.observe(imageElement);
  } else {
    setSrc();
  }
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
        setTimeout(() => {
          const neededImage = images.find((image) => {
            return image.minWindowWidth === minSize;
          });
  
          imageElement.src = neededImage.webSrc;
        }, 0);
  
        break;
      }
    }
  }
}

module.exports = {
  initAsyncImg
}