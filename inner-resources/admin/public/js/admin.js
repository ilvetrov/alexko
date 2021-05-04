(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const checkPage = require("../../../../source/js/partials/check-page");
require("./partials/upload-files").init();

if (checkPage('edit-portfolio')) {
  require('./partials/editor');
  require('./partials/add-intro-images');
  require('./partials/input-send-to-cloud').init();
}
},{"../../../../source/js/partials/check-page":9,"./partials/add-intro-images":2,"./partials/editor":4,"./partials/input-send-to-cloud":5,"./partials/upload-files":6}],2:[function(require,module,exports){
const { addCallbackToUploaded, initUploadInput } = require("./upload-files");

const editorIntroImages = document.getElementsByClassName('js-editor-intro-images')[0];
const editorIntroDesktopImages = document.getElementsByClassName('js-editor-intro-desktop-images')[0];

if (editorIntroImages) {
  addCallbackToUploaded('intro_images', true, addNewPreviewConstructor('intro_images', editorIntroImages));
  addCallbackToUploaded('intro_desktop_images', true, addNewPreviewConstructor('intro_desktop_images', editorIntroDesktopImages));
  
  function addNewPreviewConstructor(idPrefix, container) {
    return function(preview, uploadedFile) {
      const previews = document.querySelectorAll(`[data-group-file-previews="${idPrefix}"]`);
      let amountOfPreviews = previews.length;
      let amountOfUploadedPreviews = 0;
      for (let i = 0; i < previews.length; i++) {
        const previewFromList = previews[i];
        if (previewFromList.classList.contains('uploaded')) {
          amountOfUploadedPreviews++;
        }
        if (previewFromList.classList.contains('js-sample')) {
          amountOfPreviews--;
        }
      }
    
      if (amountOfUploadedPreviews >= amountOfPreviews) {
        const sample = Array.from(previews).find((element) => {
          return element.classList.contains('js-sample');
        });
        if (sample) {
          const newPreview = sample.cloneNode(true);
          const newPreviewId = idPrefix + '_' + previews.length;
          const newInput = newPreview.getElementsByTagName('input')[0];
          const newLabel = newPreview.getElementsByTagName('label')[0];
    
          newPreview.setAttribute('data-upload-file-preview', newPreviewId);
          newInput.setAttribute('id', newPreviewId);
          newLabel.setAttribute('for', newPreviewId);
    
          container.appendChild(newPreview);
    
          sample.classList.remove('disabled', 'js-sample');
    
          const sampleInput = sample.getElementsByClassName('js-upload-files')[0];
    
          initUploadInput(sampleInput);
        }
      }
    }
  }
}
},{"./upload-files":6}],3:[function(require,module,exports){
const defaultProperties = {
  
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
},{}],4:[function(require,module,exports){
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
},{"./editor-properties":3}],5:[function(require,module,exports){
const checkJson = require("../../../../../libs/check-json");
const lookAtMeAnimation = require("../../../../../source/js/partials/look-at-me");

function init() {
  const buttons = document.querySelectorAll('[data-send-to-cloud-button]');
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    initButton(button);
  }
}

function initButton(button) {
  button.addEventListener('click', function() {
    if (button.classList.contains('process')) return false;

    button.classList.add('process');
    const data = JSON.parse(button.getAttribute('data-send-to-cloud-properties'));
    const groupName = button.getAttribute('data-send-to-cloud-button');
    const inputs = document.querySelectorAll(`[data-send-to-cloud-group="${groupName}"]`);
    const link = data.link;
  
    let values = data.values;
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const value = getInputValue(input);
      values = {...values, ...value};
    }
  
    const startTime = (new Date()).getTime();
    sendToCloud(link, values)
    .then(function() {
      const endTime = (new Date()).getTime();
      const processTime = endTime - startTime;
      setTimeout(() => {
        button.classList.remove('process');
      }, Math.max(700 - processTime, 0));
    })
    .catch(function(reason) {
      console.error(reason);
      button.classList.remove('process');
      lookAtMeAnimation(button);
    });
  });
}

function saveInputData(input) {
  const data = JSON.parse(input.getAttribute('data-send-to-cloud'));
  const link = data.link;
  const linkedInputs = input.getAttribute('data-linked-inputs')?.split(',').map((linkedInput) => {
    const linkedInputName = linkedInput.trim();
    return document.querySelector(`[name="${linkedInputName}"]`);
  });
  let values = getInputValue(input);
  if (linkedInputs) {
    for (let i = 0; i < linkedInputs.length; i++) {
      const linkedInput = linkedInputs[i];
      if (linkedInput) {
        values = {...values, ...getInputValue(linkedInput)};
      }
    }
  }
  
  sendToCloud(link, values);
}

function getInputValue(input) {
  const value = getInputValueFromElement(input);
  
  const values = {};
  values[input.getAttribute('data-send-to-cloud-name')] = checkJson(value) ? JSON.parse(value) : value;
  
  return values;
}

function getInputValueFromElement(input) {
  if (input.hasAttribute('data-send-to-cloud-attribute')) {
    const attributeName = input.getAttribute('data-send-to-cloud-attribute');
    return input.getAttribute(attributeName);
  };

  const inputType = input.tagName;
  let value = undefined;
  switch (inputType) {
    case 'INPUT':
      value = input.value || undefined;
      break;
  
    case 'SELECT':
      value = input.value || undefined;
      break;
  
    default:
      value = input.innerText.trim();
      break;
  }
  return value;
}

function sendToCloud(link, values) {
  return fetch(link, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(values)
  })
  .then((response) => {
    return response.json();
  });
}

