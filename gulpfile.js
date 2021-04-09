const gulp = require('gulp');
const browserify = require('browserify');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const fs = require('fs');
const chmod = require('gulp-chmod');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const glob = require('glob');

sass.compiler = require('node-sass');

//Tasks

gulp.task('default', function (done) {
	console.log('Hello, Gulp!');
	done();
});

class SourceToPublic {
	constructor(pathPrefix = '') {
		this.pathPrefix = pathPrefix;
	}

	css = () => {
		return gulp.src(this.pathPrefix + 'source/scss/*.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cleanCSS())
		.pipe(gulp.dest(this.pathPrefix + 'public/css'));
	}
	
	jsDev = () => {
		const entries = glob.sync(this.pathPrefix + 'source/js/*.js');
		for (let i = 0; i < entries.length; i++) {
			const entryPath = entries[i];
			
			return browserify({
				entries: entryPath,
				debug: true
			})
			.bundle()
			.pipe(source(getFileName(entryPath)))
			.pipe(buffer())
			.pipe(chmod(0o664))
			.pipe(gulp.dest(this.pathPrefix + 'public/js/'));
		}
	}

	jsMin = () => {
		return gulp.src(this.pathPrefix + 'public/js/*.js')
		.pipe(plumber())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(chmod(0o664))
		.pipe(gulp.dest(this.pathPrefix + 'public/js/'));
	}

	jsProd = (done) => {
		return gulp.series(this.jsDev, this.jsMin)(() => {
			done();
		});
	}

	syncImages = (done) => {
		const sourceImages = glob.sync(this.pathPrefix + 'source/img-entry/**');
		const buildImages = glob.sync(this.pathPrefix + 'public/img/**');
	
		for (let i = 0; i < sourceImages.length; i++) {
			const sourceImage = sourceImages[i];
			const regExp = new RegExp(`^${this.pathPrefix}source\/img-entry\/(.+)`);
			const relativePath = (sourceImage.match(regExp) || [])[1];
			if (relativePath) {
				const buildPath = this.pathPrefix + 'public/img/' + relativePath;
		
				if (buildImages.indexOf(buildPath) === -1) {
					this.minifyImg(sourceImage, () => {
						removeImg(sourceImage);
					});
				} else {
					removeImg(sourceImage);
				}
			}
		}
	
		done();
	}

	minifyImg = (path, callback = null) => {
		const relativePathRegExp = new RegExp(`^${this.pathPrefix}source\/img-entry\/(.+)`);
		const relativeFolderRegExp = new RegExp(`^${this.pathPrefix}source\/img-entry\/(.+?)\/[^/]+$`);
		const relativePath = path.match(relativePathRegExp)[1];
		const relativeFolder = (path.match(relativeFolderRegExp) || [])[1] || '';

		return gulp.src(path)
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({progressive: true}),
			imageminJpegRecompress({
				loops: 5,
				min: 65,
				max: 70,
				quality: 'medium'
			}),
			imagemin.svgo(),
			imagemin.optipng({optimizationLevel: 3}),
			pngquant({quality: [0.75, 0.8], speed: 8})
		],{
			verbose: true
		}))
		.pipe(gulp.dest(this.pathPrefix + 'public/img/' + relativeFolder))
		.on('end', () => {
			if (callback) {
				callback();
			}
		});
	}

	prod = () => {
		return new Promise((resolve, reject) => {
			gulp.parallel(this.jsProd, this.css, this.syncImages)(() => {
				resolve();
			})
		});
	}

	watch = () => {
		gulp.parallel(this.jsDev, this.css, this.syncImages)();
	
		gulp.watch(this.pathPrefix + 'source/**/*.js').on('change', gulp.series(this.jsDev));
		gulp.watch(this.pathPrefix + 'source/**/*.scss').on('change', gulp.series(this.css));
	
		gulp.watch(this.pathPrefix + 'source/img-entry/**').on('add', (path, stats) => {
			this.minifyImg(path, () => {
				removeImg(path);
			});
		});
	}

}

const front = new SourceToPublic('');
const admin = new SourceToPublic('inner-resources/admin/');

gulp.task('prod', function(done) {
	Promise.all([
		front.prod(),
		admin.prod()
	])
	.then(() => {
		done();
	})
});

gulp.task('watch', function() {
	front.watch();
	admin.watch();
});

// Functions
function removeImg(path) {
	fs.lstat(path, (err, stats) => {
		if (err) throw err;
		if (!stats.isDirectory()) {
			fs.unlink(path, (err) => {
				if (err) throw err;
			});
		}
	});
}

function getFileName(path) {
	return (path.match(/\/([^/]+)$/) || [])[1];
}