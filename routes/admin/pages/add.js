const express = require('express');
const checkAdminCsrf = require('../../../middlewares/check-admin-csrf');
const db = require('../../../db');
const redirectTo = require('../../../libs/redirect-to');
const multilingualDefault = require('../../../libs/multilingual-default');

var router = express.Router();

router.get('/pages/add', checkAdminCsrf, async function(req, res, next) {
  const newProjectId = (await db.query('INSERT INTO pages (title, text, excerpt) VALUES ($<multilingualDefault>, $<multilingualDefault>, $<multilingualDefault>) RETURNING id', {
    multilingualDefault: multilingualDefault
  }))[0].id;

  redirectTo(res, '/admin/pages/edit/' + newProjectId);
});

module.exports = router;