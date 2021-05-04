const createError = require('http-errors');
const express = require('express');
const { langConstructor, getUserLanguage, getLanguagesNames } = require('../libs/user-language');
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
const { PortfolioProject } = require('../models/portfolio');
const { frontMultilingualToBackend } = require('../libs/converters/multilingual');

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
  }).then(async function(projectFromDb) {
    if (!projectFromDb) return next(createError(404));

    const project = new PortfolioProject(projectFromDb, getUserLanguage(req).cod_name);
    const lang = langConstructor(req);

    Promise.all([

      new Promise((resolve, reject) =>
        db.query('SELECT id, singular_name FROM project_types').then(data => resolve(data))
      ),
      
      new Promise((resolve, reject) =>
        fs.readFile(getRoot() + '/public/img/multilingual.svg', (err, data) => resolve(data))
      ),

      new Promise((resolve, reject) =>
        fs.readFile(getRoot() + '/public/img/remove.svg', (err, data) => resolve(data))
      ),

      new Promise((resolve, reject) =>
        fs.readFile(getRoot() + '/public/img/remove-white-shadow.svg', (err, data) => resolve(data))
      ),
      
      new Promise((resolve, reject) =>
        fs.readFile(getRoot() + '/public/img/gear.svg', (err, data) => resolve(data))
      ),

    ]).then(function([
      projectTypesFromDb,
      multilingualSvg,
      removeSvg,
      removeWhiteShadowSvg,
      gearSvg,
    ]) {

      const projectTypes = projectTypesFromDb.map((type, index) => {
        return {
          id: type.id,
          singular_name: lang(type.singular_name)
        };
      });
      
      const activeProjectType = projectTypes.find((projectType) => {
        return projectType.id === project.type_id;
      });
  
      const projectTypesForSelect = [];
      if (project.type_id) {
        projectTypesForSelect.push({
          id: activeProjectType.id,
          content: activeProjectType.singular_name,
          active: true
        });
      }
      for (let i = 0; i < projectTypes.length; i++) {
        const projectType = projectTypes[i];
        if (project.type_id !== projectType.id) {
          projectTypesForSelect.push({
            id: projectType.id,
            content: projectType.singular_name
          });
        }
      }
  
      const hideDesktopImagesForTypes = [
        2,
        3
      ];
  
      const introImages = project.intro_images ? project.intro_images : {
        mobile: {},
        desktop: {}
      };
      const introImagesForOutput = (function() {
        const outputImages = {};
        for (const deviceType in introImages) {
          if (Object.hasOwnProperty.call(introImages, deviceType)) {
  
            const images = introImages[deviceType];
            outputImages[deviceType] = (function() {
              const asyncImages = {};
              for (const key in images) {
                if (Object.hasOwnProperty.call(images, key)) {
                  const image = images[key];
                  asyncImages[Number(key)] = asyncImg([{
                    webSrc: image.webSrc,
                    serverSrc: image.serverSrc
                  }], true);
                }
              }
              return asyncImages;
            }());
  
          }
        }
        return outputImages;
      }());
  
      const uploadedIntroImagesAmount = {
        mobile: Object.keys(introImages.mobile).length,
        desktop: Object.keys(introImages.desktop).length
      };
  
      const introImagesAmount = {
        mobile: Math.max(uploadedIntroImagesAmount.mobile + 2, 8),
        desktop: Math.max(uploadedIntroImagesAmount.desktop + 2, 4)
      };
  
      const introImagesDraftsStart = {
        mobile: introImagesAmount.mobile - 2,
        desktop: introImagesAmount.desktop - 2
      };
  
      const toLinkVariations = {
        1: lang('open'),
        2: lang('download'),
        3: lang('download'),
      };
  
      const draft = Number(project.status !== 'published');
  
      if (!res.locals.frontVariables.dictionary) res.locals.frontVariables.dictionary = {};
      res.locals.frontVariables.dictionary.other_languages = lang('other_languages');

      res.renderMin('admin/portfolio/edit', {
        title: lang('edit_project') + ' ' + project.id,
        layout: 'layouts/admin',
        project: project,
        projectType: activeProjectType,
        draft: draft,
        introImages: introImages,
        introImagesForOutput: introImagesForOutput,
        introImagesExist: {
          mobile: Object.keys(introImages.mobile).length > 0,
          desktop: Object.keys(introImages.desktop).length > 0
        },
        introImagesAmount: introImagesAmount,
        introImagesDraftsStart: introImagesDraftsStart,
        hideDesktopImages: project.type_id && hideDesktopImagesForTypes.indexOf(activeProjectType.id) != -1,
        toLinkText: project.type_id && toLinkVariations[project.type_id] || toLinkVariations[2],
        multilingual: {
          title: project.allTitles,
          descr: project.allDescrs
        },
        directSvg: {
          multilingual: multilingualSvg,
          remove: removeSvg,
          removeWhiteShadow: removeWhiteShadowSvg,
          gear: gearSvg,
        },
        sendToCloudProperties: {
          link: '/admin/portfolio/edit',
          values: {
            project_id: project.id,
          }
        },
        editorProperties: JSON.stringify({
          
        }),
        toLinkVariations: JSON.stringify(toLinkVariations),
        selects: [
          {
            name: 'project_types',
            event: 'selectProjectType',
            modClass: 'project-types',
            items: projectTypesForSelect
          },
          {
            name: 'editing_language',
            event: 'changeEditingLanguage',
            modClass: 'editing-language',
            items: (function() {
              const languagesNames = getLanguagesNames(req);
              const outputItems = [];
              for (const codName in languagesNames) {
                if (Object.hasOwnProperty.call(languagesNames, codName)) {
                  const languageHumanName = languagesNames[codName];
                  outputItems.push({
                    id: codName,
                    content: languageHumanName,
                    active: codName == getUserLanguage(req).cod_name
                  });
                }
              }
              return outputItems;
            }())
          }
        ],
        popUpInputs: [
          {
            name: 'to_link',
            event: 'writeToLink',
            modClass: 'to-link',
            humanName: lang('link'),
            defaultValue: project.to_link || '',
            sendToCloud: {
              name: 'to_link',
              group: 'edit_project'
            }
          }
        ],
        creatingVariations: JSON.stringify({
          1: lang('site_creation'),
          2: lang('app_creation'),
          3: lang('game_creation'),
        }),
        hideDesktopImagesForTypes: JSON.stringify(hideDesktopImagesForTypes),
      });
    });
  })
  .catch((reason) => {
    console.log(reason); //for dev
    // return next(createError(404));
  });
});

