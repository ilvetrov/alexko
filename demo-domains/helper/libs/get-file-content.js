const fs = require('fs');
const { getRoot } = require('../../../libs/get-root');

function getFileContent(path) {
  return fs.readFileSync(getRoot() + '/demo-domains/helper/files/public/' + path).toString('utf-8');
}

module.exports = getFileContent;