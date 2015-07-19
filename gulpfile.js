'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

gulp.task('test', function (cb) {
    gulp.src(['index.js', 'formatter.js'])
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            return gulp.src(['tests/*.js'])
                .pipe(mocha())
                .pipe(istanbul.writeReports())
                .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
                .on('end', cb);
        });
});

gulp.task('lint', function () {
    return gulp.src(['./*.js', 'tests/*.js'])
        .pipe(plumber())
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['lint', 'test'], function () {

});
