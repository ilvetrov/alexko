let rootPath;
function initRoot(initRootPath) {
  rootPath = initRootPath;
}

function getRoot() {
  return rootPath;
}

module.exports = {
  initRoot,
  getRoot
};