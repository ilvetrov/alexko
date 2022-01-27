const cookiesNames = require("./cookies-names");
const { currentDomain } = require("./current-domain");
const { getDemoSign, getDemoSignHead, getDemoSignFooter } = require("./demo-sign");
const { metricsCode } = require("./get-metrics-for-manual-installation");
const { linkPrefix, linkPrefixOfHome } = require("./link-prefix");
const { langConstructor, langPropConstructor, getUserLanguage, getLanguagesList, getLanguagesNames, defaultLang, getBrowserLanguage, langConstructorByCodeName } = require("./user-language");

function defaultResLocals(req, res) {
  res.locals.lang = langConstructor(req);
  res.locals.langProp = langPropConstructor(req);
  res.locals.currentLang = getUserLanguage(req);
  res.locals.langsList = getLanguagesList(req);

  res.locals.demoSign = getDemoSign(req);
  res.locals.demoSignHead = getDemoSignHead();
  res.locals.demoSignFooter = getDemoSignFooter();

  res.locals.siteName = res.locals.lang('site_name');

  res.locals.fullUrl = currentDomain + req.originalUrl;
  res.locals.pageType = 'website';

  res.locals.browserLanguage = getBrowserLanguage(req).code_name;
  const detectedLangAndCurrentAreDifferent = getUserLanguage(req).code_name !== getBrowserLanguage(req).code_name;
  res.locals.showProposalToChangeLanguageToBrowserLanguage = detectedLangAndCurrentAreDifferent && !req.cookies.hidden_ptocl;
  res.locals.changeToBrowserLanguageText = langConstructorByCodeName(getBrowserLanguage(req).code_name)('change_to_lang');
  res.locals.changeToBrowserLanguageLink = (function() {
    const regExp = new RegExp(`^\/${getUserLanguage(req).code_name}\/`);
    const langExistsInLink = !!req.path.match(regExp) && req.path !== (getUserLanguage(req).code_name === defaultLang ? '/' : `/${getUserLanguage(req).code_name}/`);
    if (langExistsInLink) return req.path.replace(regExp, `/${getBrowserLanguage(req).code_name}/`)
    return (function() {
      if (getBrowserLanguage(req).code_name === defaultLang) return '/';
      return `/${getBrowserLanguage(req).code_name}`;
    }());
  }());

  res.locals.linkPrefix = linkPrefix(req);
  res.locals.linkPrefixOfHome = linkPrefixOfHome(req);

  // Why? This is demo mode
  res.locals.requestCookiesConsent = false;
  // res.locals.requestCookiesConsent = !req.cookies[cookiesNames.cookiesConsentPopUpWasShown];
  res.locals.consentToTheUseOfCookiesReceived = !!req.cookies[cookiesNames.consentToTheUseOfCookiesReceived];

  if (typeof res.locals.frontVariables !== 'object') (res.locals.frontVariables = {});
  res.locals.frontVariables.currentLang = getUserLanguage(req).code_name;
  res.locals.frontVariables.languages = getLanguagesNames(req);
  res.locals.frontVariables.adminToken = res.locals.adminCsrf && res.locals.adminCsrf.createNewToken();

  res.locals.metricsCode = !res.locals.consentToTheUseOfCookiesReceived ? metricsCode : undefined;
  
  res.locals.writeToUs = res.locals.lang('form_text')[0];

  if (typeof res.locals.selects !== 'object') (res.locals.selects = []);
  res.locals.selects.push(
    {
      name: 'change_language',
      event: 'changeLanguage',
      modClass: 'change-language',
      items: (function() {
        const languages = getLanguagesList(req);
        const outputItems = [];
        const regExp = new RegExp(`^\/${getUserLanguage(req).code_name}\/`);
        const langExistsInLink = !!req.path.match(regExp) && req.path !== (getUserLanguage(req).code_name === defaultLang ? '/' : `/${getUserLanguage(req).code_name}/`);
        for (let i = 0; i < languages.length; i++) {
          const language = languages[i];
          outputItems.push({
            id: language.code_name,
            content: `${language.short_name} • ${language.full_name}`,
            active: language.code_name == getUserLanguage(req).code_name,
            link: (function() {
              if (langExistsInLink) return req.path.replace(regExp, `/${language.code_name}/`)
              return (function() {
                if (language.code_name === defaultLang) return '/';
                return `/${language.code_name}/`;
              }());
            }())
          });
        }
        return outputItems;
      }())
    }
  );

  res.locals.alternateLinks = (function() {
    const languages = getLanguagesList(req);
    const outputItems = [];
    const regExp = new RegExp(`^\/${getUserLanguage(req).code_name}\/`);
    const langExistsInLink = !!req.path.match(regExp) && req.path !== (getUserLanguage(req).code_name === defaultLang ? '/' : `/${getUserLanguage(req).code_name}/`);
    for (let i = 0; i < languages.length; i++) {
      const language = languages[i];
      outputItems.push({
        name: language.code_name,
        link: (function() {
          if (langExistsInLink) return req.path.replace(regExp, `/${language.code_name}/`)
          return (function() {
            if (language.code_name === defaultLang) return '/';
            return `/${language.code_name}`;
          }());
        }()),
        withRegion: language.dictionary.region_name
      });
    }
    return outputItems;
  }());

  res.locals.writeToUsAcceptedNotification = {
    name: 'write_to_us_accepted',
    title: res.locals.lang('accepted'),
    text: res.locals.lang('we_will_answer_within_24_hours'),
  }
}

module.exports = defaultResLocals;