const { getUserLanguage, defaultLang } = require("./user-language");

function linkPrefix(req) {
  return `/${getUserLanguage(req).code_name}`;
}

function linkPrefixOfHome(req) {
  if (getUserLanguage(req).code_name === defaultLang) return '';
  return linkPrefix(req);
}

module.exports = {
  linkPrefix,
  linkPrefixOfHome
};