const { addCallbackToHideOfActionCloud } = require("../action-cloud");
const cookies = require("../cookies");

addCallbackToHideOfActionCloud('change-language', function(event) {
  cookies.set('hidden_ptocl', true, 1440);
});