const hbs = require('hbs');

hbs.registerHelper('ifInArray', (array, index, options) => {
  if (array[index]) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper('ifEquals', (value1, value2, options) => {
  if (value1 === value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});