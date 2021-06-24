var express = require('express');
const { CSRF } = require('../libs/csrf');
const nonAuthCsrf = require('../libs/non-auth-csrf');
const redirectTo = require('../libs/redirect-to');
var router = express.Router();

router.use(function(req, res, next) {
  if (nonAuthCsrf.get(req).checkToken(CSRF.getCurrentToken(req))) return next();

  ifTokenIsWrong(req, res);
});

function ifTokenIsWrong(req, res) {
  if (req.method === 'GET') {
    redirectTo(res, req.query.to, res.locals.admin ? '/admin' : '/');
  } else {
    res.sendStatus(403);
  }
}

const checkNonAuthCsrf = router;

module.exports = checkNonAuthCsrf;