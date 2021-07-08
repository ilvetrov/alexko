const db = require("../db");
const cache = require("./cache");

async function detectImgIsDraft(name) {
  const idForPath = name.split('/')[0];
  const projectId = Number(idForPath.match(/\d/g).join(''));
  const isPage = !!(idForPath.match(/page/));

  return cache.getOrSet(`${isPage ? 'page' : 'portfolio'}_${projectId}_is_draft`, async function() {
    return db.oneOrNone(`SELECT status FROM ${isPage ? 'pages' : 'portfolio'} WHERE id = $<id>`, {
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