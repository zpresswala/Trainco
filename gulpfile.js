'use strict';

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    watch = require('gulp-watch'),
    webserver = require('gulp-webserver'),
    serverPort = 3000;

// set the paths for css compiling
var config = {
	sassPath: 'src/TPCTrainco.Umbraco/assets/bootstrap-sass/assets/stylesheets',
    sassPathCustom: 'src/TPCTrainco.Umbraco/assets/scss',
	sassDest: 'src/TPCTrainco.Umbraco/css',
    htmlPath: 'src/TPCTrainco.Umbraco/',
    imgPath: 'src/TPCTrainco.Umbraco/assets/images/*',
    imgPathDest: 'src/TPCTrainco.Umbraco/img'
};

// gulp sass task, compiling all bootstrap sass files and our custom sass files
gulp.task('sass', function() {
    gulp.src([config.sassPath + '/**/*.scss', config.sassPathCustom + '/*.scss', config.sassPathCustom + '/**/*.scss'])
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(config.sassDest));
});

gulp.task('webserver', function() {
    gulp.src(config.htmlPath)
        .pipe(webserver({
            // root: '/src',
            livereload: true,
            // directoryListing: true,
            open: true,
            port: 3000
    }));
});

// watching all bootstrap sass files and our custom sass files
gulp.task('watch', function () {
    gulp.watch([config.sassPath + '/**/*.scss', config.sassPathCustom + '/*.scss'], ['sass']);
    // js watch call goes here
});


gulp.task('default', ['sass', 'webserver', 'watch']);

// run 'gulp smush' to minify images
gulp.task('img-opt', function() { 
    return gulp.src(config.imgPath)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest(config.imgPathDest));
});

gulp.task('smush', ['img-opt']);

// need: 
// css, js concatenate
// css, js minify
