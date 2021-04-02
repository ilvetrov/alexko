'use strict';

const { gsap } = require('./partials/libs/gsap.min');
const { ScrollTrigger } = require('./partials/libs/gsap-scroll-trigger.min');
gsap.registerPlugin(ScrollTrigger);

require('./partials/async-img-front');
require('./partials/animations/arrows');
require('./partials/animations/screen-scroll');
require('./partials/scroll-to-anchor');