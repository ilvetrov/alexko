const createError = require('http-errors');
const express = require('express');
const { langConstructor, getUserLanguage, getLanguagesNames } = require('../../../libs/user-language');
const fs = require('fs');
const { getRoot } = require('../../../libs/get-root');
const db = require('../../../db');
const redirectTo = require('../../../libs/redirect-to');
const isDevelopment = require('../../../libs/is-development');
const { Page } = require('../../../models/page');
const { promisify } = require('util');
const redirectFromNonLang = require('../../../libs/redirect-from-non-lang');
const { setLangForRouter } = require('../../../libs/set-lang-for-router');
const defaultResLocals = require('../../../libs/default-res-locals');

var router = express.Router();

router.get(`/admin/pages/edit/:id`, (req, res) => redirectFromNonLang(req, res, `/admin/pages/edit/${req.params.id}`));

router.get('/:lang/admin/pages/edit/:id', function(req, res, next) {
  if (!setLangForRouter(req, res, next, `/admin/pages/edit/${req.params.id}`)) return;

  const id = Number(req.params.id);
  if (!id) return redirectTo(res, '/admin/pages');

  db.oneOrNone('SELECT * FROM pages WHERE id=$<id>', {
    id: id
  })
  .then(function(pageFromDb) {
    if (!pageFromDb) return next(createError(404));

    const page = new Page(pageFromDb, getUserLanguage(req).code_name);
    const lang = langConstructor(req);

    Promise.all([
      
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

    ])
    .then(([
      multilingualSvg,
      removeSvg,
      removeWhiteShadowSvg,
      gearSvg,
    ]) => {
      const draft = Number(page.status !== 'published');

      defaultResLocals(req, res);

      res.locals.frontVariables.pageId = page.id;
      
      res.locals.frontVariables.editorText = (function() {
        const languagesNames = getLanguagesNames(req);

        const outputItems = {};
        for (const codeName in languagesNames) {
          if (Object.hasOwnProperty.call(languagesNames, codeName)) {
            if (codeName === getUserLanguage(req).code_name) {
              outputItems[`page_text`] = page.allTexts[codeName] ?? page.allTexts['en'];
            } else {
              outputItems[`page_text_${codeName}`] = page.allTexts[codeName] ?? page.allTexts['en'];
            }
          }
        }
        return outputItems;
      }());
      
      res.renderMin('admin/pages/edit', {
        title: lang('edit_page') + ' ' + page.id,
        layout: 'layouts/admin',
        page: page,
        draft: draft,
        multilingual: {
          title: page.allTitles,
          excerpt: page.allExcerpts,
          text: page.allTexts
        },
        directSvg: {
          multilingual: multilingualSvg,
          remove: removeSvg,
          removeWhiteShadow: removeWhiteShadowSvg,
          gear: gearSvg,
        },
        sendToCloudProperties: {
          link: '/admin/pages/edit',
          values: {
            page_id: page.id,
          },
          required: {
            'title': {
              checker: function(value) {
                return value !== '';
              },
              explanation: 'Заполните название на всех языках',
              multilingual: true,
              isDisplayBlock: true,
            },
            'excerpt': {
              checker: function(value) {
                return value !== '';
              },
              explanation: 'Заполните описание на всех языках',
              multilingual: true,
              isDisplayBlock: true,
              ownAnimation: '[data-pop-up-button="page_settings_panel"]',
            },
            'slug': {
              checker: function(value) {
                return value !== '';
              },
              explanation: 'Укажите адрес URI',
              multilingual: false,
              isDisplayBlock: true,
              ownAnimation: '[data-pop-up-button="page_settings_panel"]',
            },
            'page_text': {
              checker: function(value) {
                return value.blocks?.length > 0;
              },
              explanation: 'Опишите страницу на всех языках',
              multilingual: true,
              isDisplayBlock: true,
              accentElementsClass: 'js-page-content',
            },
          }
        },
        selects: [...(res.locals.selects ?? []), ...[
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
      });
    });
  })
  .catch((reason) => {
    isDevelopment && console.error(reason);
    return next(createError(404));
  });
});

module.exports = router;