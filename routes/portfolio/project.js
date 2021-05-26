const createError = require('http-errors');
var express = require('express');
const { asyncImg } = require('../../libs/async-img-loader');
const db = require('../../db');
const { PortfolioProject } = require('../../models/portfolio');
const { getUserLanguage } = require('../../libs/user-language');
const getImgSrc = require('../../libs/get-img-src');

var router = express.Router();

router.get('/portfolio/example', function(req, res, next) {
  res.renderMin('pages/portfolio-item', {
    title: 'Carousel 3D – AlexKo',
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

router.get('/portfolio/:slug', function(req, res, next) {
  const slug = req.params.slug;
  if (!slug) return next(createError(404));

  db.oneOrNone('SELECT portfolio.*, project_types.singular_name as type_name FROM portfolio LEFT JOIN project_types ON portfolio.type_id = project_types.id WHERE status = $<status> AND slug = $<slug>', {
    status: 'published',
    slug: slug
  })
  .then(function(projectFromDb) {
    if (!projectFromDb) return next(createError(404));

    const project = new PortfolioProject(projectFromDb, getUserLanguage(req).code_name);

    res.renderMin('pages/portfolio-item', {
      title: project.title + ' – AlexKo',
      project: project,
      intro_images: (function() {
        const introImages = (project.type_id == 1 ? project.intro_images.desktop : project.intro_images.mobile);

        const asyncImages = [];
        for (const order in introImages) {
          if (Object.hasOwnProperty.call(introImages, order)) {
            const introImage = introImages[order];
            asyncImages.push(
              asyncImg([getImgSrc(introImage, false)])
            );
          }
        }

        return asyncImages;
      }()),
      intro_mobile_images: (function() {
        if (project.type_id != 1) return [];
        const introImages = project.intro_images.mobile;

        const asyncImages = [];
        for (const order in introImages) {
          if (Object.hasOwnProperty.call(introImages, order)) {
            const introImage = introImages[order];
            asyncImages.push(
              asyncImg([getImgSrc(introImage, false)])
            );
          }
        }

        return asyncImages;
      }()),
      images: {
        level_3: asyncImg([
          {
            webSrc: '/content/1/img/level-3.png',
            serverSrc: 'public/content/1/img/level-3.png'
          }
        ])
      }
    });
  })
  .catch(function(reason) {
    console.log(reason); // for dev
    next(createError(404));
  });

});

module.exports = router;