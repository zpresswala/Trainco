import gulp from 'gulp';
import gutil from 'gulp-util';
import browserSync from 'browser-sync';
import Fontmin from 'fontmin';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import mqpacker from 'css-mqpacker';
import csswring from 'csswring';
import filter from 'gulp-filter';
import header from 'gulp-header';
import rename from 'gulp-rename';
import handleErrors from '../utils/handleErrors';
import config from '../config';
import pkg from '../../package.json';
let processors, envDev = config.args.env === 'dev';

// Processors
if (config.args.env === 'dev') {
  processors = [
    autoprefixer({
      browsers: config.browsers
    })
  ];
} else {
  processors = [
    autoprefixer({
      browsers: config.browsers
    }),
    mqpacker,
    csswring({
      preserveHacks: true,
      removeAllComments: true
    })
  ];
}

let sassOpts = {
  sourcemap: true,
  outputStyle: 'nested',
  errLogToConsole: true
};

gulp.task('styles', function() {
  return gulp.src(`${config.src}/sass/main.scss`)
    .pipe(sass(sassOpts))
    .on('error', handleErrors)
    .pipe(postcss(processors))
    .pipe(envDev ? sourcemaps.write() : gutil.noop())
    .pipe(envDev ? gutil.noop() : header(config.banner))
    .pipe(envDev ? gutil.noop() : rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(`${config.umb}/css`))
    .pipe(filter('**/*.css'))
    .pipe(browserSync.stream());

});


gulp.task('styles:fonts', function() {
  const fontmin = new Fontmin()
    .src(`${config.src}/fonts/*.ttf`)
    .use(Fontmin.ttf2eot({
      clone: true
    }))
    .use(Fontmin.ttf2woff({
      clone: true
    }))
    .use(Fontmin.ttf2svg({
      clone: true
    }))
    .dest(`${config.dist}/fonts`);

  return fontmin.run(
    function(err, files, stream) {
      if (err) {
        console.log(err);
      }
    }
  );
});
