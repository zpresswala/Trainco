'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var browserSync = require('browser-sync');

var utilities = require('./utilities');
var config = require('../gulp.config')();
var $ = require('gulp-load-plugins')({
          pattern: ['gulp-*', 'del', 'fs-extra']
        });
var gIf = require('gulp-if');
var yargs = require('yargs');
var production = yargs.argv.prod ? true : false;

gulp.task('scripts-reload', function() {
  return buildScripts()
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return buildScripts();
});

function buildScripts() {
  return gulp.src(config.ngjs)
    .pipe($.preprocess({ context: { NODE_ENV: 'development' }}))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate({add: true}))
    .pipe(gIf(production, $.concat('ngapp.js')))
    .pipe(gIf(production, $.uglify({
      preserveComments: $.uglifySaveLicense, mangle: false}))
      .on('error', conf.errorHandler('Uglify')))
    .pipe($.sourcemaps.write('maps'))
    .pipe($.size())
    .pipe(gulp.dest(config.tmp));
};

gulp.task('vendor', function() {
  return buildVendor();
});

function buildVendor() {
  return gulp.src(path.join(conf.paths.umb, 'assets/js/ngapp/lib/**/*.js'))
    .pipe($.ngAnnotate())
    .pipe($.concat('vendor.js'))
    .pipe($.uglify())
    .pipe($.size())
    .pipe(gulp.dest(path.join(conf.paths.umb, 'assets/js/ngapp/lib')));
};

var config = {

    jsPaths: [
                'src/TPCTrainco.Umbraco/assets/js/custom/TPCApp.js',
                'src/TPCTrainco.Umbraco/assets/js/custom/*.js'
            ],
            jsDest: 'src/TPCTrainco.Umbraco/js'
}
gulp.task('js', function() {
    return gulp.src(config.jsPaths)
        .pipe($.concat('main.js').on('error', function(err) {
            console.log(err);
        }))
        .pipe($.uglify({mangle: false}).on('error', function(err) {
            console.log(err);
        }))
        .pipe(gulp.dest(config.jsDest));
});
