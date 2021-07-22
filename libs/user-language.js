const fs = require('fs');
const languages = getAllLanguagesFromFiles();
const defaultLang = 'ru';
const userLocale = require('get-user-locale');
const detectedLangCookieName = 'd_lang';

function getAllLanguagesFromFiles() {
  const languageFiles = fs.readdirSync('languages');
  
  let outputLanguages = {};
  for (let i = 0; i < languageFiles.length; i++) {
    const languageFile = languageFiles[i];
    const language = JSON.parse(fs.readFileSync(`languages/${languageFile}`));
    outputLanguages[language.code_name] = language;
  }
  
  return outputLanguages;
}

function getLanguagesList(req = undefined) {
  if (!req) return languages;

  const userLanguage = getUserLanguage(req);

  let languageList = [];
  for (const key in languages) {
    if (Object.hasOwnProperty.call(languages, key)) {
      const language = languages[key];
      if (language.code_name !== userLanguage.code_name) {
        languageList.push(language);
      }
    }
  }
  languageList.unshift(userLanguage);

  return languageList;
}

function getLanguagesNames(req = undefined) {
  const languages = getLanguagesList(req);

  const outputLanguages = {};
  for (const key in languages) {
    if (Object.hasOwnProperty.call(languages, key)) {
      const language = languages[key];
      outputLanguages[language.code_name] = language.full_name;
    }
  }
  return outputLanguages;
}

function getLanguage(rawName) {
  const name = String(rawName).trim();

  for (const key in languages) {
    if (Object.hasOwnProperty.call(languages, key)) {
      const language = languages[key];
      if (key === name || language.aliases.indexOf(name) !== -1) {
        return language;
      }
    }
  }

  return languages[defaultLang];
}

function validateLangName(langName) {
  return getLanguage(langName.trim()).code_name;
}

function checkThatItIsLanguage(possiblyLangName) {
  const name = String(possiblyLangName).trim();

  for (const key in languages) {
    if (Object.hasOwnProperty.call(languages, key)) {
      const language = languages[key];
      if (key === name || language.aliases.indexOf(name) !== -1) {
        return true;
      }
    }
  }

  return false;
}

function checkPathLangName(langName) {
  return Object.keys(languages).indexOf(langName.trim()) !== -1;
}

function getMainLangNameByAlias(aliasName) {
  const name = String(aliasName).trim();

  for (const key in languages) {
    if (Object.hasOwnProperty.call(languages, key)) {
      const language = languages[key];
      if (key === name || language.aliases.indexOf(name) !== -1) {
        return key;
      }
    }
  }

  return false;
}

function setBrowserLanguage(req, res) {
  if (!(req.cookies && req.cookies[detectedLangCookieName])) {
    const browserLanguage = getBrowserLanguage(req);
    req.browserLang = browserLanguage;
    res.cookie(detectedLangCookieName, browserLanguage.code_name, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      sameSite: true
    });
    return browserLanguage;
  }
  if (!req.browserLang) {
    const browserLanguage = getBrowserLanguage(req);
    req.browserLang = browserLanguage;
    return browserLanguage;
  }
}

function getBrowserLanguage(req) {
  if (req.browserLang) return req.browserLang;
  if (req.cookies && req.cookies[detectedLangCookieName]) return getLanguage(req.cookies[detectedLangCookieName]);

  const browserLanguage = getLanguage(userLocale.getUserLocale().split('-')[0]);
  return browserLanguage;
}

function setUserLanguage(req, res, setDefaultLang = false) {
  const userLanguage = setDefaultLang ? getLanguage(defaultLang) : getUserLanguage(req);
  req.userLang = userLanguage;

  if (req.cookies.u_lang && !(req.params.lang || req.path === '/')) {
    req.universalPagesLang = getLanguage(req.cookies.u_lang);
  } else {
    res.cookie('u_lang', userLanguage.code_name, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      sameSite: true
    });
    req.universalPagesLang = userLanguage;
  }

  res.locals.lang = langConstructorByCodeName(userLanguage.code_name);
}
function getUserLanguage(req) {
  if (req.userLang) return req.userLang;
  if (req.params.lang) return getLanguage(req.params.lang);
  return getLastLanguage(req);
}

function getLastLanguage(req) {
  if (req.universalPagesLang) return req.universalPagesLang;
  if (req.cookies.u_lang) return getLanguage(req.cookies.u_lang);
  return getBrowserLanguage(req);
}

function langConstructor(req) {
  const language = getUserLanguage(req);

  return (text) => {
    return lang(text, language);
  }
}

function langConstructorByCodeName(langCodeName) {
  const language = getLanguage(langCodeName);

  return (text) => {
    return lang(text, language);
  }
}

function lang(text, language) {
  return language.dictionary[text] || getLanguage(defaultLang).dictionary[text] || text;
}

function langPropConstructor(req) {
  const language = getUserLanguage(req);

  return (object) => {
    return object[language.code_name] || object[defaultLang];
  }
}

module.exports = {
  getLanguage,
  getBrowserLanguage,
  setBrowserLanguage,
  setUserLanguage,
  getUserLanguage,
  getLastLanguage,
  langConstructor,
  langConstructorByCodeName,
  langPropConstructor,
  getLanguagesList,
  getLanguagesNames,
  validateLangName,
  checkPathLangName,
  checkThatItIsLanguage,
  getMainLangNameByAlias,
  defaultLang
}