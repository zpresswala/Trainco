'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
  }

  var server = {
    baseDir: [conf.paths.src + '/static', conf.paths.src + '/TPCTrainCo.Umbraco'],
    routes: routes
  };

  browserSync.instance = browserSync.init({
    proxy: 'http://trainco-phase1.axial-client.com/'
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSync.init({
    proxy: 'http://trainco-phase1.axial-client.com/'
  });
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});
