const createError = require('http-errors');
const express = require('express');
const { langConstructor } = require('../../libs/user-language');
const { asyncImg } = require('../../libs/async-img-loader');

var router = express.Router();

router.get('/', function(req, res, next) {
  const lang = langConstructor(req);
   
  res.renderMin('admin/index', {
    title: lang('admin_panel'),
    layout: 'layouts/admin',
    images: {
      status_items: {
        done: asyncImg([
          {
            webSrc: '/admin/resources/admin/public/img/done.svg',
            serverSrc: 'inner-resources/admin/public/img/done.svg'
          }
        ], false),
        clock: asyncImg([
          {
            webSrc: '/admin/resources/admin/public/img/clock.svg',
            serverSrc: 'inner-resources/admin/public/img/clock.svg'
          }
        ], false),
        draft: asyncImg([
          {
            webSrc: '/admin/resources/admin/public/img/draft.svg',
            serverSrc: 'inner-resources/admin/public/img/draft.svg'
          }
        ], false),
        plus: asyncImg([
          {
            webSrc: '/img/plus.svg',
            serverSrc: 'public/img/plus.svg'
          }
        ])
      }
    }
  });
});

module.exports = router;