const checkImg = require("../../../libs/check-img");
const removeWhitespaces = require("./remove-whitespaces");

const uploadInputs = document.getElementsByClassName('js-upload-files');

for (let i = 0; i < uploadInputs.length; i++) {
  const uploadInput = uploadInputs[i];
  uploadInput.addEventListener('change', function() {
    processUploadInput(this);
  });
}

function processUploadInput(input) {
  if (!input.value) return;
  const id = input.getAttribute('id');
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
    preview.classList.remove('uploaded');
    const img = preview.getElementsByClassName('upload-file__img')[0];
    if (img) img.remove();
    if (input.hasAttribute('data-file')) input.setAttribute('data-file', '');
    if (dataOutput) {
      delete data[id];
      dataOutput.value = JSON.stringify(data);
    }
  }

  deactivatePreview(preview);
  
  uploadFiles(files, projectId, draft, function(uploadedFiles) {
    const uploadedFile = uploadedFiles[0];
    if (dataOutput) {
      data[id] = uploadedFile;
    } else {
      data = uploadedFile;
    }

    if (dataOutput) {
      dataOutput.value = JSON.stringify(data);
    } else {
      input.setAttribute('data-file', JSON.stringify(data));
    }

    insertToPreview(uploadedFile, preview, () => {
      activatePreview(preview);
    });
  }, function() {
    activatePreview(preview);
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
      'Accept': 'application/json',
    },
    body: formData
  })
  .then((response) => {
    return response.json();
  })
  .then((uploadedFiles) => {
    successCallback(uploadedFiles);
  })
  .catch(() => {
    errorCallback();
  });
}

function deactivatePreview(preview) {
  preview.classList.add('process');
}

function activatePreview(preview) {
  preview.classList.remove('process');
}

function insertToPreview(uploadedFile, preview, callback) {
  const label = preview.querySelector('[data-upload-file-label]');

  preview.classList.add('uploaded');

  if (checkImg(uploadedFile)) {
    const img = document.createElement('img');
    img.classList.add('upload-file__img');
    img.src = uploadedFile;

    setTimeout(() => {
      label.appendChild(img);
      callback();
    }, 350);
  } else {
    callback();
  }
}