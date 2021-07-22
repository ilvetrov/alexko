const express = require('express');
const db = require('../../../db');
const isDevelopment = require('../../../libs/is-development');
const checkAdminCsrf = require('../../../middlewares/check-admin-csrf');
const redirectTo = require('../../../libs/redirect-to');

var router = express.Router();

router.get('/admin/letters/:id/toggle-mark', checkAdminCsrf, async function(req, res, next) {
  const id = Number(req.params.id);
  if (!id) return redirectTo(res, '/admin/letters/' + id);
  
  db.query('UPDATE letters SET new = NOT new WHERE id = $<id>', {
    id: id
  })
  .then(function(letter) {
    redirectTo(res, '/admin/letters/' + id);
  })
  .catch(function(reason) {
    isDevelopment && console.error(reason);
    return redirectTo(res, '/admin/letters/' + id);
  });
});

module.exports = router;