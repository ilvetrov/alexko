var express = require('express');
const { admin } = require('../../libs/auth');
const auth = require('../../libs/auth');
const defaultResLocals = require('../../libs/default-res-locals');
const redirectFromNonLang = require('../../libs/redirect-from-non-lang');
const redirectTo = require('../../libs/redirect-to');
const { setLangForRouter } = require('../../libs/set-lang-for-router');
const checkAdminCsrf = require('../../middlewares/check-admin-csrf');
var router = express.Router();

router.get('/admin-login-page', (req, res) => redirectFromNonLang(req, res, `/admin-login-page`));

router.get('/:lang/admin-login-page', function(req, res, next) {
  if (!setLangForRouter(req, res, next, `/:lang/admin-login-page`)) return;

  auth.admin.getLoggedUser(req)
  .then(() => {
    redirectTo(res, req.query.to, `${req.params.lang}/admin`);
  })
  .catch(() => {
    if (req.cookies && req.cookies.ahsh) {
      admin.removeSessionCookie(res);
    }
    defaultResLocals(req, res);
    res.renderMin('pages/admin-login', {
      title: res.locals.lang('admin_panel'),
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
