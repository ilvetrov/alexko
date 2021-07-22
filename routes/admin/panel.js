const express = require('express');
const { langConstructor } = require('../../libs/user-language');
const { asyncImg } = require('../../libs/async-img-loader');
const db = require('../../db');
const { PortfolioProject } = require('../../models/portfolio');
const redirectFromNonLang = require('../../libs/redirect-from-non-lang');
const { setLangForRouter } = require('../../libs/set-lang-for-router');
const defaultResLocals = require('../../libs/default-res-locals');

var router = express.Router();

router.get(`/admin`, (req, res) => redirectFromNonLang(req, res, `/admin`));

router.get('/:lang/admin', function(req, res, next) {
  if (!setLangForRouter(req, res, next, `/admin`)) return;

  const lang = langConstructor(req);

  Promise.all([

    db.query(`
      SELECT status FROM portfolio
      ${!res.locals.admin.can_edit_all ? 'WHERE (admin_id = $<adminId> OR common = true)' : ''}
    `, {
      adminId: res.locals.admin.id
    }),

    db.query(`SELECT COUNT(*) FROM letters WHERE new=true`),

    db.query('SELECT COUNT(*) FROM pages WHERE status = $<status>', {
      status: 'published'
    }),

    db.query('SELECT COUNT(*) FROM pages WHERE status = $<status>', {
      status: 'awaiting_approval'
    }),

    db.query('SELECT COUNT(*) FROM pages WHERE status = $<status>', {
      status: 'draft'
    }),

  ])
  .then(function([
    projectsFromDb,
    letters,
    [{count: publishedPagesAmount}],
    [{count: awaitingApprovalPagesAmount}],
    [{count: draftPagesAmount}],
  ]) {
    const projects = projectsFromDb.map(projectFromDb => new PortfolioProject(projectFromDb));
    const numberOfPublished = projects.filter(project => project.status === 'published').length;
    const numberOfAwaitingApproval = projects.filter(project => project.status === 'awaiting_approval').length;
    const numberOfDrafts = projects.filter(project => project.status === 'draft').length;

    defaultResLocals(req, res);
    res.renderMin('admin/index', {
      title: lang('admin_panel'),
      layout: 'layouts/admin',
      projectsAmount: {
        published: numberOfPublished,
        awaitingApproval: numberOfAwaitingApproval,
        draft: numberOfDrafts
      },
      newLettersAmount: Number(letters[0].count),
      pagesAmount: {
        published: Number(publishedPagesAmount),
        awaitingApproval: Number(awaitingApprovalPagesAmount),
        draft: Number(draftPagesAmount)
      },
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
        },
        important: asyncImg([
          {
            webSrc: '/admin/resources/admin/public/img/important.svg',
            serverSrc: 'inner-resources/admin/public/img/important.svg'
          }
        ])
      }
    });
  });
   
});

module.exports = router;