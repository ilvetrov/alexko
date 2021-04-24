function getFileName(path) {
	return (path.match(/\/?([^/]+)$/) || [])[1];
}

function getFileNameWithoutExt(path) {
	return (path.match(/\/?([^/]+?)\.?[^.]*$/) || [])[1];
}

module.exports = {
	getFileName,
	getFileNameWithoutExt
};