const hbs = require('hbs');
const { objectToRawString } = require('../libs/converters/object-to-raw-string');

hbs.registerHelper('toString', (value) => {
  return JSON.stringify(value);
});

hbs.registerHelper('toRawString', (value) => {
  return objectToRawString(value);
});