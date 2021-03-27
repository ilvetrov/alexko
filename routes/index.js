var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {  
  res.renderMin('pages/index', {
    title: 'AlexKo'
  });
});

module.exports = router;
