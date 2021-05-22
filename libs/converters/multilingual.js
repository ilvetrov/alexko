const { getUserLanguage, getLanguagesNames } = require("../user-language");
const getValuesFromAllLanguages = require("./get-values-from-all-languages");

function frontMultilingualToBackend(selfName, allData, req) {
  const languagesNames = getLanguagesNames(req);
  const userLanguageName = getUserLanguage(req).code_name;

  return getValuesFromAllLanguages(selfName, userLanguageName, languagesNames, allData);
}

module.exports = {
  frontMultilingualToBackend
}