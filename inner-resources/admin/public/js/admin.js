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
  draft: false
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
  const draft = input.getAttribute('data-is-draft');
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
  
  uploadFiles(files, projectId, draft, function(uploadedFiles) {
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

function uploadFiles(files, projectId, draft, successCallback, errorCallback) {
  const formData = new FormData();
  formData.append('project_id', projectId);
  formData.append('draft', draft);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbm5lci1yZXNvdXJjZXMvYWRtaW4vc291cmNlL2pzL2FkbWluLmpzIiwiaW5uZXItcmVzb3VyY2VzL2FkbWluL3NvdXJjZS9qcy9wYXJ0aWFscy9hZGQtaW50cm8taW1hZ2VzLmpzIiwiaW5uZXItcmVzb3VyY2VzL2FkbWluL3NvdXJjZS9qcy9wYXJ0aWFscy9lZGl0b3ItcHJvcGVydGllcy5qcyIsImlubmVyLXJlc291cmNlcy9hZG1pbi9zb3VyY2UvanMvcGFydGlhbHMvZWRpdG9yLmpzIiwiaW5uZXItcmVzb3VyY2VzL2FkbWluL3NvdXJjZS9qcy9wYXJ0aWFscy9pbnB1dC1zZW5kLXRvLWNsb3VkLmpzIiwiaW5uZXItcmVzb3VyY2VzL2FkbWluL3NvdXJjZS9qcy9wYXJ0aWFscy91cGxvYWQtZmlsZXMuanMiLCJsaWJzL2NoZWNrLWltZy5qcyIsImxpYnMvY2hlY2stanNvbi5qcyIsInNvdXJjZS9qcy9wYXJ0aWFscy9jaGVjay1wYWdlLmpzIiwic291cmNlL2pzL3BhcnRpYWxzL2xvb2stYXQtbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgY2hlY2tQYWdlID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL3NvdXJjZS9qcy9wYXJ0aWFscy9jaGVjay1wYWdlXCIpO1xucmVxdWlyZShcIi4vcGFydGlhbHMvdXBsb2FkLWZpbGVzXCIpLmluaXQoKTtcblxuaWYgKGNoZWNrUGFnZSgnZWRpdC1wb3J0Zm9saW8nKSkge1xuICByZXF1aXJlKCcuL3BhcnRpYWxzL2VkaXRvcicpO1xuICByZXF1aXJlKCcuL3BhcnRpYWxzL2FkZC1pbnRyby1pbWFnZXMnKTtcbiAgcmVxdWlyZSgnLi9wYXJ0aWFscy9pbnB1dC1zZW5kLXRvLWNsb3VkJykuaW5pdCgpO1xufSIsImNvbnN0IHsgYWRkQ2FsbGJhY2tUb1VwbG9hZGVkLCBpbml0VXBsb2FkSW5wdXQgfSA9IHJlcXVpcmUoXCIuL3VwbG9hZC1maWxlc1wiKTtcblxuY29uc3QgZWRpdG9ySW50cm9JbWFnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1lZGl0b3ItaW50cm8taW1hZ2VzJylbMF07XG5jb25zdCBlZGl0b3JJbnRyb0Rlc2t0b3BJbWFnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1lZGl0b3ItaW50cm8tZGVza3RvcC1pbWFnZXMnKVswXTtcblxuaWYgKGVkaXRvckludHJvSW1hZ2VzKSB7XG4gIGFkZENhbGxiYWNrVG9VcGxvYWRlZCgnaW50cm9faW1hZ2VzJywgdHJ1ZSwgYWRkTmV3UHJldmlld0NvbnN0cnVjdG9yKCdpbnRyb19pbWFnZXMnLCBlZGl0b3JJbnRyb0ltYWdlcykpO1xuICBhZGRDYWxsYmFja1RvVXBsb2FkZWQoJ2ludHJvX2Rlc2t0b3BfaW1hZ2VzJywgdHJ1ZSwgYWRkTmV3UHJldmlld0NvbnN0cnVjdG9yKCdpbnRyb19kZXNrdG9wX2ltYWdlcycsIGVkaXRvckludHJvRGVza3RvcEltYWdlcykpO1xuICBcbiAgZnVuY3Rpb24gYWRkTmV3UHJldmlld0NvbnN0cnVjdG9yKGlkUHJlZml4LCBjb250YWluZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ocHJldmlldywgdXBsb2FkZWRGaWxlKSB7XG4gICAgICBjb25zdCBwcmV2aWV3cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLWdyb3VwLWZpbGUtcHJldmlld3M9XCIke2lkUHJlZml4fVwiXWApO1xuICAgICAgbGV0IGFtb3VudE9mUHJldmlld3MgPSBwcmV2aWV3cy5sZW5ndGg7XG4gICAgICBsZXQgYW1vdW50T2ZVcGxvYWRlZFByZXZpZXdzID0gMDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJldmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcHJldmlld0Zyb21MaXN0ID0gcHJldmlld3NbaV07XG4gICAgICAgIGlmIChwcmV2aWV3RnJvbUxpc3QuY2xhc3NMaXN0LmNvbnRhaW5zKCd1cGxvYWRlZCcpKSB7XG4gICAgICAgICAgYW1vdW50T2ZVcGxvYWRlZFByZXZpZXdzKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByZXZpZXdGcm9tTGlzdC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLXNhbXBsZScpKSB7XG4gICAgICAgICAgYW1vdW50T2ZQcmV2aWV3cy0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgXG4gICAgICBpZiAoYW1vdW50T2ZVcGxvYWRlZFByZXZpZXdzID49IGFtb3VudE9mUHJldmlld3MpIHtcbiAgICAgICAgY29uc3Qgc2FtcGxlID0gQXJyYXkuZnJvbShwcmV2aWV3cykuZmluZCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnanMtc2FtcGxlJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc2FtcGxlKSB7XG4gICAgICAgICAgY29uc3QgbmV3UHJldmlldyA9IHNhbXBsZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgY29uc3QgbmV3UHJldmlld0lkID0gaWRQcmVmaXggKyAnXycgKyBwcmV2aWV3cy5sZW5ndGg7XG4gICAgICAgICAgY29uc3QgbmV3SW5wdXQgPSBuZXdQcmV2aWV3LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpWzBdO1xuICAgICAgICAgIGNvbnN0IG5ld0xhYmVsID0gbmV3UHJldmlldy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGFiZWwnKVswXTtcbiAgICBcbiAgICAgICAgICBuZXdQcmV2aWV3LnNldEF0dHJpYnV0ZSgnZGF0YS11cGxvYWQtZmlsZS1wcmV2aWV3JywgbmV3UHJldmlld0lkKTtcbiAgICAgICAgICBuZXdJbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywgbmV3UHJldmlld0lkKTtcbiAgICAgICAgICBuZXdMYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIG5ld1ByZXZpZXdJZCk7XG4gICAgXG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG5ld1ByZXZpZXcpO1xuICAgIFxuICAgICAgICAgIHNhbXBsZS5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcsICdqcy1zYW1wbGUnKTtcbiAgICBcbiAgICAgICAgICBjb25zdCBzYW1wbGVJbnB1dCA9IHNhbXBsZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy11cGxvYWQtZmlsZXMnKVswXTtcbiAgICBcbiAgICAgICAgICBpbml0VXBsb2FkSW5wdXQoc2FtcGxlSW5wdXQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiY29uc3QgZGVmYXVsdFByb3BlcnRpZXMgPSB7XG4gIGRyYWZ0OiBmYWxzZVxufTtcblxubGV0IGVsZW1lbnRXaXRoUHJvcGVydGllcywgcGFnZVByb3BlcnRpZXM7XG5cbnRyeSB7XG4gIGVsZW1lbnRXaXRoUHJvcGVydGllcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWVkaXRvci1wcm9wZXJ0aWVzXScpO1xuICBwYWdlUHJvcGVydGllcyA9IEpTT04ucGFyc2UoZWxlbWVudFdpdGhQcm9wZXJ0aWVzLmdldEF0dHJpYnV0ZSgnZGF0YS1lZGl0b3ItcHJvcGVydGllcycpKTtcbn0gY2F0Y2ggKGVycm9yKSB7XG4gIHBhZ2VQcm9wZXJ0aWVzID0ge307XG59XG5cbmNvbnN0IGVkaXRvclByb3BlcnRpZXMgPSB7Li4uZGVmYXVsdFByb3BlcnRpZXMsIC4uLnBhZ2VQcm9wZXJ0aWVzfTtcblxubW9kdWxlLmV4cG9ydHMgPSBlZGl0b3JQcm9wZXJ0aWVzOyIsImNvbnN0IGVkaXRvclByb3BlcnRpZXMgPSByZXF1aXJlKFwiLi9lZGl0b3ItcHJvcGVydGllc1wiKTtcblxuY29uc3QgZmllbGRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtZWRpdG9yLWZpZWxkJyk7XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gIGNvbnN0IGZpZWxkID0gZmllbGRzW2ldO1xuXG4gIGlmIChlZGl0b3JQcm9wZXJ0aWVzLm5ldykge1xuICAgIGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChmaWVsZC5pbm5lclRleHQudHJpbSgpID09PSAnJykge1xuICAgICAgICBmaWVsZC5pbm5lclRleHQgPSAnJztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSIsImNvbnN0IGNoZWNrSnNvbiA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi9saWJzL2NoZWNrLWpzb25cIik7XG5jb25zdCBsb29rQXRNZUFuaW1hdGlvbiA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi9zb3VyY2UvanMvcGFydGlhbHMvbG9vay1hdC1tZVwiKTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXNlbmQtdG8tY2xvdWQtYnV0dG9uXScpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBidXR0b24gPSBidXR0b25zW2ldO1xuICAgIGluaXRCdXR0b24oYnV0dG9uKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0QnV0dG9uKGJ1dHRvbikge1xuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xuICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2VuZC10by1jbG91ZC1wcm9wZXJ0aWVzJykpO1xuICAgIGNvbnN0IGdyb3VwTmFtZSA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2VuZC10by1jbG91ZC1idXR0b24nKTtcbiAgICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1zZW5kLXRvLWNsb3VkLWdyb3VwPVwiJHtncm91cE5hbWV9XCJdYCk7XG4gICAgY29uc3QgbGluayA9IGRhdGEubGluaztcbiAgXG4gICAgbGV0IHZhbHVlcyA9IGRhdGEudmFsdWVzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpbnB1dCA9IGlucHV0c1tpXTtcbiAgICAgIGNvbnN0IHZhbHVlID0gZ2V0SW5wdXRWYWx1ZShpbnB1dCk7XG4gICAgICB2YWx1ZXMgPSB7Li4udmFsdWVzLCAuLi52YWx1ZX07XG4gICAgfVxuICBcbiAgICBjb25zdCBzdGFydFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgIHNlbmRUb0Nsb3VkKGxpbmssIHZhbHVlcylcbiAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGVuZFRpbWUgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgICAgY29uc3QgcHJvY2Vzc1RpbWUgPSBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdwcm9jZXNzJyk7XG4gICAgICB9LCBNYXRoLm1heCg3MDAgLSBwcm9jZXNzVGltZSwgMCkpO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgY29uc29sZS5lcnJvcihyZWFzb24pO1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcbiAgICAgIGxvb2tBdE1lQW5pbWF0aW9uKGJ1dHRvbik7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzYXZlSW5wdXREYXRhKGlucHV0KSB7XG4gIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1zZW5kLXRvLWNsb3VkJykpO1xuICBjb25zdCBsaW5rID0gZGF0YS5saW5rO1xuICBjb25zdCBsaW5rZWRJbnB1dHMgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGlua2VkLWlucHV0cycpPy5zcGxpdCgnLCcpLm1hcCgobGlua2VkSW5wdXQpID0+IHtcbiAgICBjb25zdCBsaW5rZWRJbnB1dE5hbWUgPSBsaW5rZWRJbnB1dC50cmltKCk7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtsaW5rZWRJbnB1dE5hbWV9XCJdYCk7XG4gIH0pO1xuICBsZXQgdmFsdWVzID0gZ2V0SW5wdXRWYWx1ZShpbnB1dCk7XG4gIGlmIChsaW5rZWRJbnB1dHMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmtlZElucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbGlua2VkSW5wdXQgPSBsaW5rZWRJbnB1dHNbaV07XG4gICAgICBpZiAobGlua2VkSW5wdXQpIHtcbiAgICAgICAgdmFsdWVzID0gey4uLnZhbHVlcywgLi4uZ2V0SW5wdXRWYWx1ZShsaW5rZWRJbnB1dCl9O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgc2VuZFRvQ2xvdWQobGluaywgdmFsdWVzKTtcbn1cblxuZnVuY3Rpb24gZ2V0SW5wdXRWYWx1ZShpbnB1dCkge1xuICBjb25zdCB2YWx1ZSA9IGdldElucHV0VmFsdWVGcm9tRWxlbWVudChpbnB1dCk7XG4gIFxuICBjb25zdCB2YWx1ZXMgPSB7fTtcbiAgdmFsdWVzW2lucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS1zZW5kLXRvLWNsb3VkLW5hbWUnKV0gPSBjaGVja0pzb24odmFsdWUpID8gSlNPTi5wYXJzZSh2YWx1ZSkgOiB2YWx1ZTtcbiAgXG4gIHJldHVybiB2YWx1ZXM7XG59XG5cbmZ1bmN0aW9uIGdldElucHV0VmFsdWVGcm9tRWxlbWVudChpbnB1dCkge1xuICBpZiAoaW5wdXQuaGFzQXR0cmlidXRlKCdkYXRhLXNlbmQtdG8tY2xvdWQtYXR0cmlidXRlJykpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXNlbmQtdG8tY2xvdWQtYXR0cmlidXRlJyk7XG4gICAgcmV0dXJuIGlucHV0LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgfTtcblxuICBjb25zdCBpbnB1dFR5cGUgPSBpbnB1dC50YWdOYW1lO1xuICBsZXQgdmFsdWUgPSB1bmRlZmluZWQ7XG4gIHN3aXRjaCAoaW5wdXRUeXBlKSB7XG4gICAgY2FzZSAnSU5QVVQnOlxuICAgICAgdmFsdWUgPSBpbnB1dC52YWx1ZSB8fCB1bmRlZmluZWQ7XG4gICAgICBicmVhaztcbiAgXG4gICAgZGVmYXVsdDpcbiAgICAgIHZhbHVlID0gaW5wdXQuaW5uZXJUZXh0LnRyaW0oKTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gc2VuZFRvQ2xvdWQobGluaywgdmFsdWVzKSB7XG4gIHJldHVybiBmZXRjaChsaW5rLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHZhbHVlcylcbiAgfSlcbiAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0XG59IiwiY29uc3QgY2hlY2tJbWcgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vLi4vbGlicy9jaGVjay1pbWdcIik7XG5cbmNvbnN0IGNhbGxiYWNrcyA9IHt9O1xuY29uc3QgZ3JvdXBDYWxsYmFja3MgPSB7fTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgY29uc3QgdXBsb2FkSW5wdXRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtdXBsb2FkLWZpbGVzJyk7XG4gIFxuICBmb3IgKGxldCBpID0gMDsgaSA8IHVwbG9hZElucHV0cy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHVwbG9hZElucHV0ID0gdXBsb2FkSW5wdXRzW2ldO1xuICAgIHVwbG9hZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvY2Vzc1VwbG9hZElucHV0KHRoaXMpO1xuICAgIH0pO1xuICB9XG5cbiAgd2luZG93LnJlbW92ZVByZXZpZXdPZlVwbG9hZGVkRmlsZSA9IGZ1bmN0aW9uKHJlbW92ZUJ1dHRvbikge1xuICAgIGNvbnN0IGlucHV0ID0gcmVtb3ZlQnV0dG9uLnBhcmVudEVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF07XG4gICAgY29uc3QgZ3JvdXBOYW1lID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLWdyb3VwLWZpbGUnKTtcbiAgICBjb25zdCBkYXRhT3V0cHV0ID0gZ3JvdXBOYW1lICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtncm91cE5hbWV9XCJdYCk7XG4gICAgbGV0IGRhdGEgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsZScpIHx8ICcnO1xuICAgIGlmIChkYXRhT3V0cHV0KSB7XG4gICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhT3V0cHV0LnZhbHVlIHx8ICd7fScpO1xuICAgIH1cbiAgICBcbiAgICByZW1vdmVQcmV2aWV3KGlucHV0LCBkYXRhLCBkYXRhT3V0cHV0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0VXBsb2FkSW5wdXQoaW5wdXQpIHtcbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgcHJvY2Vzc1VwbG9hZElucHV0KHRoaXMpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcHJvY2Vzc1VwbG9hZElucHV0KGlucHV0KSB7XG4gIGlmICghaW5wdXQudmFsdWUpIHJldHVybjtcbiAgY29uc3QgaWQgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gIGNvbnN0IG51bWJlciA9IChpZC5tYXRjaCgvXFxkKyQvKSB8fCBbXSlbMF0gfHwgMDtcbiAgY29uc3QgcHJvamVjdElkID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXByb2plY3QtaWQnKTtcbiAgY29uc3QgZHJhZnQgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaXMtZHJhZnQnKTtcbiAgY29uc3QgcHJldmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXVwbG9hZC1maWxlLXByZXZpZXc9XCIke2lkfVwiXWApO1xuICBjb25zdCBmaWxlcyA9IGlucHV0LmZpbGVzO1xuICBjb25zdCBncm91cE5hbWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JvdXAtZmlsZScpO1xuICBjb25zdCBkYXRhT3V0cHV0ID0gZ3JvdXBOYW1lICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtncm91cE5hbWV9XCJdYCk7XG4gIGxldCBkYXRhID0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZpbGUnKSB8fCAnJztcbiAgaWYgKGRhdGFPdXRwdXQpIHtcbiAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhT3V0cHV0LnZhbHVlIHx8ICd7fScpO1xuICB9XG5cbiAgaWYgKHByZXZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCd1cGxvYWRlZCcpKSB7XG4gICAgcmVtb3ZlUHJldmlldyhpbnB1dCwgZGF0YSwgZGF0YU91dHB1dCk7XG4gIH1cblxuICBkZWFjdGl2YXRlUHJldmlldyhwcmV2aWV3KTtcbiAgXG4gIHVwbG9hZEZpbGVzKGZpbGVzLCBwcm9qZWN0SWQsIGRyYWZ0LCBmdW5jdGlvbih1cGxvYWRlZEZpbGVzKSB7XG4gICAgY29uc3QgdXBsb2FkZWRGaWxlID0gdXBsb2FkZWRGaWxlc1swXTtcbiAgICBjb25zdCB1cGxvYWRlZEZpbGVXZWJTcmMgPSB1cGxvYWRlZEZpbGUud2ViU3JjO1xuICAgIGlmIChkYXRhT3V0cHV0KSB7XG4gICAgICBkYXRhW251bWJlcl0gPSB1cGxvYWRlZEZpbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSB1cGxvYWRlZEZpbGU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGFPdXRwdXQpIHtcbiAgICAgIGRhdGFPdXRwdXQudmFsdWUgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdkYXRhLWZpbGUnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgaW5zZXJ0VG9QcmV2aWV3KHVwbG9hZGVkRmlsZVdlYlNyYywgcHJldmlldywgKCkgPT4ge1xuICAgICAgYWN0aXZhdGVQcmV2aWV3KHByZXZpZXcpO1xuICAgIH0pO1xuXG4gICAgZGF0YU91dHB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xuXG4gICAgaWYgKGNhbGxiYWNrc1tpZF0pIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FsbGJhY2tzW2lkXS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IGNhbGxiYWNrc1tpZF1baV07XG4gICAgICAgIGNhbGxiYWNrKHByZXZpZXcsIHVwbG9hZGVkRmlsZVdlYlNyYyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkYXRhT3V0cHV0ICYmIGdyb3VwQ2FsbGJhY2tzW2dyb3VwTmFtZV0pIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBDYWxsYmFja3NbZ3JvdXBOYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IGdyb3VwQ2FsbGJhY2tzW2dyb3VwTmFtZV1baV07XG4gICAgICAgIGNhbGxiYWNrKHByZXZpZXcsIHVwbG9hZGVkRmlsZVdlYlNyYyk7XG4gICAgICB9XG4gICAgfVxuICB9LCBmdW5jdGlvbigpIHtcbiAgICBhY3RpdmF0ZVByZXZpZXcocHJldmlldyk7XG4gICAgZGF0YU91dHB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdXBsb2FkRmlsZXMoZmlsZXMsIHByb2plY3RJZCwgZHJhZnQsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ3Byb2plY3RfaWQnLCBwcm9qZWN0SWQpO1xuICBmb3JtRGF0YS5hcHBlbmQoJ2RyYWZ0JywgZHJhZnQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZmlsZSA9IGZpbGVzW2ldO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZXNbXScsIGZpbGUpO1xuICB9XG4gIGZldGNoKCcvYWRtaW4vdXBsb2FkJywge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9LFxuICAgIGJvZHk6IGZvcm1EYXRhXG4gIH0pXG4gIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gIH0pXG4gIC50aGVuKCh1cGxvYWRlZEZpbGVzKSA9PiB7XG4gICAgc3VjY2Vzc0NhbGxiYWNrKHVwbG9hZGVkRmlsZXMpO1xuICB9KVxuICAuY2F0Y2goKGVycikgPT4ge1xuICAgIC8vIGlmIChlcnIpIHRocm93IGVycjtcbiAgICBlcnJvckNhbGxiYWNrKGVycik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWFjdGl2YXRlUHJldmlldyhwcmV2aWV3KSB7XG4gIHByZXZpZXcuY2xhc3NMaXN0LmFkZCgncHJvY2VzcycpO1xufVxuXG5mdW5jdGlvbiBhY3RpdmF0ZVByZXZpZXcocHJldmlldykge1xuICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ3Byb2Nlc3MnKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUHJldmlldyhpbnB1dCwgZGF0YSA9IHVuZGVmaW5lZCwgZGF0YU91dHB1dCA9IHVuZGVmaW5lZCkge1xuICBjb25zdCBpZCA9IGlucHV0LmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgY29uc3QgbnVtYmVyID0gKGlkLm1hdGNoKC9cXGQrJC8pIHx8IFtdKVswXSB8fCAwO1xuICBjb25zdCBwcmV2aWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtdXBsb2FkLWZpbGUtcHJldmlldz1cIiR7aWR9XCJdYCk7XG4gIHByZXZpZXcuY2xhc3NMaXN0LnJlbW92ZSgndXBsb2FkZWQnKTtcbiAgY29uc3QgaW1nID0gcHJldmlldy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1cGxvYWQtZmlsZV9faW1nJylbMF07XG4gIGlmIChpbWcpIGltZy5yZW1vdmUoKTtcbiAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1maWxlJykpIGlucHV0LnNldEF0dHJpYnV0ZSgnZGF0YS1maWxlJywgJycpO1xuICBpZiAoZGF0YU91dHB1dCAmJiBkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICBkZWxldGUgZGF0YVtudW1iZXJdO1xuICAgIGRhdGFPdXRwdXQudmFsdWUgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRUb1ByZXZpZXcodXBsb2FkZWRGaWxlV2ViU3JjLCBwcmV2aWV3LCBjYWxsYmFjaykge1xuICBjb25zdCBsYWJlbCA9IHByZXZpZXcucXVlcnlTZWxlY3RvcignW2RhdGEtdXBsb2FkLWZpbGUtbGFiZWxdJyk7XG5cbiAgcHJldmlldy5jbGFzc0xpc3QuYWRkKCd1cGxvYWRlZCcpO1xuXG4gIGlmIChjaGVja0ltZyh1cGxvYWRlZEZpbGVXZWJTcmMpKSB7XG4gICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nLmNsYXNzTGlzdC5hZGQoJ3VwbG9hZC1maWxlX19pbWcnLCAnaW1nLWNvdmVyJyk7XG4gICAgaW1nLnNyYyA9IHVwbG9hZGVkRmlsZVdlYlNyYztcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbGFiZWwuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSwgMzUwKTtcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjaygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZENhbGxiYWNrVG9VcGxvYWRlZChpZCwgaXNHcm91cCA9IGZhbHNlLCBjYWxsYmFjaykge1xuICBpZiAoaXNHcm91cCkge1xuICAgIGlmICghZ3JvdXBDYWxsYmFja3NbaWRdKSBncm91cENhbGxiYWNrc1tpZF0gPSBbXTtcbiAgICBncm91cENhbGxiYWNrc1tpZF0ucHVzaChjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFjYWxsYmFja3NbaWRdKSBjYWxsYmFja3NbaWRdID0gW107XG4gICAgY2FsbGJhY2tzW2lkXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdCxcbiAgaW5pdFVwbG9hZElucHV0LFxuICBhZGRDYWxsYmFja1RvVXBsb2FkZWRcbn0iLCJmdW5jdGlvbiBjaGVja0ltZyhmaWxlUGF0aCkge1xuICBjb25zdCBleHRuYW1lID0gKGZpbGVQYXRoLm1hdGNoKC8uKz8oXFwuW14uXSspJC8pIHx8IFtdKVsxXTtcbiAgcmV0dXJuIGV4dG5hbWUgPT0gJy5wbmcnXG4gIHx8IGV4dG5hbWUgPT0gJy5qcGcnXG4gIHx8IGV4dG5hbWUgPT0gJy5qcGVnJ1xuICB8fCBleHRuYW1lID09ICcud2VicCdcbiAgfHwgZXh0bmFtZSA9PSAnLnN2ZydcbiAgfHwgZXh0bmFtZSA9PSAnLmdpZic7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tJbWc7IiwiZnVuY3Rpb24gY2hlY2tKc29uKHN0cmluZykge1xuICB0cnkge1xuICAgIEpTT04ucGFyc2Uoc3RyaW5nKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tKc29uOyIsIm1vZHVsZS5leHBvcnRzID0gKHBhZ2VOYW1lKSA9PiB7XG4gIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGBqcy0ke3BhZ2VOYW1lfS1wYWdlYCkubGVuZ3RoID4gMDtcbn0iLCJmdW5jdGlvbiBsb29rQXRNZUFuaW1hdGlvbihlbGVtZW50KSB7XG4gIGlmICghZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2xvb2stYXQtbWUnKSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbG9vay1hdC1tZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdsb29rLWF0LW1lJyk7XG4gICAgICB9KTtcbiAgICB9LCA3NTApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbG9va0F0TWVBbmltYXRpb247Il19
