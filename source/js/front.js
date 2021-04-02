'use strict';

const cookies = require('./partials/cookies');

const { gsap } = require('./partials/libs/gsap.min');
const { ScrollTrigger } = require('./partials/libs/gsap-scroll-trigger.min');
gsap.registerPlugin(ScrollTrigger);

const asyncImgFront = require('./partials/async-img-front');
const arrowsAnimation = require('./partials/animations/arrows');
const screenScroll = require('./partials/animations/screen-scroll');