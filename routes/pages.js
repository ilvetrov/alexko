const createError = require('http-errors');
var express = require('express');
const db = require('../db');
const { Page } = require('../models/page');
const { getUserLanguage } = require('../libs/user-language');
const isDevelopment = require('../libs/is-development');

var router = express.Router();

router.get('/:slug', function(req, res, next) {
  const slug = req.params.slug;
  if (!slug) return next(createError(404));

  db.oneOrNone('SELECT * FROM pages WHERE status = $<status> AND slug = $<slug>', {
    status: 'published',
    slug: slug
  })
  .then(function(pageFromDb) {
    if (!pageFromDb) return next(createError(404));

    const page = new Page(pageFromDb, getUserLanguage(req).code_name);

    res.renderMin('pages/info', {
      title: page.title + ' – AlexKo',
      page: page
    });
  })
  .catch(function(reason) {
    isDevelopment && console.error(reason);
    next(createError(404));
  });

});

module.exports = router;