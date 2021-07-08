const createError = require('http-errors');
const express = require('express');
const db = require('../../../db');
const { getUserLanguage, langConstructor } = require('../../../libs/user-language');
const { Page } = require('../../../models/page');

var router = express.Router();

router.get('/pages', async function(req, res, next) {
  db.query(`SELECT * FROM pages ORDER BY id DESC`)
  .then(function(pagesFromDB) {
    const pages = pagesFromDB.map(pageFromDB => new Page(pageFromDB, getUserLanguage(req).code_name));
    const lang = langConstructor(req);

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