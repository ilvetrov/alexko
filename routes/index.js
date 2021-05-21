var express = require('express');
const { admin } = require('../libs/auth');
const auth = require('../libs/auth');
const redirectTo = require('../libs/redirect-to');
const { langConstructor } = require('../libs/user-language');
const { asyncImg } = require('../libs/async-img-loader');
const checkAdminCsrf = require('../middlewares/check-admin-csrf');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const lang = langConstructor(req);
   
  res.renderMin('pages/index', {
    title: 'AlexKo – ' + lang('site_focus'),
    advantages: lang('advantages')
  });
});

router.get('/portfolio/example', function(req, res, next) {
  res.renderMin('pages/portfolio-item', {
    title: 'CAROUSEL 3D',
    intro_images: [
      asyncImg([
        {
          webSrc: '/content/1/img/level-1.png',
          serverSrc: 'public/content/1/img/level-1.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/content/1/img/level-1.png',
          serverSrc: 'public/content/1/img/level-1.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/content/1/img/level-3.png',
          serverSrc: 'public/content/1/img/level-3.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/content/1/img/level-1.png',
          serverSrc: 'public/content/1/img/level-1.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/content/1/img/win.png',
          serverSrc: 'public/content/1/img/win.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/content/1/img/level-2.png',
          serverSrc: 'public/content/1/img/level-2.png'
        }
      ]),
      asyncImg([
        {
          webSrc: '/content/1/img/level-1.png',
          serverSrc: 'public/content/1/img/level-1.png'
        }
      ])
    ],
    images: {
      level_3: asyncImg([
        {
          webSrc: '/content/1/img/level-3.png',
          serverSrc: 'public/content/1/img/level-3.png'
        }
      ])
    }
  });
});

router.get('/admin-login-page', function(req, res, next) {
  auth.admin.getLoggedUser(req)
  .then(() => {
    redirectTo(res, req.query.to, '/admin');
  })
  .catch(() => {
    if (req.cookies && req.cookies.ahsh) {
      admin.removeSessionCookie(res);
    }
    res.renderMin('pages/admin-login', {
      title: 'Войти в Админ-панель',
      layout: 'layouts/mini'
    });
  });
});

router.get('/admin-logout', checkAdminCsrf, function(req, res, next) {
  auth.admin.getLoggedUser(req)
  .then(() => {
    auth.admin.logout(req, res)
    .then(() => {
      redirectTo(res, req.query.to);
    });
  })
  .catch(() => {
    redirectTo(res, req.query.to);
  });
});

router.post('/login-admin', function(req, res, next) {
  auth.admin.login(req, res, req.body.name, req.body.password)
  .finally(() => {
    res.header('Content-Type', 'application/json');
  })
  .then(() => {
    res.send(JSON.stringify({
      success: true
    }));
  })
  .catch(() => {
    res.send(JSON.stringify({
      success: false
    }));
  });
});

module.exports = router;
