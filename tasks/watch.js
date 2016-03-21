var gulp = require('gulp');

gulp.task('watch', ['build'], function () {

	gulp.watch(['app/**/*.ts', 'app/**/*.jade'], ['typescript']);
	gulp.watch(['src/pages/**/*.jade'], ['jade']);
	gulp.watch(['src/styles/**/*.styl'], ['styles']);
});
