const hbs = require('hbs');
const fs = require('fs');
const { getRoot } = require('../../../libs/get-root');
const removeWhitespaces = require('../../../libs/remove-whitespaces');
const isDevelopment = require('../../../libs/is-development');
const removeHtmlComments = require('../../../libs/remove-html-comments');
const mainDomain = require('./main-domain');
const addWrapper = require('./add-wrapper');

const defaultOptions = {
	isDevelopment,
	mainDomain: mainDomain
}

function getView(name, options = {}) {
	const prefix = options.fromMain ? '/views/partials/' : '/demo-domains/helper/views/';
	return addWrapper(removeHtmlComments(removeWhitespaces(hbs.compile(String(fs.readFileSync(`${getRoot()}${prefix}${name}.hbs`)))({...defaultOptions, ...options}))));
}

module.exports = getView;