const { initRequestForm } = require("./form");

const forms = document.getElementsByClassName('js-write-to-us-form');

for (let i = 0; i < forms.length; i++) {
  const form = forms[i];
  initRequestForm(form, (result) => {
    if (result.success) {
      console.log('success!');
    } else {
      lookAtMeAnimation(loginForm);
    }
  });
}