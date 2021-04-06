var express = require('express');
const auth = require('../libs/auth');
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

router.get('/admin-login', function(req, res, next) {
  if (req.cookies && req.cookies.ahsh) {
    if (req.query.to) {
      res.redirect(req.query.to);
    } else {
      res.redirect('/admin/panel');
    }
  }
  res.renderMin('pages/admin-login', {
    title: 'Войти в Админ-панель',
    layout: 'layouts/mini'
  });
});

router.post('/login-admin', function(req, res, next) {
  auth.admin.login(req, res, req.body.name, req.body.password)
  .then((success) => {
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success
    }));
  });
});

module.exports = router;
