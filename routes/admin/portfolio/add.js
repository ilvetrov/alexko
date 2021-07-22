const createError = require('http-errors');
const express = require('express');
const checkAdminCsrf = require('../../../middlewares/check-admin-csrf');
const db = require('../../../db');
const redirectTo = require('../../../libs/redirect-to');

var router = express.Router();

router.get('/admin/portfolio/add', checkAdminCsrf, async function(req, res, next) {
  const newProjectId = (await db.query('INSERT INTO portfolio (admin_id) VALUES ($(admin_id)) RETURNING id', {
    admin_id: res.locals.admin.id
  }))[0].id;

  redirectTo(res, '/admin/portfolio/edit/' + newProjectId);
});

module.exports = router;