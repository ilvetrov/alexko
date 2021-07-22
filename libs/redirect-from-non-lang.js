const paramsToQuery = require("./params-to-query");
const redirectTo = require("./redirect-to");
const { defaultLang, getLastLanguage } = require("./user-language");

function redirectFromNonLang(req, res, toPart) {
  redirectTo(res, `/${getLastLanguage(req).code_name || defaultLang}${toPart}${paramsToQuery(req.query)}`, `/${defaultLang}${toPart}${paramsToQuery(req.query)}`);
}

module.exports = redirectFromNonLang;