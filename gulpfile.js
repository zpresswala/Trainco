'use strict';

// grab our gulp packages
var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    sass       = require('gulp-sass'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    imagemin   = require('gulp-imagemin'),
    watch      = require('gulp-watch'),
    cssnano    = require('gulp-cssnano'),
    webserver  = require('gulp-webserver'),
    serverPort = 3000;

// set the paths for css compiling
var config = {
        sassPaths: [
                    'src/TPCTrainco.Umbraco/assets/scss/*.scss'
                ],
        sassDest: 'src/TPCTrainco.Umbraco/css',

    jsPaths: [
                'src/TPCTrainco.Umbraco/assets/js/custom/TPCApp.js',
                'src/TPCTrainco.Umbraco/assets/js/custom/*.js'
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
                .pipe(cssnano())
                .pipe(gulp.dest(config.sassDest));
});

gulp.task('vendorCSS', function() {
    var vendorStyles = [
        'src/TPCTrainco.Umbraco/assets/jquery-range-slider-css/jquery-ui.structure.css',
        'src/TPCTrainco.Umbraco/assets/jquery-range-slider-css/jquery-ui.css',
        'src/TPCTrainco.Umbraco/assets/jquery-range-slider-css/classic-min.css',
        'src/TPCTrainco.Umbraco/assets/jquery-range-slider-css/select2.min.css'
    ]
    return gulp.src(vendorStyles)
        .pipe(concat('vendor.css').on('error', function(err) {
            console.log(err);
        }))
        .pipe(cssnano())
        .pipe(gulp.dest(config.sassDest));
});

// gulp js minify task, minifies javascript
gulp.task('js', function() {
    return gulp.src(config.jsPaths)
        .pipe(concat('main.js').on('error', function(err) {
            console.log(err);
        }))
        .pipe(uglify({mangle: false}).on('error', function(err) {
            console.log(err);
        }))
        .pipe(gulp.dest(config.jsDest));
});

// gulp js minify task, minifies javascript
gulp.task('js:vendor', function() {

    var vendorPaths = [
        'src/TPCTrainco.Umbraco/assets/js/vendor/jquery-ui.min.js',
        'src/TPCTrainco.Umbraco/assets/js/vendor/JQDateRangeSlider-withRuler-min.js',
        'src/TPCTrainco.Umbraco/assets/js/vendor/bootstrap-carousel.js',
        'src/TPCTrainco.Umbraco/assets/js/vendor/bootstrap-collapse.js',
        'src/TPCTrainco.Umbraco/assets/js/vendor/bootstrap-transition.js',
        'src/TPCTrainco.Umbraco/assets/js/vendor/bootstrap-dropdown.js',
        'src/TPCTrainco.Umbraco/assets/js/vendor/bootstrap-tooltip.js',
        'src/TPCTrainco.Umbraco/assets/js/vendor/bootstrap-popover.js',
        'src/TPCTrainco.Umbraco/assets/js/vendor/modernizr-dev.js',

    ];
    return gulp.src(vendorPaths)
        .pipe(concat('vendor.js').on('error', function(err) {
            console.log(err);
        }))
        .pipe(uglify().on('error', function(err) {
            console.log(err);
        }))
        .pipe(gulp.dest(config.jsDest));
});

// gulp js minify task, minifies javascript
gulp.task('js:cartapp', function() {

    var cartappPaths = [
        'src/TPCTrainco.Umbraco/assets/js/custom/cartApp/models/**/*.js',
        'src/TPCTrainco.Umbraco/assets/js/custom/cartApp/collections/**/*.js',
        'src/TPCTrainco.Umbraco/assets/js/custom/cartApp/views/**/*.js',
        'src/TPCTrainco.Umbraco/assets/js/custom/checkoutApp/**/*.js',
    ];
    return gulp.src(cartappPaths)
        .pipe(concat('cart.js').on('error', function(err) {
            console.log(err);
        }))
        .pipe(uglify({mangle: false}).on('error', function(err) {
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

gulp.task('assets:all', ['sass', 'js', 'js:vendor', 'js:cartapp']);

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

// gulp minify commands: gulp js, gulp js:vendor, gulp js:cartapp
