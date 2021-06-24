var express = require('express');
const { admin } = require('../libs/auth');
const { CSRF } = require('../libs/csrf');
const redirectTo = require('../libs/redirect-to');
var router = express.Router();

router.use(function(req, res, next) {
  admin.getCurrentSession(req)
  .then((session) => {
    const token = CSRF.getCurrentToken(req);
    const csrf = new CSRF(session.secret);
    if (csrf.checkToken(token)) {
      next();
    } else {
      ifTokenIsWrong(req, res);
    }
  })
  .catch((err) => {
    console.error(err);
    ifTokenIsWrong(req, res);
  });
});

function ifTokenIsWrong(req, res) {
  if (req.method === 'GET') {
    redirectTo(res, req.query.to, res.locals.admin ? '/admin' : '/');
  } else {
    res.sendStatus(403);
  }
}

const checkAdminCsrf = router;

module.exports = checkAdminCsrf;