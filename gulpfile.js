'use strict';

// grab our gulp packages
var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    sass       = require('gulp-sass'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    imagemin   = require('gulp-imagemin'),
    watch      = require('gulp-watch'),
    webserver  = require('gulp-webserver'),
    serverPort = 3000;

// set the paths for css compiling
var config = {
	sassPaths: [
                    'src/TPCTrainco.Umbraco/assets/**/*.scss',
                    'src/TPCTrainco.Umbraco/assets/*/*.scss'
                ],
	sassDest: 'src/TPCTrainco.Umbraco/css/',

    jsPaths: [
                'src/TPCTrainco.Umbraco/assets/js/vendor/**/*.js',
                'src/TPCTrainco.Umbraco/assets/js/custom/**/*.js'
            ],
    jsDest: 'src/TPCTrainco.Umbraco/js',

    htmlPath: 'src/TPCTrainco.Umbraco/',
    imgPath: 'src/TPCTrainco.Umbraco/assets/images/*',
    imgPathDest: 'src/TPCTrainco.Umbraco/img'
};

// gulp sass task, compiling all bootstrap sass files and our custom sass files
gulp.task('sass', function() {
    return gulp.src(config.sassPaths)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(config.sassDest));
});

// gulp js minify task, minifies javascript
gulp.task('js', function() {
    return gulp.src(config.jsPaths)
        .pipe(concat('main.js').on('error', function(err) {
            console.log(err);
        }))
        .pipe(uglify().on('error', function(err) {
            console.log(err);
        }))
        .pipe(gulp.dest(config.jsDest));
});

gulp.task('webserver', function() {
    gulp.src(config.htmlPath)
        .pipe(webserver({
            // root: [__dirname],
            livereload: true,
            directoryListing: {
                enable: true,
                path: config.htmlPath + '*.html'
            },
            open: true,
            port: 3000
    }));
});

// watching all bootstrap sass files and our custom sass files
gulp.task('watch', function () {
    gulp.watch(config.sassPaths, ['sass']);
    gulp.watch(config.jsPaths, ['js']);
});


gulp.task('default', ['sass', 'js', 'webserver', 'watch']);

gulp.task('build', ['sass', 'js', 'webserver', 'watch']);

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
