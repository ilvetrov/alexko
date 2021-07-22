const createError = require('http-errors');
const express = require('express');
const db = require('../../../db');
const { langConstructor } = require('../../../libs/user-language');
const isDevelopment = require('../../../libs/is-development');
const redirectFromNonLang = require('../../../libs/redirect-from-non-lang');
const { setLangForRouter } = require('../../../libs/set-lang-for-router');
const defaultResLocals = require('../../../libs/default-res-locals');

var router = express.Router();

router.get(`/admin/letters/:id`, (req, res) => redirectFromNonLang(req, res, `/admin/letters/${req.params.id}`));

router.get('/:lang/admin/letters/:id', async function(req, res, next) {
  if (!setLangForRouter(req, res, next, `/admin/letters/${req.params.id}`)) return;

  const id = Number(req.params.id);
  if (!id) return redirectTo(res, '/admin/letters');
  
  db.oneOrNone('SELECT * FROM letters WHERE id=$<id>', {
    id: id
  })
  .then(function(letter) {
    if (!letter) return next(createError(404));
  
    const lang = langConstructor(req);
    
    defaultResLocals(req, res);
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