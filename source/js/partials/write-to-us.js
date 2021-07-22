const { initRequestForm, clearFormData, hideProcessFromForm } = require("./form");
const { lookAtMeAnimation } = require("./look-at-me");
const { showPopUp, addCallbackToHideOfPopUp } = require("./pop-up");
const { sendToMetrics } = require("./send-to-metrics");

const forms = document.getElementsByClassName('js-write-to-us-form');

for (let i = 0; i < forms.length; i++) {
  const form = forms[i];
  initRequestForm(form, false, (response) => {
    if (response.status === 200) {
      showPopUp('write_to_us_accepted');
      setTimeout(() => {
        clearFormData(form);
      }, 500);
      sendToMetrics('write_to_us_sent');
    } else {
      hideProcessFromForm(form);
      lookAtMeAnimation(form);
    }
  });
  addCallbackToHideOfPopUp('write_to_us_accepted', function() {
    hideProcessFromForm(form);
  });
}