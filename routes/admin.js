const express = require('express');
const checkAdmin = require('../middlewares/check-admin');

var router = express.Router();

router.use(checkAdmin);
router.use(require('./admin/panel'));
router.use(require('./admin/portfolio/list-page'));
router.use(require('./admin/portfolio/add'));
router.use(require('./admin/portfolio/edit-page'));
router.use(require('./admin/portfolio/edit'));
router.use(require('./admin/resources'));
router.use(require('./admin/upload'));

module.exports = router;
