const createError = require('http-errors');
var express = require('express');
const db = require('../../db');
const { PortfolioProject } = require('../../models/portfolio');
const { getUserLanguage } = require('../../libs/user-language');
const isDevelopment = require('../../libs/is-development');

var router = express.Router();

router.get('/portfolio/:slug', function(req, res, next) {
  const slug = req.params.slug;
  if (!slug) return next(createError(404));

  db.oneOrNone('SELECT portfolio.*, project_types.singular_name as type_name, project_types.plural_name as type_plural_name FROM portfolio LEFT JOIN project_types ON portfolio.type_id = project_types.id WHERE status = $<status> AND slug = $<slug>', {
    status: 'published',
    slug: slug
  })
  .then(function(projectFromDb) {
    if (!projectFromDb) return next(createError(404));

    const project = new PortfolioProject(projectFromDb, getUserLanguage(req).code_name);

    res.renderMin('pages/portfolio-item', {
      title: project.title + ' – AlexKo',
      project: project,
      demoPopUp: project.demo_url && {
        popUpName: 'demo-exists',
        title: res.locals.lang('we_recommend_demo'),
        demoText: res.locals.lang('we_recommend_demo_text'),
        langName: getUserLanguage(req).code_name,
        withLogo: false,
        hidden: true,
        lang: res.locals.lang,
        closingCross: true,
        buttons: [
          {
            isLink: true,
            link: project.demo_url + `?demo_lang=${getUserLanguage(req).code_name}`,
            isSolid: true,
            text: res.locals.lang('open_demo'),
          },
          {
            isLink: true,
            link: project.to_link,
            text: res.locals.lang('open_site'),
          }
        ]
      }
    });
  })
  .catch(function(reason) {
    isDevelopment && console.error(reason);
    next(createError(404));
  });

});

module.exports = router;