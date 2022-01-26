const isDevelopment = require("../../../libs/is-development");

const mainDomain = isDevelopment ? ('http://localhost:' + process.env.PORT) : 'https://alexko.ltd';

module.exports = mainDomain;