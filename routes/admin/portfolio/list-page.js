const createError = require('http-errors');
const express = require('express');
const db = require('../../../db');
const { PortfolioProject } = require('../../../models/portfolio');
const { getUserLanguage } = require('../../../libs/user-language');

var router = express.Router();

router.get('/portfolio', async function(req, res, next) {
  const status = req.query.status;
  const currentAdmin = res.locals.admin;
  const query = `
    SELECT * FROM portfolio
    ${!currentAdmin.can_edit_all || !!status ? 'WHERE' : ''}
      ${currentAdmin.can_edit_all ? '' : '(admin_id = $<admin_id> OR common = true)'}
      ${!!status && !currentAdmin.can_edit_all ? 'AND' : ''}
      ${!!status ? 'status = $<status>' : ''}
  `;
  db.query(query, {
    admin_id: currentAdmin.id,
    status: status
  })
  .then(function(projectsFromDB) {
    const projects = projectsFromDB.map(projectFromDB => (new PortfolioProject(projectFromDB, getUserLanguage(req).code_name)).text);

    res.send(projects);
  })
  .catch(function() {
    next(createError(404));
  });

});

module.exports = router;