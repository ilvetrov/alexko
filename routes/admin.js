const createError = require('http-errors');
const express = require('express');
const { langConstructor } = require('../libs/user-language');
const checkAdmin = require('../middlewares/check-admin');
const fs = require('fs');
const path = require('path');
const { getRoot } = require('../libs/get-root');
const { glob } = require('glob');
const { asyncImg } = require('../libs/async-img-loader');
const db = require('../db');
const minifyImg = require('../libs/minify-img');
const checkImg = require('../libs/check-img');
const { admin } = require('../libs/auth');
const redirectTo = require('../libs/redirect-to');
const { getFileNameWithoutExt } = require('../libs/get-file-name');
const escapeString = require('escape-string-regexp');

var router = express.Router();

router.use(checkAdmin);

router.get('/', function(req, res, next) {
  const lang = langConstructor(req);
   
  res.renderMin('admin/index', {
    title: lang('admin_panel'),
    layout: 'layouts/admin',
    images: {
      status_items: {
        done: asyncImg([
          {
            webSrc: '/admin/resources/admin/public/img/done.svg',
            serverSrc: 'inner-resources/admin/public/img/done.svg'
          }
        ], false),
        clock: asyncImg([
          {
            webSrc: '/admin/resources/admin/public/img/clock.svg',
            serverSrc: 'inner-resources/admin/public/img/clock.svg'
          }
        ], false),
        draft: asyncImg([
          {
            webSrc: '/admin/resources/admin/public/img/draft.svg',
            serverSrc: 'inner-resources/admin/public/img/draft.svg'
          }
        ], false),
        plus: asyncImg([
          {
            webSrc: '/img/plus.svg',
            serverSrc: 'public/img/plus.svg'
          }
        ])
      }
    }
  });
});

router.get('/portfolio/add', async function(req, res, next) {
  const newProjectId = (await db.query('INSERT INTO portfolio (admin_id) VALUES ($(admin_id)) RETURNING id', {
    admin_id: await admin.getLoggedUser(req).then(user => user.id).catch(() => undefined)
  }))[0].id;

  redirectTo(res, '/admin/portfolio/edit/' + newProjectId);
});

router.get('/portfolio/edit/:id', function(req, res, next) {
  const id = Number(req.params.id);
  if (!id) return redirectTo('/portfolio');

  db.oneOrNone('SELECT * FROM portfolio WHERE id=$(id)', {
    id: id
  }).then(async function(project) {
    if (!project) return next(createError(404));

    const lang = langConstructor(req);

    const projectTypes = (await db.query('SELECT id, singular_name FROM project_types')).map((type, index) => {
      return {
        id: type.id,
        content: lang(type.singular_name)
      };
    });
    
    res.renderMin('admin/portfolio/edit', {
      id: project.id,
      draft: Number(project.status !== 'published'),
      title: lang('edit_project'),
      layout: 'layouts/admin',
      editorProperties: JSON.stringify({
        new: true
      }),
      toLinkVariations: JSON.stringify({
        1: lang('open'),
        2: lang('download'),
        3: lang('download'),
      }),
      creatingVariations: JSON.stringify({
        1: lang('site_creation'),
        2: lang('app_creation'),
        3: lang('game_creation'),
      }),
      selects: [
        {
          name: 'project_types',
          event: 'selectProjectType',
          modClass: 'project-types',
          items: projectTypes
        }
      ],
      popUpInputs: [
        {
          name: 'to_link',
          event: 'writeToLink',
          modClass: 'to-link',
          humanName: lang('link')
        }
      ],
      hideDesktopImagesFor: JSON.stringify([
        2,
        3
      ])
    });
  });
});

router.get('/resources/*', async function(req, res, next) {
  const fileRelativePath = req.params[0];
  if (glob.sync(getRoot() + `/inner-resources/${fileRelativePath}`).length > 0) {
    res.sendFile(`inner-resources/${fileRelativePath}`, {
      root: getRoot()
    });
  } else {
    next(createError(404));
  }
});

router.post('/upload', function(req, res, next) {
  const files = req.files['files[]'];
  const projectId = Number(req.body.project_id);
  const draft = Boolean(req.body.draft);

  if (files.length === undefined) {
    uploadFile(files, projectId, draft)
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
        uploadFile(file, projectId, draft)
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

function uploadFile(file, projectId = 'common', draft = false) {
  return new Promise((resolve, reject) => {
    
    let relativePath = `public/content/${projectId}`;
    let webPath = '/' + relativePath;
    if (draft) {
      relativePath = `inner-resources/drafts/${projectId}`;
      webPath = '/' + `admin/resources/drafts/${projectId}`;
    }
    const folderPath = getRoot() + '/' + relativePath;

    let outputFileName = file.name;
    if (fs.existsSync(folderPath + '/' + outputFileName)) {
      const numberOfSynonyms = glob.sync(`${folderPath}/${getFileNameWithoutExt(file.name)}*${path.extname(file.name)}`).length;
      outputFileName = `${getFileNameWithoutExt(outputFileName)}-${numberOfSynonyms + 1}${path.extname(outputFileName)}`;
    }
    const outputPath = folderPath + '/' + outputFileName;
    webPath += '/' + outputFileName;
  
    if (!checkImg(file.name)) {
      return fs.rename(file.tempFilePath, outputPath, (err) => {
        if (err) return reject(err);
        resolve(webPath);
      });
    }

    fs.readFile(file.tempFilePath, (err, data) => {
      if (err) return reject(err);
      minifyImg(data)
      .then((buildedBuffer) => {
        fs.lstat(folderPath, (err, stats) => {
          if (err) fs.mkdirSync(folderPath);

          fs.writeFile(outputPath, buildedBuffer, (err) => {
            if (err) return reject(err);
            fs.unlink(file.tempFilePath, (err) => {
              if (err) throw err;
            });
            resolve(webPath);
          });
        });

      });
    });
    
  });
}

module.exports = router;
