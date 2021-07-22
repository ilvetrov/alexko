const createError = require('http-errors');
const express = require('express');
const db = require('../../../db');
const { langConstructor } = require('../../../libs/user-language');
const { Letter } = require('../../../models/letter');
const redirectFromNonLang = require('../../../libs/redirect-from-non-lang');
const { setLangForRouter } = require('../../../libs/set-lang-for-router');
const defaultResLocals = require('../../../libs/default-res-locals');

var router = express.Router();

router.get(`/admin/letters`, (req, res) => redirectFromNonLang(req, res, `/admin/letters`));

router.get('/:lang/admin/letters', async function(req, res, next) {
  if (!setLangForRouter(req, res, next, `/admin/letters`)) return;

  const status = req.query.status;
  const needNew = status === 'new';
  db.query(`SELECT * FROM letters ${!!status ? 'WHERE new=$<new>' : ''} ORDER BY date DESC`, {
    new: needNew
  })
  .then(function(lettersFromDb) {
    const letters = lettersFromDb.map(letterFromDb => new Letter(letterFromDb));
    const lang = langConstructor(req);

    if (letters.length > 0) {
      defaultResLocals(req, res);
      res.renderMin('admin/letters/all', {
        title: (needNew ? lang('new_letters') : lang('letters')) + ' – ' + lang('admin_panel'),
        layout: 'layouts/admin',
        letters: letters,
        needNew: needNew
      });
    } else {
      res.renderMin('pages/list-is-empty', {
        title: lang('letters') + ' – ' + lang('admin_panel'),
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