var express = require('express');
var router = express.Router();
const { setUserLanguage, langConstructor, getLanguagesList, getUserLanguage } = require('../libs/user-language');

router.use(function(req, res, next) {  
  setUserLanguage(req, res);

  res.locals.lang = langConstructor(req);
  res.locals.currentLang = getUserLanguage(req);
  res.locals.langsList = getLanguagesList(req);

  next();
});

module.exports = router;
