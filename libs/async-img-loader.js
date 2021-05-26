const sizeOf = require("image-size");
const cache = require("./cache");
const fs = require("fs");

/**
 * @param {Object[]} images - Objects of Image settings
 * @param {string} images[].webSrc - Image's src for web
 * @param {string} images[].serverSrc - Image's src for server
 * @param {number} [images[].minWindowWidth=0] - Image is loading and visible when window width higher or equals this
 * @param {boolean} [scroll=true] - Load when appears in scroll area
 * @param {boolean} [isBackground=false] - default is img tag; isBackground turns on element's background styles
 * @param {boolean} [manual=false] - manual image init only after manual call of initAsyncImg
 */
function asyncImg(images, scroll = true, isBackground = false, manual = false) {
  const defaultValues = {
    minWindowWidth: 0
  };

  let html = '';

  try {
    if (images.length == 1 && cache.getOrSet(`image_can_write_without_blank_of_${images[0].serverSrc}`, () => {
      return fs.statSync(images[0].serverSrc).size < 700;
    })) {
      if (!isBackground) {
        html = `src="${images[0].webSrc}"`;
      } else {
        html = `style="background-image: url(${images[0].webSrc})"`;
      }
    } else {
  
      let blank = '';
      let cookedLinks = {
        scroll: scroll,
        isBackground: isBackground,
        images: [],
        manual: manual
      };
      for (let i = 0; i < images.length; i++) {
        const image = {...defaultValues, ...images[i]};
        const serverSrc = image.serverSrc;
    
        if (!isBackground && blank == '') {
          const dimensions = cache.getOrSet('image_size_of_' + serverSrc, () => {
            return sizeOf(serverSrc);
          });
          blank = `/services/blank?width=${dimensions.width}&height=${dimensions.height}`;
        }
        
        delete image.serverSrc;
        cookedLinks.images.push(image);
      }
      const asyncAttribute = `data-async-images='${JSON.stringify(cookedLinks)}'`;
    
      if (!isBackground) {
        html = `src="${blank}" ${asyncAttribute}`;
      } else {
        html = asyncAttribute;
      }
  
    }
  
    if (!isBackground) {
      html = html + ' loading="lazy"';
    }
  } catch (error) {

    if (!isBackground) {
      html = `src="${images[0].webSrc}" loading="lazy"`;
    } else {
      html = `style="background-image: url(${images[0].webSrc})"`;
    }

  }

  return html;
}

module.exports = {
  asyncImg
}