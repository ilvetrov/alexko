const express = require('express');

var router = express.Router();

router.use(require('./add'));
router.use(require('./all'));
router.use(require('./edit'));
router.use(require('./edit-page'));

module.exports = router;
