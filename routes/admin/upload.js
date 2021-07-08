const createError = require('http-errors');
const express = require('express');
const checkAdminCsrf = require('../../middlewares/check-admin-csrf');
const db = require('../../db');
const uploadFile = require('../../libs/upload-file');

var router = express.Router();

router.post('/upload', checkAdminCsrf, async function(req, res, next) {
  const files = req.files['files[]'];
  const projectId = Number(req.body.project_id);

  const isPage = String(req.body.is_page) === 'true';
  const table = isPage ? 'pages' : 'portfolio';

  if (!projectId) return next(createError(400));

  const project = await db.oneOrNone(`SELECT * FROM ${table} WHERE id=$(id)`, {
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

  const projectIdForFile = projectId + (isPage ? '-page' : '');
  if (files.length === undefined) {
    uploadFile(files, projectIdForFile, draft)
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
        uploadFile(file, projectIdForFile, draft)
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