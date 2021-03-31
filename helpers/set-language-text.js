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