const fs = require('fs');
const languages = getAllLanguagesFromFiles();
const userLocale = require('get-user-locale');

function getAllLanguagesFromFiles() {
  const languageFiles = fs.readdirSync('languages');
  
  let tempLanguages = {};
  for (let i = 0; i < languageFiles.length; i++) {
    const languageFile = languageFiles[i];
    const language = JSON.parse(fs.readFileSync(`languages/${languageFile}`));
    tempLanguages[language.code_name] = language;
  }
  
  return tempLanguages;
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

  return languages['en'];
}

function validateLangName(langName) {
  return getLanguage(langName).code_name;
}

function setUserLanguage(req, res) {
  if (!(req.cookies && req.cookies.lang)) {
    const userLanguage = getUserLanguage(req);
    req.userLang = userLanguage;
    res.cookie('lang', userLanguage.code_name, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      sameSite: true
    });
    return userLanguage;
  }
  if (!req.userLang) {
    const userLanguage = getUserLanguage(req);
    req.userLang = userLanguage;
    return userLanguage;
  }
}

function getUserLanguage(req) {
  if (req.userLang) return req.userLang;
  if (req.cookies && req.cookies.lang) return getLanguage(req.cookies.lang);

  const userLanguage = getLanguage(userLocale.getUserLocale().split('-')[0]);
  return userLanguage;
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
  return language.dictionary[text] || getLanguage('en').dictionary[text] || text;
}

function langPropConstructor(req) {
  const language = getUserLanguage(req);

  return (object) => {
    return object[language.code_name] || object['en'];
  }
}

module.exports = {
  setUserLanguage,
  langConstructor,
  langConstructorByCodeName,
  langPropConstructor,
  getLanguagesList,
  getLanguagesNames,
  getUserLanguage,
  validateLangName
}