'use strict';

var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();

gulp.task('clean', require('del').bind(null, ['dist']));

/* es6 */
gulp.task('es6', function() {
  return gulp.src(['src/**/*.js','!src/commands/scaffold/template/**/*.js', '!src/libs/**/*.js'])
    .pipe($.plumber())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .on('error', $.util.log)
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function(){

  gulp.src(['!src/**/*.js','src/**/*'])
    .pipe(gulp.dest('dist'));

  gulp.src(['src/commands/scaffold/template/**/*'])
    .pipe(gulp.dest('dist/commands/scaffold/template'));

});

gulp.task('watch', ['es6', 'copy'], function() {

  gulp.watch(['src/**/*.*'], ['es6', 'copy']);

});

gulp.task('build',['es6', 'copy']);

gulp.task('default',['clean'], function() {

  gulp.start('watch');

});
