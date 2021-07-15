const { checkMobile, checkMobileAgent } = require('../source/js/partials/check-mobile');
const removeWhitespaces = require("./remove-whitespaces");

function sbcn() {
  document.body.classList.add((checkMobile() ? 'mobile' : 'desktop') + '-view');
}

function getBodyViewClassSetter() {
  return removeWhitespaces(`
    ${checkMobileAgent.toString()}
    ${checkMobile.toString()}
    ${sbcn.toString()}

    sbcn();
  `);
}

const bodyViewClassSetter = getBodyViewClassSetter();

module.exports = bodyViewClassSetter;