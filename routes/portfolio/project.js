const createError = require('http-errors');
var express = require('express');
const db = require('../../db');
const { PortfolioProject } = require('../../models/portfolio');
const { getUserLanguage, langConstructor } = require('../../libs/user-language');
const isDevelopment = require('../../libs/is-development');
const redirectFromNonLang = require('../../libs/redirect-from-non-lang');
const { setLangForRouter } = require('../../libs/set-lang-for-router');
const defaultResLocals = require('../../libs/default-res-locals');
const { currentDomain } = require('../../libs/current-domain');

var router = express.Router();

router.get('/portfolio/:slug', (req, res) => redirectFromNonLang(req, res, `/portfolio/${req.params.slug}`));

router.get('/:lang/portfolio/:slug', function(req, res, next) {
  const slug = req.params.slug;
  if (!slug) return next(createError(404));

  if (!setLangForRouter(req, res, next, `/portfolio/${req.params.slug}`)) return;

  db.oneOrNone('SELECT portfolio.*, project_types.singular_name as type_name, project_types.plural_name as type_plural_name FROM portfolio LEFT JOIN project_types ON portfolio.type_id = project_types.id WHERE status = $<status> AND slug = $<slug>', {
    status: 'published',
    slug: slug
  })
  .then(function(projectFromDb) {
    if (!projectFromDb) return next(createError(404));

    const project = new PortfolioProject(projectFromDb, getUserLanguage(req).code_name);

    const lang = langConstructor(req);

    defaultResLocals(req, res);
    res.renderMin('pages/portfolio-item', {
      title: project.title + ' – AlexKo',
      description: project.descr,
      mainImage: `${currentDomain}/content/${project.mainImage}`,
      mainImageSize: project.imagesView === 'vertical' ? {
        width: 968,
        height: 504
      } : undefined,
      project: project,
      pageType: 'article',
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