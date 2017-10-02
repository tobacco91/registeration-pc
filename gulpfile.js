var gulp = require('gulp'),
    browserSync = require('browser-sync');
    var files = {
    base: "./",
    
    
};
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: files.base
        }
    });
    gulp.watch("./js/*.*").on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("./css/*.*").on('change', browserSync.reload);
});
gulp.task('auto', ['browser-sync']);