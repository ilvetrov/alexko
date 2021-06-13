const createError = require('http-errors');
const express = require('express');
const checkAdminCsrf = require('../../../middlewares/check-admin-csrf');
const db = require('../../../db');
const { frontMultilingualToBackend } = require('../../../libs/converters/multilingual');
const getIntroImagesAsWebArray = require('../../../libs/converters/intro-images-as-web-array');
const { getEditorImagesFromMultilingual } = require('../../../libs/converters/get-editor-images');
const registerImages = require('../../../libs/register-images');
const fs = require('fs-extra');
const normalizeIntroImages = require('../../../libs/normalize-intro-images');

var router = express.Router();

router.post('/portfolio/edit', checkAdminCsrf, async function(req, res, next) {
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
    text: frontMultilingualToBackend('project_text', data, req),
    status: data.status || oldData.status,
    common: data.common ?? oldData.common,
    type_id: data.type_id ?? oldData.type_id,
    intro_images: {
      mobile: normalizeIntroImages(data.intro_images) || oldData.intro_images.mobile,
      desktop: normalizeIntroImages(data.intro_desktop_images) || oldData.intro_images.desktop
    },
    to_link: data.to_link || null,
    demo_id: data.demo_id,
    slug: encodeURIComponent(data.slug) || null
  }

  if (data.editors_images) {
    registerImages(
      [...getIntroImagesAsWebArray(data.intro_images, data.intro_desktop_images), ...data.editors_images],
      [...getIntroImagesAsWebArray(oldData.intro_images?.mobile || {}, oldData.intro_images?.desktop || {}), ...getEditorImagesFromMultilingual(oldData.text)],
      newData.status !== 'published'
    );
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
    demo_id = $(demo_id),
    slug = $(slug)
  WHERE id=$(id)
  `, newData)
  .then((result) => {
    if (newData.status === 'published' && oldData.status !== 'published') {
      fs.move(`inner-resources/drafts/${newData.id}`, `public/content/${newData.id}`)
      .then(function() {
        sendSuccess();
      });
    } else if (newData.status !== 'published' && oldData.status === 'published') {
      fs.move(`public/content/${newData.id}`, `inner-resources/drafts/${newData.id}`)
      .then(function() {
        sendSuccess();
      });
    } else {
      sendSuccess();
    }
  })
  .catch((reason) => {
    sendUnsuccess();
  });

  function sendSuccess() {
    res.json({
      'success': true
    });
  }
  function sendUnsuccess() {
    res.json({
      'success': false
    });
  }

});

module.exports = router;