const cookies = require("../cookies");
const { addActionToEvent } = require("../pop-up");

addActionToEvent('changeLanguage', function(selectedOption) {
  const selectedLangName = selectedOption.getAttribute('data-option-id');

  cookies.set('lang', selectedLangName, 8760, true);

  window.location.reload();

  return false;
});