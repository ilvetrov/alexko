const fs = require('fs');
const languages = getAllLanguages();

function getAllLanguages() {
  const languageFiles = fs.readdirSync('languages');
  
  let tempLanguages = {};
  for (let i = 0; i < languageFiles.length; i++) {
    const languageFile = languageFiles[i];
    const language = JSON.parse(fs.readFileSync(`languages/${languageFile}`));
    tempLanguages[language.cod_name] = language;
  }
  
  return tempLanguages;
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
    const userLanguage = getUserLanguageName(req);
    req.userLang = userLanguage;
    res.cookie('lang', userLanguage, {maxAge: 1000 * 60 * 60 * 24 * 365});
    return userLanguage;
  }
}

function getUserLanguageName(req) {
  if (req.cookies && req.cookies.lang) {
    return req.cookies.lang;
  } else if (req.userLang) {
    return req.userLang;
  } else {
    const userLocale = require('get-user-locale');
    const userLanguage = userLocale.getUserLocale().split('-')[0];
    return userLanguage;
  }
}

function langConstructor(req) {
  const userLanguageName = getUserLanguageName(req);
  const language = getLanguage(userLanguageName);

  return (text) => {
    return language.dictionary[text] || 'undefined';
  }
}

module.exports = {
  setUserLanguage,
  getUserLanguageName,
  langConstructor
}