const { addActionToEvent } = require("../pop-up");
const { inputs } = require("./multilingual-inputs");

addActionToEvent('changeEditingLanguage', function(selectedOption) {
  const selectedLangName = selectedOption.getAttribute('data-option-id');

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const inputLangName = input.codName;
    const inputElement = input.element;

    if (inputLangName == selectedLangName) {
      inputElement.classList.remove('disabled');
    } else {
      inputElement.classList.add('disabled');
    }
  }

  return true;
});