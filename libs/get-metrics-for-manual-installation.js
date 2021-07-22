const hbs = require('hbs');
const fs = require('fs');
const { getRoot } = require('./get-root');

const metricsCode = String(hbs.compile(String(fs.readFileSync(`${getRoot()}/views/partials/metrics-code.hbs`)))({}));

module.exports = {
  metricsCode
};