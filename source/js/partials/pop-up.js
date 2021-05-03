const { blockScroll, unblockScroll } = require("./blockScroll");
const checkThatCurrentElementExistsOutside = require("./outsideChecker");

const popUps = document.querySelectorAll('[data-pop-up]');
const callbacksOfHiding = {};
const events = {};

for (let i = 0; i < popUps.length; i++) {
  const popUp = popUps[i];
  const popUpName = popUp.getAttribute('data-pop-up');
  const popUpButtons = document.querySelectorAll(`[data-pop-up-button="${popUpName}"]`);
  const popUpCloseButtons = document.querySelectorAll(`[data-pop-up-close-button="${popUpName}"]`);
  const popUpEventButtons = popUp.querySelectorAll(`[data-event-button]`);
  const popUpContent = popUp.querySelector('[data-pop-up-content]') || popUp;
  const popUpActiveAfterOutClick = popUp.hasAttribute('data-pop-up-active-after-out-click');
  const popUpNeedSetPositionToButton = popUp.hasAttribute('data-pop-up-set-position-to-button');
  const eventName = popUp.getAttribute('data-pop-up-event');
  
  for (let buttonIteration = 0; buttonIteration < popUpButtons.length; buttonIteration++) {
    const popUpButton = popUpButtons[buttonIteration];
    popUpButton.addEventListener('click', () => {
      if (popUp.classList.contains('disabled')) {
        (new Promise((resolve, reject) => {
          if (!popUpNeedSetPositionToButton) return resolve();

          blockScroll();
          setPositionTo(popUpContent, popUpButton);
          resolve();
        }))
        .then(() => {
          popUpButton.blur();
          showPopUp(popUp);
        });
      }
    });
  }
  for (let actionButtonIteration = 0; actionButtonIteration < popUpEventButtons.length; actionButtonIteration++) {
    const popUpActionButton = popUpEventButtons[actionButtonIteration];
    popUpActionButton.addEventListener('click', function() {
      if (callEvent(eventName, this)) {
        hidePopUp(popUp);

        setTimeout(() => {
          const selectedOptionWrap = this.parentElement;
          const parent = this.parentElement.parentElement;
          const optionsWraps = parent.children;
        
          for (let i = 0; i < optionsWraps.length; i++) {
            const option = optionsWraps[i].children[0];
            option.classList.remove('active');
          }
          parent.insertBefore(selectedOptionWrap, optionsWraps[0]);
          this.classList.add('active');
          
        }, 150);
      }
    });
  }
  for (let closeButtonIteration = 0; closeButtonIteration < popUpCloseButtons.length; closeButtonIteration++) {
    const popUpCloseButton = popUpCloseButtons[closeButtonIteration];
    popUpCloseButton.addEventListener('click', function() {
      if (!popUp.classList.contains('hidden')) {
        hidePopUp(popUp);
      }
    });
  }
  if (!popUpActiveAfterOutClick) {
    popUp.addEventListener('click', e => {
      if (!popUp.classList.contains('hidden') && checkThatCurrentElementExistsOutside(popUpContent, e.target)) {
        hidePopUp(popUp);
      }
    });
  }
  document.body.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !popUp.classList.contains('hidden')) {
      hidePopUp(popUp);
    }
  });
}

function showPopUp(popUp) {
  popUp = detectPopUpInVariable(popUp);
  if (!popUp) return false;

  popUp.classList.remove('disabled');
  blockScroll();
  setTimeout(() => {
    popUp.classList.remove('hidden');
  }, 20);
}

function hidePopUp(popUp) {
  popUp = detectPopUpInVariable(popUp);
  if (!popUp) return false;

  popUp.classList.add('hidden');
  setTimeout(() => {
    popUp.classList.add('disabled');
    unblockScroll();
  }, 220);

  const callbacks = callbacksOfHiding[popUp.getAttribute('data-pop-up')];
  if (callbacks) {
    for (let callbackIteration = 0; callbackIteration < callbacks.length; callbackIteration++) {
      const callback = callbacks[callbackIteration];
      callback(popUp);
    }
  }
}

function setPositionTo(popUpContent, toElement) {
  const position = toElement.getBoundingClientRect();
  popUpContent.style.left = `${position.x}px`;
  popUpContent.style.top = `${position.y}px`;
}

function addCallbackToHideOfPopUp(popUp, callback) {
  popUp = detectPopUpInVariable(popUp);
  if (!popUp) return false;

  if (!callbacksOfHiding[popUp.getAttribute('data-pop-up')]) {
    callbacksOfHiding[popUp.getAttribute('data-pop-up')] = [];
  }
  callbacksOfHiding[popUp.getAttribute('data-pop-up')].push(callback);
}

function callEvent(eventName, eventCaller) {
  const actions = events[eventName] || [];

  let falseExists = false;
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (!falseExists && !action(eventCaller)) {
      falseExists = true;
    }
  }

  return !falseExists;
}

function addActionToEvent(event, action) {
  if (!events[event]) {
    events[event] = [];
  }
  events[event].push(action);
}

function detectPopUpInVariable(popUp) {
  if (typeof popUp === 'string' || typeof popUp === 'number') {
    popUp = document.querySelector(`[data-pop-up="${popUp}"]`);
  }
  return popUp;
}

module.exports = {
  showPopUp,
  hidePopUp,
  addCallbackToHideOfPopUp,
  addActionToEvent
}