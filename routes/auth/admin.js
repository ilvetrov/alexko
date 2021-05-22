var express = require('express');
const { admin } = require('../../libs/auth');
const auth = require('../../libs/auth');
const redirectTo = require('../../libs/redirect-to');
const checkAdminCsrf = require('../../middlewares/check-admin-csrf');
var router = express.Router();

router.get('/admin-login-page', function(req, res, next) {
  auth.admin.getLoggedUser(req)
  .then(() => {
    redirectTo(res, req.query.to, '/admin');
  })
  .catch(() => {
    if (req.cookies && req.cookies.ahsh) {
      admin.removeSessionCookie(res);
    }
    res.renderMin('pages/admin-login', {
      title: 'Войти в Админ-панель',
      layout: 'layouts/mini'
    });
  });
});

router.get('/admin-logout', checkAdminCsrf, function(req, res, next) {
  auth.admin.getLoggedUser(req)
  .then(() => {
    auth.admin.logout(req, res)
    .then(() => {
      redirectTo(res, req.query.to);
    });
  })
  .catch(() => {
    redirectTo(res, req.query.to);
  });
});

router.post('/login-admin', function(req, res, next) {
  auth.admin.login(req, res, req.body.name, req.body.password)
  .finally(() => {
    res.header('Content-Type', 'application/json');
  })
  .then(() => {
    res.send(JSON.stringify({
      success: true
    }));
  })
  .catch(() => {
    res.send(JSON.stringify({
      success: false
    }));
  });
});

module.exports = router;
