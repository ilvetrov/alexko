'use strict';

require('./partials/dynamic-styles');
require('./partials/controls/change-language');
if (!checkMobile()) {
  const { gsap } = require('gsap/dist/gsap');
  const { ScrollTrigger } = require('gsap/dist/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({
    toggleActions: "play reverse play reverse"
  });
}
const { initRequestForm } = require('./partials/form');

const checkPage = require('./partials/check-page');
const { lookAtMeAnimation } = require('./partials/look-at-me');
const smoothHoverAnimation = require('./partials/smooth-hover-animation');

require('./partials/async-img-front');
require('./partials/scroll-to-anchor');
require('./partials/pop-up');
require('./partials/mobile-observer');
require('./partials/image-expansion-shadow');

if (checkPage('home')) {
  require('./partials/animations/arrows');
  require('./partials/animations/screen-scroll');
}
if (checkPage('login')) {
  const loginForm = document.getElementsByClassName('js-login-form')[0];
  const redirectLink = (new URLSearchParams(window.location.search)).get('to') || getDefaultPath();
  initRequestForm(loginForm, true, (result) => {
    if (result.success) {
      window.location.href = redirectLink;
    } else {
      lookAtMeAnimation(loginForm);
      return true;
    }
  });

  function getDefaultPath() {
    if (checkPage('admin-login')) {
      return '/admin';
    } else {
      return '/panel';
    }
  }
}

require('./partials/galleries');
require('./partials/controls/select-project-type');
require('./partials/controls/pop-up-inputs');
require('./partials/controls/multilingual-inputs').init();
require('./partials/controls/change-editing-language');
require('./partials/write-to-us');

smoothHoverAnimation('plus-button', 'hover');