'use strict';

const { gsap } = require('./partials/libs/gsap.min');
const { ScrollTrigger } = require('./partials/libs/gsap-scroll-trigger.min');
const checkPage = require('./partials/check-page');
gsap.registerPlugin(ScrollTrigger);

require('./partials/async-img-front');
require('./partials/scroll-to-anchor');

if (checkPage('home')) {
  require('./partials/animations/arrows');
  require('./partials/animations/screen-scroll');
}
if (checkPage('login')) {
  const { initRequestForm } = require('./partials/form');
  const loginForm = document.getElementsByClassName('js-login-form')[0];
  const redirectLink = (new URLSearchParams(window.location.search)).get('to') || '/admin';
  initRequestForm(loginForm, (result) => {
    if (result.success) {
      window.location.href = redirectLink;
    }
  });
}