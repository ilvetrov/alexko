const createError = require('http-errors');
var express = require('express');
const { asyncImg } = require('../../libs/async-img-loader');
const db = require('../../db');
const { PortfolioProject } = require('../../models/portfolio');
const { getUserLanguage, langConstructor } = require('../../libs/user-language');
const redirectTo = require('../../libs/redirect-to');

var router = express.Router();

router.get('/portfolio', function(req, res, next) {
  processPortfolioListRoute(req, res, next, 0);
});

router.get('/portfolio/page/1', function(req, res, next) {
  return redirectTo(res, '/portfolio');
});

router.get('/portfolio/page/:offset', function(req, res, next) {
  const offset = req.params.offset;
  if (!offset) return redirectTo(res, '/portfolio');

  processPortfolioListRoute(req, res, next, Number(offset - 1));
});

function processPortfolioListRoute(req, res, next, offset) {
  db.query('SELECT portfolio.*, project_types.singular_name as type_name FROM portfolio LEFT JOIN project_types ON portfolio.type_id = project_types.id WHERE status = $<status> ORDER BY portfolio_date DESC LIMIT 7 OFFSET $<offset>', {
    status: 'published',
    offset: offset * 7
  })
  .then(function(projectsFromDb) {
    if (!projectsFromDb.length) return next(createError(404));
  
    const projects = projectsFromDb.map(projectFromDb => new PortfolioProject(projectFromDb, getUserLanguage(req).code_name));

    const sortedProjects = (function() {
      const appsOrGames = projects.filter(project => project.type_id === 2 || project.type_id === 3);
      const sites = projects.filter(project => project.type_id === 1);
      
      const output = [];
      let appOrGameIteration = 0;
      let siteIteration = 0;
      for (let i = 0; i < projects.length; i++) {
        if ((output.length === 0 || output[i - 1].type_id === 1) && appsOrGames[appOrGameIteration]) {
          output.push(appsOrGames[appOrGameIteration]);
          appOrGameIteration++;
        } else if (sites[siteIteration]) {
          output.push(sites[siteIteration]);
          siteIteration++;
        } else if (appsOrGames[appOrGameIteration]) {
          output.push(appsOrGames[appOrGameIteration]);
          appOrGameIteration++;
        }
      }

      return output;
    }());
  
    const lang = langConstructor(req);

    res.renderMin('pages/portfolio', {
      title: lang('portfolio') + ' – AlexKo',
      projects: sortedProjects
    });
  })
  .catch(function(reason) {
    console.error(reason); // for dev
    next(createError(404));
  });
}

module.exports = router;