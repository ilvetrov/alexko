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
  const closeAnywhere = popUp.hasAttribute('data-pop-up-close-anywhere');
  const eventName = popUp.getAttribute('data-pop-up-event');
  
  for (let buttonIteration = 0; buttonIteration < popUpButtons.length; buttonIteration++) {
    const popUpButton = popUpButtons[buttonIteration];
    popUpButton.addEventListener('click', () => {
      if (popUp.classList.contains('disabled')) {
        if (popUpNeedSetPositionToButton) {
          blockScroll();
        }
        popUpButton.blur();
        showPopUp(popUp);
        setPositionTo(popUpContent, popUpButton);
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
  if (closeAnywhere) {
    popUp.addEventListener('click', function() {
      if (!popUp.classList.contains('hidden') && popUp.classList.contains('ready-to-close')) {
        hidePopUp(popUp);
      }
    });
  }
}

function checkPopUp(popUp) {
  popUp = detectPopUpInVariable(popUp);
  if (!popUp) return false;
  
  return !popUp.classList.contains('disabled');
}

function showPopUp(popUp) {
  popUp = detectPopUpInVariable(popUp);
  if (!popUp) return false;

  popUp.classList.remove('disabled');
  blockScroll();
  setTimeout(() => {
    popUp.classList.remove('hidden');
  }, 20);
  
  const closeAnywhere = popUp.hasAttribute('data-pop-up-close-anywhere');
  if (closeAnywhere) {
    setTimeout(() => {
      popUp.classList.add('ready-to-close');
    }, 1500);
  }
}

window.showPopUp = showPopUp;

function hidePopUp(popUp) {
  popUp = detectPopUpInVariable(popUp);
  if (!popUp) return false;

  popUp.classList.add('hidden');
  setTimeout(() => {
    popUp.classList.add('disabled');
    if (!popUp.hasAttribute('data-pop-up-do-not-show-scroll-bar-on-hide')) {
      unblockScroll();
    }
  }, 220);

  const callbacks = callbacksOfHiding[popUp.getAttribute('data-pop-up')];
  if (callbacks) {
    for (let callbackIteration = 0; callbackIteration < callbacks.length; callbackIteration++) {
      const callback = callbacks[callbackIteration];
      callback(popUp);
    }
  }

  const closeAnywhere = popUp.hasAttribute('data-pop-up-close-anywhere');
  if (closeAnywhere) {
    setTimeout(() => {
      popUp.classList.remove('ready-to-close');
    }, 100);
  }
}

function forceHidePopUp(popUp) {
  popUp = detectPopUpInVariable(popUp);
  if (!popUp) return false;

  popUp.classList.add('disabled');
  hidePopUp(popUp);
}

function setPositionTo(element, toElement) {
  const position = toElement.getBoundingClientRect();
  const elementWidth = element.offsetWidth;
  const elementHeight = element.offsetHeight;
  const offset = 45;

  element.style.left = '';
  element.style.right = '';
  element.style.top = '';
  element.style.bottom = '';

  if ((position.x + elementWidth + offset) < document.body.clientWidth) {
    element.style.left = `${Math.max(position.x, 0)}px`;
  } else {
    element.style.left = `${Math.max(document.body.clientWidth - elementWidth - offset, 0)}px`;
  }
  
  if (
    (window.scrollY + position.y + element.offsetHeight) >= document.body.clientHeight
    && (window.scrollY + (window.innerHeight - (elementHeight + offset))) >= 0
  ) {
    element.style.bottom = `${offset}px`;
  } else {
    if ((window.innerHeight - position.y) > offset) {
      element.style.top = `${Math.max(position.y, 0)}px`;
    } else {
      element.style.top = `${Math.max(position.y - offset, 0)}px`;
    }
  }
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
  checkPopUp,
  showPopUp,
  hidePopUp,
  forceHidePopUp,
  addCallbackToHideOfPopUp,
  addActionToEvent
}