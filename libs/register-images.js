const db = require("../db");
const removeFileIfExists = require("./remove-file-if-exists");
const { getTimeForPrevDaysInISO } = require("./time");
const { getRoot } = require('../libs/get-root');

async function registerImages(newImages, oldImages = []) {
  if (!newImages) newImages = [];

  Promise.all([

    new Promise(function(resolve, reject) {
      if (!oldImages?.length) return resolve();

      const oldUniqueImages = [...(new Set(oldImages))];
      for (let i = 0; i < oldUniqueImages.length; i++) {
        const oldImage = oldUniqueImages[i];
        
        if (newImages.indexOf(oldImage) == -1) {

          db.query('UPDATE images SET quantity = quantity - 1, new = false WHERE path = $<path> RETURNING quantity', {
            path: oldImage
          })
          .then(function(result) {
            const quantity = result[0].quantity;
        
            if (quantity <= 0) {
              removeFileIfExists(getRoot() + '/' + oldImage);
              db.query('DELETE FROM images WHERE path=$<path>', {
                path: oldImage
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

          db.query('UPDATE images SET quantity = quantity + 1, new = false WHERE path = $<path> RETURNING quantity', {
            path: newImage
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
  return db.query('DELETE FROM images WHERE "new" = true AND "quantity" = 0 AND "created_at" < $1 RETURNING path', [getTimeForPrevDaysInISO(3)])
  .then(function(values) {
    removeImagesFromFiles(
      imagesDbValuesToPaths(values)
    );
    return;
  });
}

function removeUnusedImages() {
  return db.query('DELETE FROM images WHERE "new" = false AND "quantity" = 0 AND "created_at" < $1 RETURNING path', [getTimeForPrevDaysInISO(1)])
  .then(function(values) {
    removeImagesFromFiles(
      imagesDbValuesToPaths(values)
    );
    return;
  });
}

function imagesDbValuesToPaths(values) {
  return values.map(function(value) {
    return value.path;
  });
}
function removeImagesFromFiles(paths) {
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    removeImageFromFiles(path);
  }
}
function removeImageFromFiles(path) {
  removeFileIfExists(getRoot() + '/' + path);
}

module.exports = registerImages;