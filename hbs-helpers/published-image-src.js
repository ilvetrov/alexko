const hbs = require('hbs');
const { asyncImg } = require('../libs/async-img-loader');
const getImgSrc = require('../libs/get-img-src');

hbs.registerHelper('published_image_src', (name) => {
  return asyncImg([getImgSrc(name, false)], true, false);
});