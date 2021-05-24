const db = require("../db");
const removeFileIfExists = require("./remove-file-if-exists");
const { getTimeForPrevDaysInISO } = require("./time");
const { getRoot } = require('../libs/get-root');
const getImgSrc = require("./get-img-src");
const detectImgIsDraft = require("./detect-img-is-draft");

async function registerImages(newImages, oldImages = [], projectIsDraft = undefined) {
  if (!newImages) newImages = [];

  Promise.all([

    new Promise(function(resolve, reject) {
      if (!oldImages?.length) return resolve();

      const oldUniqueImages = [...(new Set(oldImages))];
      for (let i = 0; i < oldUniqueImages.length; i++) {
        const oldImage = oldUniqueImages[i];
        
        if (newImages.indexOf(oldImage) == -1) {

          db.query('UPDATE images SET quantity = quantity - 1, new = false WHERE name = $<name> RETURNING quantity', {
            name: oldImage
          })
          .then(async function(result) {
            const quantity = result[0].quantity;
        
            if (quantity <= 0) {
              const imgIsDraft = projectIsDraft ?? await detectImgIsDraft(oldImage);
              removeFileIfExists(getRoot() + '/' + getImgSrc(oldImage, imgIsDraft).serverSrc);
              db.query('DELETE FROM images WHERE name=$<name>', {
                name: oldImage
              });
            }
        
            return true;
          })
          .catch(function(reason) {
            return false;
          });

        }
      }

      resolve();
    }),

    new Promise(function(resolve, reject) {
      const newUniqueImages = [...(new Set(newImages))];
      for (let i = 0; i < newUniqueImages.length; i++) {
        const newImage = newUniqueImages[i];
        
        if (oldImages.indexOf(newImage) == -1) {

          db.query('UPDATE images SET quantity = quantity + 1, new = false WHERE name = $<name> RETURNING quantity', {
            name: newImage
          })
          .catch(function(reason) {
            console.error(reason);
            return false;
          });

        }
      }

      resolve();
    }),

  ]);
}

function initImages() {
  removeNewButLongUnusedImages();
  removeUnusedImages();

  setInterval(() => {
    removeNewButLongUnusedImages()
    .then((result) => {
      console.log('New but long unused images deleted.');
    });
    removeUnusedImages()
    .then((result) => {
      console.log('Unused images deleted.');
    });
  }, 1000 * 60 * 60 * 24);
}
initImages();

function removeNewButLongUnusedImages() {
  return db.query('DELETE FROM images WHERE "new" = true AND "quantity" = 0 AND "created_at" < $1 RETURNING name', [getTimeForPrevDaysInISO(3)])
  .then(function(values) {
    removeImagesFromFiles(
      imagesDbValuesToNames(values)
    );
    return;
  });
}

function removeUnusedImages() {
  return db.query('DELETE FROM images WHERE "new" = false AND "quantity" = 0 AND "created_at" < $1 RETURNING name', [getTimeForPrevDaysInISO(1)])
  .then(function(values) {
    removeImagesFromFiles(
      imagesDbValuesToNames(values)
    );
    return;
  });
}

function imagesDbValuesToNames(values) {
  return values.map(value => value.name);
}
function removeImagesFromFiles(names) {
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    removeImageFromFiles(name);
  }
}
async function removeImageFromFiles(name) {
  const imgIsDraft = await detectImgIsDraft(name);
  removeFileIfExists(getRoot() + '/' + getImgSrc(name, imgIsDraft).serverSrc);
}

module.exports = registerImages;