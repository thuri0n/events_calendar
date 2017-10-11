var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    notify = require("gulp-notify");
gulp.task('less', function () {
    return gulp.src('./less/global.less')
        .pipe(less({}))
        .on("error", notify.onError({
            message: 'less error: <%= error.message %>'
        }))
        .pipe(concat('common.css'))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./css/'))
        .pipe(reload({
            stream: true
        }))
        .pipe(notify('css complete'));
});
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("./index.html").on('change', reload);
});
gulp.task('watch', function () {
    gulp.watch('./less/*.less', ['less']);
});
gulp.task('default', ['watch', 'browser-sync', 'less']);
