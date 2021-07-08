const express = require('express');
const checkAdminCsrf = require('../../../middlewares/check-admin-csrf');
const db = require('../../../db');
const { frontMultilingualToBackend } = require('../../../libs/converters/multilingual');
const { getEditorImagesFromMultilingual } = require('../../../libs/converters/get-editor-images');
const registerImages = require('../../../libs/register-images');
const fs = require('fs-extra');

var router = express.Router();

router.post('/pages/edit', checkAdminCsrf, async function(req, res, next) {
  const data = req.body;

  if (!data.page_id) return res.send('missed page_id');

  const oldData = await db.query(`SELECT * FROM pages WHERE id=$(id)`, {
    id: data.page_id
  })
  .then(result => result[0]);

  const newData = {
    id: Number(data.page_id),
    title: frontMultilingualToBackend('title', data, req),
    excerpt: frontMultilingualToBackend('excerpt', data, req),
    text: frontMultilingualToBackend('page_text', data, req),
    status: data.status || oldData.status,
    slug: encodeURIComponent(data.slug.replace(/^\//, '')) || null
  }

  if (data.editors_images) {
    registerImages(
      data.editors_images,
      getEditorImagesFromMultilingual(oldData.text),
      newData.status !== 'published'
    );
  }

  const idForFiles = newData.id + '-page';

  db.query(`
  UPDATE pages
  SET
    title = $(title),
    excerpt = $(excerpt),
    text = $(text),
    status = $(status),
    slug = $(slug)
  WHERE id=$(id)
  `, newData)
  .then((result) => {
    if (newData.status === 'published' && oldData.status !== 'published') {
      fs.move(`inner-resources/drafts/${idForFiles}`, `public/content/${idForFiles}`)
      .then(function() {
        sendSuccess();
      });
    } else if (newData.status !== 'published' && oldData.status === 'published') {
      fs.move(`public/content/${idForFiles}`, `inner-resources/drafts/${idForFiles}`)
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