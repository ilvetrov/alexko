const { addActionToEvent } = require("../pop-up");
const { inputs } = require("./multilingual-inputs");

addActionToEvent('changeEditingLanguage', function(selectedOption) {
  const selectedLangName = selectedOption.getAttribute('data-option-id');

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const inputLangName = input.codeName;
    const inputElement = changeInnerProblemsOfDuplicating(input.element);

    if (inputLangName == selectedLangName) {
      inputElement.classList.remove('disabled');
    } else {
      inputElement.classList.add('disabled');
    }
  }

  return true;
});

function changeInnerProblemsOfDuplicating(element) {
  const editorNarrows = element.getElementsByClassName('codex-editor--narrow');
  for (let i = 0; i < editorNarrows.length; i++) {
    const editorNarrow = editorNarrows[i];
    editorNarrow.classList.remove('codex-editor--narrow');
  }

  return element;
}