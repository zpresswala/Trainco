'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();


gulp.task('scripts-reload', function() {
  return buildScripts()
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return buildScripts();
});

function buildScripts() {
  return gulp.src(path.join(conf.paths.umb, 'TPCTrainco.Umbraco/app/**/*.js'))
    .pipe($.preprocess({ context: { NODE_ENV: 'development' }}))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.sourcemaps.init())
    .pipe($.concat('ngapp.js'))
    .pipe($.ngAnnotate({}))
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.sourcemaps.write('maps'))
    .pipe($.size())
    .pipe(gulp.dest(path.join(conf.paths.umb, 'TPCTrainco.Umbraco/app')));
};

gulp.task('vendor', function() {
  return buildVendor();
});

function buildVendor() {
  return gulp.src(path.join(conf.paths.src, '/lib/**/*.js'))
    .pipe($.ngAnnotate())
    .pipe($.concat('vendor.js'))
    .pipe($.uglify())
    .pipe($.size())
    .pipe(gulp.dest(path.join(conf.paths.umb, 'TPCTrainco.Umbraco/app/lib')));
};
