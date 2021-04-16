const createError = require('http-errors');
const express = require('express');
const { langConstructor } = require('../libs/user-language');
const checkAdmin = require('../middlewares/check-admin');
const fs = require('fs');
const { getRoot } = require('../libs/get-root');
const { glob } = require('glob');
const { asyncImg } = require('../libs/async-img-loader');

var router = express.Router();

router.use(checkAdmin);

router.get('/', function(req, res, next) {
  const lang = langConstructor(req);
   
  res.renderMin('admin/index', {
    title: lang('admin_panel'),
    layout: 'layouts/admin',
    images: {
      status_items: {
        done: asyncImg([
          {
            webSrc: '/admin/resources/img/done.svg',
            serverSrc: 'inner-resources/admin/public/img/done.svg'
          }
        ], false),
        clock: asyncImg([
          {
            webSrc: '/admin/resources/img/clock.svg',
            serverSrc: 'inner-resources/admin/public/img/clock.svg'
          }
        ], false),
        draft: asyncImg([
          {
            webSrc: '/admin/resources/img/draft.svg',
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

router.get('/portfolio/add', function(req, res, next) {
  const lang = langConstructor(req);
  
  // res.renderMin('admin/portfolio/add', {
  res.renderMin('pages/portfolio-item', {
    title: lang('add_project'),
    layout: 'layouts/admin',
    intro_images: [
      asyncImg([
        {
          webSrc: '/img/content/carousel-3d/level-1.png',
          serverSrc: 'public/img/content/carousel-3d/level-1.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/img/content/carousel-3d/level-1.png',
          serverSrc: 'public/img/content/carousel-3d/level-1.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/img/content/carousel-3d/level-3.png',
          serverSrc: 'public/img/content/carousel-3d/level-3.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/img/content/carousel-3d/level-1.png',
          serverSrc: 'public/img/content/carousel-3d/level-1.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/img/content/carousel-3d/win.png',
          serverSrc: 'public/img/content/carousel-3d/win.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/img/content/carousel-3d/level-2.png',
          serverSrc: 'public/img/content/carousel-3d/level-2.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/img/content/carousel-3d/level-1.png',
          serverSrc: 'public/img/content/carousel-3d/level-1.png'
        }
      ])
    ]
  });
});

router.get('/resources/*', function(req, res, next) {
  const fileRelativePath = req.params[0];
  if (glob.sync(getRoot() + `/inner-resources/admin/public/${fileRelativePath}`).length > 0) {
    res.sendFile(`inner-resources/admin/public/${fileRelativePath}`, {
      root: getRoot()
    });
  } else {
    next(createError(404));
  }
});

module.exports = router;
