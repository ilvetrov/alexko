const createError = require('http-errors');
const express = require('express');
const { getRoot } = require('../../../libs/get-root');
const { glob } = require('glob');
const detectImgIsDraft = require('../../../libs/detect-img-is-draft');
const getImgSrc = require('../../../libs/get-img-src');

var router = express.Router();

router.get('/portfolio/image-preview/*', async function(req, res, next) {
  const imageName = req.params[0];
  const isDraft = await detectImgIsDraft(imageName);
  const path = getImgSrc(imageName, isDraft);
  if (glob.sync(getRoot() + '/' + path.serverSrc).length > 0) {
    res.sendFile(path.serverSrc, {
      root: getRoot()
    });
  } else {
    next(createError(404));
  }
});

module.exports = router;