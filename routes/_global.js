var express = require('express');
const { admin } = require('../libs/auth');
var router = express.Router();
const { setUserLanguage, langConstructor, getLanguagesList, getUserLanguage } = require('../libs/user-language');

router.use(async function(req, res, next) {  
  setUserLanguage(req, res);

  res.locals.admin = await admin.getLoggedUser(req).then(user => user).catch(() => undefined);
  res.locals.lang = langConstructor(req);
  res.locals.currentLang = getUserLanguage(req);
  res.locals.langsList = getLanguagesList(req);

  next();
});

module.exports = router;
