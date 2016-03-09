'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();
var _ = require('lodash');
var preprocess = require('gulp-preprocess');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function() {
  browserSync.reload();
});

gulp.task('inject', ['styles'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css')
  ], { read: false });

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.src, '/app')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/static/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe(preprocess({ context: { NODE_ENV: 'development' }}))
    .pipe(gulp.dest(path.join(conf.paths.src, '/static')));
});
