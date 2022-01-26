const express = require('express');
const router = express.Router();

router.use('/services', require('./services'));

router.use(require('./_global'));

router.use(require('./home'));
router.use(require('./portfolio/all'));
router.use(require('./portfolio/project'));
router.use(require('./auth/admin'));
router.use(require('./admin'));
router.use(require('./forms'));
router.use(require('./pages'));

module.exports = router;
