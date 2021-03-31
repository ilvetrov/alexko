const fs = require('fs');
const languages = getAllLanguagesFromFiles();

function getAllLanguagesFromFiles() {
  const languageFiles = fs.readdirSync('languages');
  
  let tempLanguages = {};
  for (let i = 0; i < languageFiles.length; i++) {
    const languageFile = languageFiles[i];
    const language = JSON.parse(fs.readFileSync(`languages/${languageFile}`));
    tempLanguages[language.cod_name] = language;
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
      if (language.cod_name !== userLanguage.cod_name) {
        languageList.push(language);
      }
    }
  }
  languageList.unshift(userLanguage);

  return languageList;
}

function getLanguage(name) {
  for (const key in languages) {
    if (Object.hasOwnProperty.call(languages, key)) {
      const language = languages[key];
      if (key == name || language.aliases.indexOf(name) != -1) {
        return language;
      }
    }
  }

  return languages['en'];
}

function setUserLanguage(req, res) {
  if (!req.cookies || !req.cookies.lang) {
    const userLanguage = getUserLanguage(req);
    req.userLang = userLanguage;
    res.cookie('lang', userLanguage.cod_name, {maxAge: 1000 * 60 * 60 * 24 * 365});
    return userLanguage;
  }
}

function getUserLanguage(req) {
  if (req.cookies && req.cookies.lang) {
    return getLanguage(req.cookies.lang);
  } else if (req.userLang) {
    return req.userLang;
  } else {
    const userLocale = require('get-user-locale');
    const userLanguage = getLanguage(userLocale.getUserLocale().split('-')[0]);
    return userLanguage;
  }
}

function langConstructor(req) {
  const language = getUserLanguage(req);

  return (text) => {
    return language.dictionary[text] || 'undefined';
  }
}

module.exports = {
  setUserLanguage,
  langConstructor,
  getLanguagesList,
  getUserLanguage
}