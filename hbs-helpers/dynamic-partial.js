const hbs = require('hbs');
const handlebars = require('handlebars');
const { getRoot } = require('../libs/get-root');
const cache = require('../libs/cache');
const fs = require('fs');

function dynamicPartial(path, options) {
  return cache.getOrSet(`partial_${path}`, function() {
    return hbs.compile(String(fs.readFileSync(`${getRoot()}/views/partials/${path}.hbs`)));
  })(options);
}

hbs.registerHelper('dPartial', (path, options) => {
  return dynamicPartial(path, options);
});

hbs.registerHelper('textPartial', (path, options) => {
  return dynamicPartial(`text/${path}`, options);
});