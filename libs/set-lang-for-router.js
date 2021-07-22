const redirectTo = require('./redirect-to');
const { checkPathLangName, getMainLangNameByAlias, setUserLanguage, defaultLang, getLastLanguage, checkThatItIsLanguage, getLanguagesList } = require('./user-language');

function setLangForRouter(req, res, next, redirectUrlPart) {
  if (!checkThatItIsLanguage(req.params.lang)) {
    next();
    return false;
  }
  if (!checkPathLangName(req.params.lang)) {
    const mainFromAlias = getMainLangNameByAlias(req.params.lang);
    if (mainFromAlias) {
      redirectTo(res, `/${mainFromAlias}${redirectUrlPart}`, `/${defaultLang}${redirectUrlPart}`, true);
      return false;
    }
    redirectTo(res, `/${getLastLanguage(req).code_name}${redirectUrlPart}`, `/${defaultLang}${redirectUrlPart}`, true);
    return false;
  }
  setLangProperties(req, res);
  return true;
}

function setLangProperties(req, res) {
  setUserLanguage(req, res);
}

module.exports = {
  setLangForRouter,
  setLangProperties
};