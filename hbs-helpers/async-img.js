const hbs = require('hbs');
const { asyncImg } = require('../libs/async-img-loader');

hbs.registerHelper('asyncImg', (images, scroll = true, isBackground = false) => {
  if (typeof scroll == 'object') {
    scroll = true;
  }
  if (typeof isBackground == 'object') {
    isBackground = false;
  }

  return asyncImg(images, scroll, isBackground);
});