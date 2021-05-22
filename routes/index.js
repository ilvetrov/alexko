var express = require('express');
const { langConstructor } = require('../libs/user-language');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const lang = langConstructor(req);
   
  res.renderMin('pages/index', {
    title: 'AlexKo – ' + lang('site_focus'),
    advantages: lang('advantages')
  });
});

router.use(require('./portfolio/project'));
router.use(require('./auth/admin'));

module.exports = router;
