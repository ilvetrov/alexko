var express = require('express');
const { langConstructor } = require('../libs/user-language');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const lang = langConstructor(req);
   
  res.renderMin('pages/index', {
    advantages: lang('advantages')
  });
});

module.exports = router;
