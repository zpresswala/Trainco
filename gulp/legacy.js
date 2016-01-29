
// grab our gulp packages
var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    sass       = require('gulp-sass'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    cssnano    = require('gulp-cssnano'),
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
    imgPathDest: 'src/TPCTrainco.Umbraco/images'
};

// gulp sass task, compiling all bootstrap sass files and our custom sass files
gulp.task('sass-old', function() {
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
gulp.task('js-old', function() {
    return gulp.src(config.jsPaths)
        .pipe(concat('main.js').on('error', function(err) {
            console.log(err);
        }))
        .pipe(uglify({mangle: true}).on('error', function(err) {
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
        'src/TPCTrainco.Umbraco/assets/js/vendor/modernizr-touch.js',
        'src/TPCTrainco.Umbraco/assets/js/vendor/select2.js'

    ];
    return gulp.src(vendorPaths)
        .pipe(concat('vendor.js').on('error', function(err) {
            console.log(err);
        }))
        .pipe(uglify({mangle: true}).on('error', function(err) {
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
        .pipe(uglify({mangle: true}).on('error', function(err) {
            console.log(err);
        }))
        .pipe(gulp.dest(config.jsDest));
});

gulp.task('webserver-old', function() {
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



// gulp.task('default', ['sass', 'js', 'webserver', 'watch']);

gulp.task('build-old', ['sass-old', 'js-old']);

gulp.task('assets:all', ['sass-old', 'js-old', 'js:vendor', 'js:cartapp']);

// run 'gulp smush' to minify images

gulp.task('smush', ['img-opt']);
