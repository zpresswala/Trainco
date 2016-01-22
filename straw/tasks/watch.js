import gulp from 'gulp';
import gutil from 'gulp-util';
import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import handleErrors from '../utils/handleErrors';
import config from '../config';
import pkg from '../../package.json';

gulp.task('watch', function() {

  // Watch html files
  watch(`${pkg.directories.src}/*.html`, {
    emitOnGlob: false,
    read: false,
    name: 'Html watcher',
    verbose: config.verbose
  }, function() {
    gulp.start('markup:changed');
  });

  watch(`${pkg.directories.src}/inc/**/*`, {
    emitOnGlob: false,
    read: false,
    name: 'Includes watcher',
    verbose: config.verbose
  }, function() {
    gulp.start('markup:all');
  });

  // Watch dependencies
  watch('package.json', {
    emitOnGlob: false,
    read: true,
    name: 'Package watcher',
    verbose: config.verbose
  }, function(file) {
    global.pkg = JSON.parse(file.contents.toString());
    gulp.start('markup:all');
    gulp.start('scripts:vendor');
  });

  // Watch styles files
  watch(`${pkg.directories.src}/sass/**/*.scss`, {
    name: 'Styles watcher',
    verbose: config.verbose
  }, function() {
    gulp.start('styles');
  });

  watch(`${pkg.directories.src}/fonts/**/*`, {
    emitOnGlob: false,
    read: false,
    name: 'Fonts watcher',
    verbose: config.verbose
  }, function() {
    gulp.start('styles:fonts');
  });

  // Watch scripts files (using watchify)
  gulp.start('scripts');

  // Watch images files
  watch([`${pkg.directories.src}/images/**/*`, `!${pkg.directories.src}/images/sprite/**/*`], {
    emitOnGlob: false,
    read: false,
    name: 'Images watcher',
    verbose: config.verbose
  }, function() {
    gulp.start('images:optimization');
  });
  watch(`${config.src}/images/sprite/**/*`, {
    emitOnGlob: false,
    read: false,
    name: 'Spritesheet watcher',
    verbose: config.verbose
  }, function() {
    gulp.start('images:spritesheet');
  });

   watch([
            `${pkg.directories.dist}/*`,
            `${pkg.directories.dist}/js/**/*.js`,
            `${pkg.directories.dist}/**/*.html`,
            `${pkg.directories.dist}/images/**/*.{png,jpg,jpeg,gif,svg}`
        ], {
            name: 'Post-Build Watcher',
            verbose: config.verbose
        }).on('change', function () {
                browserSync.reload();
        });

  gutil.log(gutil.colors.green('Watching changes...'));

});
