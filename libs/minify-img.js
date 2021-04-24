const imagemin = require("imagemin");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegRecompress = require("imagemin-jpeg-recompress");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminOptipng = require("imagemin-optipng");
const { default: imageminPngquant } = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");
const imageminWebp = require("imagemin-webp");

function minifyImg(imgBuffer) {
  return imagemin.buffer(imgBuffer, {
    plugins: [
			imageminGifsicle({interlaced: true}),
			imageminMozjpeg({progressive: true}),
      imageminJpegRecompress({
				loops: 5,
				min: 65,
				max: 70,
				quality: 'medium'
			}),
      imageminSvgo(),
      imageminOptipng({optimizationLevel: 3}),
      imageminPngquant({quality: [0.75, 0.8], speed: 8}),
      // imageminWebp({quality: 75, method: 6})
    ]
  });
}

module.exports = minifyImg;