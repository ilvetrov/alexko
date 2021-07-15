const getView = require("../libs/get-view");

module.exports = function(req, res) {
  res.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8'
	});
	res.write(getView('head'));
}