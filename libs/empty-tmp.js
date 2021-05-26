const fsExtra = require('fs-extra');
const { getRoot } = require('./get-root');

function emptyTmp() {
  fsExtra.emptyDir(getRoot() + '/tmp');
}

emptyTmp();
setInterval(() => {
  emptyTmp();
}, 1000 * 60 * 60 * 24);