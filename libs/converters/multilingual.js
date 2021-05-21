const { getUserLanguage, getLanguagesNames } = require("../user-language");

function frontMultilingualToBackend(selfName, allData, req) {
  const languagesNames = getLanguagesNames(req);
  const userLanguageName = getUserLanguage(req).code_name;

  const outputToBackend = {};
  for (const codeName in languagesNames) {
    if (codeName == userLanguageName) continue;
    if (Object.hasOwnProperty.call(languagesNames, codeName)) {
      const newValue = allData[`${selfName}_${codeName}`];
      outputToBackend[codeName] = newValue;
    }
  }
  outputToBackend[userLanguageName] = allData[selfName];

  return outputToBackend;
}

module.exports = {
  frontMultilingualToBackend
}