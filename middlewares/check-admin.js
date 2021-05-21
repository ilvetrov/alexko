var express = require('express');
const { admin } = require('../libs/auth');
var router = express.Router();
const paramsToQuery = require("../libs/params-to-query");

router.use(function(req, res, next) {
  admin.getLoggedUser(req)
  .then(() => {
    next();
  })
  .catch(() => {
    res.redirect(`/admin-login-page${paramsToQuery({
      to: req.originalUrl
    })}`);
  });
});

module.exports = router;