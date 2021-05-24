const fs = require('fs');

function removeFileIfExists(path) {
	fs.lstat(path, (err, stats) => {
		if (err) console.error(err);
    fs.unlink(path, (err) => {
      if (err) console.error(err);
    });
	});
}

module.exports = removeFileIfExists;