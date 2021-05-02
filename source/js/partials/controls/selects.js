const lookAtMeAnimation = require('../look-at-me');
const { addActionToEvent } = require('../pop-up');

addActionToEvent('selectProjectType', function(selectedElement) {
  const newOptionId = Number(selectedElement.getAttribute('data-option-id'));
  
  const projectTypeOutputs = document.getElementsByClassName('js-project-type-output');
  for (let i = 0; i < projectTypeOutputs.length; i++) {
    const projectTypeOutput = projectTypeOutputs[i];
    projectTypeOutput.innerText = selectedElement.innerText;
    projectTypeOutput.setAttribute('data-project-type', selectedElement.getAttribute('data-option-id'));
  }

  const changingVariationElements = document.querySelectorAll('[data-variations]');
  for (let i = 0; i < changingVariationElements.length; i++) {
    const changingVariationElement = changingVariationElements[i];
    const variations = JSON.parse(changingVariationElement.getAttribute('data-variations'));
    const newVariation = variations[newOptionId] || variations[0];

    changingVariationElement.innerText = newVariation;
  }

  const hidingElements = document.querySelectorAll('[data-hide-on-project-types]');
  for (let i = 0; i < hidingElements.length; i++) {
    const hidingElement = hidingElements[i];
    const variations = JSON.parse(hidingElement.getAttribute('data-hide-on-project-types'));

    if (variations.indexOf(newOptionId) > -1) {
      hidingElement.classList.add('disabled');
    } else {
      hidingElement.classList.remove('disabled');
    }
  }
  
  setTimeout(() => {
    const selectedOptionWrap = selectedElement.parentElement;
    const parent = selectedElement.parentElement.parentElement;
    const optionsWraps = parent.children;
  
    for (let i = 0; i < optionsWraps.length; i++) {
      const option = optionsWraps[i].children[0];
      option.classList.remove('active');
    }
    parent.insertBefore(selectedOptionWrap, optionsWraps[0]);
    selectedElement.classList.add('active');
    
  }, 150);

  return true;
});