var express = require('express');
var router = express.Router();

router.use((req, res, next) => {
  const regexp = /^(\/[^\?]*[^\/])(\?.*)?$/;
  if (req.url.length > 1 && regexp.test(req.url)) {
    res.redirect(301, req.url.replace(regexp, '$1/$2'));
  } else {
    next();
  }
});

module.exports = router;
