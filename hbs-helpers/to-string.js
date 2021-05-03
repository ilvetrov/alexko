const hbs = require('hbs');

hbs.registerHelper('toString', (value) => {
  return JSON.stringify(value);
});