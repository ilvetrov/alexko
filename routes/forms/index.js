const express = require('express');

var router = express.Router();

router.use(require('./new-client'));

module.exports = router;
