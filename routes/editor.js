const express = require('express');
const checkAdmin = require('../middlewares/check-admin');

var router = express.Router();

router.use(checkAdmin);



module.exports = router;