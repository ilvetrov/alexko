var express = require('express');
const { admin } = require('../libs/auth');
const { CSRF } = require('../libs/csrf');
const { insertingFileVersion } = require('../libs/files-version');
var router = express.Router();
const { setUserLanguage, langConstructor, langPropConstructor, getLanguagesList, getLanguagesNames, getUserLanguage } = require('../libs/user-language');

router.use(async function(req, res, next) {
  setUserLanguage(req, res);

  const languagesNames = getLanguagesNames(req);

  Promise.all([

    new Promise((resolve, reject) =>
      admin.getLoggedUser(req).then(user => resolve(user)).catch(() => resolve(undefined))
    ),

    new Promise((resolve, reject) =>
      admin.getCurrentSession(req).then(session => resolve(session)).catch(() => resolve(undefined))
    ),

  ]).then(function([
    admin,
    adminSession
  ]) {
    res.locals.admin = admin;
    res.locals.adminSession = adminSession;
    res.locals.adminCsrf = adminSession ? new CSRF(adminSession.secret) : '';

    res.locals.lang = langConstructor(req);
    res.locals.langProp = langPropConstructor(req);
    res.locals.currentLang = getUserLanguage(req);
    res.locals.langsList = getLanguagesList(req);
    res.locals.fileVersion = insertingFileVersion;
    res.locals.frontVariables = {
      currentLang: getUserLanguage(req).code_name,
      languages: languagesNames,
      adminToken: res.locals.adminCsrf && res.locals.adminCsrf.createNewToken()
    };
  
    next();
  });

});

module.exports = router;
