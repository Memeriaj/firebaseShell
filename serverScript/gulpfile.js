'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var runSequence = require('run-sequence');


var paths = {
  js: [
    'index.js'
  ],

  tests: []
};


gulp.task('lint', function() {
  var filesToLint = _.union(paths.js, paths.tests);
  return gulp.src(filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', function(done) {
  runSequence('lint', function(error) {
    done(error && error.err);
  });
});