const sizeOf = require("image-size");
const cache = require("./cache");

/**
 * @param {Object[]} images - Objects of Image settings
 * @param {string} images[].src - Image's src
 * @param {number} [images[].minWindowWidth=0] - Image is loading and visible when window width higher or equals this
 * @param {boolean} [scroll=true] - Load when appears in scroll area
 * @param {string} [isBackground=false] - default is img tag; isBackground turns on element's background styles
 */
function asyncImg(images, scroll = true, isBackground = false) {
  const defaultValues = {
    minWindowWidth: 0
  };

  let blank = '';
  let cookedLinks = {
    scroll: scroll,
    isBackground: isBackground,
    images: []
  };
  for (let i = 0; i < images.length; i++) {
    const image = {...defaultValues, ...images[i]};
    const serverSrc = image.src;
    image.src = image.src.match(/^\/?public\//) ? image.src.replace(/^\/?public\//, '/') : image.src;

    if (!isBackground && blank == '') {
      const dimensions = cache.getOrSet('image_from_' + serverSrc, () => {
        return sizeOf(serverSrc);
      });
      blank = `/services/blank?width=${dimensions.width}&height=${dimensions.height}`;
    }
    
    cookedLinks.images.push(image);
  }
  const asyncAttribute = `data-async-images='${JSON.stringify(cookedLinks)}'`;

  let html = '';
  if (!isBackground) {
    html = `src="${blank}" ${asyncAttribute}`;
  } else {
    html = asyncAttribute;
  }

  return html;
}

module.exports = {
  asyncImg
}