router.post('/portfolio/edit', async function(req, res, next) {
  const data = req.body;

  if (!data.project_id) return res.send('missed project_id');

  const oldData = await db.query(`SELECT * FROM portfolio WHERE id=$(id)`, {
    id: data.project_id
  })
  .then(result => result[0]);

  const newData = {
    id: Number(data.project_id),
    title: frontMultilingualToBackend('title', data, req),
    descr: frontMultilingualToBackend('descr', data, req),
    text: data.text,
    status: data.status || oldData.status,
    common: data.common ?? oldData.common,
    type_id: data.type_id ?? oldData.type_id,
    intro_images: {
      mobile: data.intro_images || oldData.intro_images.mobile,
      desktop: data.intro_desktop_images || oldData.intro_images.desktop
    },
    to_link: data.to_link,
    demo_id: data.demo_id
  }

  db.query(`
  UPDATE portfolio
  SET
    title = $(title),
    descr = $(descr),
    text = $(text),
    status = $(status),
    common = $(common),
    type_id = $(type_id),
    intro_images = $(intro_images),
    to_link = $(to_link),
    demo_id = $(demo_id)
  WHERE id=$(id)
  `, newData)
  .then((result) => {
    res.json({
      'success': true
    });
  })
  .catch((reason) => {
    res.json({
      'success': false
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

router.post('/upload', async function(req, res, next) {
  const files = req.files['files[]'];
  const projectId = Number(req.body.project_id);

  if (!projectId) return next(createError(404));

  const project = await db.oneOrNone('SELECT * FROM portfolio WHERE id=$(id)', {
    id: id
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
  return new Promise(async (resolve, reject) => {
    
    let relativePath = `public/content/${projectId}`;
    let folderWebPath = '/' + relativePath;
    if (draft) {
      relativePath = `inner-resources/drafts/${projectId}`;
      folderWebPath = '/' + `admin/resources/drafts/${projectId}`;
    }
    const folderPath = getRoot() + '/' + relativePath;
    
    let outputFileName = file.name;
    const sameFileExists = fs.existsSync(folderPath + '/' + file.name);
    if (sameFileExists) {
      const numberOfSynonyms = glob.sync(`${folderPath}/${getFileNameWithoutExt(file.name)}*${path.extname(file.name)}`).length;
      outputFileName = `${getFileNameWithoutExt(outputFileName)}-${numberOfSynonyms + 1}${path.extname(outputFileName)}`;
    }
    const outputPath = folderPath + '/' + outputFileName;
    const webPath = folderWebPath + '/' + outputFileName;
  
    if (!checkImg(file.name)) {
      return fs.rename(file.tempFilePath, outputPath, (err) => {
        if (err) return reject(err);
        resolve({
          webSrc: webPath,
          serverSrc: relativePath + '/' + outputFileName
        });
      });
    }

    if (sameFileExists) {
      var existingFileChecksum = await db.query(`SELECT checksum FROM original_images WHERE path=$(path) AND checksum=$(checksum)`, {
        path: relativePath + '/' + file.name,
        checksum: file.md5
      }).then((fileInDb) => {
        return fileInDb && fileInDb[0];
      });
      if (!existingFileChecksum) {
        existingFileChecksum = await db.query(`SELECT checksum FROM original_images WHERE path=$(path) AND checksum=$(checksum)`, {
          path: relativePath + '/' + outputFileName,
          checksum: file.md5
        }).then((fileInDb) => {
          return fileInDb && fileInDb[0];
        });
      }
      if (existingFileChecksum) {
        fs.unlink(file.tempFilePath, (err) => {
          if (err) throw err;
        });
        return resolve({
          webSrc: folderWebPath + '/' + file.name,
          serverSrc: relativePath + '/' + file.name
        });
      }
    }

    fs.readFile(file.tempFilePath, (err, data) => {
      if (err) return reject(err);
      minifyImg(data)
      .then((buildedBuffer) => {
        fs.lstat(folderPath, (err, stats) => {
          if (err) fs.mkdirSync(folderPath);

          db.query('INSERT INTO original_images (path, checksum) VALUES ($(path), $(checksum))', {
            path: relativePath + '/' + (sameFileExists ? outputFileName : file.name),
            checksum: file.md5
          });
          fs.writeFile(outputPath, buildedBuffer, (err) => {
            if (err) return reject(err);
            fs.unlink(file.tempFilePath, (err) => {
              if (err) throw err;
            });
            resolve({
              webSrc: webPath,
              serverSrc: relativePath + '/' + outputFileName
            });
          });
        });

      });
    });
    
  });
}

module.exports = router;
