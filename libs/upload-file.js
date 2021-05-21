const path = require('path');
const fs = require('fs');
const db = require('../db');
const minifyImg = require('./minify-img');
const { getFileNameWithoutExt } = require('./get-file-name');
const checkImg = require('./check-img');
const { getRoot } = require('./get-root');
const { glob } = require('glob');

function uploadFile(file, projectId, blockId = null, draft = false) {
  return new Promise(async (resolve, reject) => {
    
    let relativePath = `public/content/${projectId}`;
    let folderWebPath = '/' + relativePath;
    if (draft) {
      relativePath = `inner-resources/drafts/${projectId}`;
      folderWebPath = '/' + `admin/resources/drafts/${projectId}`;
    }
    const folderPath = getRoot() + '/' + relativePath;
    
    let outputFileName = file.name;
    const sameFileExists = fs.existsSync(folderPath + '/' + file.name);
    if (sameFileExists) {
      const numberOfSynonyms = glob.sync(`${folderPath}/${getFileNameWithoutExt(file.name)}*${path.extname(file.name)}`).length;
      outputFileName = `${getFileNameWithoutExt(outputFileName)}-${numberOfSynonyms + 1}${path.extname(outputFileName)}`;
    }
    const outputPath = folderPath + '/' + outputFileName;
    const webPath = folderWebPath + '/' + outputFileName;
  
    if (!checkImg(file.name)) {
      return fs.rename(file.tempFilePath, outputPath, (err) => {
        if (err) return reject(err);
        resolve({
          webSrc: webPath,
          serverSrc: relativePath + '/' + outputFileName
        });
      });
    }

    if (sameFileExists) {
      var existingInTheSameName = false;
      var existingImage = await db.query(`SELECT id, new FROM images WHERE path=$(path) AND original_checksum=$(originalChecksum)`, {
        path: relativePath + '/' + file.name,
        originalChecksum: file.md5
      }).then((fileInDb) => {
        return fileInDb && fileInDb[0];
      });
      if (existingImage) existingInTheSameName = true;

      if (!existingImage) {
        existingImage = await db.query(`SELECT id, new FROM images WHERE path=$(path) AND original_checksum=$(originalChecksum)`, {
          path: relativePath + '/' + outputFileName,
          originalChecksum: file.md5
        }).then((fileInDb) => {
          return fileInDb && fileInDb[0];
        });
        if (existingImage) existingInTheSameName = false;
      }

      if (existingImage) {
        fs.unlink(file.tempFilePath, (err) => {
          if (err) throw err;
        });
        let existingName = existingInTheSameName ? file.name : outputFileName;
        if (existingImage.new) {
          db.query('UPDATE images SET "created_at" = $<createdAt> WHERE id=$<id>', {
            id: existingImage.id,
            createdAt: (new Date()).toISOString()
          });
        }
        return resolve({
          webSrc: folderWebPath + '/' + existingName,
          serverSrc: relativePath + '/' + existingName
        });
      }
    }

    fs.readFile(file.tempFilePath, (err, data) => {
      if (err) return reject(err);
      minifyImg(data)
      .then((buildedBuffer) => {
        fs.lstat(folderPath, (err, stats) => {
          if (err) fs.mkdirSync(folderPath);

          db.query('INSERT INTO images (path, original_checksum, quantity, new) VALUES ($(path), $(originalChecksum), $(quantity), $(new))', {
            path: relativePath + '/' + (sameFileExists ? outputFileName : file.name),
            originalChecksum: file.md5,
            quantity: 0,
            new: true
          })
          .catch((err) => {
            if (err) throw err;
          });
          fs.writeFile(outputPath, buildedBuffer, (err) => {
            if (err) return reject(err);
            fs.unlink(file.tempFilePath, (err) => {
              if (err) throw err;
            });
            resolve({
              webSrc: webPath,
              serverSrc: relativePath + '/' + outputFileName
            });
          });
        });

      });
    });
    
  });
}

module.exports = uploadFile;