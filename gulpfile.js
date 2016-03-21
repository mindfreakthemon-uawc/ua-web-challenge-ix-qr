var gulp = require('gulp');

gulp.task('build', ['deps', 'styles', 'typescript', 'jade']);

gulp.task('default', ['connect', 'watch']);

require('requiredir')('./tasks');

