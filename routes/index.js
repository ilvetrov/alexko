var express = require('express');
const db = require('../db');
const { getVariant, getNumberOf } = require('../libs/ab-test');
const { langConstructor, getUserLanguage } = require('../libs/user-language');
const { PortfolioProject } = require('../models/portfolio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const lang = langConstructor(req);

  Promise.all([
    db.query('SELECT portfolio.*, project_types.singular_name as type_name, project_types.plural_name as type_plural_name FROM portfolio LEFT JOIN project_types ON portfolio.type_id = project_types.id WHERE type_id = 3 AND status = $<status> ORDER BY portfolio_date DESC LIMIT 1', {
      status: 'published'
    }),
    db.query('SELECT portfolio.*, project_types.singular_name as type_name, project_types.plural_name as type_plural_name FROM portfolio LEFT JOIN project_types ON portfolio.type_id = project_types.id WHERE type_id = 1 AND status = $<status> ORDER BY portfolio_date DESC LIMIT 1', {
      status: 'published'
    }),
    db.query('SELECT portfolio.*, project_types.singular_name as type_name, project_types.plural_name as type_plural_name FROM portfolio LEFT JOIN project_types ON portfolio.type_id = project_types.id WHERE type_id = 2 AND status = $<status> ORDER BY portfolio_date DESC LIMIT 1', {
      status: 'published'
    }),
  ])
  .then(function([
    games,
    sites,
    apps
  ]) {
    const projects = [...games, ...sites, ...apps].filter(projectFromDb => !!projectFromDb).map(projectFromDb => new PortfolioProject(projectFromDb, getUserLanguage(req).code_name));

    res.renderMin('pages/index', {
      title: 'AlexKo – ' + lang('site_focus'),
      siteFocus: lang('site_focus_complex'),
      helloTitle: {
        firstLine: lang('advantages')[0].title[0],
        secondLine: lang('advantages')[0].title[1]
      },
      helloTitleVariant: 1,
      advantages: (function() {
        const advantages = [...lang('advantages')];
        delete advantages[0];
        return advantages;
      }()),
      projects: projects
    });
  });
   
});

router.use(require('./portfolio/all'));
router.use(require('./portfolio/project'));
router.use(require('./auth/admin'));

module.exports = router;
