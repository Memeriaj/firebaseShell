'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var runSequence = require('run-sequence');


var paths = {
  js: [
    'src/**/*.js'
  ],
  html: [
    'src/**/*.html'
  ],
  tests: [],
  dest: 'build',
  libs: {
    js: [
      'bower_components/angular/angular.js',
      'bower_components/angularfire/dist/angularfire.js',
      'bower_components/firebase/firebase.js'
    ],
    css: [
      'bower_components/bootstrap/dist/css/bootstrap.css'
    ]
  }
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

gulp.task('js', function() {
  var jsFiles = _.union(paths.js, paths.libs.js);
  return gulp.src(jsFiles)
    .pipe(gulp.dest(paths.dest));
});

gulp.task('css', function() {
  return gulp.src(paths.libs.css)
    .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('build', ['html', 'js', 'css']);

gulp.task('default', function(done) {
  runSequence('lint', 'build', function(error) {
    done(error && error.err);
  });
});