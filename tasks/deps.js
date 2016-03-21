var gulp = require('gulp');

gulp.task('deps', function () {
	gulp
		.src([
			'./node_modules/systemjs/dist/system.js',
			'./node_modules/rxjs/bundles/Rx.min.js',
			'./node_modules/angular2/bundles/angular2.js',
			'./node_modules/angular2/bundles/angular2-polyfills.min.js',
			'./node_modules/angular2/bundles/http.min.js',
			'./node_modules/angular2/bundles/router.js'
		])
		.pipe(gulp.dest('./public/lib'));
});

