const hbs = require('hbs');

hbs.registerHelper('repeat', require('handlebars-helper-repeat'));

require('./async-img');
require('./complex-if');
require('./inline-if');
require('./in-array');
require('./to-string');
require('./dynamic-partial');
require('./published-image-src');