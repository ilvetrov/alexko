const checkJson = require("../../../../../libs/check-json");
const { multilingualToArray } = require("../../../../../libs/converters/multilingual-front");
const { rawStringToObject } = require("../../../../../libs/converters/object-to-raw-string");
const { lookAtMeAnimation, lookAtMeInlineAnimation } = require("../../../../../source/js/partials/look-at-me");
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
    const data = rawStringToObject(button.getAttribute('data-send-to-cloud-properties'));
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

      if (values.status !== 'draft') {

        for (const fieldName in data.required) {
          if (Object.hasOwnProperty.call(data.required, fieldName)) {
            const fieldData = data.required[fieldName];
            
            if (
              (fieldData.multilingual && !checkExistenceOfEditorValueAndAccentIfNot(fieldName, values, fieldData.checker, fieldData.isDisplayBlock, fieldData.accentElementsClass))
              || (!fieldData.multilingual && !fieldData.checker(values[fieldName]))
            ) {
              disableButtonProcessWithError(button, fieldData.explanation);
              lookAtMeAnimation(button);

              if (fieldData.ownAnimation) {
                if (fieldData.isDisplayBlock) {
                  lookAtMeAnimation(document.querySelector(fieldData.ownAnimation));
                } else {
                  lookAtMeInlineAnimation(document.querySelector(fieldData.ownAnimation));
                }
              } else if (!fieldData.multilingual) {
                const animatedElement = document.querySelector(`[data-send-to-cloud-name="${fieldName}"]`);
                animatedElement && lookAtMeInlineAnimation(animatedElement);
              }
              return;
            }
          }
        }

        if (button.hasAttribute('data-with-intro-images')) {
          const introImages = values.intro_images;
          const introDesktopImages = values.intro_desktop_images;
          const projectType = document.getElementsByClassName('js-project-type-output')[0]?.getAttribute('data-project-type');
    
          if (
            Number(projectType) !== 1
            && !(
              introImages
              && introImages['0']
              && introImages['1']
              && introImages['2']
              && introImages['3']
              && introImages['4']
              && introImages['5']
              && introImages['6']
              && introImages['7']
              && introImages['8']
            )
          ) {
            disableButtonProcessWithError(button, 'Нужно минимум 9 мобильных изображений');
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
            disableButtonProcessWithError(button, 'Нужно минимум 3 десктопных изображений');
            lookAtMeAnimation(button);

            lookAtMeAnimation(editorIntroDesktopImagesElement);
            return;
          }
        }
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

function checkExistenceOfEditorValueAndAccentIfNot(name, allValues, existenceChecker, isDisplayBlock = true, accentElementsClass = undefined) {
  if (multilingualToArray(name, allValues).find(value => !existenceChecker(value)) !== undefined) {
    const accentElements = document.getElementsByClassName(accentElementsClass);
    if (accentElementsClass) {
      for (let i = 0; i < accentElements.length; i++) {
        const accentElement = accentElements[i];
        if (isDisplayBlock) {
          lookAtMeAnimation(accentElement);
        } else {
          lookAtMeInlineAnimation(accentElement);
        }
      }
    } else {
      for (const langCodeName in frontVariables.languages) {
        if (Object.hasOwnProperty.call(frontVariables.languages, langCodeName)) {
          const inputName = langCodeName === frontVariables.currentLang ? name : `${name}_${langCodeName}`;
          if (isDisplayBlock) {
            lookAtMeAnimation(document.querySelector(`[data-send-to-cloud-name="${inputName}"]`));
          } else {
            lookAtMeInlineAnimation(document.querySelector(`[data-send-to-cloud-name="${inputName}"]`));
          }
        }
      }
    }
    return false;
  }
  return true;
}

let lastButtonProcessError = 0;
let lastButtonProcessErrorsAmount = 0;
let lastReason;
function disableButtonProcessWithError(button, reason = undefined) {
  button.classList.remove('process');

  if (!lastReason || lastReason === reason) {

    lastButtonProcessErrorsAmount++;
    const newProcessError = (new Date()).getTime();
    if (newProcessError - lastButtonProcessError <= 4000 && lastButtonProcessErrorsAmount >= 4) {
      alert(reason);
      lastButtonProcessErrorsAmount = 0;
    }
  
    setTimeout(() => {
      if (lastButtonProcessErrorsAmount > 0) lastButtonProcessErrorsAmount--;
    }, 4000 * 4);

  } else {
    lastButtonProcessErrorsAmount = 0;
  }

  lastButtonProcessError = (new Date()).getTime();
  lastReason = reason;
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
      value = input.value.trim() || '';
      break;
  
    case 'TEXTAREA':
      value = input.value.trim() || '';
      break;
  
    case 'SELECT':
      value = input.value.trim() || '';
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