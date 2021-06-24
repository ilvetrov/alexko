const express = require('express');

var router = express.Router();

router.use(require('./all'));
router.use(require('./one'));
router.use(require('./toggle-mark'));

module.exports = router;
