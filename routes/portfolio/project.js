const createError = require('http-errors');
var express = require('express');
const { asyncImg } = require('../../libs/async-img-loader');
const db = require('../../db');
const { PortfolioProject } = require('../../models/portfolio');
const { getUserLanguage } = require('../../libs/user-language');

var router = express.Router();

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
      project: project
    });
  })
  .catch(function(reason) {
    console.log(reason); // for dev
    next(createError(404));
  });

});

module.exports = router;