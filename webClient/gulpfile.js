'use strict';

var _ = require('lodash');
var gulp = require('gulp');
var blaze = require('gulp-blaze');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');


var paths = {
  js: [
    'src/**/*.js'
  ],
  html: [
    'src/**/*.html'
  ],
  css: [
    'src/**/*.css'
  ],
  tests: [],
  dest: 'build',
  libs: {
    js: [
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angularfire/dist/angularfire.js',
      'bower_components/firebase/firebase.js'
    ],
    css: [
      'bower_components/bootstrap/dist/css/bootstrap.css'
    ]
  },
  rules: 'rules.yaml'
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
  var cssFiles = _.union(paths.css, paths.libs.css);
  return gulp.src(cssFiles)
    .pipe(gulp.dest(paths.dest));
});

gulp.task('rules', function() {
  gulp.src(paths.rules)
    .pipe(blaze({debug: false}))
    .pipe(rename(function(path) { path.extname = '.json' }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.rules, ['rules']);
});

gulp.task('build', ['html', 'js', 'css', 'rules']);

gulp.task('default', function(done) {
  runSequence('lint', 'build', function(error) {
    done(error && error.err);
  });
});