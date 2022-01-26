const isDevelopment = require("./is-development");

const currentDomain = !isDevelopment ? 'https://alexko.ltd' : ('http://localhost:' + process.env.PORT);

module.exports = {
  currentDomain
}