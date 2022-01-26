const fs = require('fs-extra');

function moveDirectoryIfExists(oldPath, newPath) {
  return new Promise(function(resolve, reject) {
    fs.lstat(oldPath, (err, stats) => {
      if (err) return resolve();
      
      fs.move(oldPath, newPath)
      .then(resolve)
      .catch(reject);
    });
  });
}

module.exports = moveDirectoryIfExists;