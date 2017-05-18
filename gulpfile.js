/* eslint-env node */

'use strict';

var gulp = require('gulp');
var fileGlobs = 'js,html,css,png,jpg,gif,svg,eot,ttf,woff';

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'app';

  swPrecache.write(`${rootDir}/service-worker.js`, {
    staticFileGlobs: [rootDir + '/**/*.{' + fileGlobs + '}'],
    stripPrefix: rootDir + '/'
  }, callback);
});

gulp.task('default', function() {
  gulp.watch('./app/**/*.{' + fileGlobs + '}', ['generate-service-worker']);
});