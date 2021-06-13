const hbs = require('hbs');
const removeWhitespaces = require('../libs/remove-whitespaces');

hbs.registerHelper('removeWhitespaces', (options) => {
  return removeWhitespaces(options.fn(this));
});
