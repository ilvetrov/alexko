const db = require("../db");
const cache = require("./cache");

async function detectImgIsDraft(name) {
  const projectId = Number(name.split('/')[0]);

  return cache.getOrSet(`project_${projectId}_is_draft`, async function() {
    return db.oneOrNone('SELECT status FROM portfolio WHERE id = $<id>', {
      id: projectId
    })
    .then(function(result) {
      if (!result) return false;

      return result?.status !== 'published';
    })
    .catch(function(reason) {
      return false;
    });
  }, 1000 * 2);
}

module.exports = detectImgIsDraft;