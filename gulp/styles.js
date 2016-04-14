'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var config = require('../gulp.config')();
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var _ = require('lodash');

var buildStyles = function() {
  var sassOptions = {
    style: 'expanded'
  };
  var processors = [
    autoprefixer({browsers: ['> 1%', 'last 3 version']})
  ];

  return gulp.src(config.sass + 'main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', conf.errorHandler('Sass')))
    .pipe($.postcss(processors))
    .pipe($.cssnano())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(path.join(conf.paths.umb, 'assets/css')));
};

gulp.task('styles', function() {
  return buildStyles();
});

gulp.task('styles-reload', ['styles'], function() {
  return buildStyles()
    .pipe(browserSync.reload({
      stream: true
    }))
});
