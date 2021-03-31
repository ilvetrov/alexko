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

gulp.task('css', function() {
	return gulp.src('source/scss/*.scss')
			.pipe(plumber())
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer())
			.pipe(cleanCSS())
			.pipe(gulp.dest('public/css'));
});

gulp.task('js-dev', function() {
	const entries = glob.sync('source/js/*.js');
	for (let i = 0; i < entries.length; i++) {
		const entryPath = entries[i];
		
		return browserify({
			entries: entryPath,
			debug: true
		})
		.bundle()
		.pipe(source(getFileName(entryPath)))
		.pipe(buffer())
		.pipe(chmod(0664))
		.pipe(gulp.dest('public/js/'));
	}
});

gulp.task('minify-js', function() {
	return gulp.src('public/js/*.js')
	.pipe(plumber())
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(uglify())
	.pipe(chmod(0664))
	.pipe(gulp.dest('public/js/'));
});

gulp.task('js-prod', function(done) {
	return gulp.series('js-dev', 'minify-js')(() => {
		done();
	});
});

gulp.task('sync-images', function(done) {
	const sourceImages = glob.sync('source/img-entry/**');
	const buildImages = glob.sync('public/img/**');

	for (let i = 0; i < sourceImages.length; i++) {
		const sourceImage = sourceImages[i];
		const relativePath = (sourceImage.match(/^source\/img-entry\/(.+)/) || [])[1];
		if (relativePath) {
			const buildPath = 'public/img/' + relativePath;
	
			if (buildImages.indexOf(buildPath) === -1) {
				minifyImg(sourceImage, () => {
					removeImg(sourceImage);
				});
			} else {
				removeImg(sourceImage);
			}
		}
	}

	done();
});

gulp.task('prod', function(done) {
	gulp.parallel('js-prod', 'css', 'sync-images')(() => {
		done();
	});
});

// Watch

gulp.task('watch', function() {
	gulp.parallel('js-dev', 'css', 'sync-images')();

	gulp.watch('source/**/*.js').on('change', gulp.series('js-dev'));
	gulp.watch('source/**/*.scss').on('change', gulp.series('css'));

	gulp.watch('source/img-entry/**').on('add', (path, stats) => {
		minifyImg(path, () => {
			removeImg(path);
		});
	});
});

// Functions

function minifyImg(path, callback = null) {
	const relativePath = path.match(/^source\/img-entry\/(.+)/)[1],
				relativeFolder = (path.match(/^source\/img-entry\/(.+?)\/[^/]+$/) || [])[1] || '';
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
	.pipe(gulp.dest('public/img/' + relativeFolder))
	.on('end', () => {
		if (callback) {
			callback();
		}
	});
}

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