const getValuesFromAllLanguages = require("./get-values-from-all-languages");

function multilingualToArray(selfName, allData) {
  const userLanguageName = frontVariables.currentLang;

  return Object.values(getValuesFromAllLanguages(selfName, userLanguageName, frontVariables.languages, allData));
}

module.exports = {
  multilingualToArray
}