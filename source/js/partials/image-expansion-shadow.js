const { checkThatElementIsNear } = require("./check-scroll");
const cookies = require("./cookies");

const imageExpansionShadowBlocks = document.getElementsByClassName('js-image-expansion-shadow-block');

const desktopImageGuideCompletedCookieName = 'digc';
let desktopImageGuideCompletedCookieExists = !!cookies.get(desktopImageGuideCompletedCookieName);
const initialWindowWidth = window.innerWidth;
for (let i = 0; i < imageExpansionShadowBlocks.length; i++) {
  const imageExpansionShadowBlock = imageExpansionShadowBlocks[i];
  const content = imageExpansionShadowBlock.getElementsByClassName('js-image-expansion-shadow-content')[0];
  const image = imageExpansionShadowBlock.getElementsByTagName('img')[0];
  const shadow = imageExpansionShadowBlock.getElementsByClassName('js-image-expansion-shadow')[0];
  let difference;
  
  function resizeHandler(windowWidth = window.innerWidth) {
    if (image.offsetWidth > windowWidth) {
      shadow.style.display = 'block';
      difference = image.offsetWidth - windowWidth;
    } else {
      shadow.style.display = 'none';
      difference = 0;
    }
  }
  resizeHandler(initialWindowWidth);
  window.addEventListener('resize', () => resizeHandler());

  content.addEventListener('scroll', function() {
    shadow.style.transform = `translateX(${Math.round((content.scrollLeft / difference) * 100)}%)`;
  });
  
  if (!desktopImageGuideCompletedCookieExists) {
    function desktopImageGuideCompletedCookieHandler() {
      if (desktopImageGuideCompletedCookieExists) {
        content.removeEventListener('touchmove', desktopImageGuideCompletedCookieHandler);
        return;
      }

      if (content.scrollLeft / difference > 0.7) {
        desktopImageGuideCompletedCookieExists = true;
        content.removeEventListener('touchmove', desktopImageGuideCompletedCookieHandler);
        cookies.set(desktopImageGuideCompletedCookieName, true, 720);
      }
    }
    content.addEventListener('touchmove', desktopImageGuideCompletedCookieHandler);
    
    if (i === 0 && !desktopImageGuideCompletedCookieExists) {
      function firstGuideHandler() {
        if (checkThatElementIsNear(content, -100)) {
          window.removeEventListener('scroll', firstGuideHandler);
          content.style.scrollBehavior = 'smooth';
          const guideScroll = difference / 2 >= 50 ? difference / 2 : difference;
          content.scrollLeft = guideScroll;
  
          let wasTouched = false;
          function toucheCheckHandler() {
            if (content.scrollLeft - guideScroll > 5) {
              content.removeEventListener('touchmove', toucheCheckHandler);
              wasTouched = true;
            }
          }
          content.addEventListener('touchmove', toucheCheckHandler);
  
          setTimeout(() => {
            if (wasTouched) {
              content.style.scrollBehavior = '';
              return;
            }
            content.removeEventListener('touchmove', toucheCheckHandler);
  
            content.scrollLeft = 0;
            setTimeout(() => {
              content.style.scrollBehavior = '';
            }, 200);
          }, 700);
        }
      }
      window.addEventListener('scroll', firstGuideHandler);
    }
  }

}