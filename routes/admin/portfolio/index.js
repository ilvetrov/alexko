const express = require('express');

var router = express.Router();

router.use(require('./list-page'));
router.use(require('./add'));
router.use(require('./edit-page'));
router.use(require('./edit'));
router.use(require('./image-preview'));

module.exports = router;
