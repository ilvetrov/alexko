const hbs = require('hbs');

hbs.registerHelper('inArray', (array, index) => {
  return array[index];
});