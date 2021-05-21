const { getLanguagesNames } = require("./user-language");

const multilingualDefault = (function() {
  const languages = getLanguagesNames();
  
  const output = {};
  for (const languageCodName in languages) {
    if (Object.hasOwnProperty.call(languages, languageCodName)) {
      output[languageCodName] = null;
    }
  }
  
  return output;
}());

module.exports = multilingualDefault;