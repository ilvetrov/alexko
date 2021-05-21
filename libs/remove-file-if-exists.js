const fs = require('fs');

function removeFileIfExists(path) {
	fs.lstat(path, (err, stats) => {
		if (err) throw err;
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
	});
}

module.exports = removeFileIfExists;