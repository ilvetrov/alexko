const cache = require('./cache');

process.stdin.resume();

function exitHandler(options, exitCode) {
  if (options.callback) options.callback();
  if (exitCode) console.log(exitCode);
  if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null));

process.on('SIGINT', exitHandler.bind(null, {exit:true}));

process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

process.on('uncaughtException', exitHandler.bind(null, {exit:true}));