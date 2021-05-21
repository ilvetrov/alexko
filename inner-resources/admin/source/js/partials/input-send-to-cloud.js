const checkJson = require("../../../../../libs/check-json");
const lookAtMeAnimation = require("../../../../../source/js/partials/look-at-me");
const { getEditorsData, getEditorsImages } = require("./editor");
const { editorIntroImagesElement, editorIntroDesktopImagesElement } = require('./get-intro-images');

function init() {
  const buttons = document.querySelectorAll('[data-send-to-cloud-button]');
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    initButton(button);
  }
}

function initButton(button) {
  button.addEventListener('click', async function() {
    if (button.classList.contains('process')) return;

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

    if (button.hasAttribute('data-with-editorjs')) {
      const editorsData = await getEditorsData();
      values.editors_images = getEditorsImages(editorsData);
      values = {...values, ...editorsData};
    }

    if (button.hasAttribute('data-with-intro-images')) {
      const introImages = values.intro_images;
      const introDesktopImages = values.intro_desktop_images;
      const projectType = document.getElementsByClassName('js-project-type-output')[0]?.getAttribute('data-project-type');

      if (
        !(
          introImages
          && introImages['0']
          && introImages['1']
          && introImages['2']
          && introImages['3']
          && introImages['4']
          && introImages['5']
          && introImages['6']
        )
      ) {
        button.classList.remove('process');
        lookAtMeAnimation(button);
        lookAtMeAnimation(editorIntroImagesElement);
        return;
      }

      if (
        Number(projectType) === 1
        && !(
          introDesktopImages
          && introDesktopImages['0']
          && introDesktopImages['1']
          && introDesktopImages['2']
        )
      ) {
        button.classList.remove('process');
        lookAtMeAnimation(button);
        lookAtMeAnimation(editorIntroDesktopImagesElement);
        return;
      }
    }

    values.token = frontVariables.adminToken;
  
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