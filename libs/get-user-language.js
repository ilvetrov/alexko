module.exports = (req, res) => {
  if (req.cookies) {
    
  } else {
    const userLocale = require('get-user-locale');
    const userLanguage = userLocale.getUserLocale().split('-')[0];
    res.cookie('lang', userLanguage, {maxAge: 1});
    return userLanguage;
  }
}