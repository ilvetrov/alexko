const createError = require('http-errors');
var express = require('express');
const db = require('../../db');
const { PortfolioProject } = require('../../models/portfolio');
const { getUserLanguage, langConstructor } = require('../../libs/user-language');
const redirectTo = require('../../libs/redirect-to');
const isDevelopment = require('../../libs/is-development');
const redirectFromNonLang = require('../../libs/redirect-from-non-lang');
const { setLangForRouter } = require('../../libs/set-lang-for-router');
const defaultResLocals = require('../../libs/default-res-locals');
const amountOfProjectsOnPage = 7;

var router = express.Router();

router.get(`/portfolio`, (req, res) => redirectFromNonLang(req, res, `/portfolio`));

router.get('/:lang/portfolio', async function(req, res, next) {
  if (!setLangForRouter(req, res, next, `/portfolio`)) return;

  processPortfolioListRoute(req, res, next, 0);
});


router.get('/portfolio/page/1', (req, res) => redirectFromNonLang(req, res, '/portfolio'));

router.get('/:lang/portfolio/page/1', function(req, res, next) {
  return redirectTo(res, `/${req.params.lang}/portfolio`, '/', true);
});


router.get('/portfolio/page/:offset', (req, res) => redirectFromNonLang(req, res, `/portfolio/page/${req.params.offset}`));

router.get('/:lang/portfolio/page/:offset', function(req, res, next) {
  const offset = req.params.offset;
  if (!offset) return redirectTo(res, `/${req.params.lang}/portfolio`, '/', true);

  if (!setLangForRouter(req, res, next, `/portfolio/page/${offset}`)) return;

  processPortfolioListRoute(req, res, next, Number(offset - 1));
});

initPortfolioListRoute('sites', 1);
initPortfolioListRoute('apps', 2);
initPortfolioListRoute('games', 3);

function initPortfolioListRoute(name, portfolioTypeId) {
  router.get(`/${name}`, (req, res) => redirectFromNonLang(req, res, `/${name}`));
  
  router.get(`/:lang/${name}`, function(req, res, next) {
    if (!setLangForRouter(req, res, next, `/${name}`)) return;
    
    processPortfolioListRoute(req, res, next, 0, portfolioTypeId);
  });
  
  
  router.get(`/${name}/page/1`, (req, res) => redirectFromNonLang(req, res, `/${name}`));
  
  router.get(`/:lang/${name}/page/1`, function(req, res, next) {
    return redirectTo(res, `/${req.params.lang}/${name}`);
  });
  
  
  router.get(`/${name}/page/:offset`, (req, res) => redirectFromNonLang(req, res, `/${name}/page/${req.params.offset}`));
  
  router.get(`/:lang/${name}/page/:offset`, function(req, res, next) {
    const offset = req.params.offset;
    if (!offset) return redirectTo(res, `/${name}`);
  
    if (!setLangForRouter(req, res, next, `/${name}/page/${req.params.offset}`)) return;
  
    processPortfolioListRoute(req, res, next, Number(offset - 1), portfolioTypeId);
  });
}

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

    defaultResLocals(req, res);
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