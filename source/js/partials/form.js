const { smoothScrollToElement } = require("./smooth-scroll");
const { checkElementVisibilityForInteractions } = require("./check-scroll");
const { lookAtMeAnimation } = require("./look-at-me");

function initRequestForm(form, acceptJson = true, callback) {
  const url = form.getAttribute('action');

  let canProcess = true;
  form.onsubmit = () => {
    if (canProcess) {
      canProcess = false;

      if (formConfirmation(form)) {
        showProcessOnForm(form);
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': acceptJson ? 'application/json' : undefined,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(getFormData(form))
        })
        .then((response) => {
          return acceptJson ? response.json() : response;
        })
        .then((result) => {
          if (!acceptJson && result.status !== 200) {
            canProcess = true;
          }
          if (callback(result)) {
            hideProcessFromForm(form);
          }
          canProcess = true;
        })
        .catch((reason) => {
          console.error(reason);
          hideProcessFromForm(form);
          canProcess = true;
        });
      } else {
        canProcess = true;
      }
    }
    return false;
  }
}

function showProcessOnForm(form) {
  form.classList.add('process');
}

function hideProcessFromForm(form) {
  form.classList.remove('process');
}

function checkInputIsEmpty(input) {
  return (input.getAttribute('type') == 'checkbox' && !input.checked)
  || (input.tagName == 'DIV' && input.innerText.trim() == '')
  || (input.value.trim() == '');
}

function doFocusOnEmptyInput(form) {
  let fields = form.getElementsByClassName('js-field');
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i],
          input = field.querySelector('[name]');
    if (field.hasAttribute('data-field-require') && checkInputIsEmpty(input)) {
      if (input.getAttribute('type') == 'checkbox') {
        if (!checkElementVisibilityForInteractions(field)) {
          smoothScrollToElement(field, window.innerHeight / 2);
        }
      } else {
        if (!checkElementVisibilityForInteractions(field, -23)) {
          smoothScrollToElement(field, window.innerHeight / 2);
        }
        input.focus();
      }
      lookAtMeAnimation(field);
      return true;
    }
  }
  return false;
}

function formConfirmation(form) {
  return !doFocusOnEmptyInput(form);
}

function getFormData(form) {
  let inputs = form.querySelectorAll('[name]'),
      data = {};
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i],
          inputName = input.getAttribute('name');
    data[inputName] = input.value;
  }
  return data;
}

function clearFormData(form) {
  let inputs = form.querySelectorAll('[name]')
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (input.getAttribute('type') === 'hidden') continue;

    if (input.getAttribute('type') === 'checkbox') {
      input.checked = false;
    } else {
      input.value = '';
    }
  }
}

const fields = document.getElementsByClassName('js-field');
for (let i = 0; i < fields.length; i++) {
  setTimeout(() => {
    const field = fields[i];
    const input = field.querySelector('[name]');
    input.addEventListener('focus', () => {
      field.classList.add('focus');
    });
    input.addEventListener('blur', () => {
      field.classList.remove('focus');
    });
    if (input.getAttribute('type') === 'password') {
      input.addEventListener('focus', () => {
        input.select();
      });
    }
  }, 0);
}

module.exports = {
  initRequestForm,
  clearFormData,
  hideProcessFromForm
}