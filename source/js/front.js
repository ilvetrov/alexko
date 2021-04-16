'use strict';

const { gsap } = require('gsap/dist/gsap');
const { ScrollTrigger } = require('gsap/dist/ScrollTrigger');
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({
  toggleActions: "play reverse play reverse"
});

const checkPage = require('./partials/check-page');
const lookAtMeAnimation = require('./partials/look-at-me');
const smoothHoverAnimation = require('./partials/smooth-hover-animation');

require('./partials/async-img-front');
require('./partials/scroll-to-anchor');

if (checkPage('home')) {
  require('./partials/animations/arrows');
  require('./partials/animations/screen-scroll');
}
if (checkPage('login')) {
  const { initRequestForm } = require('./partials/form');
  const loginForm = document.getElementsByClassName('js-login-form')[0];
  const redirectLink = (new URLSearchParams(window.location.search)).get('to') || getDefaultPath();
  initRequestForm(loginForm, (result) => {
    if (result.success) {
      window.location.href = redirectLink;
    } else {
      lookAtMeAnimation(loginForm);
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

smoothHoverAnimation('plus-button', 'hover');