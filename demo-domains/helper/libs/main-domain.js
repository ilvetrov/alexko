const isDevelopment = require("../../../libs/is-development");

const mainDomain = isDevelopment ? 'http://localhost:3000' : 'https://alexko.ltd';

module.exports = mainDomain;