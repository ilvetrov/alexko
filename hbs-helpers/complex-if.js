const hbs = require('hbs');

hbs.registerHelper('ifInArray', (array, index, options) => {
  if (array[index]) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});