const createError = require('http-errors');
const express = require('express');
const { langConstructor, getUserLanguage, getLanguagesNames } = require('../../../libs/user-language');
const fs = require('fs');
const { getRoot } = require('../../../libs/get-root');
const { asyncImg } = require('../../../libs/async-img-loader');
const db = require('../../../db');
const redirectTo = require('../../../libs/redirect-to');
const { PortfolioProject } = require('../../../models/portfolio');
const getImgSrc = require('../../../libs/get-img-src');
const isDevelopment = require('../../../libs/is-development');

var router = express.Router();

router.get('/portfolio/edit/:id', function(req, res, next) {
  const id = Number(req.params.id);
  if (!id) return redirectTo('/portfolio');

  db.oneOrNone('SELECT * FROM portfolio WHERE id=$(id)', {
    id: id
  }).then(async function(projectFromDb) {
    if (!projectFromDb) return next(createError(404));

    const project = new PortfolioProject(projectFromDb, getUserLanguage(req).code_name);
    const lang = langConstructor(req);

    Promise.all([

      db.query('SELECT id, singular_name FROM project_types'),
      
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
  
      const hideMobileImagesForTypes = [
        1
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
                  asyncImages[Number(key)] = asyncImg([getImgSrc(image, project.status !== 'published')], true);
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
  
      const draft = Number(project.status !== 'published');
  
      if (!res.locals.frontVariables.dictionary) res.locals.frontVariables.dictionary = {};
      res.locals.frontVariables.dictionary.other_languages = lang('other_languages');

      res.locals.frontVariables.projectId = project.id;
      
      res.locals.frontVariables.editorText = (function() {
        const languagesNames = getLanguagesNames(req);

        const outputItems = {};
        for (const codeName in languagesNames) {
          if (Object.hasOwnProperty.call(languagesNames, codeName)) {
            if (codeName === getUserLanguage(req).code_name) {
              outputItems[`project_text`] = project.allTexts[codeName] ?? project.allTexts['en'];
            } else {
              outputItems[`project_text_${codeName}`] = project.allTexts[codeName] ?? project.allTexts['en'];
            }
          }
        }
        return outputItems;
      }());

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
        toLinkText: project.type_id && project.to_link_text,
        multilingual: {
          title: project.allTitles,
          descr: project.allDescrs,
          text: project.allTexts
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
        toLinkVariations: JSON.stringify(project.to_link_variations),
        selects: [...(res.locals.selects ?? []), ...[
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
              for (const codeName in languagesNames) {
                if (Object.hasOwnProperty.call(languagesNames, codeName)) {
                  const languageHumanName = languagesNames[codeName];
                  outputItems.push({
                    id: codeName,
                    content: languageHumanName,
                    active: codeName == getUserLanguage(req).code_name
                  });
                }
              }
              return outputItems;
            }())
          }
        ]],
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
        creatingText: project.creating_text,
        creatingVariations: JSON.stringify(project.creating_variations),
        hideDesktopImages: project.type_id && hideDesktopImagesForTypes.indexOf(activeProjectType.id) != -1,
        hideDesktopImagesForTypes: JSON.stringify(hideDesktopImagesForTypes),
        hideMobileImages: project.type_id && hideMobileImagesForTypes.indexOf(activeProjectType.id) != -1,
        hideMobileImagesForTypes: JSON.stringify(hideMobileImagesForTypes),
      });
    });
  })
  .catch((reason) => {
    isDevelopment && console.error(reason);
    return next(createError(404));
  });
});

module.exports = router;