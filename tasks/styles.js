var gulp = require('gulp');
var stylus = require('gulp-stylus');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('styles', function () {
	gulp.src('./src/styles/**/*.styl')
		.pipe(sourcemaps.init())
		.pipe(stylus())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/css'))
		.pipe(connect.reload());
});
