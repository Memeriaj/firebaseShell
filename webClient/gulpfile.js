'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var runSequence = require('run-sequence');


var paths = {
  js: [],
  html: [
    'src/**/*.html'
  ],
  tests: [],
  dest: 'build'
};


gulp.task('lint', function() {
  var filesToLint = _.union(paths.js, paths.tests);
  return gulp.src(filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.html, ['html']);
});

gulp.task('build', ['html']);

gulp.task('default', function(done) {
  runSequence('lint', 'build', function(error) {
    done(error && error.err);
  });
});