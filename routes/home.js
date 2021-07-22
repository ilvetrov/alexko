var express = require('express');
const db = require('../db');
const { getVariant, getNumberOf } = require('../libs/ab-test');
const { currentDomain } = require('../libs/current-domain');
const defaultResLocals = require('../libs/default-res-locals');
const redirectTo = require('../libs/redirect-to');
const { setLangProperties } = require('../libs/set-lang-for-router');
const { langConstructor, getUserLanguage, defaultLang, setUserLanguage, checkPathLangName } = require('../libs/user-language');
const { PortfolioProject } = require('../models/portfolio');
var router = express.Router();

router.get('/', function(req, res, next) {
  setUserLanguage(req, res, true);

  processHomePage(req, res, next);
});

router.get('/:lang', function(req, res, next) {
  if (req.params.lang === defaultLang) return redirectTo(res, '/', '/');

  if (!checkPathLangName(req.params.lang)) return next();

  setLangProperties(req, res);

  processHomePage(req, res, next);
});

function processHomePage(req, res, next) {
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
  
    defaultResLocals(req, res);
    res.renderMin('pages/index', {
      title: 'AlexKo – ' + lang('site_focus'),
      description: lang('advantages').map(advantage => advantage.title.join(' ')).join(' • '),
      mainImage: `${currentDomain}/img/alexko-square.jpg`,
      mainImageSize: {
        width: 1024,
        height: 1024
      },
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
}

module.exports = router;
