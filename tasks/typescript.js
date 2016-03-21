var gulp = require('gulp');
var ts = require('gulp-typescript');
var plumber = require('gulp-plumber');
var inlineNG2Template = require('gulp-inline-ng2-template');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('typescript', function () {
	var tsResult = gulp.src([
			'app/**/*.ts',
			'app/**/*.jade',
			'typings/browser.d.ts'
		], { base: 'app/' })
		.pipe(plumber())
		.pipe(inlineNG2Template({
			base: 'app',
			jade: true
		}))
		.pipe(sourcemaps.init())
		.pipe(ts({
			target: 'es5',
			sortOutput: true,
			module: 'commonjs',
			moduleResolution: 'node',
			experimentalDecorators: true,
			emitDecoratorMetadata: true,
			noImplicitAny: false,
			noLib: false
		}));

	return tsResult.js
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/js'))
		.pipe(connect.reload());
});
