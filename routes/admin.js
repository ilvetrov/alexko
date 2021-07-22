const express = require('express');
const checkAdmin = require('../middlewares/check-admin');

var router = express.Router();

router.use('/admin', checkAdmin);
router.use('/:lang/admin', checkAdmin);
router.use(require('./admin/panel'));
router.use(require('./admin/portfolio'));
router.use(require('./admin/letters'));
router.use(require('./admin/resources'));
router.use(require('./admin/upload'));
router.use(require('./admin/pages'));

module.exports = router;
