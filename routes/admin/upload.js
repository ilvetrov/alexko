const createError = require('http-errors');
const express = require('express');
const checkAdminCsrf = require('../../middlewares/check-admin-csrf');
const db = require('../../db');
const uploadFile = require('../../libs/upload-file');

var router = express.Router();

router.post('/upload', checkAdminCsrf, async function(req, res, next) {
  const files = req.files['files[]'];
  const projectId = Number(req.body.project_id);
  const blockId = req.body.block_id || null;

  if (!projectId) return next(createError(404));

  const project = await db.oneOrNone('SELECT * FROM portfolio WHERE id=$(id)', {
    id: projectId
  });

  if (
    !project
    && (
      res.locals.admin.id === project.admin_id
      || res.locals.admin.can_edit_all
    )
  ) return next(createError(404));

  const draft = Number(project.status !== 'published');

  if (files.length === undefined) {
    uploadFile(files, projectId, blockId, draft)
    .then((webPath) => {
      res.send(JSON.stringify([webPath]));
    })
    .catch((reason) => {
      throw reason;
    });
  } else {
    let uploadFilesFunctions = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadFilesFunctions.push(new Promise((resolve, reject) => {
        uploadFile(file, projectId, blockId, draft)
        .then((webPath) => {
          resolve(webPath);
        })
        .catch((reason) => {
          throw reason;
        });
      }));
    }

    Promise.all(uploadFilesFunctions).then((webPaths) => {
      res.send(JSON.stringify(webPaths));
    });
  }
});

module.exports = router;