const isDevelopment = require("./is-development");

const currentDomain = !isDevelopment ? 'https://alexko.ltd' : 'http://localhost:3000';

module.exports = {
  currentDomain
}