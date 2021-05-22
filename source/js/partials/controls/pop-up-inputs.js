const { addCallbackToHideOfPopUp } = require('../pop-up');

addCallbackToHideOfPopUp('to_link', function(popUp) {
  const toLinkButton = document.getElementsByClassName('js-to-link-button')[0];
  const input = popUp.getElementsByTagName('input')[0];
  if (input.value && input.value.trim().length) {
    toLinkButton.classList.remove('editor-pop-up-input-caller_empty');
  } else {
    toLinkButton.classList.add('editor-pop-up-input-caller_empty');
    setTimeout(() => {
      input.value = '';
    }, 100);
  }
});