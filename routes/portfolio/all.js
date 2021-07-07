const createError = require('http-errors');
var express = require('express');
const db = require('../../db');
const { PortfolioProject } = require('../../models/portfolio');
const { getUserLanguage, langConstructor } = require('../../libs/user-language');
const redirectTo = require('../../libs/redirect-to');
const isDevelopment = require('../../libs/is-development');
const amountOfProjectsOnPage = 7;

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

router.get('/sites', function(req, res, next) {
  processPortfolioListRoute(req, res, next, 0, 1);
});

router.get('/sites/page/1', function(req, res, next) {
  return redirectTo(res, '/sites');
});

router.get('/sites/page/:offset', function(req, res, next) {
  const offset = req.params.offset;
  if (!offset) return redirectTo(res, '/sites');

  processPortfolioListRoute(req, res, next, Number(offset - 1), 1);
});

router.get('/apps', function(req, res, next) {
  processPortfolioListRoute(req, res, next, 0, 2);
});

router.get('/apps/page/1', function(req, res, next) {
  return redirectTo(res, '/apps');
});

router.get('/apps/page/:offset', function(req, res, next) {
  const offset = req.params.offset;
  if (!offset) return redirectTo(res, '/apps');

  processPortfolioListRoute(req, res, next, Number(offset - 1), 2);
});

router.get('/games', function(req, res, next) {
  processPortfolioListRoute(req, res, next, 0, 3);
});

router.get('/games/page/1', function(req, res, next) {
  return redirectTo(res, '/games');
});

router.get('/games/page/:offset', function(req, res, next) {
  const offset = req.params.offset;
  if (!offset) return redirectTo(res, '/games');

  processPortfolioListRoute(req, res, next, Number(offset - 1), 3);
});

function processPortfolioListRoute(req, res, next, offset, projectType = undefined) {
  Promise.all([
    db.query(`SELECT portfolio.*, project_types.singular_name as type_name, project_types.plural_name as type_plural_name FROM portfolio LEFT JOIN project_types ON portfolio.type_id = project_types.id WHERE status = $<status> ${projectType ? 'AND type_id = $<projectType>' : ''} ORDER BY portfolio_date DESC LIMIT ${amountOfProjectsOnPage} OFFSET $<offset>`, {
      status: 'published',
      offset: offset * amountOfProjectsOnPage,
      projectType: projectType
    }),
    db.query(`SELECT COUNT(*) FROM portfolio WHERE status = $<status> ${projectType ? 'AND type_id = $<projectType>' : ''}`, {
      status: 'published',
      projectType: projectType
    })
  ])
  .then(function([
    projectsFromDb,
    [{count: amountOfProjects}]
  ]) {
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

    const thereAreMoreProjects = amountOfProjects > (offset + 1) * amountOfProjectsOnPage;
    const thereAreLastProjects = !!offset;
  
    const lang = langConstructor(req);

    res.renderMin('pages/portfolio', {
      title: (projectType ? lang(projects[0].type_plural_name) : lang('portfolio')) + ' – AlexKo',
      projects: sortedProjects,
      onlyOneType: !!projectType,
      currentOneType: projectType && projects[0].type_plural_name,
      currentOneRawType: projectType && projects[0].type_plural_raw_name,
      thereAreMoreProjects: thereAreMoreProjects,
      thereAreLastProjects: thereAreLastProjects,
      navigationExists: thereAreMoreProjects || thereAreLastProjects,
      nextOffset: offset + 2,
      lastOffset: offset
    });
  })
  .catch(function(reason) {
    isDevelopment && console.error(reason);
    next(createError(404));
  });
}

module.exports = router;