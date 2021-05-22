function getValuesFromAllLanguages(selfName, userLanguageName, languagesNames, values) {
  const output = {};
  for (const codeName in languagesNames) {
    if (codeName == userLanguageName) continue;
    if (Object.hasOwnProperty.call(languagesNames, codeName)) {
      const newValue = values[`${selfName}_${codeName}`];
      output[codeName] = newValue;
    }
  }
  output[userLanguageName] = values[selfName];

  return output;
}

module.exports = getValuesFromAllLanguages;