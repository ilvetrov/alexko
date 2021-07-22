const cookiesNames = require("../../../libs/cookies-names");
const cookies = require("./cookies");

function sendToMetrics(name, type = 'reachGoal') {
  if (
    !!cookies.get(cookiesNames.consentToTheUseOfCookiesReceived)
    && typeof ym !== 'undefined'
  ) {
    ym(83065540, type, name)
  }
}

module.exports = {
  sendToMetrics
};