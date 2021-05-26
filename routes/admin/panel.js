const createError = require('http-errors');
const express = require('express');
const { langConstructor } = require('../../libs/user-language');
const { asyncImg } = require('../../libs/async-img-loader');
const db = require('../../db');
const { PortfolioProject } = require('../../models/portfolio');

var router = express.Router();

router.get('/', function(req, res, next) {
  const lang = langConstructor(req);

  Promise.all([

    new Promise((resolve, reject) =>
      db.query(`
        SELECT status FROM portfolio
        ${!res.locals.admin.can_edit_all ? 'WHERE (admin_id = $<adminId> OR common = true)' : ''}
      `, {
        adminId: res.locals.admin.id
      })
      .then(projects => resolve(projects))
    ),

  ])
  .then(function(
    [ projectsFromDb ]
  ) {
    const projects = projectsFromDb.map(projectFromDb => new PortfolioProject(projectFromDb));
    const numberOfPublished = projects.filter(project => project.status === 'published').length;
    const numberOfAwaitingApproval = projects.filter(project => project.status === 'awaiting_approval').length;
    const numberOfDrafts = projects.filter(project => project.status === 'draft').length;

    res.renderMin('admin/index', {
      title: lang('admin_panel'),
      layout: 'layouts/admin',
      projectsAmount: {
        published: numberOfPublished,
        awaitingApproval: numberOfAwaitingApproval,
        draft: numberOfDrafts
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
        }
      }
    });
  });
   
});

module.exports = router;