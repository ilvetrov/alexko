var express = require('express');
const { admin } = require('../libs/auth');
const { insertingFileVersion } = require('../libs/files-version');
var router = express.Router();
const { setUserLanguage, langConstructor, langPropConstructor, getLanguagesList, getLanguagesNames, getUserLanguage } = require('../libs/user-language');

router.use(async function(req, res, next) {  
  setUserLanguage(req, res);

  const languagesNames = getLanguagesNames(req);

  res.locals.admin = await admin.getLoggedUser(req).then(user => user).catch(() => undefined);
  res.locals.lang = langConstructor(req);
  res.locals.langProp = langPropConstructor(req);
  res.locals.currentLang = getUserLanguage(req);
  res.locals.langsList = getLanguagesList(req);
  res.locals.fileVersion = insertingFileVersion;
  res.locals.frontVariables = {
    currentLang: getUserLanguage(req).cod_name,
    languages: languagesNames
  };

  next();
});

module.exports = router;
