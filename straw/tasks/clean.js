import gulp from 'gulp';
import del from 'del';

import cache from 'gulp-cache';

import config from '../config';

gulp.task('clean', ['clean:clearCache', 'clean:deleteFiles']);

gulp.task('clean:deleteFiles', function() {
  del([`${config.dist}/**`,`!${config.dist}`, '.sass-cache']);
});

gulp.task('clean:clearCache', function() {
  cache.clearAll();
});
