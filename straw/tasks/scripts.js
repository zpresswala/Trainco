import gulp from 'gulp';
import webpack from 'webpack-stream';
import gutil from 'gulp-util';
import filter from 'gulp-filter';
import header from 'gulp-header';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';

import handleErrors from '../utils/handleErrors';
import config from '../config';
import pkg from '../../package.json';

function webpackWrapper(watch, test, callback) {

  let webpackOptions = {
    watch: watch,
    module: {
      loaders: [{ test: /\.js$/, exclude: /node_modules/, loaders: pkg.webpackLoaders}]
    },
    output: { filename: 'index.module.js' }
  };

  if (watch) {
    webpackOptions.devtool = 'inline-source-map';
  }

  let webpackChangeHandler = function(err, stats) {
    if(err) {
      conf.errorHandler('Webpack')(err);
    }
    gutil.log(stats.toString({
      colors: gutil.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }));
    browserSync.reload();
    if(watch) {
      watch = false;
      callback();
    }
  };

  return gulp.src(`${config.src}/scripts/index.js`)
    .pipe(webpack(webpackOptions, null, webpackChangeHandler))
    .pipe(gulp.dest(`${config.dist}/scripts`));

}

gulp.task('scripts', function() {
 return webpackWrapper(false, false);
});

gulp.task('scripts:watch', ['scripts'], function (callback) {
  return webpackWrapper(true, false, callback);
});

gulp.task('scripts:test', function () {
  return webpackWrapper(false, true);
});

gulp.task('scripts:test-watch', ['scripts'], function (callback) {
  return webpackWrapper(true, true, callback);
});
