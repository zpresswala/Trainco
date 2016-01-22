import gulp from 'gulp';
import browserSync from 'browser-sync';
import handleErrors from '../utils/handleErrors';
import config from '../config';
import pkg from '../../package.json';
gulp.task('serve', function() {

  const logLevel = config.verbose ? 'debug' : 'info';

  browserSync({
    server: {
      baseDir: config.dist
    },
    port: config.port,
    logConnections: true,
    logFileChanges: true,
    logLevel: logLevel,
    injectChanges: true,
    notify: true
  });
});
