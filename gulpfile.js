'use strict';

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var livereload = require('gulp-livereload');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
// Set the browser that you want to supoprt
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Gulp task to minify CSS files
gulp.task('styles', function () {
  return gulp.src('./src/assets/sass/styles.scss')
    // Compile SASS files

    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('./dist/assets/css'))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function () {
  return gulp.src('./src/assets/js/**/*.js')
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./dist/assets/js'))
});

// Gulp task to minify HTML files
gulp.task('pages', function () {
  return gulp.src(['./src/**/*.html'])

    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'));
});
gulp.task('css-default', function () {
  gulp.src('./src/assets/sass/*.css')
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('imagenes', function () {
  return gulp.src('src/assets/images/*')

    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/assets/images'));
});

// Clean output directory
gulp.task('clean', () => del(['dist']));

// Gulp task to minify all files
gulp.task('build', ['clean'], function () {
  //browserSync.reload();
  runSequence(
    'styles',
    'css-default',
    'scripts',
    'imagenes',
    'pages'
  );


});
gulp.task('watch', ['styles', 'css-default',
  'scripts',
  'imagenes',
  'pages'
], function (done) {
  browserSync.reload();
  done();
});

gulp.task('serve', ['build'], function (done) {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });
  gulp.watch("src/*.html", ['watch']);
  //gulp.watch("src/*.html").on("change", reload);
});