const createError = require('http-errors');
const express = require('express');
const { getRoot } = require('../../libs/get-root');
const { glob } = require('glob');

var router = express.Router();

router.get('/resources/*', async function(req, res, next) {
  const fileRelativePath = req.params[0];
  if (glob.sync(getRoot() + `/inner-resources/${fileRelativePath}`).length > 0) {
    res.sendFile(`inner-resources/${fileRelativePath}`, {
      root: getRoot()
    });
  } else {
    next(createError(404));
  }
});

module.exports = router;