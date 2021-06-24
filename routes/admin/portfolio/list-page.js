const createError = require('http-errors');
const express = require('express');
const db = require('../../../db');
const { PortfolioProject } = require('../../../models/portfolio');
const { getUserLanguage, langConstructor } = require('../../../libs/user-language');

var router = express.Router();

router.get('/portfolio', async function(req, res, next) {
  const status = req.query.status;
  const currentAdmin = res.locals.admin;
  const query = `
    SELECT
      portfolio.*,
      project_types.singular_name as type_name,
      admins.name as admin_name
    FROM portfolio
    LEFT JOIN project_types ON portfolio.type_id = project_types.id
    LEFT JOIN admins ON portfolio.admin_id = admins.id
    ${!currentAdmin.can_edit_all || !!status ? 'WHERE' : ''}
      ${currentAdmin.can_edit_all ? '' : '(admin_id = $<admin_id> OR common = true)'}
      ${!!status && !currentAdmin.can_edit_all ? 'AND' : ''}
      ${!!status ? 'status = $<status>' : ''}
    ORDER BY portfolio_date DESC
  `;
  db.query(query, {
    admin_id: currentAdmin.id,
    status: status
  })
  .then(function(projectsFromDB) {
    const projects = projectsFromDB.map(projectFromDB => new PortfolioProject(projectFromDB, getUserLanguage(req).code_name));
    const lang = langConstructor(req);

    if (projects.length > 0) {
      res.renderMin('admin/portfolio/list', {
        title: lang('portfolio') + ' – ' + lang('admin_panel'),
        layout: 'layouts/admin',
        projects: projects
      });
    } else {
      res.renderMin('pages/list-is-empty', {
        title: lang('portfolio') + ' – ' + lang('admin_panel'),
        layout: 'layouts/mini',
      });
    }
  })
  .catch(function(reason) {
    console.log(reason);
    next(createError(404));
  });

});

module.exports = router;