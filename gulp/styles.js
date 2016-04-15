'use strict';

var path = require('path');
var gulp = require('gulp');
var utilities = require('./utilities');
var config = require('../gulp.config')();
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({
          pattern: ['gulp-*', 'del', 'fs-extra']
        });
var gIf = require('gulp-if');
var yargs = require('yargs');
var production = yargs.argv.prod ? true : false;

var buildStyles = function() {
  var sassOptions = {
    style: 'expanded'
  };
  var processors = [
    autoprefixer({browsers: ['> 1%', 'last 3 version']})
  ];

  return gulp.src(config.sass + 'main.scss')
    .pipe(gIf(!production, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: [config.sass + '**/*']
    }).on('error', utilities.errorHandler('Sass')))
    .pipe($.postcss(processors))
    .pipe(gIf(production, $.cssnano()))
    .pipe(gIf(!production, $.sourcemaps.write('./')))
    .pipe(gIf(!production, gulp.dest(config.tmp)))
    .pipe(gulp.dest(config.css));
};

gulp.task('styles', function() {
  utilities.log('Running Sass => CSS');
  return buildStyles();
});

gulp.task('styles-reload', ['styles'], function() {
  return buildStyles()
    .pipe(browserSync.reload({
      stream: true
    }))
});
