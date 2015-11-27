'use strict';

var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
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
                .pipe(istanbul.enforceThresholds({ thresholds: { global: 100 } }))
                .on('end', cb);
        });
});

gulp.task('lint', function () {
    var stream = gulp.src(['./*.js', 'tests/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jshint.reporter('jshint-stylish'));

    if (process.env.CI) {
        stream.pipe(jscs.reporter('fail'))
            .pipe(jshint.reporter('fail'));
    }

    return stream;
});

gulp.task('default', ['lint', 'test'], function () {

});
