const filesVersion = require('../package.json').version;

const insertingFileVersion = '?ver=' + filesVersion;

module.exports = {
  filesVersion,
  insertingFileVersion
};