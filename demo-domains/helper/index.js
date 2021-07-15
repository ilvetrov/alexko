const debug = require('debug')('alexko:server');
const http = require('http');
const { URL } = require('url');

var port = normalizePort('3020');

const routes = {
	'/pop-up': require('./routes/pop-up'),
	'/head': require('./routes/head'),
	'/404': require('./routes/404')
};

var server = http.createServer(function(req, res) {
	let data = '';
	req.on('data', (chunk) => {
		data += chunk.toString();
	});
	req.on('end', () => {
		const body = (function() {
			if (data.trim() === '' || !data) return {};
			const object = JSON.parse('{"' + data.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
			for (const key in object) {
				if (Object.hasOwnProperty.call(object, key)) {
					const element = object[key];
					object[key] = decodeURIComponent(element);
				}
			}
			return object;
		}());

		const baseURL = `http://localhost:${port}/`;
		const queryObject = new URL(req.url, baseURL);
		const path = queryObject.pathname;
		const allData = (function() {
			let output = body;
			for (const parameter of queryObject.searchParams) {
				output[parameter[0]] = parameter[1];
			}
			return output;
		}());

		req.data = allData;
	
		getRoute(path)(req, res);
	
		res.end();
	});
	
});

function getRoute(path) {
	const index = Object.keys(routes).indexOf(path);
	if (index === -1) return routes['/404'];
	return routes[path];
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}
