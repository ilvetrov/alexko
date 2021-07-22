var express = require('express');
var router = express.Router();
const { admin } = require('../libs/auth');
const bodyViewClassSetter = require('../libs/body-view-class-setter');
const { CSRF } = require('../libs/csrf');
const { insertingFileVersion } = require('../libs/files-version');
const isDevelopment = require('../libs/is-development');
const nonAuthCsrf = require('../libs/non-auth-csrf');
const { setBrowserLanguage } = require('../libs/user-language');

router.use(function(req, res, next) {
  setBrowserLanguage(req, res);

  nonAuthCsrf.init(req, res);
  
  Promise.all([
  
    admin.getLoggedUser(req).catch(() => undefined),
  
    admin.getCurrentSession(req).catch(() => undefined),
  
  ]).then(function([
    admin,
    adminSession
  ]) {
    res.locals.admin = admin;
    res.locals.adminSession = adminSession;
    res.locals.adminCsrf = adminSession ? new CSRF(adminSession.secret) : '';
  
    res.locals.fileVersion = insertingFileVersion;
    res.locals.isDevelopment = isDevelopment;
    res.locals.accessToDebugScripts = isDevelopment && !!res.locals.admin;
    res.locals.bodyViewClassSetter = bodyViewClassSetter;
    res.locals.nonAuthCsrf = nonAuthCsrf.get(req);
  
    const currentYear = (new Date()).getFullYear();
    res.locals.copyrightYear = `2021${currentYear !== 2021 ? '—' + currentYear : ''}`;
    
    next();
  });
});

module.exports = router;
