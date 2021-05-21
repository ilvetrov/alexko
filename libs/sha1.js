const crypto = require('crypto');

function sha1(str) {
  return crypto.createHash('sha1').update(String(str)).digest('hex');
}

module.exports = sha1;