var gulp = require('gulp');
var less = require('gulp-less');
// var babel = require('babel-core');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifyes = require('gulp-uglifyes');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var gutil = require('gulp-util');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var wrap = require("gulp-wrap");

var paths = {
  styles: {
    src: '_src/less/**/*.less',
    dest: '_build/css/'
  },
  scripts: {
    src: '_src/js/**/*.js',
    dest: '_build/js/'
  },
  script_maps: {
    src: '_src/js/**/*.map',
    dest: '_build/js/'
  },
  pages: {
    src: '_src/html/**/*.html',
    dest: '_build/html/'
  }
};

/* --- */

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    // .pipe(wrap('(function(){\n<%= contents %>\n})();'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.dest));
}

function script_maps() {
  return gulp.src(paths.script_maps.src, { sourcemaps: true })
    .pipe(gulp.dest(paths.script_maps.dest));
}

function pages() {
  return gulp.src(paths.pages.src)
    // .pipe(htmlmin({collapseWhitespace: true}))
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest(paths.pages.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.script_maps.src, script_maps);
  gulp.watch(paths.pages.src, pages);
}



function build() {
  return gulp.series(gulp.parallel(styles, scripts, pages));
}

/* --- */

exports.styles = styles;
exports.scripts = scripts;
exports.script_maps = script_maps;
exports.pages = pages;
exports.watch = watch;

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('script_maps', script_maps);
gulp.task('pages', pages);

gulp.task('watch', watch);
gulp.task('build', build);
gulp.task('default', build);
