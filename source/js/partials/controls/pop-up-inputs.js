const { addCallbackToHideOfPopUp } = require('../pop-up');

addCallbackToHideOfPopUp('to_link', function(popUp) {
  const button = document.getElementsByClassName('js-to-link-button')[0];
  const input = popUp.getElementsByTagName('input')[0];
  if (input.value && input.value.trim().length) {
    button.classList.remove('editor-pop-up-input-caller_empty');
  } else {
    button.classList.add('editor-pop-up-input-caller_empty');
    setTimeout(() => {
      input.value = '';
    }, 100);
  }
});

addCallbackToHideOfPopUp('demo_url', function(popUp) {
  const button = document.getElementsByClassName('js-demo-url-button')[0];
  const input = popUp.getElementsByTagName('input')[0];
  if (input.value && input.value.trim().length) {
    button.classList.remove('editor-pop-up-input-caller_empty');
  } else {
    button.classList.add('editor-pop-up-input-caller_empty');
    setTimeout(() => {
      input.value = '';
    }, 100);
  }
});