(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const checkPage = require("../../../../source/js/partials/check-page");

if (checkPage('edit-portfolio')) {
  require('./partials/editor');
}
},{"../../../../source/js/partials/check-page":4,"./partials/editor":3}],2:[function(require,module,exports){
const defaultProperties = {
  new: false
};

let elementWithProperties, pageProperties;

try {
  elementWithProperties = document.querySelector('[data-editor-properties]');
  pageProperties = JSON.parse(elementWithProperties.getAttribute('data-editor-properties'));
} catch (error) {
  pageProperties = {};
}

const editorProperties = {...defaultProperties, ...pageProperties};

module.exports = editorProperties;
},{}],3:[function(require,module,exports){
const editorProperties = require("./editor-properties");

const fields = document.getElementsByClassName('js-editor-field');

for (let i = 0; i < fields.length; i++) {
  const field = fields[i];

  if (editorProperties.new) {
    field.addEventListener('blur', function() {
      if (field.innerText.trim() === '') {
        field.innerText = '';
      }
    });
  }
}
},{"./editor-properties":2}],4:[function(require,module,exports){
module.exports = (pageName) => {
  return document.getElementsByClassName(`js-${pageName}-page`).length > 0;
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbm5lci1yZXNvdXJjZXMvYWRtaW4vc291cmNlL2pzL2FkbWluLmpzIiwiaW5uZXItcmVzb3VyY2VzL2FkbWluL3NvdXJjZS9qcy9wYXJ0aWFscy9lZGl0b3ItcHJvcGVydGllcy5qcyIsImlubmVyLXJlc291cmNlcy9hZG1pbi9zb3VyY2UvanMvcGFydGlhbHMvZWRpdG9yLmpzIiwic291cmNlL2pzL3BhcnRpYWxzL2NoZWNrLXBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBjaGVja1BhZ2UgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vc291cmNlL2pzL3BhcnRpYWxzL2NoZWNrLXBhZ2VcIik7XG5cbmlmIChjaGVja1BhZ2UoJ2VkaXQtcG9ydGZvbGlvJykpIHtcbiAgcmVxdWlyZSgnLi9wYXJ0aWFscy9lZGl0b3InKTtcbn0iLCJjb25zdCBkZWZhdWx0UHJvcGVydGllcyA9IHtcbiAgbmV3OiBmYWxzZVxufTtcblxubGV0IGVsZW1lbnRXaXRoUHJvcGVydGllcywgcGFnZVByb3BlcnRpZXM7XG5cbnRyeSB7XG4gIGVsZW1lbnRXaXRoUHJvcGVydGllcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWVkaXRvci1wcm9wZXJ0aWVzXScpO1xuICBwYWdlUHJvcGVydGllcyA9IEpTT04ucGFyc2UoZWxlbWVudFdpdGhQcm9wZXJ0aWVzLmdldEF0dHJpYnV0ZSgnZGF0YS1lZGl0b3ItcHJvcGVydGllcycpKTtcbn0gY2F0Y2ggKGVycm9yKSB7XG4gIHBhZ2VQcm9wZXJ0aWVzID0ge307XG59XG5cbmNvbnN0IGVkaXRvclByb3BlcnRpZXMgPSB7Li4uZGVmYXVsdFByb3BlcnRpZXMsIC4uLnBhZ2VQcm9wZXJ0aWVzfTtcblxubW9kdWxlLmV4cG9ydHMgPSBlZGl0b3JQcm9wZXJ0aWVzOyIsImNvbnN0IGVkaXRvclByb3BlcnRpZXMgPSByZXF1aXJlKFwiLi9lZGl0b3ItcHJvcGVydGllc1wiKTtcblxuY29uc3QgZmllbGRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtZWRpdG9yLWZpZWxkJyk7XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gIGNvbnN0IGZpZWxkID0gZmllbGRzW2ldO1xuXG4gIGlmIChlZGl0b3JQcm9wZXJ0aWVzLm5ldykge1xuICAgIGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChmaWVsZC5pbm5lclRleHQudHJpbSgpID09PSAnJykge1xuICAgICAgICBmaWVsZC5pbm5lclRleHQgPSAnJztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gKHBhZ2VOYW1lKSA9PiB7XG4gIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBqcy0ke3BhZ2VOYW1lfS1wYWdlYCkubGVuZ3RoID4gMDtcbn0iXX0=
