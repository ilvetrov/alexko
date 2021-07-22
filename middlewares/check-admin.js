var express = require('express');
const { admin } = require('../libs/auth');
var router = express.Router();
const paramsToQuery = require("../libs/params-to-query");
const { getUserLanguage } = require('../libs/user-language');

router.use(function(req, res, next) {
  admin.getLoggedUser(req)
  .then(() => {
    next();
  })
  .catch(() => {
    if (req.method === 'GET') {
      res.redirect(`/${getUserLanguage(req).code_name}/admin-login-page${paramsToQuery({
        to: req.originalUrl
      })}`);
    } else {
      res.sendStatus(403);
    }
  });
});

module.exports = router;