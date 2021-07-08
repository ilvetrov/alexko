const insertAfter = require("../insertAfter");

const dataNameAttributes = [
  'name',
  'data-send-to-cloud-name',
  'id',
  'for',
  'data-editorjs'
];

const inputs = [];

function init() {
  const multilingualInputs = document.querySelectorAll('[data-multilingual]');
  for (let i = 0; i < multilingualInputs.length; i++) {
    const multilingualInput = multilingualInputs[i];
    initInput(multilingualInput);
  }
}

function initInput(mainInput) {
  const values = JSON.parse(mainInput.getAttribute('data-multilingual'));
  inputs.push({
    codeName: frontVariables.currentLang,
    element: mainInput
  });
  for (const codeName in values) {
    if (Object.hasOwnProperty.call(values, codeName)) {
      if (codeName == frontVariables.currentLang) continue;

      const value = values[codeName];
      const duplicate = changesNamesToMultilingual(mainInput.cloneNode(true), codeName);
      duplicate.classList.add('disabled');
      duplicate.removeAttribute('data-multilingual');
      setValueToDuplicate(duplicate, value);
      
      inputs.push({
        codeName: codeName,
        element: insertAfter(duplicate, mainInput)
      });
    }
  }
}

function changesNamesToMultilingual(input, codeName) {
  for (let i = 0; i < dataNameAttributes.length; i++) {
    const dataNameAttribute = dataNameAttributes[i];
    if (!input.hasAttribute(dataNameAttribute)) continue;

    const attributeValue = input.getAttribute(dataNameAttribute);
    input.setAttribute(dataNameAttribute, `${attributeValue}_${codeName}`);
  }
  input.value = '';
  input.innerText = '';
  return input;
}

function setValueToDuplicate(duplicate, value) {
  if (duplicate.tagName === 'TEXTAREA') return duplicate.value = value;
  if (!duplicate.hasAttribute('data-editorjs')) {
    duplicate.innerText = value;
  }
}

module.exports = {
  init,
  inputs
}