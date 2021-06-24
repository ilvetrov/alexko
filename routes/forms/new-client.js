const express = require('express');
const db = require('../../db');
const { noreplyEmail } = require('../../libs/email');
const checkNonAuthCsrf = require('../../middlewares/check-non-auth-csrf');

var router = express.Router();

router.post('/forms/new-client', checkNonAuthCsrf, async function(req, res, next) {
  if (req.body.personal_data !== 'on' || String(req.body.email).trim().length === 0 || String(req.body.about_task).trim().length === 0) {
    return res.sendStatus(400);
  }

  db.query('INSERT INTO letters ("email", "text") VALUES ($<email>, $<text>) RETURNING id', {
    email: String(req.body.email).trim(),
    text: String(req.body.about_task).trim()
  })
  .then(function([newLetter]) {

    noreplyEmail.sendMail('clients@alexko.ltd', 'Новая заявка с сайта', `
      Email: ${req.body.email}
      
      ${req.body.about_task}

      ---

      Открыть на сайте: https://alexko.ltd/admin/letters/${newLetter.id}
    `);

    res.sendStatus(200);
  })
  .catch(function() {
    res.sendStatus(500);
  });
});

module.exports = router;