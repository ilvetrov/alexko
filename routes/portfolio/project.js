var express = require('express');
const { asyncImg } = require('../../libs/async-img-loader');

var router = express.Router();

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

module.exports = router;