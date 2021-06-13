(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

window.checkTimeSync = function (action) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var startTime = Date.now();

  for (var i = 0; i < amount; i++) {
    action();
  }

  console.log("syncTime: ".concat(Date.now() - startTime, "ms"));
};

window.checkTimeAsync = function (action) {
  var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (amount === 1) {
    var startTime = Date.now();
    action(sendEndTime);
  } else {
    var actions = [];

    for (var i = 0; i < amount; i++) {
      actions.push(action);
    }

    var startTime = Date.now();
    Promise.all(actions).then(sendEndTime);
  }

  function sendEndTime() {
    console.log("asyncTime: ".concat(Date.now() - startTime, "ms"));
  }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbm5lci1yZXNvdXJjZXMvYWRtaW4vc291cmNlL2pzL2RlYnVnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxNQUFNLENBQUMsYUFBUCxHQUF1QixVQUFVLE1BQVYsRUFBOEI7QUFBQSxNQUFaLE1BQVksdUVBQUgsQ0FBRztBQUNuRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBTCxFQUFsQjs7QUFDQSxPQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLE1BQXBCLEVBQTRCLENBQUMsRUFBN0IsRUFBaUM7QUFDL0IsSUFBQSxNQUFNO0FBQ1A7O0FBQ0QsRUFBQSxPQUFPLENBQUMsR0FBUixxQkFBeUIsSUFBSSxDQUFDLEdBQUwsS0FBYSxTQUF0QztBQUNELENBTkQ7O0FBUUEsTUFBTSxDQUFDLGNBQVAsR0FBd0IsVUFBVSxNQUFWLEVBQThCO0FBQUEsTUFBWixNQUFZLHVFQUFILENBQUc7O0FBQ3BELE1BQUksTUFBTSxLQUFLLENBQWYsRUFBa0I7QUFDaEIsUUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUwsRUFBaEI7QUFDQSxJQUFBLE1BQU0sQ0FBQyxXQUFELENBQU47QUFDRCxHQUhELE1BR087QUFDTCxRQUFNLE9BQU8sR0FBRyxFQUFoQjs7QUFDQSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLE1BQXBCLEVBQTRCLENBQUMsRUFBN0IsRUFBaUM7QUFDL0IsTUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLE1BQWI7QUFDRDs7QUFDRCxRQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBTCxFQUFoQjtBQUNBLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLElBQXJCLENBQTBCLFdBQTFCO0FBQ0Q7O0FBQ0QsV0FBUyxXQUFULEdBQXVCO0FBQ3JCLElBQUEsT0FBTyxDQUFDLEdBQVIsc0JBQTBCLElBQUksQ0FBQyxHQUFMLEtBQWEsU0FBdkM7QUFDRDtBQUNGLENBZkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJ3aW5kb3cuY2hlY2tUaW1lU3luYyA9IGZ1bmN0aW9uIChhY3Rpb24sIGFtb3VudCA9IDEpIHtcbiAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbW91bnQ7IGkrKykge1xuICAgIGFjdGlvbigpO1xuICB9XG4gIGNvbnNvbGUubG9nKGBzeW5jVGltZTogJHtEYXRlLm5vdygpIC0gc3RhcnRUaW1lfW1zYCk7XG59XG5cbndpbmRvdy5jaGVja1RpbWVBc3luYyA9IGZ1bmN0aW9uIChhY3Rpb24sIGFtb3VudCA9IDEpIHtcbiAgaWYgKGFtb3VudCA9PT0gMSkge1xuICAgIHZhciBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGFjdGlvbihzZW5kRW5kVGltZSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYWN0aW9ucyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50OyBpKyspIHtcbiAgICAgIGFjdGlvbnMucHVzaChhY3Rpb24pO1xuICAgIH1cbiAgICB2YXIgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICBQcm9taXNlLmFsbChhY3Rpb25zKS50aGVuKHNlbmRFbmRUaW1lKTtcbiAgfVxuICBmdW5jdGlvbiBzZW5kRW5kVGltZSgpIHtcbiAgICBjb25zb2xlLmxvZyhgYXN5bmNUaW1lOiAke0RhdGUubm93KCkgLSBzdGFydFRpbWV9bXNgKTtcbiAgfVxufSJdfQ==
