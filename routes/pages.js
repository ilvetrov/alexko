const createError = require('http-errors');
var express = require('express');
const db = require('../db');
const { Page } = require('../models/page');
const { getUserLanguage } = require('../libs/user-language');
const isDevelopment = require('../libs/is-development');
const redirectFromNonLang = require('../libs/redirect-from-non-lang');
const { setLangForRouter } = require('../libs/set-lang-for-router');
const defaultResLocals = require('../libs/default-res-locals');
const addTrailingSlash = require('../middlewares/trailing-slash.js');

var router = express.Router();

router.get(`/:slug`, (req, res) => redirectFromNonLang(req, res, `/${req.params.slug}`));

router.get('/:lang/:slug/', addTrailingSlash, function(req, res, next) {
  if (!setLangForRouter(req, res, next, `/${req.params.slug}`)) return;

  const slug = req.params.slug;
  if (!slug) return next(createError(404));

  db.oneOrNone('SELECT * FROM pages WHERE status = $<status> AND slug = $<slug>', {
    status: 'published',
    slug: slug
  })
  .then(function(pageFromDb) {
    if (!pageFromDb) return next(createError(404));

    const page = new Page(pageFromDb, getUserLanguage(req).code_name);

    defaultResLocals(req, res);
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