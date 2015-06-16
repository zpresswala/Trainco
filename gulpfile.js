'use strict';

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    serverPort = 3000,
    server;

var config = {
	sassPath: 'src/TPCTrainco.Umbraco/static/bower_components/bootstrap-sass/assets/stylesheets',
	sassDest: 'src/TPCTrainco.Umbraco/assets/stylesheets'
};

gulp.task('watch', function () {
	console.log('watch')
   gulp.watch(config.sassPath + '/**/*.scss', function() {
   		gulp.run('sass');
   });
});

gulp.task('sass', function() {
	gulp.src(config.sassPath + '/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(config.sassDest));
});


gulp.task('default',function() {
    gulp.watch(config.sassPath + '/**/*.scss',['sass']);
});