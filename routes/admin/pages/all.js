const createError = require('http-errors');
const express = require('express');
const db = require('../../../db');
const { getUserLanguage, langConstructor } = require('../../../libs/user-language');
const { Page } = require('../../../models/page');
const redirectFromNonLang = require('../../../libs/redirect-from-non-lang');
const { setLangForRouter } = require('../../../libs/set-lang-for-router');
const defaultResLocals = require('../../../libs/default-res-locals');

var router = express.Router();

router.get(`/admin/pages`, (req, res) => redirectFromNonLang(req, res, `/admin/pages`));

router.get('/:lang/admin/pages', async function(req, res, next) {
  if (!setLangForRouter(req, res, next, `/admin/pages`)) return;

  db.query(`SELECT * FROM pages ORDER BY id DESC`)
  .then(function(pagesFromDB) {
    const pages = pagesFromDB.map(pageFromDB => new Page(pageFromDB, getUserLanguage(req).code_name));
    const lang = langConstructor(req);

    defaultResLocals(req, res);
    if (pages.length > 0) {
      res.renderMin('admin/pages/list', {
        title: lang('page') + ' – ' + lang('admin_panel'),
        layout: 'layouts/admin',
        pages: pages
      });
    } else {
      res.renderMin('pages/list-is-empty', {
        title: lang('page') + ' – ' + lang('admin_panel'),
        layout: 'layouts/mini',
      });
    }
  })
  .catch(function(reason) {
    console.log(reason);
    next(createError(404));
  });

});

module.exports = router;