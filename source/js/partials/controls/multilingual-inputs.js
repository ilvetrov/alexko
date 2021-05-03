const insertAfter = require("../insertAfter");

const dataNameAttributes = [
  'name',
  'data-send-to-cloud-name'
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
    codName: frontVariables.currentLang,
    element: mainInput
  });
  for (const codName in values) {
    if (Object.hasOwnProperty.call(values, codName)) {
      if (codName == frontVariables.currentLang) continue;

      const value = values[codName];
      const duplicate = changesNamesToMultilingual(mainInput.cloneNode(true), codName);
      duplicate.classList.add('disabled');
      duplicate.removeAttribute('data-multilingual');
      duplicate.innerText = value;
      
      inputs.push({
        codName: codName,
        element: insertAfter(duplicate, mainInput)
      });
    }
  }
}

function changesNamesToMultilingual(input, codName) {
  for (let i = 0; i < dataNameAttributes.length; i++) {
    const dataNameAttribute = dataNameAttributes[i];
    if (!input.hasAttribute(dataNameAttribute)) continue;

    const attributeValue = input.getAttribute(dataNameAttribute);
    input.setAttribute(dataNameAttribute, `${attributeValue}_${codName}`);
  }
  input.value = '';
  input.innerText = '';
  return input;
}

module.exports = {
  init,
  inputs
}