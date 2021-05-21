const { getLanguagesNames } = require("./user-language");

const multilingualDefault = (function() {
  const languages = getLanguagesNames();
  
  const output = {};
  for (const languagecodeName in languages) {
    if (Object.hasOwnProperty.call(languages, languagecodeName)) {
      output[languagecodeName] = null;
    }
  }
  
  return output;
}());

module.exports = multilingualDefault;