const fs = require('fs-extra');

function moveDirectoryIfExists(oldPath, newPath) {
  return new Promise(function(resolve, reject) {
    fs.lstat(oldPath, (err, stats) => {
      if (err) return resolve();
      
      fs.move(oldPath, newPath)
      .then(resolve)
      .catch(function(reason) {
        console.error(reason);
        reject();
      });
    });
  });
}

module.exports = moveDirectoryIfExists;