module.exports = {
  init
}
},{"../../../../../libs/check-json":8,"../../../../../source/js/partials/look-at-me":10}],6:[function(require,module,exports){
const checkImg = require("../../../../../libs/check-img");

const callbacks = {};
const groupCallbacks = {};

function init() {
  const uploadInputs = document.getElementsByClassName('js-upload-files');
  
  for (let i = 0; i < uploadInputs.length; i++) {
    const uploadInput = uploadInputs[i];
    uploadInput.addEventListener('change', function() {
      processUploadInput(this);
    });
  }

  window.removePreviewOfUploadedFile = function(removeButton) {
    const input = removeButton.parentElement.getElementsByTagName('input')[0];
    const groupName = input.getAttribute('data-group-file');
    const dataOutput = groupName && document.querySelector(`[name="${groupName}"]`);
    let data = input.getAttribute('data-file') || '';
    if (dataOutput) {
      data = JSON.parse(dataOutput.value || '{}');
    }
    
    removePreview(input, data, dataOutput);
  }
}

function initUploadInput(input) {
  input.addEventListener('change', function() {
    processUploadInput(this);
  });
}

function processUploadInput(input) {
  if (!input.value) return;
  const id = input.getAttribute('id');
  const number = (id.match(/\d+$/) || [])[0] || 0;
  const projectId = input.getAttribute('data-project-id');
  const preview = document.querySelector(`[data-upload-file-preview="${id}"]`);
  const files = input.files;
  const groupName = input.getAttribute('data-group-file');
  const dataOutput = groupName && document.querySelector(`[name="${groupName}"]`);
  let data = input.getAttribute('data-file') || '';
  if (dataOutput) {
    data = JSON.parse(dataOutput.value || '{}');
  }

  if (preview.classList.contains('uploaded')) {
    removePreview(input, data, dataOutput);
  }

  deactivatePreview(preview);
  
  uploadFiles(files, projectId, function(uploadedFiles) {
    const uploadedFile = uploadedFiles[0];
    const uploadedFileWebSrc = uploadedFile.webSrc;
    if (dataOutput) {
      data[number] = uploadedFile;
    } else {
      data = uploadedFile;
    }

    if (dataOutput) {
      dataOutput.value = JSON.stringify(data);
    } else {
      input.setAttribute('data-file', JSON.stringify(data));
    }

    insertToPreview(uploadedFileWebSrc, preview, () => {
      activatePreview(preview);
    });

    dataOutput.dispatchEvent(new Event('change'));

    if (callbacks[id]) {
      for (let i = 0; i < callbacks[id].length; i++) {
        const callback = callbacks[id][i];
        callback(preview, uploadedFileWebSrc);
      }
    }
    if (dataOutput && groupCallbacks[groupName]) {
      for (let i = 0; i < groupCallbacks[groupName].length; i++) {
        const callback = groupCallbacks[groupName][i];
        callback(preview, uploadedFileWebSrc);
      }
    }
  }, function() {
    activatePreview(preview);
    dataOutput.dispatchEvent(new Event('change'));
  });
}

function uploadFiles(files, projectId, successCallback, errorCallback) {
  const formData = new FormData();
  formData.append('project_id', projectId);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    formData.append('files[]', file);
  }
  fetch('/admin/upload', {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: formData
  })
  .then((response) => {
    return response.json();
  })
  .then((uploadedFiles) => {
    successCallback(uploadedFiles);
  })
  .catch((err) => {
    // if (err) throw err;
    errorCallback(err);
  });
}

function deactivatePreview(preview) {
  preview.classList.add('process');
}

function activatePreview(preview) {
  preview.classList.remove('process');
}

function removePreview(input, data = undefined, dataOutput = undefined) {
  const id = input.getAttribute('id');
  const number = (id.match(/\d+$/) || [])[0] || 0;
  const preview = document.querySelector(`[data-upload-file-preview="${id}"]`);
  preview.classList.remove('uploaded');
  const img = preview.getElementsByClassName('upload-file__img')[0];
  if (img) img.remove();
  if (input.hasAttribute('data-file')) input.setAttribute('data-file', '');
  if (dataOutput && data !== undefined) {
    delete data[number];
    dataOutput.value = JSON.stringify(data);
  }

  return data;
}

function insertToPreview(uploadedFileWebSrc, preview, callback) {
  const label = preview.querySelector('[data-upload-file-label]');

  preview.classList.add('uploaded');

  if (checkImg(uploadedFileWebSrc)) {
    const img = document.createElement('img');
    img.classList.add('upload-file__img', 'img-cover');
    img.src = uploadedFileWebSrc;

    setTimeout(() => {
      label.appendChild(img);
      callback();
    }, 350);
  } else {
    callback();
  }
}

function addCallbackToUploaded(id, isGroup = false, callback) {
  if (isGroup) {
    if (!groupCallbacks[id]) groupCallbacks[id] = [];
    groupCallbacks[id].push(callback);
  } else {
    if (!callbacks[id]) callbacks[id] = [];
    callbacks[id].push(callback);
  }
}

module.exports = {
  init,
  initUploadInput,
  addCallbackToUploaded
}
},{"../../../../../libs/check-img":7}],7:[function(require,module,exports){
function checkImg(filePath) {
  const extname = (filePath.match(/.+?(\.[^.]+)$/) || [])[1];
  return extname == '.png'
  || extname == '.jpg'
  || extname == '.jpeg'
  || extname == '.webp'
  || extname == '.svg'
  || extname == '.gif';
}

module.exports = checkImg;
},{}],8:[function(require,module,exports){
function checkJson(string) {
  try {
    JSON.parse(string);
  } catch (error) {
    return false;
  }
  return true;
}

module.exports = checkJson;
},{}],9:[function(require,module,exports){
module.exports = (pageName) => {
  return document.getElementsByClassName(`js-${pageName}-page`).length > 0;
}
},{}],10:[function(require,module,exports){
function lookAtMeAnimation(element) {
  if (!element.classList.contains('look-at-me')) {
    element.classList.add('look-at-me');
    setTimeout(() => {
      requestAnimationFrame(() => {
        element.classList.remove('look-at-me');
      });
    }, 750);
  }
}

module.exports = lookAtMeAnimation;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbm5lci1yZXNvdXJjZXMvYWRtaW4vc291cmNlL2pzL2FkbWluLmpzIiwiaW5uZXItcmVzb3VyY2VzL2FkbWluL3NvdXJjZS9qcy9wYXJ0aWFscy9hZGQtaW50cm8taW1hZ2VzLmpzIiwiaW5uZXItcmVzb3VyY2VzL2FkbWluL3NvdXJjZS9qcy9wYXJ0aWFscy9lZGl0b3ItcHJvcGVydGllcy5qcyIsImlubmVyLXJlc291cmNlcy9hZG1pbi9zb3VyY2UvanMvcGFydGlhbHMvZWRpdG9yLmpzIiwiaW5uZXItcmVzb3VyY2VzL2FkbWluL3NvdXJjZS9qcy9wYXJ0aWFscy9pbnB1dC1zZW5kLXRvLWNsb3VkLmpzIiwiaW5uZXItcmVzb3VyY2VzL2FkbWluL3NvdXJjZS9qcy9wYXJ0aWFscy91cGxvYWQtZmlsZXMuanMiLCJsaWJzL2NoZWNrLWltZy5qcyIsImxpYnMvY2hlY2stanNvbi5qcyIsInNvdXJjZS9qcy9wYXJ0aWFscy9jaGVjay1wYWdlLmpzIiwic291cmNlL2pzL3BhcnRpYWxzL2xvb2stYXQtbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBjaGVja1BhZ2UgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vc291cmNlL2pzL3BhcnRpYWxzL2NoZWNrLXBhZ2VcIik7XG5yZXF1aXJlKFwiLi9wYXJ0aWFscy91cGxvYWQtZmlsZXNcIikuaW5pdCgpO1xuXG5pZiAoY2hlY2tQYWdlKCdlZGl0LXBvcnRmb2xpbycpKSB7XG4gIHJlcXVpcmUoJy4vcGFydGlhbHMvZWRpdG9yJyk7XG4gIHJlcXVpcmUoJy4vcGFydGlhbHMvYWRkLWludHJvLWltYWdlcycpO1xuICByZXF1aXJlKCcuL3BhcnRpYWxzL2lucHV0LXNlbmQtdG8tY2xvdWQnKS5pbml0KCk7XG59IiwiY29uc3QgeyBhZGRDYWxsYmFja1RvVXBsb2FkZWQsIGluaXRVcGxvYWRJbnB1dCB9ID0gcmVxdWlyZShcIi4vdXBsb2FkLWZpbGVzXCIpO1xuXG5jb25zdCBlZGl0b3JJbnRyb0ltYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWVkaXRvci1pbnRyby1pbWFnZXMnKVswXTtcbmNvbnN0IGVkaXRvckludHJvRGVza3RvcEltYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWVkaXRvci1pbnRyby1kZXNrdG9wLWltYWdlcycpWzBdO1xuXG5pZiAoZWRpdG9ySW50cm9JbWFnZXMpIHtcbiAgYWRkQ2FsbGJhY2tUb1VwbG9hZGVkKCdpbnRyb19pbWFnZXMnLCB0cnVlLCBhZGROZXdQcmV2aWV3Q29uc3RydWN0b3IoJ2ludHJvX2ltYWdlcycsIGVkaXRvckludHJvSW1hZ2VzKSk7XG4gIGFkZENhbGxiYWNrVG9VcGxvYWRlZCgnaW50cm9fZGVza3RvcF9pbWFnZXMnLCB0cnVlLCBhZGROZXdQcmV2aWV3Q29uc3RydWN0b3IoJ2ludHJvX2Rlc2t0b3BfaW1hZ2VzJywgZWRpdG9ySW50cm9EZXNrdG9wSW1hZ2VzKSk7XG4gIFxuICBmdW5jdGlvbiBhZGROZXdQcmV2aWV3Q29uc3RydWN0b3IoaWRQcmVmaXgsIGNvbnRhaW5lcikge1xuICAgIHJldHVybiBmdW5jdGlvbihwcmV2aWV3LCB1cGxvYWRlZEZpbGUpIHtcbiAgICAgIGNvbnN0IHByZXZpZXdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtZ3JvdXAtZmlsZS1wcmV2aWV3cz1cIiR7aWRQcmVmaXh9XCJdYCk7XG4gICAgICBsZXQgYW1vdW50T2ZQcmV2aWV3cyA9IHByZXZpZXdzLmxlbmd0aDtcbiAgICAgIGxldCBhbW91bnRPZlVwbG9hZGVkUHJldmlld3MgPSAwO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aWV3cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBwcmV2aWV3RnJvbUxpc3QgPSBwcmV2aWV3c1tpXTtcbiAgICAgICAgaWYgKHByZXZpZXdGcm9tTGlzdC5jbGFzc0xpc3QuY29udGFpbnMoJ3VwbG9hZGVkJykpIHtcbiAgICAgICAgICBhbW91bnRPZlVwbG9hZGVkUHJldmlld3MrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJldmlld0Zyb21MaXN0LmNsYXNzTGlzdC5jb250YWlucygnanMtc2FtcGxlJykpIHtcbiAgICAgICAgICBhbW91bnRPZlByZXZpZXdzLS07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBcbiAgICAgIGlmIChhbW91bnRPZlVwbG9hZGVkUHJldmlld3MgPj0gYW1vdW50T2ZQcmV2aWV3cykge1xuICAgICAgICBjb25zdCBzYW1wbGUgPSBBcnJheS5mcm9tKHByZXZpZXdzKS5maW5kKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1zYW1wbGUnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzYW1wbGUpIHtcbiAgICAgICAgICBjb25zdCBuZXdQcmV2aWV3ID0gc2FtcGxlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICBjb25zdCBuZXdQcmV2aWV3SWQgPSBpZFByZWZpeCArICdfJyArIHByZXZpZXdzLmxlbmd0aDtcbiAgICAgICAgICBjb25zdCBuZXdJbnB1dCA9IG5ld1ByZXZpZXcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF07XG4gICAgICAgICAgY29uc3QgbmV3TGFiZWwgPSBuZXdQcmV2aWV3LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsYWJlbCcpWzBdO1xuICAgIFxuICAgICAgICAgIG5ld1ByZXZpZXcuc2V0QXR0cmlidXRlKCdkYXRhLXVwbG9hZC1maWxlLXByZXZpZXcnLCBuZXdQcmV2aWV3SWQpO1xuICAgICAgICAgIG5ld0lucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCBuZXdQcmV2aWV3SWQpO1xuICAgICAgICAgIG5ld0xhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgbmV3UHJldmlld0lkKTtcbiAgICBcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobmV3UHJldmlldyk7XG4gICAgXG4gICAgICAgICAgc2FtcGxlLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJywgJ2pzLXNhbXBsZScpO1xuICAgIFxuICAgICAgICAgIGNvbnN0IHNhbXBsZUlucHV0ID0gc2FtcGxlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXVwbG9hZC1maWxlcycpWzBdO1xuICAgIFxuICAgICAgICAgIGluaXRVcGxvYWRJbnB1dChzYW1wbGVJbnB1dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iLCJjb25zdCBkZWZhdWx0UHJvcGVydGllcyA9IHtcbiAgXG59O1xuXG5sZXQgZWxlbWVudFdpdGhQcm9wZXJ0aWVzLCBwYWdlUHJvcGVydGllcztcblxudHJ5IHtcbiAgZWxlbWVudFdpdGhQcm9wZXJ0aWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtZWRpdG9yLXByb3BlcnRpZXNdJyk7XG4gIHBhZ2VQcm9wZXJ0aWVzID0gSlNPTi5wYXJzZShlbGVtZW50V2l0aFByb3BlcnRpZXMuZ2V0QXR0cmlidXRlKCdkYXRhLWVkaXRvci1wcm9wZXJ0aWVzJykpO1xufSBjYXRjaCAoZXJyb3IpIHtcbiAgcGFnZVByb3BlcnRpZXMgPSB7fTtcbn1cblxuY29uc3QgZWRpdG9yUHJvcGVydGllcyA9IHsuLi5kZWZhdWx0UHJvcGVydGllcywgLi4ucGFnZVByb3BlcnRpZXN9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVkaXRvclByb3BlcnRpZXM7IiwiY29uc3QgZWRpdG9yUHJvcGVydGllcyA9IHJlcXVpcmUoXCIuL2VkaXRvci1wcm9wZXJ0aWVzXCIpO1xuXG5jb25zdCBmaWVsZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1lZGl0b3ItZmllbGQnKTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgY29uc3QgZmllbGQgPSBmaWVsZHNbaV07XG5cbiAgaWYgKGVkaXRvclByb3BlcnRpZXMubmV3KSB7XG4gICAgZmllbGQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGZpZWxkLmlubmVyVGV4dC50cmltKCkgPT09ICcnKSB7XG4gICAgICAgIGZpZWxkLmlubmVyVGV4dCA9ICcnO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IiwiY29uc3QgY2hlY2tKc29uID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uLy4uL2xpYnMvY2hlY2stanNvblwiKTtcbmNvbnN0IGxvb2tBdE1lQW5pbWF0aW9uID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9qcy9wYXJ0aWFscy9sb29rLWF0LW1lXCIpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICBjb25zdCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2VuZC10by1jbG91ZC1idXR0b25dJyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGJ1dHRvbnNbaV07XG4gICAgaW5pdEJ1dHRvbihidXR0b24pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRCdXR0b24oYnV0dG9uKSB7XG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIGlmIChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdwcm9jZXNzJykpIHJldHVybiBmYWxzZTtcblxuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdwcm9jZXNzJyk7XG4gICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1zZW5kLXRvLWNsb3VkLXByb3BlcnRpZXMnKSk7XG4gICAgY29uc3QgZ3JvdXBOYW1lID0gYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS1zZW5kLXRvLWNsb3VkLWJ1dHRvbicpO1xuICAgIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLXNlbmQtdG8tY2xvdWQtZ3JvdXA9XCIke2dyb3VwTmFtZX1cIl1gKTtcbiAgICBjb25zdCBsaW5rID0gZGF0YS5saW5rO1xuICBcbiAgICBsZXQgdmFsdWVzID0gZGF0YS52YWx1ZXM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGlucHV0ID0gaW5wdXRzW2ldO1xuICAgICAgY29uc3QgdmFsdWUgPSBnZXRJbnB1dFZhbHVlKGlucHV0KTtcbiAgICAgIHZhbHVlcyA9IHsuLi52YWx1ZXMsIC4uLnZhbHVlfTtcbiAgICB9XG4gIFxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgc2VuZFRvQ2xvdWQobGluaywgdmFsdWVzKVxuICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZW5kVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgICBjb25zdCBwcm9jZXNzVGltZSA9IGVuZFRpbWUgLSBzdGFydFRpbWU7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcbiAgICAgIH0sIE1hdGgubWF4KDcwMCAtIHByb2Nlc3NUaW1lLCAwKSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHJlYXNvbik7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgncHJvY2VzcycpO1xuICAgICAgbG9va0F0TWVBbmltYXRpb24oYnV0dG9uKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNhdmVJbnB1dERhdGEoaW5wdXQpIHtcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXNlbmQtdG8tY2xvdWQnKSk7XG4gIGNvbnN0IGxpbmsgPSBkYXRhLmxpbms7XG4gIGNvbnN0IGxpbmtlZElucHV0cyA9IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1saW5rZWQtaW5wdXRzJyk/LnNwbGl0KCcsJykubWFwKChsaW5rZWRJbnB1dCkgPT4ge1xuICAgIGNvbnN0IGxpbmtlZElucHV0TmFtZSA9IGxpbmtlZElucHV0LnRyaW0oKTtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW25hbWU9XCIke2xpbmtlZElucHV0TmFtZX1cIl1gKTtcbiAgfSk7XG4gIGxldCB2YWx1ZXMgPSBnZXRJbnB1dFZhbHVlKGlucHV0KTtcbiAgaWYgKGxpbmtlZElucHV0cykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlua2VkSW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaW5rZWRJbnB1dCA9IGxpbmtlZElucHV0c1tpXTtcbiAgICAgIGlmIChsaW5rZWRJbnB1dCkge1xuICAgICAgICB2YWx1ZXMgPSB7Li4udmFsdWVzLCAuLi5nZXRJbnB1dFZhbHVlKGxpbmtlZElucHV0KX07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBzZW5kVG9DbG91ZChsaW5rLCB2YWx1ZXMpO1xufVxuXG5mdW5jdGlvbiBnZXRJbnB1dFZhbHVlKGlucHV0KSB7XG4gIGNvbnN0IHZhbHVlID0gZ2V0SW5wdXRWYWx1ZUZyb21FbGVtZW50KGlucHV0KTtcbiAgXG4gIGNvbnN0IHZhbHVlcyA9IHt9O1xuICB2YWx1ZXNbaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXNlbmQtdG8tY2xvdWQtbmFtZScpXSA9IGNoZWNrSnNvbih2YWx1ZSkgPyBKU09OLnBhcnNlKHZhbHVlKSA6IHZhbHVlO1xuICBcbiAgcmV0dXJuIHZhbHVlcztcbn1cblxuZnVuY3Rpb24gZ2V0SW5wdXRWYWx1ZUZyb21FbGVtZW50KGlucHV0KSB7XG4gIGlmIChpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2VuZC10by1jbG91ZC1hdHRyaWJ1dGUnKSkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2VuZC10by1jbG91ZC1hdHRyaWJ1dGUnKTtcbiAgICByZXR1cm4gaW5wdXQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICB9O1xuXG4gIGNvbnN0IGlucHV0VHlwZSA9IGlucHV0LnRhZ05hbWU7XG4gIGxldCB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgc3dpdGNoIChpbnB1dFR5cGUpIHtcbiAgICBjYXNlICdJTlBVVCc6XG4gICAgICB2YWx1ZSA9IGlucHV0LnZhbHVlIHx8IHVuZGVmaW5lZDtcbiAgICAgIGJyZWFrO1xuICBcbiAgICBjYXNlICdTRUxFQ1QnOlxuICAgICAgdmFsdWUgPSBpbnB1dC52YWx1ZSB8fCB1bmRlZmluZWQ7XG4gICAgICBicmVhaztcbiAgXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhbHVlID0gaW5wdXQuaW5uZXJUZXh0LnRyaW0oKTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gc2VuZFRvQ2xvdWQobGluaywgdmFsdWVzKSB7XG4gIHJldHVybiBmZXRjaChsaW5rLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHZhbHVlcylcbiAgfSlcbiAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0XG59IiwiY29uc3QgY2hlY2tJbWcgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vbGlicy9jaGVjay1pbWdcIik7XG5cbmNvbnN0IGNhbGxiYWNrcyA9IHt9O1xuY29uc3QgZ3JvdXBDYWxsYmFja3MgPSB7fTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgY29uc3QgdXBsb2FkSW5wdXRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtdXBsb2FkLWZpbGVzJyk7XG4gIFxuICBmb3IgKGxldCBpID0gMDsgaSA8IHVwbG9hZElucHV0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHVwbG9hZElucHV0ID0gdXBsb2FkSW5wdXRzW2ldO1xuICAgIHVwbG9hZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvY2Vzc1VwbG9hZElucHV0KHRoaXMpO1xuICAgIH0pO1xuICB9XG5cbiAgd2luZG93LnJlbW92ZVByZXZpZXdPZlVwbG9hZGVkRmlsZSA9IGZ1bmN0aW9uKHJlbW92ZUJ1dHRvbikge1xuICAgIGNvbnN0IGlucHV0ID0gcmVtb3ZlQnV0dG9uLnBhcmVudEVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF07XG4gICAgY29uc3QgZ3JvdXBOYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLWdyb3VwLWZpbGUnKTtcbiAgICBjb25zdCBkYXRhT3V0cHV0ID0gZ3JvdXBOYW1lICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtncm91cE5hbWV9XCJdYCk7XG4gICAgbGV0IGRhdGEgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsZScpIHx8ICcnO1xuICAgIGlmIChkYXRhT3V0cHV0KSB7XG4gICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhT3V0cHV0LnZhbHVlIHx8ICd7fScpO1xuICAgIH1cbiAgICBcbiAgICByZW1vdmVQcmV2aWV3KGlucHV0LCBkYXRhLCBkYXRhT3V0cHV0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0VXBsb2FkSW5wdXQoaW5wdXQpIHtcbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgcHJvY2Vzc1VwbG9hZElucHV0KHRoaXMpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1VwbG9hZElucHV0KGlucHV0KSB7XG4gIGlmICghaW5wdXQudmFsdWUpIHJldHVybjtcbiAgY29uc3QgaWQgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gIGNvbnN0IG51bWJlciA9IChpZC5tYXRjaCgvXFxkKyQvKSB8fCBbXSlbMF0gfHwgMDtcbiAgY29uc3QgcHJvamVjdElkID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXByb2plY3QtaWQnKTtcbiAgY29uc3QgcHJldmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXVwbG9hZC1maWxlLXByZXZpZXc9XCIke2lkfVwiXWApO1xuICBjb25zdCBmaWxlcyA9IGlucHV0LmZpbGVzO1xuICBjb25zdCBncm91cE5hbWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JvdXAtZmlsZScpO1xuICBjb25zdCBkYXRhT3V0cHV0ID0gZ3JvdXBOYW1lICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtncm91cE5hbWV9XCJdYCk7XG4gIGxldCBkYXRhID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbGUnKSB8fCAnJztcbiAgaWYgKGRhdGFPdXRwdXQpIHtcbiAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhT3V0cHV0LnZhbHVlIHx8ICd7fScpO1xuICB9XG5cbiAgaWYgKHByZXZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCd1cGxvYWRlZCcpKSB7XG4gICAgcmVtb3ZlUHJldmlldyhpbnB1dCwgZGF0YSwgZGF0YU91dHB1dCk7XG4gIH1cblxuICBkZWFjdGl2YXRlUHJldmlldyhwcmV2aWV3KTtcbiAgXG4gIHVwbG9hZEZpbGVzKGZpbGVzLCBwcm9qZWN0SWQsIGZ1bmN0aW9uKHVwbG9hZGVkRmlsZXMpIHtcbiAgICBjb25zdCB1cGxvYWRlZEZpbGUgPSB1cGxvYWRlZEZpbGVzWzBdO1xuICAgIGNvbnN0IHVwbG9hZGVkRmlsZVdlYlNyYyA9IHVwbG9hZGVkRmlsZS53ZWJTcmM7XG4gICAgaWYgKGRhdGFPdXRwdXQpIHtcbiAgICAgIGRhdGFbbnVtYmVyXSA9IHVwbG9hZGVkRmlsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IHVwbG9hZGVkRmlsZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YU91dHB1dCkge1xuICAgICAgZGF0YU91dHB1dC52YWx1ZSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsZScsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBpbnNlcnRUb1ByZXZpZXcodXBsb2FkZWRGaWxlV2ViU3JjLCBwcmV2aWV3LCAoKSA9PiB7XG4gICAgICBhY3RpdmF0ZVByZXZpZXcocHJldmlldyk7XG4gICAgfSk7XG5cbiAgICBkYXRhT3V0cHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnKSk7XG5cbiAgICBpZiAoY2FsbGJhY2tzW2lkXSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYWxsYmFja3NbaWRdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gY2FsbGJhY2tzW2lkXVtpXTtcbiAgICAgICAgY2FsbGJhY2socHJldmlldywgdXBsb2FkZWRGaWxlV2ViU3JjKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRhdGFPdXRwdXQgJiYgZ3JvdXBDYWxsYmFja3NbZ3JvdXBOYW1lXSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cENhbGxiYWNrc1tncm91cE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gZ3JvdXBDYWxsYmFja3NbZ3JvdXBOYW1lXVtpXTtcbiAgICAgICAgY2FsbGJhY2socHJldmlldywgdXBsb2FkZWRGaWxlV2ViU3JjKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIGZ1bmN0aW9uKCkge1xuICAgIGFjdGl2YXRlUHJldmlldyhwcmV2aWV3KTtcbiAgICBkYXRhT3V0cHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1cGxvYWRGaWxlcyhmaWxlcywgcHJvamVjdElkLCBzdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcbiAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgZm9ybURhdGEuYXBwZW5kKCdwcm9qZWN0X2lkJywgcHJvamVjdElkKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGZpbGUgPSBmaWxlc1tpXTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGVzW10nLCBmaWxlKTtcbiAgfVxuICBmZXRjaCgnL2FkbWluL3VwbG9hZCcsIHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfSxcbiAgICBib2R5OiBmb3JtRGF0YVxuICB9KVxuICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICB9KVxuICAudGhlbigodXBsb2FkZWRGaWxlcykgPT4ge1xuICAgIHN1Y2Nlc3NDYWxsYmFjayh1cGxvYWRlZEZpbGVzKTtcbiAgfSlcbiAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAvLyBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgZXJyb3JDYWxsYmFjayhlcnIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVhY3RpdmF0ZVByZXZpZXcocHJldmlldykge1xuICBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ3Byb2Nlc3MnKTtcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGVQcmV2aWV3KHByZXZpZXcpIHtcbiAgcHJldmlldy5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVByZXZpZXcoaW5wdXQsIGRhdGEgPSB1bmRlZmluZWQsIGRhdGFPdXRwdXQgPSB1bmRlZmluZWQpIHtcbiAgY29uc3QgaWQgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gIGNvbnN0IG51bWJlciA9IChpZC5tYXRjaCgvXFxkKyQvKSB8fCBbXSlbMF0gfHwgMDtcbiAgY29uc3QgcHJldmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXVwbG9hZC1maWxlLXByZXZpZXc9XCIke2lkfVwiXWApO1xuICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ3VwbG9hZGVkJyk7XG4gIGNvbnN0IGltZyA9IHByZXZpZXcuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndXBsb2FkLWZpbGVfX2ltZycpWzBdO1xuICBpZiAoaW1nKSBpbWcucmVtb3ZlKCk7XG4gIGlmIChpbnB1dC5oYXNBdHRyaWJ1dGUoJ2RhdGEtZmlsZScpKSBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsZScsICcnKTtcbiAgaWYgKGRhdGFPdXRwdXQgJiYgZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZGVsZXRlIGRhdGFbbnVtYmVyXTtcbiAgICBkYXRhT3V0cHV0LnZhbHVlID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VG9QcmV2aWV3KHVwbG9hZGVkRmlsZVdlYlNyYywgcHJldmlldywgY2FsbGJhY2spIHtcbiAgY29uc3QgbGFiZWwgPSBwcmV2aWV3LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXVwbG9hZC1maWxlLWxhYmVsXScpO1xuXG4gIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgndXBsb2FkZWQnKTtcblxuICBpZiAoY2hlY2tJbWcodXBsb2FkZWRGaWxlV2ViU3JjKSkge1xuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZy5jbGFzc0xpc3QuYWRkKCd1cGxvYWQtZmlsZV9faW1nJywgJ2ltZy1jb3ZlcicpO1xuICAgIGltZy5zcmMgPSB1cGxvYWRlZEZpbGVXZWJTcmM7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxhYmVsLmFwcGVuZENoaWxkKGltZyk7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0sIDM1MCk7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDYWxsYmFja1RvVXBsb2FkZWQoaWQsIGlzR3JvdXAgPSBmYWxzZSwgY2FsbGJhY2spIHtcbiAgaWYgKGlzR3JvdXApIHtcbiAgICBpZiAoIWdyb3VwQ2FsbGJhY2tzW2lkXSkgZ3JvdXBDYWxsYmFja3NbaWRdID0gW107XG4gICAgZ3JvdXBDYWxsYmFja3NbaWRdLnB1c2goY2FsbGJhY2spO1xuICB9IGVsc2Uge1xuICAgIGlmICghY2FsbGJhY2tzW2lkXSkgY2FsbGJhY2tzW2lkXSA9IFtdO1xuICAgIGNhbGxiYWNrc1tpZF0ucHVzaChjYWxsYmFjayk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQsXG4gIGluaXRVcGxvYWRJbnB1dCxcbiAgYWRkQ2FsbGJhY2tUb1VwbG9hZGVkXG59IiwiZnVuY3Rpb24gY2hlY2tJbWcoZmlsZVBhdGgpIHtcbiAgY29uc3QgZXh0bmFtZSA9IChmaWxlUGF0aC5tYXRjaCgvLis/KFxcLlteLl0rKSQvKSB8fCBbXSlbMV07XG4gIHJldHVybiBleHRuYW1lID09ICcucG5nJ1xuICB8fCBleHRuYW1lID09ICcuanBnJ1xuICB8fCBleHRuYW1lID09ICcuanBlZydcbiAgfHwgZXh0bmFtZSA9PSAnLndlYnAnXG4gIHx8IGV4dG5hbWUgPT0gJy5zdmcnXG4gIHx8IGV4dG5hbWUgPT0gJy5naWYnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrSW1nOyIsImZ1bmN0aW9uIGNoZWNrSnNvbihzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBKU09OLnBhcnNlKHN0cmluZyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrSnNvbjsiLCJtb2R1bGUuZXhwb3J0cyA9IChwYWdlTmFtZSkgPT4ge1xuICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShganMtJHtwYWdlTmFtZX0tcGFnZWApLmxlbmd0aCA+IDA7XG59IiwiZnVuY3Rpb24gbG9va0F0TWVBbmltYXRpb24oZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsb29rLWF0LW1lJykpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2xvb2stYXQtbWUnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbG9vay1hdC1tZScpO1xuICAgICAgfSk7XG4gICAgfSwgNzUwKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvb2tBdE1lQW5pbWF0aW9uOyJdfQ==
