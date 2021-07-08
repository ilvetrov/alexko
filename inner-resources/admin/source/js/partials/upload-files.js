const checkImg = require("../../../../../libs/check-img");
const getImgSrc = require("../../../../../libs/get-img-src");
const checkPage = require("../../../../../source/js/partials/check-page");

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
    if (removeButton.classList.contains('uploaded')) return false;
    const input = removeButton.parentElement.getElementsByTagName('input')[0];
    const groupName = input.getAttribute('data-group-file');
    const dataOutput = groupName && document.querySelector(`[name="${groupName}"]`);
    
    removePreview(input, dataOutput);
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

  if (preview.classList.contains('uploaded')) {
    removePreview(input, dataOutput);
  }

  deactivatePreview(preview);
  
  uploadFiles(files, projectId, function(uploadedFiles) {
    const uploadedFileName = uploadedFiles[0];
    const uploadedFile = getImgSrc(
      uploadedFileName,
      document.querySelector('[data-send-to-cloud-name="status"]')?.value === 'draft' || document.querySelector('[data-send-to-cloud-name="status"]')?.value === 'awaiting_approval'
    );
    const uploadedFileWebSrc = uploadedFile.webSrc;

    const data = getInputData(input, dataOutput);
    if (dataOutput) {
      data[number] = uploadedFileName;
      dataOutput.value = JSON.stringify(data);
    } else {
      data = uploadedFileName;
      input.setAttribute('data-file', JSON.stringify(data));
    }

    insertToPreview(uploadedFileWebSrc, preview, () => {
      activatePreview(preview);
    });

    dataOutput?.dispatchEvent(new Event('change'));

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
    dataOutput?.dispatchEvent(new Event('change'));
  });
}

function getInputData(input, dataOutput) {
  if (dataOutput) {
    return JSON.parse(dataOutput.value || '{}');
  } else {
    return input.getAttribute('data-file') || '';
  }
}

function uploadFiles(files, projectId, successCallback, errorCallback) {
  const formData = new FormData();
  formData.append('project_id', projectId);
  formData.append('is_page', checkPage('edit-page'));
  formData.append('token', frontVariables.adminToken);
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

function removePreview(input, dataOutput = undefined) {
  const id = input.getAttribute('id');
  const number = (id.match(/\d+$/) || [])[0] || 0;
  const preview = document.querySelector(`[data-upload-file-preview="${id}"]`);
  preview.classList.remove('uploaded');
  const img = preview.getElementsByClassName('upload-file__img')[0];
  if (img) img.remove();
  input.value = '';
  if (input.hasAttribute('data-file')) input.setAttribute('data-file', '');
  if (dataOutput) {
    const data = getInputData(input, dataOutput);
    delete data[number];
    dataOutput.value = JSON.stringify(data);
  }
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