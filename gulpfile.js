var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    files = {
    base: "./",
    js: './js/manage/'
};
gulp.task('scripts', function() {
    // console.log(files.js + 'main.js')
    return gulp.src([files.js + 'public.js',files.js + 'router.js',files.js + 'activity.js',files.js + 'data.js',files.js + 'message.js',files.js + 'history.js'])
    .pipe(concat('index.js'))
    .pipe(gulp.dest(files.js))
});
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: files.base
        }
    });
    gulp.watch("./js/manage/*.*").on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("./css/*.*").on('change', browserSync.reload);
    gulp.watch(files.js + '*.js',['scripts']);

});
gulp.task('auto', ['browser-sync']);

