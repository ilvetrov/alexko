const { getLanguagesNames } = require("./user-language");

const multilingualDefault = (function() {
  const languages = getLanguagesNames();
  
  const output = {};
  for (const languageCodeName in languages) {
    if (Object.hasOwnProperty.call(languages, languageCodeName)) {
      output[languageCodeName] = null;
    }
  }
  
  return output;
}());

module.exports = multilingualDefault;