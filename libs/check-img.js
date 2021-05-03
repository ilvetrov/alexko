function checkImg(filePath) {
  const extname = (filePath.match(/.+?(\.[^.]+)$/) || [])[1];
  return extname == '.png'
  || extname == '.jpg'
  || extname == '.jpeg'
  || extname == '.webp'
  || extname == '.svg'
  || extname == '.gif';
}

module.exports = checkImg;