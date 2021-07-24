const actionClouds = document.querySelectorAll('[data-action-cloud]');

const defaultCloseTransitionTime = 220;

const callbacksOfHiding = {};
const actionCallbacks = {};

for (let i = 0; i < actionClouds.length; i++) {
  const actionCloud = actionClouds[i];
  const actionCloudName = actionCloud.getAttribute('data-action-cloud');
  const closeButtons = document.querySelectorAll(`[data-action-cloud-close-button="${actionCloudName}"]`);
  const actionElements = actionCloud.querySelectorAll('[data-action-cloud-make-action]');

  for (let closeButtonIteration = 0; closeButtonIteration < closeButtons.length; closeButtonIteration++) {
    const closeButton = closeButtons[closeButtonIteration];
    closeButton.addEventListener('click', function(event) {
      if (!actionCloud.classList.contains('hidden')) {
        closeActionCloud(actionCloud, closeButton);
      }
    });
  }

  for (let actionElementIteration = 0; actionElementIteration < actionElements.length; actionElementIteration++) {
    const actionElement = actionElements[actionElementIteration];
    actionElement.addEventListener('click', function(event) {
      const callbacks = actionCallbacks[actionCloud.getAttribute('data-action-cloud')];
      if (callbacks) {
        for (let callbackIteration = 0; callbackIteration < callbacks.length; callbackIteration++) {
          const callback = callbacks[callbackIteration];
          callback(actionCloud, actionElement);
        }
      }
    });
  }
}

function showActionCloud(actionCloud) {
  actionCloud = detectActionCloudInVariable(actionCloud);
  if (!actionCloud) return false;

  requestAnimationFrame(function() {
    actionCloud.classList.remove('disabled');
    
    setTimeout(() => {
      requestAnimationFrame(function() {
        actionCloud.classList.remove('hidden');
      });
    }, 20);
  });
}

function closeActionCloud(actionCloud, closeButton = undefined) {
  actionCloud = detectActionCloudInVariable(actionCloud);
  if (!actionCloud) return false;

  const closeTransitionTime = Number(actionCloud.getAttribute('data-close-transition-time') ?? defaultCloseTransitionTime);

  requestAnimationFrame(function() {
    actionCloud.classList.add('hidden');
    setTimeout(() => {
      requestAnimationFrame(function() {
        actionCloud.classList.add('disabled');
      });
    }, closeTransitionTime);
  });

  const callbacks = callbacksOfHiding[actionCloud.getAttribute('data-action-cloud')];
  if (callbacks) {
    for (let callbackIteration = 0; callbackIteration < callbacks.length; callbackIteration++) {
      const callback = callbacks[callbackIteration];
      callback(actionCloud, closeButton);
    }
  }
}

function detectActionCloudInVariable(actionCloud) {
  if (typeof actionCloud === 'string' || typeof actionCloud === 'number') {
    actionCloud = document.querySelector(`[data-action-cloud="${actionCloud}"]`);
  }
  return actionCloud;
}

function addCallbackToHideOfActionCloud(actionCloud, callback) {
  actionCloud = detectActionCloudInVariable(actionCloud);
  if (!actionCloud) return false;

  if (!callbacksOfHiding[actionCloud.getAttribute('data-action-cloud')]) {
    callbacksOfHiding[actionCloud.getAttribute('data-action-cloud')] = [];
  }
  callbacksOfHiding[actionCloud.getAttribute('data-action-cloud')].push(callback);
}

function addCallbackToActionOfActionCloud(actionCloud, callback) {
  actionCloud = detectActionCloudInVariable(actionCloud);
  if (!actionCloud) return false;

  if (!actionCallbacks[actionCloud.getAttribute('data-action-cloud')]) {
    actionCallbacks[actionCloud.getAttribute('data-action-cloud')] = [];
  }
  actionCallbacks[actionCloud.getAttribute('data-action-cloud')].push(callback);
}

module.exports = {
  showActionCloud,
  addCallbackToHideOfActionCloud,
  addCallbackToActionOfActionCloud
}