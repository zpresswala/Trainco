import runSequence from 'run-sequence';
import gulp from 'gulp';
gulp.task('build', function() {

  runSequence('scripts', 'styles');

});
