var gulp = require('gulp'),
	jade = require('gulp-jade'),
	connect = require('gulp-connect');

gulp.task('jade', function () {
	gulp.src('./src/pages/**/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('./public'))
		.pipe(connect.reload());
});
