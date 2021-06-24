var express = require('express');
const { admin } = require('../libs/auth');
const bodyViewClassSetter = require('../libs/body-view-class-setter');
const { CSRF } = require('../libs/csrf');
const { insertingFileVersion } = require('../libs/files-version');
const isDevelopment = require('../libs/is-development');
const nonAuthCsrf = require('../libs/non-auth-csrf');
var router = express.Router();
const { setUserLanguage, langConstructor, langPropConstructor, getLanguagesList, getLanguagesNames, getUserLanguage } = require('../libs/user-language');

router.use(async function(req, res, next) {
  setUserLanguage(req, res);
  nonAuthCsrf.init(req, res);

  const languagesNames = getLanguagesNames(req);

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

    res.locals.lang = langConstructor(req);
    res.locals.langProp = langPropConstructor(req);
    res.locals.currentLang = getUserLanguage(req);
    res.locals.langsList = getLanguagesList(req);
    res.locals.fileVersion = insertingFileVersion;
    res.locals.isDevelopment = isDevelopment;
    res.locals.accessToDebugScripts = isDevelopment && !!res.locals.admin;
    res.locals.bodyViewClassSetter = bodyViewClassSetter;
    res.locals.nonAuthCsrf = nonAuthCsrf.get(req);

    res.locals.frontVariables = {
      currentLang: getUserLanguage(req).code_name,
      languages: languagesNames,
      adminToken: res.locals.adminCsrf && res.locals.adminCsrf.createNewToken()
    };
    res.locals.writeToUs = res.locals.lang('form_text')[0];

    const currentYear = (new Date()).getFullYear();
    res.locals.copyrightYear = `2021${currentYear !== 2021 ? '—' + currentYear : ''}`;
    res.locals.selects = [
      {
        name: 'change_language',
        event: 'changeLanguage',
        modClass: 'change-language',
        itemsOLD: (function() {
          const languagesNames = getLanguagesNames(req);
          const outputItems = [];
          for (const codeName in languagesNames) {
            if (Object.hasOwnProperty.call(languagesNames, codeName)) {
              const languageHumanName = languagesNames[codeName];
              outputItems.push({
                id: codeName,
                content: languageHumanName,
                active: codeName == getUserLanguage(req).code_name
              });
            }
          }
          return outputItems;
        }()),
        items: (function() {
          const languages = getLanguagesList(req);
          const outputItems = [];
          for (let i = 0; i < languages.length; i++) {
            const language = languages[i];
            outputItems.push({
              id: language.code_name,
              content: `${language.short_name} • ${language.full_name}`,
              active: language.code_name == getUserLanguage(req).code_name
            });
          }
          return outputItems;
        }())
      }
    ];

    res.locals.writeToUsAcceptedNotification = {
      name: 'write_to_us_accepted',
      title: res.locals.lang('accepted'),
      text: res.locals.lang('we_will_answer_within_24_hours'),
    }
  
    next();
  });

});

module.exports = router;
