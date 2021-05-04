const { getUserLanguage, getLanguagesNames } = require("../user-language");

function frontMultilingualToBackend(selfName, allData, req) {
  const languagesNames = getLanguagesNames(req);
  const userLanguageName = getUserLanguage(req).cod_name;

  const outputToBackend = {};
  for (const codName in languagesNames) {
    if (codName == userLanguageName) continue;
    if (Object.hasOwnProperty.call(languagesNames, codName)) {
      const newValue = allData[`${selfName}_${codName}`];
      outputToBackend[codName] = newValue;
    }
  }
  outputToBackend[userLanguageName] = allData[selfName];

  return outputToBackend;
}

module.exports = {
  frontMultilingualToBackend
}