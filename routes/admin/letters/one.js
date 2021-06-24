const createError = require('http-errors');
const express = require('express');
const db = require('../../../db');
const { langConstructor } = require('../../../libs/user-language');
const isDevelopment = require('../../../libs/is-development');

var router = express.Router();

router.get('/letters/:id', async function(req, res, next) {
  const id = Number(req.params.id);
  if (!id) return redirectTo(res, '/admin/letters');
  
  db.oneOrNone('SELECT * FROM letters WHERE id=$<id>', {
    id: id
  })
  .then(function(letter) {
    if (!letter) return next(createError(404));
  
    const lang = langConstructor(req);
    
    res.renderMin('admin/letters/one', {
      title: `${letter.email} – ${lang('letter')} – AlexKo`,
      letter: letter
    });
  })
  .catch(function(reason) {
    isDevelopment && console.error(reason);
    return next(createError(404));
  });
});

module.exports = router;